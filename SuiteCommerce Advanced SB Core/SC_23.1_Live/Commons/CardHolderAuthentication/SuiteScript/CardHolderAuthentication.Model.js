/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('CardHolderAuthentication.Model', [
    'SC.Model',
    'SC.Models.Init',
    'Application',
    'CardHolderAuthentication.Utils',
    'Utils',
    'underscore'
], function(SCModel, ModelsInit, Application, CardHolderAuthenticationUtils, Utils, _) {
    // @class CardHolderAuthentication.Model Defines the model used for authentication
    // in case of 3DSecure
    // Available methods allow to create, submit and search a cardHolder authentication record
    // @extends SCModel
    return SCModel.extend({
        name: 'CardHolderAuthentication',
        // @property {Object} addressType
        addressType: {
            SHIPPING: 'shippingaddress',
            BILLING: 'billingaddress'
        },
        CHA_STATUS: CardHolderAuthenticationUtils.CHA_STATUS,

        // @method submit
        submit: function submit(data, callbackModel) {
            try {
                // Not logged throws an error
                if (!ModelsInit.session.isLoggedIn2()) {
                    return this.buildSubmitLoginError(this.request.body);
                }

                const CHARecordId = ModelsInit.context.getSessionObject(
                    'cardHolderAuthenticationRecordId'
                );

                const CHARecord = CHARecordId ? this.searchById(CHARecordId) : null;
                const CHARecordStatus = CHARecordId ? CHARecord.getValue('status') : null;

                // Already authenticated
                if (!CHARecordId || CHARecordStatus === this.CHA_STATUS.AUTHENTICATED) {
                    return this.buildSubmitLoginAuthenticated(callbackModel);
                }

                // Waiting for Authentication
                if (CHARecordStatus === this.CHA_STATUS.WAITING_FOR_DEVICE_AUTHENTICATION) {
                    return this.waitingForDeviceAuth(data, CHARecord, CHARecordId, callbackModel);
                }

                // Waiting for Challenge
                if (CHARecordStatus === this.CHA_STATUS.WAITING_FOR_SHOPPER_CHALLENGE) {
                    return this.waitingForShopperChallenge(
                        data,
                        CHARecord,
                        CHARecordId,
                        callbackModel
                    );
                }

                if (CHARecordStatus === this.CHA_STATUS.CANCELLED) {
                    return this.buildSubmitError(
                        CHARecord.getText('threedstranstatusreason') ||
                            CHARecord.getValue('threedstranstatusreason')
                    );
                }

                return this.buildSubmitError();
            } catch (e) {
                return this.buildSubmitError(e);
            }
        },

        // @method submit
        process3DSecure: function process3DSecure(authenticationOptions, callbackModel) {
            const cardHolderAuthenticationRecord = this.createAndReturnRecord(
                authenticationOptions
            );

            switch (cardHolderAuthenticationRecord.getValue('status')) {
                case this.CHA_STATUS.NOT_REQUIRED:
                case this.CHA_STATUS.AUTHENTICATED:
                    const confirmation = callbackModel.submit(true);

                    if (confirmation.statuscode === 'error') {
                        throw confirmation;
                    }
                    return confirmation;

                case this.CHA_STATUS.WAITING_FOR_DEVICE_AUTHENTICATION:
                    return this.buildSubmitDeviceAuthenticationForm(cardHolderAuthenticationRecord);

                case this.CHA_STATUS.WAITING_FOR_SHOPPER_CHALLENGE:
                    return this.buildSubmitReqShopperChallenger(
                        cardHolderAuthenticationRecord,
                        cardHolderAuthenticationRecord.id
                    );

                default:
                    ModelsInit.context.setSessionObject('cardHolderAuthenticationRecordId', null);
                    throw 'An error has occurred';
            }
        },

        // Waiting for Shopper Challenge flow
        // @method waitingForShopperChallenge
        waitingForShopperChallenge: function waitingForShopperChallenge(
            data,
            CHARecord,
            CHARecordId,
            callbackModel
        ) {
            if (!_.isEmpty(data)) {
                this.loadAndSubmitWithReturnedParameters(CHARecord.id, 'SHOPPER_CHALLENGE', data);
            }
            this.setStatus(CHARecord.id, this.CHA_STATUS.RETURN_FROM_SHOPPER_CHALLENGE);
            const newCHARecord = this.searchById(CHARecordId);

            if (newCHARecord.getValue('status') === this.CHA_STATUS.AUTHENTICATED) {
                return this.buildSubmitLoginAuthenticated(callbackModel);
            }

            if (newCHARecord.getValue('status') === this.CHA_STATUS.CANCELLED) {
                return this.buildSubmitError(
                    newCHARecord.getText('threedstranstatusreason') ||
                        newCHARecord.getValue('threedstranstatusreason')
                );
            }
            return this.buildSubmitError();
        },

        // Waiting for Device Authentication flow
        // @method waitingForDeviceAuth
        waitingForDeviceAuth: function waitingForDeviceAuth(
            data,
            CHARecord,
            CHARecordId,
            callbackModel
        ) {
            if (!_.isEmpty(data)) {
                this.loadAndSubmitWithReturnedParameters(
                    CHARecord.id,
                    this.CHA_STATUS.AUTHENTICATE_DEVICE,
                    data
                );
            }
            this.setStatus(CHARecordId, this.CHA_STATUS.RETURN_FROM_DEVICE_AUTHENTICATION);

            const newCHARecord = this.searchById(CHARecordId);
            const newCHARecordStatus = newCHARecord.getValue('status');

            if (
                newCHARecordStatus === this.CHA_STATUS.AUTHENTICATED ||
                newCHARecordStatus === this.CHA_STATUS.NOT_REQUIRED
            ) {
                return this.buildSubmitLoginAuthenticated(callbackModel);
            }

            if (newCHARecordStatus === this.CHA_STATUS.CANCELLED) {
                return this.buildSubmitError(
                    newCHARecord.getText('threedstranstatusreason') ||
                        newCHARecord.getValue('threedstranstatusreason')
                );
            }

            return this.buildSubmitReqShopperChallenger(newCHARecord, CHARecordId);
        },

        // @method buildSubmitError
        buildSubmitError: function submitError(error) {
            ModelsInit.context.setSessionObject('cardHolderAuthenticationRecordId', null);
            if (!error) {
                return {
                    errorMessage: 'An error has occurred'
                };
            }
            return Application.processError(error);
        },

        // @method buildSubmitDeviceAuthenticationForm
        buildSubmitDeviceAuthenticationForm: function buildSubmitDeviceAuthenticationForm(
            CHARecord
        ) {
            return {
                statuscode: 'error',
                reasoncode: this.CHA_STATUS.ERR_WS_REQ_DEVICE_AUTHENTICATION,
                cardholderauthenticationid: CHARecord.id,
                authenticationformaction: ModelsInit.session.getAbsoluteUrl2(
                    'checkout',
                    CardHolderAuthenticationUtils.getUrl(
                        '../',
                        'deviceAuthenticationForm',
                        CHARecord.getValue('authenticatedeviceformaction'),
                        CHARecord.getValue('authenticatedeviceformid'),
                        this.searchAuthenticateDeviceInputFields(CHARecord.id)
                    )
                )
            };
        },

        // @method buildSubmitReqShopperChallenger
        buildSubmitReqShopperChallenger: function buildSubmitReqShopperChallenger(
            CHARecord,
            CHARecordId
        ) {
            return {
                statuscode: 'error',
                reasoncode: this.CHA_STATUS.ERR_WS_REQ_SHOPPER_CHALLENGE,
                cardholderauthenticationid: CHARecord.id,
                authenticationformaction: ModelsInit.session
                    .getAbsoluteUrl2(
                        'checkout',
                        CardHolderAuthenticationUtils.getUrl(
                            '',
                            'challengeShopperForm',
                            CHARecord.getValue('challengeshopperformaction'),
                            CHARecord.getValue('challengeshopperformid'),
                            this.searchChallengeShopperInputFields(CHARecordId)
                        )
                    )
                    .replace('/services', '')
            };
        },

        // @method buildSubmitLoginError
        buildSubmitLoginError: function buildSubmitLoginError(body) {
            return {
                statuscode: 'error',
                reasoncode: this.CHA_STATUS.ERR_WS_REQUIRE_CUSTOMER_LOGIN,
                cardholderauthenticationid: null,
                body: _.escape(body)
            };
        },

        // @method buildSubmitLoginAuthenticated
        buildSubmitLoginAuthenticated: function buildSubmitLoginAuthenticated(callbackModel) {
            const confirmation = callbackModel.submit(true);
            ModelsInit.context.setSessionObject('cardHolderAuthenticationRecordId', null);
            return confirmation;
        },

        // @method create
        create: function create(options) {
            const cardHolderAuthenticationRecord = nlapiCreateRecord('cardholderauthentication');

            // Required field values
            cardHolderAuthenticationRecord.setFieldValue('entity', nlapiGetUser());
            cardHolderAuthenticationRecord.setFieldValue('amount', options.amount);
            cardHolderAuthenticationRecord.setFieldValue('paymentoption', options.paymentOption);
            cardHolderAuthenticationRecord.setFieldValue('paymentcardcsc', options.paymentOptionCsc);
            cardHolderAuthenticationRecord.setFieldValue(
                'paymentprocessingprofile',
                options.paymentProcessingProfile
            );
            cardHolderAuthenticationRecord.setFieldValue(
                'notificationurl',
                options.notificationURL
            );
            cardHolderAuthenticationRecord.setFieldValue('challengewindowsize', '02');

            this.createAddress(
                cardHolderAuthenticationRecord,
                this.addressType.SHIPPING,
                ModelsInit.order.getShippingAddress()
            );

            this.createAddress(
                cardHolderAuthenticationRecord,
                this.addressType.BILLING,
                ModelsInit.order.getBillingAddress()
            );

            return nlapiSubmitRecord(cardHolderAuthenticationRecord);
        },

        // @method createAddress
        createAddress: function createAddress(record, type, address) {
            if (address && address.internalid && address.isvalid === 'T') {
                const addressInfo = record.createSubrecord(type);
                addressInfo.setFieldValue('country', address.country);
                addressInfo.setFieldValue('addressee', address.addressee);
                addressInfo.setFieldValue('addr1', address.addr1);
                addressInfo.setFieldValue('city', address.city);
                addressInfo.setFieldValue('state', address.state);
                addressInfo.setFieldValue('zip', address.zip);
                addressInfo.commit();
            }
        },

        // @method createAndReturnRecord
        createAndReturnRecord: function(options) {
            const newRecord = this.searchById(this.create(options));
            ModelsInit.context.setSessionObject('cardHolderAuthenticationRecordId', newRecord.id);
            return newRecord;
        },

        // @method searchById
        searchById: function(id) {
            const filters = [];
            filters[0] = new nlobjSearchFilter('internalid', null, 'is', id);
            const columns = [];
            columns[0] = new nlobjSearchColumn('internalid');
            columns[1] = new nlobjSearchColumn('status');
            columns[2] = new nlobjSearchColumn('authenticatedeviceformid');
            columns[3] = new nlobjSearchColumn('authenticatedeviceformaction');
            columns[4] = new nlobjSearchColumn('challengeshopperformid');
            columns[5] = new nlobjSearchColumn('challengeshopperformaction');
            columns[6] = new nlobjSearchColumn('threedstranstatusreason');

            const searchresults = nlapiSearchRecord(
                'cardholderauthentication',
                null,
                filters,
                columns
            );

            if (searchresults.length > 0) {
                return searchresults[0];
            }

            throw notFoundError;
        },

        // @method setStatus
        setStatus: function(id, status) {
            return nlapiSubmitField('cardholderauthentication', id, 'status', status);
        },

        // @method searchAuthenticateDeviceInputFields
        searchAuthenticateDeviceInputFields: function(id) {
            const filters = [];
            filters[0] = new nlobjSearchFilter('cardholderauthentication', null, 'is', id);
            const columns = [];
            columns[0] = new nlobjSearchColumn('name');
            columns[1] = new nlobjSearchColumn('value');

            return nlapiSearchRecord('authenticatedeviceinput', null, filters, columns);
        },

        // @method searchChallengeShopperInputFields
        searchChallengeShopperInputFields: function(id) {
            const filters = [];
            filters[0] = new nlobjSearchFilter('cardholderauthentication', null, 'is', id);
            const columns = [];
            columns[0] = new nlobjSearchColumn('name');
            columns[1] = new nlobjSearchColumn('value');

            return nlapiSearchRecord('challengeshopperinput', null, filters, columns);
        },

        // @method loadAndSubmitWithReturnedParameters
        loadAndSubmitWithReturnedParameters: function(id, iframeType, returnedParameters) {
            const cardholderAuthentication = nlapiLoadRecord('cardholderauthentication', id);
            let group = 'challengeshopperresults';

            if (iframeType === this.CHA_STATUS.AUTHENTICATE_DEVICE) {
                group = 'authenticatedeviceresults';
            }
            for (key in returnedParameters) {
                if (returnedParameters[key] !== '' && returnedParameters[key] !== 'null') {
                    cardholderAuthentication.selectNewLineItem(group);
                    cardholderAuthentication.setCurrentLineItemValue(group, 'name', key);
                    cardholderAuthentication.setCurrentLineItemValue(
                        group,
                        'value',
                        Utils.flatten(returnedParameters[key])
                    );
                    cardholderAuthentication.commitLineItem(group);
                }
            }
            nlapiSubmitRecord(cardholderAuthentication);
        }
    });
});

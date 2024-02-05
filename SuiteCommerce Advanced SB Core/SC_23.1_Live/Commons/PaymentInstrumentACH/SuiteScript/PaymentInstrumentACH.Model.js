/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// PaymentInstrumentACH.Model.js
// ----------------
// This file define the functions to be used on ACH service

// Payment methods id type for ACH
const ACH = 13;

define('PaymentInstrumentACH.Model', ['SC.Model', 'SC.Models.Init', 'underscore'], function(
    SCModel,
    ModelsInit,
    _
) {
    const PaymentInstrumentACHModel = SCModel.extend({
        name: 'PaymentInstrumentACH',

        get: function(id) {
            // Return a specific ACH
            const pi_ach = this.list(id);
            if (pi_ach.length) {
                return pi_ach[0];
            }

            try {
                const record = this.getRecord(id);
                if (this.checkForUser(record)) {
                    return this.getRecordFields(record);
                }
                console.error(`PaymentInstrumentACH.Model.get failed loading id ${id}`);
                return null;
            } catch (e) {
                console.error(
                    `PaymentInstrumentACH.Model.get failed loading id ${id}`,
                    JSON.stringify(e)
                );
                return null;
            }
        },

        getRecordFields: function(record) {
            const result = {};
            // @property {String} internalid
            result.internalid = record.getFieldValue('id');
            // @property {Boolean} isinactive
            result.isinactive = record.getFieldValue('isinactive');
            // @property {Boolean} preserveonfile
            result.preserveonfile = record.getFieldValue('preserveonfile');
            // @property {String} recordtype
            result.recordtype = record.getFieldValue('recordtype') || record.getFieldValue('type');
            // @property {String} id
            result.id = record.getFieldValue('id');
            // @property {Boolean} isdefault
            result.isdefault = record.getFieldValue('isdefault');
            // @property {Boolean} isdefault
            result.mask = record.getFieldValue('mask');
            // @property {Instrumenttype} instrumenttype
            result.instrumenttype = {
                internalid: record.getFieldValue('instrumenttype'),
                name: record.getFieldText('instrumenttype')
            };
            // @property {State} state
            result.state = {
                internalid: record.getFieldValue('state'),
                name: record.getFieldText('state')
            };
            // @property {Entity} entity
            result.entity = {
                internalid: record.getFieldValue('entity'),
                name: record.getFieldText('entity')
            };
            // @property {Paymentmethod} paymentmethod
            result.paymentmethod = this.getPaymentMethod(record.getFieldValue('paymentmethod'));
            // @property {String} account
            result.account = record.getFieldValue('account');
            // @property {String} accountownername
            result.accountownername = record.getFieldValue('accountownername');
            // @property {String} accounttype
            result.accounttype = record.getFieldValue('accounttype');
            // @property {String} bankname
            result.bankname = record.getFieldValue('bankname');
            // @property {String} routingnumber
            result.routingnumber = record.getFieldValue('routingnumber');
            // @property {String} customerconsent
            result.customerconsent = record.getFieldValue('customerconsent');
            // @property {String} limit
            result.limit = record.getFieldValue('limit');

            return result;
        },

        getDefault: function() {
            return this.paymentmethod.getDefault();
        },

        preListSearch: function() {},

        postListSearchResult: function(result, searchResult) {},

        list: function(id) {
            this.filters = [
                new nlobjSearchFilter('customer', null, 'is', nlapiGetUser()),
                new nlobjSearchFilter('preserveOnFile', null, 'is', 'T'),
                new nlobjSearchFilter('isInactive', null, 'is', 'F'),
                new nlobjSearchFilter('paymentinstrumenttype', null, 'anyof', ACH)
            ];

            this.columns = {
                internalid: new nlobjSearchColumn('internalid'),
                paymentmethod: new nlobjSearchColumn('paymentmethod'),
                mask: new nlobjSearchColumn('mask'),
                default: new nlobjSearchColumn('default'),
                paymentinstrumenttype: new nlobjSearchColumn('paymentinstrumenttype'),
                bankname: new nlobjSearchColumn('bankname'),
                routingnumber: new nlobjSearchColumn('routingnumber'),
                ownername: new nlobjSearchColumn('ownername'),
                accounttype: new nlobjSearchColumn('achaccounttype'),
                customerconsent: new nlobjSearchColumn('customerconsent'),
                entity: new nlobjSearchColumn('entity'),
                limit: new nlobjSearchColumn('limit')
            };

            if (id) {
                this.filters.push(new nlobjSearchFilter('internalid', null, 'is', id));
            }

            const result = [];
            const search_results = Application.getAllSearchResults(
                'paymentinstrument',
                this.filters,
                _.values(this.columns)
            );

            const self = this;
            const PAYMENT_METHODS = ModelsInit.session.getPaymentMethods();
            _.each(search_results, function(search_result) {
                const payment_method_id = search_result.getValue('paymentmethod');
                const payment_method = _.findWhere(PAYMENT_METHODS, {
                    internalid: payment_method_id
                });

                //  only return payment methods available for the website
                if (payment_method) {
                    const rowResult = {
                        internalid: search_result.getValue('internalid'),
                        paymentmethod: payment_method,
                        instrumenttypeValue: search_result.getValue('paymentinstrumenttype'),
                        recordType: self.parseToRecordType(
                            search_result.getText('paymentinstrumenttype')
                        ),
                        mask: search_result.getValue('mask'),
                        ccdefault: search_result.getValue('default'),
                        bankname: search_result.getValue('bankname')
                            ? search_result.getValue('bankname')
                            : search_result.getValue('routingnumber'),
                        routingnumber: search_result.getValue('routingnumber'),
                        ownername: search_result.getValue('ownername'),
                        accounttype: search_result.getValue('achaccounttype'),
                        customerconsent: search_result.getValue('customerconsent'),
                        entity: search_result.getValue('entity'),
                        limit: search_result.getValue('limit')
                    };

                    self.postListSearchResult(rowResult, search_result);
                    result.push(rowResult);
                }
            });
            return result;
        },

        update: function(id, data) {
            if (data.consent) {
                const record = nlapiLoadRecord('automatedclearinghouse', id);
                record.setFieldValue('isdefault', data.ccdefault);
                record.setFieldValue('limit', data.limit);
                return nlapiSubmitRecord(record);
            }

            const record = nlapiLoadRecord('automatedclearinghouse', id, { recordmode: 'dynamic' });
            record.setFieldValue('isdefault', data.ccdefault);
            record.setFieldValue('limit', data.limit);

            data.customerconsent = record.getFieldValue('customerconsent');
            return data;
        },

        create: function(data) {
            // Create a new ACH
            const payment_method = data.paymentmethod.split(',')[0];
            const preserve_on_file = data.savecreditcard ? data.savecreditcard : 'T';
            const is_default = 'F';
            const default_billing = _.findWhere(ModelsInit.customer.getAddressBook(), {
                defaultbilling: 'T'
            });

            const pi = nlapiCreateRecord('automatedclearinghouse', { recordmode: 'dynamic' });
            pi.setFieldValue('type', 'automatedclearinghouse');
            pi.setFieldValue('origbinactive', 'F');
            pi.setFieldValue('origin', 'ENTITY');
            pi.setFieldValue('isinactive', 'F');
            pi.setFieldValue('state', '1');

            pi.setFieldValue('bankaccountnumber', data.account);
            pi.setFieldValue('accountownername', data.accountownername || data.ownername);
            pi.setFieldValue('accounttype', data.accounttype);
            pi.setFieldValue('bankname', data.bankname);
            pi.setFieldValue('routingnumber', data.routingnumber);
            pi.setFieldValue('limit', data.limit);
            pi.setFieldValue('entity', nlapiGetUser());
            pi.setFieldValue('paymentmethod', payment_method);
            pi.setFieldValue('preserveonfile', preserve_on_file);
            pi.setFieldValue('isdefault', is_default);

            if (default_billing) {
                pi.setFieldValue('street', default_billing.addr1);
                pi.setFieldValue('zipcode', default_billing.zip);
            }

            if (data.consent) {
                return nlapiSubmitRecord(pi);
            }
            data.customerconsent = pi.getFieldValue('customerconsent');
            return data;
        },

        remove: function(id) {
            const record = this.getRecord(id);
            if (this.checkForUser(record)) {
                record.setFieldValue('isinactive', 'T');
                return nlapiSubmitRecord(record);
            }
            console.error(`Invalid id used to delete ACH Payment Method ${id}`);
            return null;
        },

        checkForUser: function(record) {
            return (
                record && record.getFieldValue('entity').toString() === nlapiGetUser().toString()
            );
        },

        getRecord: function(id) {
            try {
                return nlapiLoadRecord('automatedclearinghouse', id);
            } catch (e) {
                console.error(`Invalid id used to get ACH Payment Method ${id} - ${e}`);
                throw e;
            }
        },

        parseToRecordType: function(name) {
            const record_type = name.replace(/\s/g, '');
            return record_type;
        }
    });

    return PaymentInstrumentACHModel;
});

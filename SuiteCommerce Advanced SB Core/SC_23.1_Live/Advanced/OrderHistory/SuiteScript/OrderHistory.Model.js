/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// OrderHistory.Model.js
// ----------
// Handles fetching orders
define('OrderHistory.Model', [
    'Application',
    'Utils',
    'StoreItem.Model',
    'Transaction.Model',
    'Transaction.Model.Extensions',
    'SiteSettings.Model',
    'SC.Model',
    'ReturnAuthorization.Model',
    'ExternalPayment.Model',
    'Models.Init',
    'Configuration',
    'bignumber',
    'underscore'
], function(
    Application,
    Utils,
    StoreItem,
    Transaction,
    TransactionModelExtensions,
    SiteSettings,
    SCModel,
    ReturnAuthorization,
    ExternalPayment,
    ModelsInit,
    Configuration,
    BigNumber,
    _
) {
    return Transaction.extend({
        name: 'OrderHistory',

        isPickupInStoreEnabled: SiteSettings.isPickupInStoreEnabled(),

        isSCISIntegrationEnabled: SiteSettings.isSCISIntegrationEnabled(),

        setExtraListColumns: function() {
            this.columns.trackingnumbers = new nlobjSearchColumn('trackingnumbers');

            if (this.isSCISIntegrationEnabled) {
                this.columns.origin = new nlobjSearchColumn('formulatext');
                this.columns.origin.setFormula(
                    `case when LENGTH({source})>0 and {source} <> 'SCIS' then 2 else (case when {location.locationtype.id} = '${Configuration.get(
                        'locationTypeMapping.store.internalid'
                    )}' then 1 else 0 end) end`
                );
            }
        },
        setExtraListFilters: function() {
            if (this.data.filter === 'status:open') {
                // Status is open and this is only valid for Sales Orders.
                this.filters.type_operator = 'and';
                this.filters.type = ['type', 'anyof', ['SalesOrd']];
                this.filters.status_operator = 'and';
                this.filters.status = [
                    'status',
                    'anyof',
                    ['SalesOrd:A', 'SalesOrd:B', 'SalesOrd:D', 'SalesOrd:E', 'SalesOrd:F']
                ];
            } else if (this.isSCISIntegrationEnabled) {
                if (this.data.filter === 'origin:instore') {
                    // SCIS Integration enabled, only In Store records (Including Sales Orders from SCIS)
                    this.filters.scisrecords_operator = 'and';
                    this.filters.scisrecords = [
                        ['type', 'anyof', ['CashSale', 'CustInvc', 'SalesOrd']],
                        'and',
                        ['createdfrom.type', 'noneof', ['SalesOrd']],
                        'and',
                        [
                            'location.locationtype',
                            'is',
                            Configuration.get('locationTypeMapping.store.internalid')
                        ],
                        'and',
                        ['source', 'anyof', ['@NONE@', 'SCIS']]
                    ];
                } // SCIS Integration enabled, all records
                else {
                    this.filters.scisrecords_operator = 'and';
                    this.filters.scisrecords = [
                        [
                            ['type', 'anyof', ['CashSale', 'CustInvc']],
                            'and',
                            ['createdfrom.type', 'noneof', ['SalesOrd']],
                            'and',
                            [
                                'location.locationtype',
                                'is',
                                Configuration.get('locationTypeMapping.store.internalid')
                            ],
                            'and',
                            ['source', 'anyof', ['@NONE@', 'SCIS']]
                        ],
                        'or',
                        [['type', 'anyof', ['SalesOrd']]]
                    ];
                }
            } // SCIS Integration is disabled, show all the Sales Orders
            else {
                this.filters.type_operator = 'and';
                this.filters.type = ['type', 'anyof', ['SalesOrd']];
            }

            const is_contact =
                ModelsInit.session.getCustomer().getFieldValues().contactloginid !== '0';
            if (
                !_.isEmpty(ModelsInit.session.getSiteSettings().cartsharingmode) &&
                ModelsInit.session.getSiteSettings().cartsharingmode === 'PER_CONTACT' &&
                is_contact
            ) {
                const contactId = parseInt(
                    ModelsInit.session.getCustomer().getFieldValues().contactloginid
                );
                const email = nlapiLookupField('contact', contactId, 'email');
                this.filters.email_opeartor = 'and';
                this.filters.email = ['email', 'is', email];
            }
        },
        mapListResult: function(result, record) {
            result = result || {};
            result.trackingnumbers = record.getValue('trackingnumbers')
                ? record.getValue('trackingnumbers').split('<BR>')
                : null;

            if (this.isSCISIntegrationEnabled) {
                result.origin = parseInt(record.getValue(this.columns.origin), 10);
            }

            if (this.isCustomColumnsEnabled()) {
                this.mapCustomColumns(result, record);
            }

            return result;
        },
        isSCISSource: function(source) {
            return !source || source === 'SCIS';
        },
        getExtraRecordFields: function() {
            this.getReceipts();

            this.getReturnAuthorizations();

            let origin = 0;
            let applied_to_transaction;

            const source = this.record.getFieldValue('source');

            if (
                this.isSCISIntegrationEnabled &&
                this.isSCISSource(source) &&
                this.record.getFieldValue('location') &&
                nlapiLookupField(
                    this.result.recordtype,
                    this.result.internalid,
                    'location.locationtype'
                ) === Configuration.get('locationTypeMapping.store.internalid')
            ) {
                origin = 1; // store
            } else if (source) {
                origin = 2; // online
            }

            this.result.origin = origin;

            if (this.result.recordtype === 'salesorder') {
                applied_to_transaction = _(
                    _.where(this.result.receipts || [], {
                        recordtype: 'invoice'
                    })
                ).pluck('internalid');
            } else if (this.result.recordtype === 'invoice') {
                applied_to_transaction = [this.result.internalid];
            }

            this.getFulfillments();

            if (applied_to_transaction && applied_to_transaction.length) {
                this.getAdjustments({
                    paymentMethodInformation: true,
                    appliedToTransaction: applied_to_transaction
                });
            }

            this.result.ismultishipto = this.record.getFieldValue('ismultishipto') === 'T';

            this.getLinesGroups();

            this.result.receipts = _.values(this.result.receipts);

            // @property {Boolean} isReturnable
            this.result.isReturnable = this.isReturnable();

            this.getPaymentEvent();

            // @property {Boolean} isCancelable
            this.result.isCancelable = this.isCancelable();
        },

        getTerms: function() {
            const terms = nlapiLookupField(this.result.recordtype, this.result.internalid, 'terms');

            if (terms) {
                return {
                    // @property {String} internalid
                    internalid: terms,
                    // @property {String} name
                    name: nlapiLookupField(
                        this.result.recordtype,
                        this.result.internalid,
                        'terms',
                        true
                    )
                };
            }

            return null;
        },

        getStatus: function() {
            this.result.status = {
                internalid: nlapiLookupField(
                    this.result.recordtype,
                    this.result.internalid,
                    'status'
                ),
                name: nlapiLookupField(
                    this.result.recordtype,
                    this.result.internalid,
                    'status',
                    true
                )
            };
        },
        getLinesGroups: function() {
            const self = this;

            _.each(this.result.lines, function(line) {
                let line_group_id = '';

                if (self.result.recordtype === 'salesorder') {
                    if (
                        (self.isPickupInStoreEnabled && line.fulfillmentChoice === 'pickup') ||
                        (!self.result.ismultishipto &&
                            (!line.isfulfillable || !self.result.shipaddress)) ||
                        (self.result.ismultishipto && (!line.shipaddress || !line.shipmethod))
                    ) {
                        if (
                            (self.isSCISIntegrationEnabled && self.result.origin === 1) ||
                            (self.isPickupInStoreEnabled && line.fulfillmentChoice === 'pickup')
                        ) {
                            line_group_id = 'instore';
                        } else {
                            line_group_id = 'nonshippable';
                        }
                    } else {
                        line_group_id = 'shippable';
                    }
                } else {
                    line_group_id = 'instore';
                }

                line.linegroup = line_group_id;
            });
        },
        getFulfillments: function() {
            if (this.result.recordtype !== 'salesorder') {
                const location = this.record.getFieldValue('location');

                _.each(this.result.lines, function(line) {
                    line.quantityfulfilled = line.quantity;
                    line.location = location;
                });

                return;
            }

            this.result.fulfillments = {};

            const self = this;
            const filters = [
                new nlobjSearchFilter('internalid', null, 'is', this.result.internalid),
                new nlobjSearchFilter('mainline', null, 'is', 'F'),
                new nlobjSearchFilter('shipping', null, 'is', 'F'),
                new nlobjSearchFilter('taxline', null, 'is', 'F')
            ];
            const columns = [
                new nlobjSearchColumn('line'),
                new nlobjSearchColumn('fulfillingtransaction'),
                new nlobjSearchColumn('quantityshiprecv'),

                new nlobjSearchColumn('actualshipdate'),
                new nlobjSearchColumn('quantity'),
                new nlobjSearchColumn('quantity', 'fulfillingtransaction'),
                new nlobjSearchColumn('item', 'fulfillingtransaction'),
                new nlobjSearchColumn('shipmethod', 'fulfillingtransaction'),
                new nlobjSearchColumn('shipto', 'fulfillingtransaction'),
                new nlobjSearchColumn('trackingnumbers', 'fulfillingtransaction'),
                new nlobjSearchColumn('trandate', 'fulfillingtransaction'),
                new nlobjSearchColumn('status', 'fulfillingtransaction'),

                // Ship Address
                new nlobjSearchColumn('shipaddress', 'fulfillingtransaction'),
                new nlobjSearchColumn('shipaddress1', 'fulfillingtransaction'),
                new nlobjSearchColumn('shipaddress2', 'fulfillingtransaction'),
                new nlobjSearchColumn('shipaddressee', 'fulfillingtransaction'),
                new nlobjSearchColumn('shipattention', 'fulfillingtransaction'),
                new nlobjSearchColumn('shipcity', 'fulfillingtransaction'),
                new nlobjSearchColumn('shipcountry', 'fulfillingtransaction'),
                new nlobjSearchColumn('shipstate', 'fulfillingtransaction'),
                new nlobjSearchColumn('shipzip', 'fulfillingtransaction')
            ];

            const pick_pack_ship_is_enabled = !!Utils.isFeatureEnabled('PICKPACKSHIP');
            const is_uom_enabled =
                ModelsInit.context.getSetting('FEATURE', 'UNITSOFMEASURE') === 'T';

            if (pick_pack_ship_is_enabled) {
                columns.push(new nlobjSearchColumn('quantitypicked'));
                columns.push(new nlobjSearchColumn('quantitypacked'));
            }

            if (is_uom_enabled) {
                columns.push(new nlobjSearchColumn('quantityuom'));
            }

            Application.getAllSearchResults('salesorder', filters, columns).forEach(function(
                ffline
            ) {
                const fulfillment_id = ffline.getValue('fulfillingtransaction');
                const line_internalid = `${self.result.internalid}_${ffline.getValue('line')}`;
                const line = _.findWhere(self.result.lines, {
                    internalid: line_internalid
                });
                const quantity = new BigNumber(ffline.getValue('quantity'));
                const quantity_uom = ffline.getValue('quantityuom')
                    ? new BigNumber(ffline.getValue('quantityuom'))
                    : quantity;
                const quantity_fulfilled = new BigNumber(ffline.getValue('quantityshiprecv'));
                const quantity_line = new BigNumber(
                    ffline.getValue('quantity', 'fulfillingtransaction')
                );
                const quantity_picked = new BigNumber(ffline.getValue('quantitypicked'));
                const quantity_packed = new BigNumber(ffline.getValue('quantitypacked'));
                const zero = new BigNumber(0);

                const conversion_units =
                    quantity.gt(zero) && quantity_uom.gt(zero)
                        ? quantity.dividedBy(quantity_uom)
                        : new BigNumber(1);

                if (fulfillment_id) {
                    const shipaddress = self.addAddress(
                        {
                            internalid: ffline.getValue('shipaddress', 'fulfillingtransaction'),
                            country: ffline.getValue('shipcountry', 'fulfillingtransaction'),
                            state: ffline.getValue('shipstate', 'fulfillingtransaction'),
                            city: ffline.getValue('shipcity', 'fulfillingtransaction'),
                            zip: ffline.getValue('shipzip', 'fulfillingtransaction'),
                            addr1: ffline.getValue('shipaddress1', 'fulfillingtransaction'),
                            addr2: ffline.getValue('shipaddress2', 'fulfillingtransaction'),
                            attention: ffline.getValue('shipattention', 'fulfillingtransaction'),
                            addressee: ffline.getValue('shipaddressee', 'fulfillingtransaction')
                        },
                        self.result
                    );

                    self.result.fulfillments[fulfillment_id] = self.result.fulfillments[
                        fulfillment_id
                    ] || {
                        internalid: fulfillment_id,
                        shipaddress: shipaddress,
                        shipmethod: self.addShippingMethod({
                            internalid: ffline.getValue('shipmethod', 'fulfillingtransaction'),
                            name: ffline.getText('shipmethod', 'fulfillingtransaction')
                        }),
                        date: ffline.getValue('actualshipdate'),
                        trackingnumbers: ffline.getValue('trackingnumbers', 'fulfillingtransaction')
                            ? ffline
                                  .getValue('trackingnumbers', 'fulfillingtransaction')
                                  .split('<BR>')
                            : null,
                        lines: [],
                        status: {
                            internalid: ffline.getValue('status', 'fulfillingtransaction'),
                            name: ffline.getText('status', 'fulfillingtransaction')
                        }
                    };

                    self.result.fulfillments[fulfillment_id].lines.push({
                        internalid: line_internalid,
                        quantity: quantity_line.dividedBy(conversion_units).toNumber()
                    });
                }

                if (line) {
                    line.quantityfulfilled = quantity_fulfilled;

                    if (line.fulfillmentChoice && line.fulfillmentChoice === 'pickup') {
                        line.quantitypicked = pick_pack_ship_is_enabled
                            ? quantity_picked.minus(line.quantityfulfilled)
                            : zero;
                        line.quantitybackordered = quantity
                            .minus(line.quantityfulfilled)
                            .minus(line.quantitypicked);
                    } else {
                        line.quantitypacked = pick_pack_ship_is_enabled
                            ? quantity_packed.minus(line.quantityfulfilled)
                            : zero;
                        line.quantitypicked = pick_pack_ship_is_enabled
                            ? quantity_picked
                                  .minus(line.quantitypacked)
                                  .minus(line.quantityfulfilled)
                            : zero;
                        line.quantitybackordered = quantity
                            .minus(line.quantityfulfilled)
                            .minus(line.quantitypacked)
                            .minus(line.quantitypicked);
                        line.quantitypacked = line.quantitypacked
                            .dividedBy(conversion_units)
                            .toNumber();
                    }

                    line.quantityfulfilled = line.quantityfulfilled
                        .dividedBy(conversion_units)
                        .toNumber();
                    line.quantitypicked = line.quantitypicked
                        .dividedBy(conversion_units)
                        .toNumber();
                    line.quantitybackordered = line.quantitybackordered
                        .dividedBy(conversion_units)
                        .toNumber();
                }
            });

            this.result.fulfillments = _.values(this.result.fulfillments);
        },

        // @method isReturnable Indicate if the current loaded transaction is returnable or not
        // @return {Boolean}
        isReturnable: function() {
            if (this.result.recordtype === 'salesorder') {
                const status_id = this.record.getFieldValue('statusRef');

                return (
                    status_id !== 'pendingFulfillment' &&
                    status_id !== 'pendingApproval' &&
                    status_id !== 'closed' &&
                    status_id !== 'canceled'
                );
            }
            return true;
        },
        getReceipts: function() {
            this.result.receipts = Transaction.list({
                createdfrom: this.result.internalid,
                types: 'CustInvc,CashSale',
                page: 'all'
            });
        },
        getReturnAuthorizations: function() {
            const created_from = _(this.result.receipts || []).pluck('internalid');

            created_from.push(this.result.internalid);

            this.result.returnauthorizations = ReturnAuthorization.list({
                createdfrom: created_from,
                page: 'all',
                getLines: true
            });
        },

        postGet: function() {
            this.result.lines = _.reject(this.result.lines, function(line) {
                return line.quantity === 0;
            });
        },

        getPaymentEvent: function() {
            if (this.record.getFieldValue('paymethtype') === 'external_checkout') {
                this.result.paymentevent = {
                    holdreason: this.record.getFieldValue('paymenteventholdreason'),
                    redirecturl: ExternalPayment.generateUrl(
                        this.result.internalid,
                        this.result.recordtype
                    )
                };
            } else {
                this.result.paymentevent = {};
            }
        },

        update: function(id, data, headers) {
            let result = 'OK';

            if (data.status === 'cancelled') {
                const url = `https://${Application.getHost()}/app/accounting/transactions/salesordermanager.nl?type=cancel&xml=T&id=${id}`;
                const cancel_response = nlapiRequestURL(url, null, headers);

                if (cancel_response.getCode() === 206) {
                    if (nlapiLookupField('salesorder', id, 'statusRef') !== 'cancelled') {
                        result = 'ERR_ALREADY_APPROVED_STATUS';
                    } else {
                        result = 'ERR_ALREADY_CANCELLED_STATUS';
                    }
                }
            }

            return result;
        },

        // @method isCancelable
        // @return {Boolean}
        isCancelable: function() {
            return (
                this.result.recordtype === 'salesorder' &&
                this.result.status.internalid === 'pendingApproval'
            );
        },

        // @method getCreatedFrom
        // return {Void}
        getCreatedFrom: function() {
            const fields = ['createdfrom.tranid', 'createdfrom.internalid', 'createdfrom.type'];
            const result = nlapiLookupField(this.recordType, this.recordId, fields);

            if (result) {
                // @class Transaction.Model.Get.Result
                // @property {CreatedFrom} createdfrom
                this.result.createdfrom =
                    // @class CreatedFrom
                    {
                        // @property {String} internalid
                        internalid: result['createdfrom.internalid'],
                        // @property {String} name
                        name: result['createdfrom.tranid'],
                        // @property {String} recordtype
                        recordtype: result['createdfrom.type']
                    };
            }
        },

        getAdjustments: TransactionModelExtensions.getAdjustments,

        getLines: function() {
            Transaction.getLines.apply(this, arguments);

            if (this.isPickupInStoreEnabled) {
                const self = this;

                _.each(this.result.lines, function(line) {
                    line.location = self.record.getLineItemValue('item', 'location', line.index);

                    const item_fulfillment_choice = self.record.getLineItemValue(
                        'item',
                        'itemfulfillmentchoice',
                        line.index
                    );

                    if (item_fulfillment_choice === '1') {
                        line.fulfillmentChoice = 'ship';
                    } else if (item_fulfillment_choice === '2') {
                        line.fulfillmentChoice = 'pickup';
                    }
                });
            }
        },

        getTransactionRecord: function(record_type, id) {
            if (
                this.isPickupInStoreEnabled &&
                record_type === 'salesorder' &&
                Configuration.get('pickupInStoreSalesOrderCustomFormId')
            ) {
                return nlapiLoadRecord(record_type, id, {
                    customform: Configuration.get('pickupInStoreSalesOrderCustomFormId')
                });
            }
            return Transaction.getTransactionRecord.apply(this, arguments);
        },

        // @method addAddress Overrides function on Transaction.Model.
        // AddressModel validation is not called because it is not required and affects performance and API Governance usage points.
        // @param {Address.Model.Attributes} address
        // @return {String} address id
        addAddress: function(address) {
            this.result.addresses = this.result.addresses || {};

            address.fullname = address.attention ? address.attention : address.addressee;
            address.company = address.attention ? address.addressee : null;

            delete address.attention;
            delete address.addressee;

            address.internalid = this.getAddressInternalId(address);
            address.isvalid = 'T';

            if (!this.result.addresses[address.internalid]) {
                this.result.addresses[address.internalid] = address;
            }

            return address.internalid;
        },

        _addTransactionColumnFieldsToOptions: function(line) {
            const self = this;
            const lineFieldsId = self.record.getAllLineItemFields('item');
            _.each(lineFieldsId, function(field) {
                if (field.indexOf('custcol') === 0) {
                    const lineId = line.index;
                    const fieldValue = self.record.getLineItemValue('item', field, lineId);
                    if (fieldValue !== null) {
                        const fieldInf = self.record.getLineItemField('item', field, lineId);
                        if (fieldInf !== null) {
                            line.options.push(
                                self.transactionModelGetLineOptionBuilder(
                                    field,
                                    fieldInf.label,
                                    self.transactionModelGetLineOptionValueBuilder(
                                        undefined,
                                        fieldValue
                                    ),
                                    fieldInf.mandatory
                                )
                            );
                        }
                    }
                }
            });
        }
    });
});

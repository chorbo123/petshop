/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global stringtodate */
// LivePayment.js
// -------
// Defines the model used by the LivePayment.Service.ss service
define('LivePayment.Model', [
    'SC.Model',
    'CustomerPayment.Model',
    'Invoice.Model',
    'SC.Models.Init',
    'Application',
    'bignumber',
    'Configuration',
    'CardHolderAuthentication.Model',
    'CardHolderAuthentication.Utils',
    'Utils',
    'underscore'
], function(
    SCModel,
    CustomerPayment,
    InvoiceModel,
    ModelsInit,
    Application,
    BigNumber,
    Configuration,
    CardHolderAuthentication,
    CardHolderAuthenticationUtils,
    Utils,
    _
) {
    return SCModel.extend({
        name: 'LivePayment',
        // @property {Object} CHA_STATUS
        CHA_STATUS: CardHolderAuthenticationUtils.CHA_STATUS,
        // @property {Boolean} paymentInstrumentsEnabled
        paymentInstrumentsEnabled:
            ModelsInit.context.getSetting('FEATURE', 'PAYMENTINSTRUMENTS') === 'T',

        create: function(currencyid) {
            const customer_payment = nlapiCreateRecord('customerpayment', {
                recordmode: 'dynamic'
            });
            customer_payment.setFieldValue('customer', nlapiGetUser());
            customer_payment.setFieldValue('autoapply', 'F');

            if (currencyid) {
                customer_payment.setFieldValue('currency', currencyid);
            }

            return customer_payment;
        },

        loadRecord: function(internalid) {
            return nlapiLoadRecord('customerpayment', internalid, {
                recordmode: 'dynamic'
            });
        },

        get: function(internalid, currencyid, page, invoice_internalid) {
            try {
                const selected_currency = Utils.getCurrencyById(currencyid);
                let customer_payment;

                this.selected_currency_symbol = selected_currency
                    ? selected_currency.symbol
                    : selected_currency;

                if (internalid && internalid !== 'null') {
                    customer_payment = this.loadRecord(internalid);
                } else {
                    customer_payment = this.create(currencyid);
                }

                return this.createResult(customer_payment, page, invoice_internalid);
            } catch (e) {
                if (e instanceof nlobjError && e.getCode() === 'INSUFFICIENT_PERMISSION') {
                    return {};
                }
                throw e;
            }
        },

        setPaymentMethod: function(customer_payment, result) {
            result.paymentmethods = [];
            const websitePayments = ModelsInit.session.getSiteSettings(['paymentmethods'])
                .paymentmethods;
            const paymentTypeRecord = customer_payment.getFieldValue('paymentmethod');
            const paymentTypeWebsite = _.find(
                websitePayments,
                payment => payment.internalid === paymentTypeRecord
            );

            if (paymentTypeWebsite) {
                return Utils.setPaymentMethodToResult(customer_payment, result);
            }
        },

        createResult: function(customer_payment, page, invoice_internalid) {
            const result = {};

            result.internalid = customer_payment.getId();
            result.type = customer_payment.getRecordType();
            result.tranid = customer_payment.getFieldValue('tranid');
            result.autoapply = customer_payment.getFieldValue('autoapply');
            result.trandate = customer_payment.getFieldValue('trandate');
            result.status = customer_payment.getFieldValue('status');
            result.payment = Utils.toCurrency(customer_payment.getFieldValue('payment'));
            result.payment_formatted = Utils.formatCurrency(
                customer_payment.getFieldValue('payment'),
                this.selected_currency_symbol
            );
            result.lastmodifieddate = customer_payment.getFieldValue('lastmodifieddate');
            result.balance = Utils.toCurrency(customer_payment.getFieldValue('balance'));
            result.balance_formatted = Utils.formatCurrency(
                customer_payment.getFieldValue('balance'),
                this.selected_currency_symbol
            );

            this.setPaymentMethod(customer_payment, result);
            this.setInvoices(customer_payment, result, page, invoice_internalid);
            this.setCredits(customer_payment, result);
            this.setDeposits(customer_payment, result);

            return result;
        },

        setInvoices: function(customer_payment, result, page, invoice_internalid) {
            result.invoices = [];

            for (let i = 1; i <= customer_payment.getLineItemCount('apply'); i++) {
                result.invoices.push({
                    internalid: customer_payment.getLineItemValue('apply', 'internalid', i),
                    total: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'total', i)),
                    total_formatted: Utils.formatCurrency(
                        customer_payment.getLineItemValue('apply', 'total', i),
                        this.selected_currency_symbol
                    ),
                    apply: customer_payment.getLineItemValue('apply', 'apply', i) === 'T',
                    applydate: customer_payment.getLineItemValue('apply', 'applydate', i),
                    currency: customer_payment.getLineItemValue('apply', 'currency', i),
                    discamt: Utils.toCurrency(
                        customer_payment.getLineItemValue('apply', 'discamt', i)
                    ),
                    discamt_formatted: Utils.formatCurrency(
                        customer_payment.getLineItemValue('apply', 'discamt', i),
                        this.selected_currency_symbol
                    ),
                    disc: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'disc', i)),
                    disc_formatted: Utils.formatCurrency(
                        customer_payment.getLineItemValue('apply', 'disc', i),
                        this.selected_currency_symbol
                    ),
                    discdate: customer_payment.getLineItemValue('apply', 'discdate', i),
                    due: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'due', i)),
                    due_formatted: Utils.formatCurrency(
                        customer_payment.getLineItemValue('apply', 'due', i),
                        this.selected_currency_symbol
                    ),
                    tranid: customer_payment.getLineItemValue('apply', 'refnum', i)
                });
            }

            // We need to extend our invoices with complementary properties
            if (result.invoices.length) {
                let invoices_expanded;
                if (invoice_internalid) {
                    const invoiceList = InvoiceModel.list({
                        internalid: invoice_internalid,
                        page: page
                    });

                    invoices_expanded = page === 'all' ? invoiceList : invoiceList.records;
                } else {
                    invoices_expanded = InvoiceModel.list({
                        internalid: _.pluck(result.invoices, 'internalid'),
                        page: page || 1
                    }).records;
                }

                // We'll use just the invoices that match those coming from InvoiceModel.list method
                result.invoices = _.filter(
                    result.invoices,
                    function(invoice) {
                        return _.find(invoices_expanded, {
                            internalid: invoice.internalid
                        });
                    },
                    this
                );

                _.each(
                    result.invoices,
                    function(invoice) {
                        const invoice_expanded = _.find(invoices_expanded, {
                            internalid: invoice.internalid
                        });

                        invoice.amount = invoice_expanded.amount;
                        invoice.amount_formatted = invoice_expanded.amount_formatted;
                        invoice.trandate = invoice_expanded.trandate;
                        invoice.duedate = invoice_expanded.duedate;
                        invoice.dueinmilliseconds = invoice_expanded.dueinmilliseconds;
                        invoice.isOverdue = invoice_expanded.isOverdue;

                        invoice.discountapplies =
                            invoice.discdate && stringtodate(invoice.discdate) >= new Date();
                        invoice.duewithdiscount = new BigNumber(invoice.due)
                            .minus(invoice.discountapplies ? invoice.discamt : 0)
                            .toNumber();
                        invoice.duewithdiscount_formatted = Utils.formatCurrency(
                            invoice.duewithdiscount,
                            this.selected_currency_symbol
                        );
                        invoice.discount =
                            invoice.discamt && invoice.total
                                ? new BigNumber(invoice.discamt)
                                      .div(invoice.due)
                                      .times(100)
                                      .toFixed(2)
                                : 0;
                        invoice.discount_formatted = `${invoice.discount}%`;
                    },
                    this
                );
            }

            return result;
        },

        setCredits: function(customer_payment, result) {
            result.credits = [];
            result.creditmemosremaining = 0;

            for (let i = 1; i <= customer_payment.getLineItemCount('credit'); i++) {
                const creditmemo = {
                    internalid: customer_payment.getLineItemValue('credit', 'internalid', i),
                    type: customer_payment.getLineItemValue('credit', 'type', i),
                    total: Utils.toCurrency(
                        customer_payment.getLineItemValue('credit', 'total', i)
                    ),
                    total_formatted: Utils.formatCurrency(
                        customer_payment.getLineItemValue('credit', 'total', i),
                        this.selected_currency_symbol
                    ),
                    apply: customer_payment.getLineItemValue('credit', 'apply', i) === 'T',
                    currency: customer_payment.getLineItemValue('apply', 'currency', i),
                    remaining: Utils.toCurrency(
                        customer_payment.getLineItemValue('credit', 'due', i)
                    ),
                    remaining_formatted: Utils.formatCurrency(
                        customer_payment.getLineItemValue('credit', 'due', i),
                        this.selected_currency_symbol
                    ),
                    amount: Utils.toCurrency(
                        customer_payment.getLineItemValue('credit', 'amount', i)
                    ),
                    amount_formatted: Utils.formatCurrency(
                        customer_payment.getLineItemValue('credit', 'amount', i),
                        this.selected_currency_symbol
                    ),
                    refnum: customer_payment.getLineItemValue('credit', 'refnum', i)
                };

                result.creditmemosremaining = new BigNumber(creditmemo.remaining)
                    .plus(result.creditmemosremaining)
                    .toNumber();
                result.credits.push(creditmemo);
            }

            result.creditmemosremaining_formatted = Utils.formatCurrency(
                result.creditmemosremaining,
                this.selected_currency_symbol
            );

            return result;
        },

        setDeposits: function(customer_payment, result) {
            result.deposits = [];

            result.depositsremaining = 0;

            for (let i = 1; i <= customer_payment.getLineItemCount('deposit'); i++) {
                const deposit = {
                    internalid: customer_payment.getLineItemValue('deposit', 'doc', i),
                    total: Utils.toCurrency(
                        customer_payment.getLineItemValue('deposit', 'total', i)
                    ),
                    total_formatted: Utils.formatCurrency(
                        customer_payment.getLineItemValue('deposit', 'total', i),
                        this.selected_currency_symbol
                    ),
                    apply: customer_payment.getLineItemValue('deposit', 'apply', i) === 'T',
                    currency: customer_payment.getLineItemValue('deposit', 'currency', i),
                    depositdate: customer_payment.getLineItemValue('deposit', 'depositdate', i),
                    remaining: Utils.toCurrency(
                        customer_payment.getLineItemValue('deposit', 'remaining', i)
                    ),
                    remaining_formatted: Utils.formatCurrency(
                        customer_payment.getLineItemValue('deposit', 'remaining', i),
                        this.selected_currency_symbol
                    ),
                    amount: Utils.toCurrency(
                        customer_payment.getLineItemValue('deposit', 'amount', i)
                    ),
                    amount_formatted: Utils.formatCurrency(
                        customer_payment.getLineItemValue('deposit', 'amount', i),
                        this.selected_currency_symbol
                    ),
                    refnum: customer_payment.getLineItemValue('deposit', 'refnum', i)
                };

                result.depositsremaining = new BigNumber(deposit.remaining)
                    .plus(result.depositsremaining)
                    .toNumber();
                result.deposits.push(deposit);
            }

            result.depositsremaining_formatted = Utils.formatCurrency(
                result.depositsremaining,
                this.selected_currency_symbol
            );

            return result;
        },

        update: function(payment_record, data) {
            const self = this;
            const { invoices } = data;
            const { credits } = data;
            const { deposits } = data;

            // invoices

            for (var i = 1; i <= payment_record.getLineItemCount('apply'); i++) {
                const invoice = _.findWhere(invoices, {
                    internalid: payment_record.getLineItemValue('apply', 'internalid', i)
                });

                if (invoice && invoice.apply) {
                    payment_record.setLineItemValue('apply', 'apply', i, 'T');
                    payment_record.setLineItemValue('apply', 'amount', i, invoice.amount);

                    invoice.due = payment_record.getLineItemValue('apply', 'due', i);
                    invoice.total = payment_record.getLineItemValue('apply', 'total', i);
                    invoice.discdate = payment_record.getLineItemValue('apply', 'discdate', i);
                    invoice.discamt = payment_record.getLineItemValue('apply', 'discamt', i);
                    invoice.discountapplies =
                        self._isPayFull(invoice) &&
                        (invoice.discdate && stringtodate(invoice.discdate) >= new Date());
                    invoice.duewithdiscount = new BigNumber(invoice.due)
                        .minus(invoice.discountapplies ? invoice.discamt : 0)
                        .toNumber();

                    if (invoice.discountapplies && !!invoice.discamt) {
                        payment_record.setLineItemValue(
                            'apply',
                            'amount',
                            i,
                            invoice.duewithdiscount
                        );
                        payment_record.setLineItemValue('apply', 'disc', i, invoice.discamt);
                    }
                }
            }

            // deposits

            for (i = 1; i <= payment_record.getLineItemCount('deposit'); i++) {
                const deposit = _.findWhere(deposits, {
                    internalid: payment_record.getLineItemValue('deposit', 'doc', i)
                });

                if (deposit && deposit.apply) {
                    payment_record.setLineItemValue('deposit', 'apply', i, 'T');
                    payment_record.setLineItemValue('deposit', 'amount', i, deposit.amount);
                }
            }

            // credits

            for (i = 1; i <= payment_record.getLineItemCount('credit'); i++) {
                const credit = _.findWhere(credits, {
                    internalid: payment_record.getLineItemValue('credit', 'internalid', i)
                });

                if (credit && credit.apply) {
                    payment_record.setLineItemValue('credit', 'apply', i, 'T');
                    payment_record.setLineItemValue('credit', 'amount', i, credit.amount);
                }
            }

            const payment_method = data.paymentmethods && data.paymentmethods[0];

            if (data.payment && payment_method && payment_method.type) {
                // remove current payment method.
                payment_record.setFieldValue('returnurl', null);
                payment_record.setFieldValue('creditcard', null);
                payment_record.setFieldValue('ccexpiredate', null);
                payment_record.setFieldValue('ccname', null);
                payment_record.setFieldValue('ccnumber', null);
                payment_record.setFieldValue('paymentmethod', null);
                payment_record.setFieldValue('creditcardprocessor', null);
                payment_record.setFieldValue('paymenteventholdreason', null);

                if (payment_method.type === 'creditcard') {
                    const credit_card = payment_method.creditcard;

                    if (credit_card.internalid === '-temporal-') {
                        payment_record.setFieldValue('creditcard', null);
                        payment_record.setFieldValue('ccsave', 'F');
                        payment_record.setFieldValue('ccnumber', credit_card.ccnumber);
                        payment_record.setFieldValue('ccsecuritycode', credit_card.ccsecuritycode);
                        payment_record.setFieldValue('ccname', credit_card.ccname);
                        payment_record.setFieldValue('ccdefault', 'F');
                        payment_record.setFieldValue('ccexpiredate', credit_card.ccexpiredate);
                        payment_record.setFieldValue(
                            'paymentmethod',
                            credit_card.paymentmethod.internalid
                        );
                    } else {
                        if (this.paymentInstrumentsEnabled) {
                            payment_record.setFieldValue('paymentoption', credit_card.internalid);
                            if (credit_card.paymentmethod.merchantid) {
                                payment_record.setFieldValue(
                                    'paymentprocessingprofile',
                                    credit_card.paymentmethod.merchantid
                                );
                            }
                            if (credit_card.ccsecuritycode) {
                                payment_record.setFieldValue(
                                    'paymentcardcsc',
                                    credit_card.ccsecuritycode
                                );
                            }
                        } else {
                            payment_record.setFieldValue('creditcard', credit_card.internalid);
                            payment_record.setFieldValue(
                                'paymentmethod',
                                credit_card.paymentmethod.internalid
                            );

                            if (credit_card.paymentmethod.merchantid) {
                                payment_record.setFieldValue(
                                    'creditcardprocessor',
                                    credit_card.paymentmethod.merchantid
                                );
                            }
                        }

                        if (credit_card.ccsecuritycode) {
                            payment_record.setFieldValue(
                                'ccsecuritycode',
                                credit_card.ccsecuritycode
                            );
                        }
                    }
                    payment_record.setFieldValue('chargeit', 'T');
                } else if (~payment_method.type.indexOf('external_checkout')) {
                    payment_record.setFieldValue('paymentmethod', payment_method.internalid);
                    payment_record.setFieldValue('creditcardprocessor', payment_method.merchantid);
                    payment_record.setFieldValue('returnurl', payment_method.returnurl);
                    payment_record.setFieldValue('chargeit', 'T');
                } else if (payment_method.type === 'ACH') {
                    payment_record.setFieldValue('paymentoption', payment_method.ACH.internalid);
                }
            }

            payment_record.setFieldValue('payment', data.payment);
            return payment_record;
        },

        _isPayFull: function(invoice) {
            return parseFloat(invoice.amount) === parseFloat(invoice.due);
        },
        getPaymentRecord: function(data) {
            return this.update(
                data.internalid ? this.loadRecord(data.internalid) : this.create(data.currency_id),
                data
            );
        },
        submitRecord: function(paymentRecord, data) {
            const paymentRecordId = nlapiSubmitRecord(paymentRecord);
            const newPaymentRecord = this.get();
            if (paymentRecordId !== '0') {
                // send confirmation
                newPaymentRecord.confirmation = _.extend(
                    data,
                    CustomerPayment.get('customerpayment', paymentRecordId)
                );
            } else {
                data.internalid = '0';
                newPaymentRecord.confirmation = data;
            }
            return newPaymentRecord;
        },
        saveDataInSession: function(data) {
            ModelsInit.context.setSessionObject('sessionPaymentData', JSON.stringify(data));
        },
        getPaymentMethod: function(data) {
            return data && data.paymentmethods && data.paymentmethods[0];
        },
        // @method process3DSecure. 3D Secure is a second factor authentication.
        // Can apply to Visa, MasterCard, JCB International and American Express.
        // @return {Object} Result of order submit operation ({status, internalid, confirmationnumber})
        process3DSecure: function process3DSecure(data, paymentMethod) {
            const notificationURL = CardHolderAuthenticationUtils.getThreeDSecurePageUrl(
                ModelsInit
            );
            const site_id = ModelsInit.session.getSiteSettings(['siteid']).siteid;
            const cardHolderAuthenticationRecord = CardHolderAuthentication.createAndReturnRecord({
                amount: data.invoices_total,
                paymentOption: paymentMethod.creditcard.internalid,
                paymentProcessingProfile: paymentMethod.creditcard.paymentmethod.key.split(',')[1],
                notificationURL: `${notificationURL}?n=${site_id}&type=${2}`
            });

            switch (cardHolderAuthenticationRecord.getValue('status')) {
                case this.CHA_STATUS.NOT_REQUIRED:
                case this.CHA_STATUS.AUTHENTICATED:
                    const cardHolderAuthenticationRecordId = ModelsInit.context.getSessionObject(
                        'cardHolderAuthenticationRecordId'
                    );
                    const paymentRecord = this.getPaymentRecord(data);
                    if (CardHolderAuthenticationUtils.isCHASupported(paymentMethod)) {
                        paymentRecord.setFieldValue(
                            'cardholderauthentication',
                            cardHolderAuthenticationRecordId
                        );
                    }
                    return this.submitRecord(paymentRecord, data);
                case this.CHA_STATUS.WAITING_FOR_DEVICE_AUTHENTICATION:
                    this.saveDataInSession(data);
                    return CardHolderAuthentication.buildSubmitDeviceAuthenticationForm(
                        cardHolderAuthenticationRecord
                    );

                case this.CHA_STATUS.WAITING_FOR_SHOPPER_CHALLENGE:
                    this.saveDataInSession(data);
                    return CardHolderAuthentication.buildSubmitReqShopperChallenger(
                        cardHolderAuthenticationRecord,
                        cardHolderAuthenticationRecord.id
                    );
                default:
                    ModelsInit.context.setSessionObject('cardHolderAuthenticationRecordId', null);
                    throw 'An error has occurred';
            }
        },
        submit: function(threeDSecure, data) {
            if (
                !threeDSecure &&
                CardHolderAuthenticationUtils.startProcess3DSecure(
                    this.getPaymentMethod(data),
                    Configuration.get('isThreeDSecureEnabled')
                )
            ) {
                return this.process3DSecure(data, this.getPaymentMethod(data));
            }
            if (
                threeDSecure &&
                ModelsInit.context.getSessionObject('cardHolderAuthenticationRecordId') !== null &&
                !data
            ) {
                const cardHolderAuthenticationRecordId = ModelsInit.context.getSessionObject(
                    'cardHolderAuthenticationRecordId'
                );
                const sessionPaymentData = JSON.parse(
                    ModelsInit.context.getSessionObject('sessionPaymentData')
                );
                const paymentRecord = this.getPaymentRecord(sessionPaymentData);
                if (
                    CardHolderAuthenticationUtils.isCHASupported(
                        this.getPaymentMethod(sessionPaymentData)
                    )
                ) {
                    paymentRecord.setFieldValue(
                        'cardholderauthentication',
                        cardHolderAuthenticationRecordId
                    );
                }
                return this.submitRecord(paymentRecord, sessionPaymentData).confirmation;
            }
            const paymentRecord = this.getPaymentRecord(data);
            return this.submitRecord(paymentRecord, data);
        }
    });
});

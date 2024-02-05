/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("PaymentInstrumentACH.Edit.Form.View", ["require", "exports", "underscore", "paymentinstrument_ach_edit_form.tpl", "FormView", "Loggers", "jQuery", "Utils", "PaymentInstrumentACH.Model", "Configuration", "Profile.Model", "Error", "GlobalViews.Confirmation.View", "Backbone"], function (require, exports, _, paymentinstrument_ach_edit_form_tpl, FormView_1, Loggers_1, jQuery, Utils, PaymentInstrumentACH_Model_1, Configuration_1, Profile_Model_1, Error_1, GlobalViewsConfirmationView, Backbone) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentInstrumentACHEditFormView = void 0;
    var PaymentInstrumentACHEditFormView = /** @class */ (function (_super) {
        __extends(PaymentInstrumentACHEditFormView, _super);
        function PaymentInstrumentACHEditFormView(options) {
            var _this = _super.call(this, new PaymentInstrumentACH_Model_1.PaymentInstrumentACHModel()) || this;
            _this.template = paymentinstrument_ach_edit_form_tpl;
            _this.options = options;
            _this.user = Profile_Model_1.ProfileModel.getInstance();
            _this.formModel = _this.options.model;
            return _this;
        }
        PaymentInstrumentACHEditFormView.prototype.getEvents = function () {
            return {
                'submit form': 'customSaveForm',
                'blur [name="paymentmethod"]': 'onFormFieldChange',
                'blur [name="account"]': 'onFormFieldChange',
                'blur [name="accounttype"]': 'onFormFieldChange',
                'blur [name="routingnumber"]': 'onFormFieldChange',
                'blur [name="bankname"]': 'onFormFieldChange',
                'blur [name="ownername"]': 'onFormFieldChange',
                'blur [name="limit"]': 'onFormFieldChange',
                'change form [name="account"]': 'setPaymethodKey'
            };
        };
        PaymentInstrumentACHEditFormView.prototype.getFormValues = function ($savingForm) {
            var formValues = $savingForm.serializeObject();
            var account = '';
            var routingNumber = '';
            var bankName = '';
            var ownerName = '';
            var limit = '';
            var paymentMethod = null;
            var accountType = '';
            var validFields;
            var errorsResult = {
                errorCode: Error_1.Errors.FormValidation,
                errors: {}
            };
            if ('limit' in formValues && typeof formValues.limit === 'string' && formValues.limit) {
                limit = formValues.limit;
            }
            else {
                errorsResult.errors.limit = Utils.translate('Limit is required');
            }
            if (this.formModel.isNew()) {
                if ('account' in formValues &&
                    typeof formValues.account === 'string' &&
                    formValues.account) {
                    account = formValues.account;
                }
                else {
                    errorsResult.errors.account = Utils.translate('Account is required');
                }
                if ('routingnumber' in formValues &&
                    typeof formValues.routingnumber === 'string' &&
                    formValues.routingnumber) {
                    routingNumber = formValues.routingnumber;
                }
                else {
                    errorsResult.errors.routingnumber = Utils.translate('Routing Number is required');
                }
                if ('bankname' in formValues &&
                    typeof formValues.bankname === 'string' &&
                    formValues.bankname) {
                    bankName = formValues.bankname;
                }
                else {
                    errorsResult.errors.bankname = Utils.translate('Bank Name is required');
                }
                if ('ownername' in formValues &&
                    typeof formValues.ownername === 'string' &&
                    formValues.ownername) {
                    ownerName = formValues.ownername;
                }
                else {
                    errorsResult.errors.ownername = Utils.translate('Owner Name is required');
                }
                if ('accounttype' in formValues &&
                    typeof formValues.accounttype === 'string' &&
                    formValues.accounttype !== '0' &&
                    formValues.accounttype) {
                    accountType = formValues.accounttype;
                }
                else {
                    errorsResult.errors.accounttype = Utils.translate('Account Type is required');
                }
                if ('paymentmethod' in formValues &&
                    typeof formValues.paymentmethod === 'string' &&
                    formValues.paymentmethod !== '0' &&
                    formValues.paymentmethod) {
                    paymentMethod = formValues.paymentmethod;
                }
                else {
                    errorsResult.errors.paymentmethod = Utils.translate('Payment method is required');
                }
                if (account &&
                    accountType &&
                    paymentMethod &&
                    routingNumber &&
                    bankName &&
                    ownerName &&
                    limit) {
                    validFields = {
                        account: account,
                        accounttype: accountType,
                        paymentmethod: paymentMethod,
                        routingnumber: routingNumber,
                        bankname: bankName,
                        ownername: ownerName,
                        limit: limit
                    };
                }
            }
            else if (limit) {
                validFields = {
                    limit: limit
                };
            }
            return validFields || errorsResult;
        };
        PaymentInstrumentACHEditFormView.prototype.getFormFieldValue = function (changedInput) {
            var newVal = changedInput.val();
            var fieldName = changedInput.attr('name');
            if (fieldName === 'account' && typeof newVal === 'string') {
                return {
                    name: fieldName,
                    value: newVal
                };
            }
            if (fieldName === 'routingnumber' && typeof newVal === 'string') {
                return {
                    name: fieldName,
                    value: newVal
                };
            }
            if (fieldName === 'bankname' && typeof newVal === 'string') {
                return {
                    name: fieldName,
                    value: newVal
                };
            }
            if (fieldName === 'ownername' && typeof newVal === 'string') {
                return {
                    name: fieldName,
                    value: newVal
                };
            }
            if (fieldName === 'limit' && typeof newVal === 'string') {
                return {
                    name: fieldName,
                    value: newVal
                };
            }
            if (fieldName === 'accounttype' && typeof newVal === 'string' && newVal !== '0') {
                return {
                    name: fieldName,
                    value: newVal
                };
            }
            if (fieldName === 'paymentmethod' && newVal !== '0') {
                return {
                    name: fieldName,
                    value: newVal
                };
            }
            return {
                name: fieldName || '',
                error: Utils.translate('Please provide a valid $(0)', fieldName)
            };
        };
        PaymentInstrumentACHEditFormView.prototype.persistForm = function () {
            return this.customSaveForm(jQuery.Event('click', {
                target: this.$el.find('form').get(0)
            }));
        };
        PaymentInstrumentACHEditFormView.prototype.customSaveForm = function (e) {
            var _this = this;
            var loggers = Loggers_1.Loggers.getLogger();
            var actionId = loggers.start('Save ACH');
            var promise = _super.prototype.saveForm.call(this, e);
            if (promise) {
                promise.then(function () {
                    loggers.end(actionId, {
                        operationIds: _this.formModel.getOperationIds(),
                        status: 'success'
                    });
                    _this.confirmConsent();
                });
            }
            return promise;
        };
        PaymentInstrumentACHEditFormView.prototype.confirmConsent = function () {
            var _this = this;
            var consentMessage = this.formModel.get('customerconsent');
            var approveConsentView = new GlobalViewsConfirmationView({
                callBack: function () {
                    _this.formModel.set('consent', true);
                    var promise = _this.formModel.save();
                    if (promise) {
                        promise.then(function () {
                            _this.options.collection.fetch().then(function () {
                                if (!_this.options.inModal && !_this.options.noRedirect) {
                                    Backbone.history.navigate('#ach', {
                                        trigger: true
                                    });
                                }
                            });
                        });
                    }
                },
                title: Utils.translate('Approve Consent'),
                body: Utils.translate(consentMessage),
                autohide: true
            });
            approveConsentView.once('destroy', function () {
                if (!!_this.formModel.get('consent') === false) {
                    _this.options.collection.trigger('noconsent', _this.options.collection);
                }
            });
            return this.application.getLayout().showInModal(approveConsentView, {});
        };
        PaymentInstrumentACHEditFormView.prototype.paymenthodKeyACH = function (ach_number) {
            var payment_methods_configuration = Configuration_1.Configuration.get('paymentmethods');
            var paymenthod_key;
            // validate that the number and issuer
            _.each(payment_methods_configuration, function (payment_method_configuration) {
                if (payment_method_configuration.regex &&
                    payment_method_configuration.regex.test(ach_number)) {
                    paymenthod_key = payment_method_configuration.key;
                }
            });
            var paymentmethod = paymenthod_key &&
                _.findWhere(Configuration_1.Configuration.get('siteSettings.paymentmethods'), { key: paymenthod_key });
            return paymentmethod && paymentmethod.key;
        };
        PaymentInstrumentACHEditFormView.prototype.setPaymethodKey = function (e) {
            var ach_number = String(jQuery(e.target).val()).replace(/\s/g, '');
            var form = jQuery(e.target).closest('form');
            var paymenthod_key = this.paymenthodKeyACH(ach_number);
            form.find('[name="paymentmethod"]').val(paymenthod_key || 0);
        };
        PaymentInstrumentACHEditFormView.prototype.getContext = function () {
            var accountTypes = this.formModel.getAccountTypes();
            var payment_methods_from_configuration = Configuration_1.Configuration.get('siteSettings.paymentmethods', []);
            var selected_payment_method = _.findWhere(payment_methods_from_configuration, {
                internalid: this.formModel.get('paymentmethod')
            });
            var isNew = this.formModel.isNew();
            var paymentMethods = _.map(_.where(payment_methods_from_configuration, {
                isautomatedclearinghouse: 'T'
            }), function (paymentmethod) {
                return {
                    hidden: !(isNew ||
                        (selected_payment_method &&
                            paymentmethod.key === selected_payment_method.key)),
                    icon: paymentmethod.imagesrc,
                    internalid: paymentmethod.internalid,
                    key: paymentmethod.key,
                    name: paymentmethod.name,
                    selected: selected_payment_method && paymentmethod.key === selected_payment_method.key
                };
            });
            var typeSaved = null;
            var accountTypeSaved = '';
            var paymentMethodSaved = '';
            if (!isNew) {
                typeSaved = _.first(_.where(this.formModel.getAccountTypes(), {
                    name: this.formModel.getAccountType()
                }));
                accountTypeSaved = typeSaved.name ? typeSaved.name : '';
                paymentMethodSaved =
                    this.formModel.get('paymentmethod') && this.formModel.get('paymentmethod').name
                        ? this.formModel.get('paymentmethod').name
                        : '';
            }
            return {
                account: this.formModel.get('mask'),
                accountTypes: accountTypes,
                accountType: this.formModel.get('accounttype'),
                accountTypeSaved: accountTypeSaved,
                routingNumber: this.formModel.get('routingnumber'),
                bankName: this.formModel.get('bankname'),
                ownerName: this.formModel.get('ownername'),
                isModal: this.options.inModal,
                isSection: this.options.isSection,
                isModalOrCollectionLength: this.options.inModal ||
                    !(this.options.collection && this.options.collection.length),
                showFooter: this.options.showFooter,
                limit: this.formModel.get('limit'),
                paymentMethods: paymentMethods,
                paymentMethodValue: selected_payment_method ? selected_payment_method.key : '',
                paymentMethodSaved: paymentMethodSaved,
                isNew: isNew
            };
        };
        return PaymentInstrumentACHEditFormView;
    }(FormView_1.FormView));
    exports.PaymentInstrumentACHEditFormView = PaymentInstrumentACHEditFormView;
});

//# sourceMappingURL=PaymentInstrumentACH.Edit.Form.View.js.map

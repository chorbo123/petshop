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
define("PaymentInstrumentACH.Model", ["require", "exports", "underscore", "Model", "Utils", "Validator"], function (require, exports, _, Model_1, Utils, Validator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentInstrumentACHModel = void 0;
    // @class PaymentInstrument.ACH.Model
    var PaymentInstrumentACHModel = /** @class */ (function (_super) {
        __extends(PaymentInstrumentACHModel, _super);
        function PaymentInstrumentACHModel(attributes, options) {
            if (attributes === void 0) { attributes = {
                internalid: null,
                account: null,
                ownername: '',
                accounttype: null,
                bankname: '',
                routingnumber: '',
                limit: null,
                paymentmethod: null,
                paymentmethods: null,
                consent: false
            }; }
            var _this = _super.call(this, attributes, options) || this;
            _this.urlRoot = function () {
                return Utils.getAbsoluteUrl('services/PaymentInstrumentACH.Service.ss', false);
            };
            if (!_this.get('internalid')) {
                _this.set('internalid', _this.get('id'));
            }
            return _this;
        }
        PaymentInstrumentACHModel.prototype.getValidationRules = function () {
            var _this = this;
            return {
                account: [function (val) { return Validator_1.ValidationUtils.required(val, Utils.translate('Account is required')); }],
                paymentmethod: [function (val) { return _this.validatePaymentMethod(val); }],
                accounttype: [
                    function (val) { return Validator_1.ValidationUtils.required(val, Utils.translate('Account type is required')); }
                ],
                routingnumber: [function (val) { return _this.validateRoutingNumber(val); }],
                bankname: [
                    function (val) { return Validator_1.ValidationUtils.required(val, Utils.translate('Bank name is required')); }
                ],
                ownername: [
                    function (val) { return Validator_1.ValidationUtils.required(val, Utils.translate('Owner name is required')); }
                ],
                limit: [function (val) { return _this.validateLimit(val); }]
            };
        };
        PaymentInstrumentACHModel.prototype.validateRoutingNumber = function (val) {
            return (Validator_1.ValidationUtils.required(val, Utils.translate('Routing number is required')) ||
                Validator_1.ValidationUtils.number(val, Utils.translate('Routing number must be numeric')));
        };
        PaymentInstrumentACHModel.prototype.validateLimit = function (val) {
            return (Validator_1.ValidationUtils.required(val, Utils.translate('Limit is required')) ||
                Validator_1.ValidationUtils.number(val, Utils.translate('Limit must be numeric')));
        };
        PaymentInstrumentACHModel.prototype.validatePaymentMethod = function (form) {
            if (form && _.isUndefined(form.internalid) && form.paymentmethod === '0') {
                return Utils.translate('Please Select an ACH Type');
            }
            return '';
        };
        PaymentInstrumentACHModel.prototype.getAccountTypes = function () {
            return [
                { key: 'CHECKING', name: 'Checking' },
                { key: 'SAVING', name: 'Saving' },
                { key: 'CORPORATE_CHECKING', name: 'Corporate Checking' }
            ];
        };
        PaymentInstrumentACHModel.prototype.getAccountType = function () {
            return _.where(this.getAccountTypes(), { key: this.get('accounttype') })[0].name;
        };
        return PaymentInstrumentACHModel;
    }(Model_1.Model));
    exports.PaymentInstrumentACHModel = PaymentInstrumentACHModel;
});

//# sourceMappingURL=PaymentInstrumentACH.Model.js.map

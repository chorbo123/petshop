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
define("PaymentInstrumentACH.View", ["require", "exports", "paymentinstrument_ach.tpl", "View"], function (require, exports, paymentinstrument_ach_tpl, View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentInstrumentACHView = void 0;
    var PaymentInstrumentACHView = /** @class */ (function (_super) {
        __extends(PaymentInstrumentACHView, _super);
        function PaymentInstrumentACHView(options) {
            var _this = _super.call(this) || this;
            _this.template = paymentinstrument_ach_tpl;
            _this.options = options;
            _this.model = options.model;
            return _this;
        }
        PaymentInstrumentACHView.prototype.getContext = function () {
            var accountType = this.model.getAccountType ? this.model.getAccountType() : '';
            var icon = this.model.get('paymentmethod').imagesrc && this.model.get('paymentmethod').imagesrc[0];
            var isSelected = this.options.hideSelector ||
                this.model.get('internalid') === this.options.selectedACHId;
            var mask = this.model.get('mask');
            var bankName = this.model.get('bankname')
                ? this.model.get('bankname')
                : this.model.get('routingnumber');
            return {
                // @property {String} achId
                achId: this.model.get('internalid'),
                // @property {String} showACHImage
                showACHImage: !!icon,
                // @property {String} paymentMethodImageUrl
                paymentMethodImageUrl: icon || '',
                // @property {String} paymentName
                paymentName: this.model.get('paymentmethod').name,
                // @property {String} endingAccount
                endingAccount: mask.substring(mask.length - 4) || '',
                // @property {String} bankName
                bankName: bankName,
                // @property {Boolean} showDefaults
                showSelect: !!this.options.showSelect,
                // @property {String} selectMessage
                selectMessage: this.options.selectMessage,
                // @property {Boolean} isSelected
                isSelected: isSelected,
                // @property {Boolean} showActions
                showActions: !!this.options.showActions,
                // @property {Boolean} showSelector
                showSelector: !this.options.hideSelector,
                // @property {String} ownerName
                ownerName: this.model.get('ownername'),
                // @property {String} customerConsent
                customerConsent: this.model.get('customerconsent'),
                // @property {String} limit
                limit: this.model.get('limit'),
                // @property {String} accountType
                accountType: accountType,
                // @property {String} routingNumber
                routingNumber: this.model.get('routingnumber'),
                // @property {Boolean} isNewPaymentMethod
                isNewPaymentMethod: this.model.get('internalid') < 0
            };
        };
        return PaymentInstrumentACHView;
    }(View_1.View));
    exports.PaymentInstrumentACHView = PaymentInstrumentACHView;
});

//# sourceMappingURL=PaymentInstrumentACH.View.js.map

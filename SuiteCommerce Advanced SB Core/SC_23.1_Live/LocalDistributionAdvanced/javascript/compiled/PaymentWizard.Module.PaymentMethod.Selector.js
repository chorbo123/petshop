/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PaymentWizard.Module.PaymentMethod.Selector", ["require", "exports", "Utils", "jQuery", "Environment", "PaymentWizard.Module.PaymentMethod.ACH", "Configuration", "OrderWizard.Module.PaymentMethod.Selector"], function (require, exports, Utils, jQuery, Environment_1, PaymentWizard_Module_PaymentMethod_ACH_1, Configuration_1, OrderWizardModulePaymentMethodSelector) {
    "use strict";
    // @class PaymentWizard.Module.PaymentMethod.Creditcard @extend OrderWizard.Module.PaymentMethod.Creditcard
    var PaymentWizardModulePaymentMethodSelector = OrderWizardModulePaymentMethodSelector.extend({
        className: 'PaymentWizard.Module.PaymentMethod.Selector',
        render: function () {
            if (this.wizard.hidePayment()) {
                this.$el.empty();
            }
            else {
                OrderWizardModulePaymentMethodSelector.prototype.render.apply(this, arguments);
            }
            if (this.selectedModule && !!~this.selectedModule.type.indexOf('external_checkout')) {
                this.trigger('change_label_continue', Utils.translate('Continue to External Payment'));
            }
            else {
                this.trigger('change_label_continue', Utils.translate('Submit'));
            }
        },
        initialize: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var isPaymentInstrumentEnabled = Environment_1.Environment.getSC().ENVIRONMENT.paymentInstrumentEnabled &&
                Configuration_1.Configuration.get('paymentInstrumentACHEnabled');
            if (isPaymentInstrumentEnabled && args.length > 0 && args[0].modules) {
                args[0].modules.push(this.getACHModule(PaymentWizard_Module_PaymentMethod_ACH_1.PaymentWizardModulePaymentMethodACH));
            }
            OrderWizardModulePaymentMethodSelector.prototype.initialize.apply(this, args);
            this.wizard.model.on('change:payment', jQuery.proxy(this, 'changeTotal'));
        },
        changeTotal: function () {
            var was = this.model.previous('payment');
            var was_confirmation = this.model.previous('confirmation');
            var is_confirmation = this.model.get('confirmation');
            var is = this.model.get('payment');
            // Changed from or to 0
            if (((was === 0 && is !== 0) || (was !== 0 && is === 0)) &&
                !was_confirmation &&
                !is_confirmation) {
                this.render();
            }
        },
        // @method submit If there's a payment, continue the payment method selection. Otherwise, resets the paymentmethods collection
        // @return {jQuery.Deferred}
        submit: function () {
            if (this.model.get('payment') !== 0) {
                return OrderWizardModulePaymentMethodSelector.prototype.submit.apply(this, arguments);
            }
            this.model.get('paymentmethods').reset([]);
            return jQuery.Deferred().resolve();
        }
    });
    return PaymentWizardModulePaymentMethodSelector;
});

//# sourceMappingURL=PaymentWizard.Module.PaymentMethod.Selector.js.map

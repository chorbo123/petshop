/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("QuoteToSalesOrderWizard.ThreeDSecure", ["require", "exports", "OrderWizard.Module.PaymentMethod.ThreeDSecure", "Transaction.Model"], function (require, exports, OrderWizardModulePaymentMethodThreeDSecure) {
    "use strict";
    var QuoteToSalesOrderWizardThreeDSecure = OrderWizardModulePaymentMethodThreeDSecure.extend({
        threeDSecureCallBackModel: 3,
        // @method fail Called if confirmation coming from 3D Secure ssp file fails.
        // @return {jQuery.Deferred} Rejected promise.
        fail: function (errorMessage) {
            this.closeModal();
            return this.deferred.rejectWith(this, [errorMessage]);
        },
        isSuccess3DSecure: function (data) {
            return data && data.confirmation && data.confirmation.internalid;
        }
    });
    return QuoteToSalesOrderWizardThreeDSecure;
});

//# sourceMappingURL=QuoteToSalesOrderWizard.ThreeDSecure.js.map

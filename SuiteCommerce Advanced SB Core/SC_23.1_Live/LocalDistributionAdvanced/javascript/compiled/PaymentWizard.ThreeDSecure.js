/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PaymentWizard.ThreeDSecure", ["require", "exports", "underscore", "OrderWizard.Module.PaymentMethod.ThreeDSecure", "Transaction.Model"], function (require, exports, _, OrderWizardModulePaymentMethodThreeDSecure) {
    "use strict";
    var PaymentWizardThreeDSecure = OrderWizardModulePaymentMethodThreeDSecure.extend({
        threeDSecureCallBackModel: 2,
        processFailed: false,
        // @method fail Called if confirmation coming from 3D Secure ssp file fails.
        // @return {jQuery.Deferred} Rejected promise.
        fail: function (errorMessage) {
            this.processFailed = true;
            this.closeModal();
            return this.deferred.rejectWith(this, [errorMessage]);
        },
        isSuccess3DSecure: function (data) {
            return data && data.confirmation && data.confirmation.type === 'customerpayment';
        },
        onCloseModal: function () {
            var _this = this;
            this.on('modal-close', function () {
                window.removeEventListener('message', _this.receiveMessage, false);
                if (_.isEmpty(_this.model.get('confirmation'))) {
                    if (!_this.processFailed) {
                        _this.deferred.reject();
                    }
                }
                else {
                    _this.closeModalAction();
                }
            });
        }
    });
    return PaymentWizardThreeDSecure;
});

//# sourceMappingURL=PaymentWizard.ThreeDSecure.js.map

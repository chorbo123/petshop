/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PaymentWizard.ThreeDSecure"/>

import '../../../Commons/Transaction/JavaScript/Transaction.Model';
import * as _ from 'underscore';

import OrderWizardModulePaymentMethodThreeDSecure = require('../../OrderWizard.Module.PaymentMethod/JavaScript/OrderWizard.Module.PaymentMethod.ThreeDSecure');
import Deferred = JQuery.Deferred;

const PaymentWizardThreeDSecure: any = OrderWizardModulePaymentMethodThreeDSecure.extend({
    threeDSecureCallBackModel: 2,
    processFailed: false,
    // @method fail Called if confirmation coming from 3D Secure ssp file fails.
    // @return {jQuery.Deferred} Rejected promise.
    fail: function(errorMessage: string): Deferred<string> {
        this.processFailed = true;
        this.closeModal();
        return this.deferred.rejectWith(this, [errorMessage]);
    },
    isSuccess3DSecure: function(data) {
        return data && data.confirmation && data.confirmation.type === 'customerpayment';
    },
    onCloseModal: function() {
        this.on('modal-close', () => {
            (<any>window).removeEventListener('message', this.receiveMessage, false);
            if (_.isEmpty(this.model.get('confirmation'))) {
                if (!this.processFailed) {
                    this.deferred.reject();
                }
            } else {
                this.closeModalAction();
            }
        });
    }
});

export = PaymentWizardThreeDSecure;

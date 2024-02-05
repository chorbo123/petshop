/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="QuoteToSalesOrderWizard.ThreeDSecure"/>

import '../../../Commons/Transaction/JavaScript/Transaction.Model';

import OrderWizardModulePaymentMethodThreeDSecure = require('../../OrderWizard.Module.PaymentMethod/JavaScript/OrderWizard.Module.PaymentMethod.ThreeDSecure');
import Deferred = JQuery.Deferred;

const QuoteToSalesOrderWizardThreeDSecure: any = OrderWizardModulePaymentMethodThreeDSecure.extend({
    threeDSecureCallBackModel: 3,
    // @method fail Called if confirmation coming from 3D Secure ssp file fails.
    // @return {jQuery.Deferred} Rejected promise.
    fail: function(errorMessage: string): Deferred<string> {
        this.closeModal();
        return this.deferred.rejectWith(this, [errorMessage]);
    },
    isSuccess3DSecure: function(data) {
        return data && data.confirmation && data.confirmation.internalid;
    }
});

export = QuoteToSalesOrderWizardThreeDSecure;

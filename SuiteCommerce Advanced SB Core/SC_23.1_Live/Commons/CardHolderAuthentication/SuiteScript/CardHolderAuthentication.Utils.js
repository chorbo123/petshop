/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module CardHolderAuthentication
define('CardHolderAuthentication.Utils', ['underscore'], function (_) {
    // @class CardHolderAuthenticationUtils contains utilities related to CardholderAuthentication
    return {
        // @property {CHAStatus} CardHolderAuthenticationStatus enum
        CHA_STATUS: {
            CANCELLED: 'CANCELLED',
            NOT_REQUIRED: 'NOT_REQUIRED',
            AUTHENTICATED: 'AUTHENTICATED',
            AUTHENTICATE_DEVICE: 'AUTHENTICATE_DEVICE',
            WAITING_FOR_DEVICE_AUTHENTICATION: 'WAITING_FOR_DEVICE_AUTHENTICATION',
            RETURN_FROM_DEVICE_AUTHENTICATION: 'RETURN_FROM_DEVICE_AUTHENTICATION',
            WAITING_FOR_SHOPPER_CHALLENGE: 'WAITING_FOR_SHOPPER_CHALLENGE',
            RETURN_FROM_SHOPPER_CHALLENGE: 'RETURN_FROM_SHOPPER_CHALLENGE',
            ERR_WS_REQ_DEVICE_AUTHENTICATION: 'ERR_WS_REQ_DEVICE_AUTHENTICATION',
            ERR_WS_REQ_SHOPPER_CHALLENGE: 'ERR_WS_REQ_SHOPPER_CHALLENGE',
            ERR_WS_REQUIRE_CUSTOMER_LOGIN: 'ERR_WS_REQUIRE_CUSTOMER_LOGIN',
            ERR_WS_REQ_PAYMENT_AUTHORIZATION: 'ERR_WS_REQ_PAYMENT_AUTHORIZATION'
        },

        // @function getUrl return urls with the query string that iframe expect.
        getUrl: function getUrl(prefix, sspName, formAction, formId, inputs) {
            let url = `${prefix}${sspName}.ssp?action=${formAction}&form=${formId}`;
            if (inputs && inputs.length > 0) {
                const data = _.map(inputs, input => {
                    return `{"name":"${input.getValue('name')}","value":"${input.getValue(
                        'value'
                    )}"}`;
                }).join(',');
                url += `&data=[${encodeURIComponent(data)}]`;
            }
            return url;
        },

        // @function getUrl return urls with the query string that iframe expect.
        getThreeDSecurePageUrl: function getUrl(ModelsInit) {
            return ModelsInit.session.getAbsoluteUrl2(
                'checkout',
                '../threedsecure.ssp');
        },

        getCallbackModel: function(callbackModelType) {
            let callbackModel;
            switch (callbackModelType) {
                case '1':
                    callbackModel = require ('LiveOrder.Model');
                    break;
                case '2':
                    callbackModel = require ('LivePayment.Model');
                    break;
                case '3':
                    callbackModel = require ('QuoteToSalesOrder.Model');
                    break;
                default:
                    break;
            }
            return callbackModel;
        },

        startProcess3DSecure: function(payment, is3DSEnabled) {
            return (
                is3DSEnabled &&
                payment &&
                payment.creditcard &&
                payment.creditcard.paymentmethod &&
                payment.creditcard.paymentmethod.creditcard === 'T'
            );
        },

        isCHASupported: function isCHASupported(payment) {
            return (
                payment &&
                payment.creditcard &&
                payment.creditcard.paymentmethod &&
                payment.creditcard.paymentmethod.iscardholderauthenticationsupported === 'T'
            );
        }
    };
});

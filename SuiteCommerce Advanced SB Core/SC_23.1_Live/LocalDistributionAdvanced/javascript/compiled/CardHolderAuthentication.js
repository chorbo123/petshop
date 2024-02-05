/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CardHolderAuthentication", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isPaymentAuthenticationRequired = void 0;
    /// <amd-module name="CardHolderAuthentication"/>
    function isPaymentAuthenticationRequired(confirmation) {
        if (!confirmation) {
            return true;
        }
        var statusCode = confirmation.get('statuscode');
        var success = statusCode === 'success' || statusCode === 'redirect';
        var requiresAuthentication = [
            'ERR_WS_REQ_PAYMENT_AUTHORIZATION',
            'ERR_WS_REQ_SHOPPER_CHALLENGE',
            'ERR_WS_REQ_DEVICE_AUTHENTICATION'
        ].indexOf(confirmation.get('reasoncode')) > -1;
        var paymentAuthorizationSettings = confirmation.get('paymentauthorization') || confirmation.get('authenticationformaction');
        return !!(!success && requiresAuthentication && paymentAuthorizationSettings);
    }
    exports.isPaymentAuthenticationRequired = isPaymentAuthenticationRequired;
});

//# sourceMappingURL=CardHolderAuthentication.js.map

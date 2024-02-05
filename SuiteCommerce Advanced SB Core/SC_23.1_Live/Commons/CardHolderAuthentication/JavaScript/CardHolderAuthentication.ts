/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="CardHolderAuthentication"/>

export function isPaymentAuthenticationRequired(confirmation): boolean {
    if (!confirmation) {
        return true;
    }

    const statusCode = confirmation.get('statuscode');
    const success = statusCode === 'success' || statusCode === 'redirect';
    const requiresAuthentication =
        [
            'ERR_WS_REQ_PAYMENT_AUTHORIZATION',
            'ERR_WS_REQ_SHOPPER_CHALLENGE',
            'ERR_WS_REQ_DEVICE_AUTHENTICATION'
        ].indexOf(confirmation.get('reasoncode')) > -1;
    const paymentAuthorizationSettings =
        confirmation.get('paymentauthorization') || confirmation.get('authenticationformaction');

    return !!(!success && requiresAuthentication && paymentAuthorizationSettings);
}

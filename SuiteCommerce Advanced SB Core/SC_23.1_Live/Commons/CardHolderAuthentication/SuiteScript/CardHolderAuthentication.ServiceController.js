/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// CardHolderAuthentication.ServiceController.js
// ----------------
define('CardHolderAuthentication.ServiceController', [
    'ServiceController',
    'CardHolderAuthentication.Model',
    'CardHolderAuthentication.Utils'
], function(ServiceController, CardHolderAuthenticationModel, CardHolderAuthenticationUtils) {
    return ServiceController.extend({
        name: 'CardHolderAuthentication.ServiceController',
        post: function() {
            return CardHolderAuthenticationModel.submit(
                this.data,
                CardHolderAuthenticationUtils.getCallbackModel(this.request.getParameter('type'))
            );
        }
    });
});

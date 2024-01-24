// @module bb1.PetshopShopping.RestrictCustomers
define(
	'bb1.PetshopShopping.RestrictCustomers.PasswordReset.Model',
	[
  'Account.Model',
  'Application',
  'Configuration',
		'Utils',
		'SC.Model',
		'Models.Init',

		'underscore'
	],
	function (
		AccountModel,
		Application,
  Configuration,
		Utils,
		SCModel,
  ModelsInit,

 	_
	)
 {
  'use strict';

  // @class bb1.PetshopShopping.RestrictCustomers.PasswordReset.Model Defines the model used by the all bb1.PetshopShopping.RestrictCustomers.PasswordReset related services.
  // @extends SCModel
  return SCModel.extend({

   name: 'bb1.PetshopShopping.RestrictCustomers.PasswordReset',

   //@property {String} webServicesUrl
   webServicesUrl: nlapiResolveURL('SUITELET', 'customscript_bb1_wsc_webservices', 'customdeploy_bb1_wsc_webservices', true),

   //@method sendPasswordRetrievalEmail
   //@param {String} email
   //@returns {Boolean} success
   sendPasswordRetrievalEmail: function (email)
   {
    if (!email)
     throw nlapiCreateError('NO_EMAIL_ADDRESS', 'No email address was specified');
     
    var webSiteAccessId = Configuration.websiteAccess.internalId,
        webServicesParms = {
                            action: 'send-password-reset-email',
                            email: email || '',
                            website: webSiteAccessId
                           },
        webServicesUrl = _.addParamsToUrl(this.webServicesUrl, webServicesParms),
        webServicesResponse = JSON.parse(nlapiRequestURL(webServicesUrl).getBody() || '{}');
    
    //console.log('PasswordReset.sendPasswordRetrievalEmail - webServicesResponse', JSON.stringify(webServicesResponse));

    if (!webServicesResponse.success)
     throw nlapiCreateError(webServicesResponse.errorCode, webServicesResponse.errorMessage);
     
    return true;
   },

   //@method isChangePasswordRequest
   //@param {String} token
   //@returns {Boolean} success
   isChangePasswordRequest: function (token)
   {
    if (!token) return false;
    
    var webSiteAccessId = Configuration.websiteAccess.internalId,
        webServicesParms = {
                            action: 'is-change-password-request', 
                            token: token || '', 
                            website: webSiteAccessId
                           },
        webServicesUrl = _.addParamsToUrl(this.webServicesUrl, webServicesParms),
        webServicesResponse = JSON.parse(nlapiRequestURL(webServicesUrl).getBody() || '{}');
    
    //console.log('PasswordReset.isChangePasswordRequest - webServicesResponse', JSON.stringify(webServicesResponse));

    if (!webServicesResponse.success)
     throw nlapiCreateError(webServicesResponse.errorCode, webServicesResponse.errorMessage);
     
    return webServicesResponse.isChangePasswordRequest;
   },

   //@method doChangePassword
   //@param {String} token
   //@param {String} password
   //@returns {Boolean} success
   doChangePassword: function (token, password)
   {
    if (!token)
     throw nlapiCreateError('NO_RESET_TOKEN', 'No reset token was specified');
     
    if (!password)
     throw nlapiCreateError('NO_PASSWORD', 'No password was specified');
     
    var webSiteAccessId = Configuration.websiteAccess.internalId,
        webServicesParms = {action: 'do-change-password'},
        webServicesUrl = _.addParamsToUrl(this.webServicesUrl, webServicesParms),
        webServicesPostParams = {
                                 token: token,
                                 password: password,
                                 website: webSiteAccessId
                                },
        webServicesHttpHeaders = {'Content-Type': 'application/json'},
        webServicesResponse = JSON.parse(nlapiRequestURL(webServicesUrl, JSON.stringify(webServicesPostParams), webServicesHttpHeaders, 'POST').getBody() || '{}');
    
    //console.log('PasswordReset.doChangePassword - webServicesResponse', JSON.stringify(webServicesResponse));

    if (!webServicesResponse.success)
     throw nlapiCreateError(webServicesResponse.errorCode, webServicesResponse.errorMessage);
     
    return true;
   },

   //@method killExistingResetTokens
   //@param {String} customerId
   killExistingResetTokens: function (customerId)
   {
    //console.log('PasswordReset.killExistingResetTokens - customerId', customerId);

    if (!customerId) return;
    
    // find any previous password reset tokens and delete them
    var previousResetTokenFilters = [['isinactive', 'is', 'F'], 'and',
                                     ['custrecord_bb1_prt_customer', 'anyof', customerId]],
        previousResetTokenSearchResults = nlapiSearchRecord('customrecord_bb1_prt', null, previousResetTokenFilters) || [];
    
    //console.log('PasswordReset.killExistingResetTokens - previousResetTokenSearchResults.length', previousResetTokenSearchResults.length);

    for (var i=0; i < previousResetTokenSearchResults.length; i++) {
     nlapiSubmitField('customrecord_bb1_prt', previousResetTokenSearchResults[i].getId(), 'isinactive', 'T');
     //nlapiDeleteRecord('customrecord_bb1_prt', previousResetTokenSearchResults[i].getId());
    }
   }

  });
  
 }
);

// @module bb1.PetshopShopping.RestrictCustomers
define(
	'bb1.PetshopShopping.RestrictCustomers',
	[
  'bb1.PetshopShopping.RestrictCustomers.PasswordReset.Model',
  'Account.Model',
  'Application',
  'Configuration',
		'Utils',
		'SC.Model',
		'Models.Init',

		'underscore'
	],
	function (
		PasswordResetModel,
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
  
  var bb1WebServicesUrl = nlapiResolveURL('SUITELET', 'customscript_bb1_wsc_webservices', 'customdeploy_bb1_wsc_webservices', true);

  var addParamsToUrl = function (baseUrl, params)
  {
   // We get the search options from the config file
   if (params && _.keys(params).length)
   {
    var paramString = Object.keys(params).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&')		
    ,	join_string = ~baseUrl.indexOf('?') ? '&' : '?';

    return baseUrl + join_string + paramString;
   }
   else
   {
    return baseUrl;
   }
  }

  Application.on('after:Profile.get', function (model, profile)
  {
   var websiteAccessId = Configuration.get('websiteAccess.internalId');
   var customFields = ModelsInit.customer.getCustomFieldValues() || {};
   var customerAccessId = (_.findWhere(customFields, {'name': 'custentity_bb1_websiteaccess'}) || {}).value || '';
   profile.websiteAccess = customerAccessId;
   
    //console.log('after:Profile.get');
    //console.log('customerAccessId/websiteAccessId/ModelsInit.session.isRecognized()', customerAccessId + "/" + websiteAccessId + "/" + ModelsInit.session.isRecognized());
    //console.log('JSON.stringify(profile)', JSON.stringify(profile));
   if (ModelsInit.session.isRecognized() && customerAccessId && customerAccessId != websiteAccessId) {
    console.log('customer is recognized but does not have access to this site.', customerAccessId);
    profile.loggedOffForRestrictedAccess = true;
    //ModelsInit.session.logout();
    // redirect to logout on petshop
    
    //return nlapiSetRedirectURL('EXTERNAL', 'http://www.petshop.co.uk/'); //?logoff=T');
   }
   
  });
  
  Application.on('before:Account.register', function(model, data) {

   //console.log('before:Account.register - data', JSON.stringify(data));

   var webSiteAccessId = Configuration.get('websiteAccess.internalId');
   
   // login and test if successful, get access id then logout and report error
   try {
    session.login({
     email: data.email,
     password: data.password
    });
   }
   catch(e) {
    console.log('login does not exist', e.getCode ? e.getCode() + ': ' + e.getDetails() : e);
   }

   if (session.isLoggedIn2()) {
    var customFields = ModelsInit.customer.getCustomFieldValues() || {},
        customerWebsiteAccessId = (_.findWhere(customFields, {'name': 'custentity_bb1_websiteaccess'}) || {}).value || '';
    
    session.logout();
    
    if (customerWebsiteAccessId == webSiteAccessId)
     throw nlapiCreateError('EXISTING_CUSTOMER', 'You have an existing account for this web store, please login instead. If you have forgotten your password you can use the \'Forgot password?\' link to reset your password.');
    else
     throw nlapiCreateError('EXISTING_CUSTOMER', 'Please try registering with a different password for this web store.');
   }
   
   var webServicesParms = {'action': 'check-email-exists', 'email': data.email, 'website': webSiteAccessId},
       webServicesUrl = addParamsToUrl(bb1WebServicesUrl, webServicesParms),
       emailExists = JSON.parse(nlapiRequestURL(webServicesUrl).getBody() || '{}');
   
   //console.log('before:Account.register - emailExists response', JSON.stringify(emailExists));

   //console.log('after:Account.login - webSiteAccessId', webSiteAccessId);
   
   if (!emailExists.success)
    throw nlapiCreateError('EMAIL_CHECK_FAILED', emailExists.error);
    
   if (emailExists.emailExists)
    throw nlapiCreateError('EXISTING_CUSTOMER', 'You have an existing account, please login instead. If you have forgotten your password you can use the \'Forgot password?\' link to reset your password.');

  });

  Application.on('after:Account.login', function(model, result, email, password, redirect) {

   //console.log('after:Account.login - result', JSON.stringify(result));

   var webSiteAccessId = Configuration.get('websiteAccess.internalId');
   var customFields = ModelsInit.customer.getCustomFieldValues() || {};
   var websiteAccess = (_.findWhere(customFields, {'name': 'custentity_bb1_websiteaccess'}) || {}).value || '';
   
   console.log('after:Account.login - customFields', JSON.stringify(customFields));
   //console.log('after:Account.login - webSiteAccessId', webSiteAccessId);
   //console.log('after:Account.login - websiteAccess', websiteAccess);

   if (websiteAccess != webSiteAccessId) {
    ModelsInit.session.logout();
    throw nlapiCreateError('INVALID_LOGIN', 'Login is invalid for this web site. Please register your details to login.');
   }

   //fixIncorrectTouchpoints(result.touchpoints);
   
   //console.log('after:Account.login - result after', JSON.stringify(result));
   
   PasswordResetModel.killExistingResetTokens(result.user.internalid);
   
  });

  function fixIncorrectTouchpoints(touchpoints) {
   
   var incorrectSession = false,
       replacementUrls = {
        'http://vetshop.co.uk': 'http://www.petshop.co.uk',
        'http://www.vetshop.co.uk': 'http://www.petshop.co.uk',
        'http://shopping.eu2.netsuite.com': 'http://www.petshop.co.uk',
        '/c.3934951/vetshop-2017/shopping.ssp': '/',
        '/vetshop-2017/shopping.ssp': '/',
        '/vetshop-2017/logOut.ssp': '/c.3934951/sca-dev-2019-1/logOut.ssp',
        '/vetshop-2017/my_account.ssp': '/c.3934951/sca-dev-2019-1/my_account.ssp',
        '/vetshop-2017/goToCart.ssp': '/c.3934951/sca-dev-2019-1/goToCart.ssp',
        '/vetshop-2017/checkout.ssp': '/c.3934951/sca-dev-2019-1/checkout.ssp'
       };
   
   for (var touchpoint in touchpoints) {
    //touchpoints[touchpoint] = touchpoints[touchpoint].replace(/^http:\/\/\w*\.?petshop\.co\.uk/i, 'http://www.vetshop.co.uk');
    for (replacementUrl in replacementUrls) {
     touchpoints[touchpoint] = touchpoints[touchpoint].replace(replacementUrl, replacementUrls[replacementUrl]);
     if (new RegExp(replacementUrl).test(touchpoints[touchpoint])) {
      incorrectSession = true;
      //break;
     }
    }
    if (incorrectSession) break;
   }
   
   return incorrectSession;
   
  }
  
  Application.on('after:SiteSettings.getTouchPoints', function (model, touchpoints)
  {
   var incorrectSession = fixIncorrectTouchpoints(touchpoints);
   
   if (incorrectSession) {
    var redirect = 'http://www.vetshop.co.uk/vetshop-2017/redirect.ssp?redirect=' + encodeURIComponent(request.getSSPURL());
    //console.log('redirecting to:', redirect);
    //return nlapiSetRedirectURL('EXTERNAL', redirect);
   }
  });
  
  Application.on('before:Profile.update', function(model, data) {

   if (data.current_password && data.password && data.password === data.confirm_password)
   {
    //console.log('before:Profile.update updating password - data', JSON.stringify(data));

    var websiteAccessId = Configuration.get('websiteAccess.internalId');
    var customerFields = customer.getFieldValues(['internalid', 'email', 'password']);
    var customerId = customerFields.internalid;
    var customerEmail = customerFields.email;
    
    //console.log('before:Profile.update updating password - customerEmail/customerFields.password', customerEmail + '/' + customerFields.password);
    //console.log('testing current password is correct', customerEmail);

    // pre-emptively change password to test if the current password is correct before login to another session and kill this one
    try {
     var login = nlapiGetLogin();
     login.changePassword(data.current_password, data.password);
    }
    catch(e) {
     console.log('current password is not correct?', e.getCode ? e.getCode() + ': ' + e.getDetails() : e);
     throw nlapiCreateError(e.getCode && e.getCode() || e, e.getDetails && e.getDetails() || e);
    }
    
    try {
     login.changePassword(data.password, data.current_password);
    }
    catch(e) {
     console.log('error trying to revert password to original', e.getCode ? e.getCode() + ': ' + e.getDetails() : e);
     throw nlapiCreateError(e.getCode && e.getCode() || e, e.getDetails && e.getDetails() || e);
    }
    
    // login with new password to test if it exists and what web site access id then logout and report error
    try {
     session.login({
      email: customerEmail,
      password: data.password
     });
    }
    catch(e) {
     console.log('login does not exist', e.getCode ? e.getCode() + ': ' + e.getDetails() : e);
    }

    if (session.isLoggedIn2()) {
     var customFields = customer.getCustomFieldValues() || {},
         customerWebsiteAccessId = (_.findWhere(customFields, {'name': 'custentity_bb1_websiteaccess'}) || {}).value || '';
     
     //console.log('login exists - logging out - customerWebsiteAccessId', customerWebsiteAccessId);
     
     session.logout();
      
     if (customerWebsiteAccessId != websiteAccessId) {
      console.log('incorrect web site access set - customerWebsiteAccessId', customerWebsiteAccessId);
     }
     
      //console.log('logging customer back in and throwing error');
      // log customer back in
      session.login({
       email: customerEmail,
       password: data.current_password
      });
      
      throw nlapiCreateError('EXISTING_CUSTOMER', 'Please try a different new password.');
     //}
    }
    
    //console.log('login did not exist - logging customer back in');
    // log customer back in
    session.login({
     email: customerEmail,
     password: data.current_password
    });
   }

  });
  
  Application.on('before:Account.resetPassword', function(model, params, password) {

   //console.log('before:Account.resetPassword resetting password - params', JSON.stringify(params));

   //console.log('before:Account.resetPassword resetting password - password', password);
   //console.log('testing if email already exists', password);
   
   var websiteAccessId = Configuration.get('websiteAccess.internalId');
   
   // login with new password to test if it exists and what web site access id then logout and report error
   try {
    session.login({
     email: params.e,
     password: password
    });
   }
   catch(e) {
    console.log('login does not exist', e.getCode ? e.getCode() + ': ' + e.getDetails() : e);
   }

   if (session.isLoggedIn2()) {
    var customFields = customer.getCustomFieldValues() || {},
        customerWebsiteAccessId = (_.findWhere(customFields, {'name': 'custentity_bb1_websiteaccess'}) || {}).value || '';
    
    //console.log('login exists - logging out - customerWebsiteAccessId', customerWebsiteAccessId);
    
    session.logout();
     
    if (customerWebsiteAccessId != websiteAccessId) {
     console.log('incorrect web site access set - customerWebsiteAccessId', customerWebsiteAccessId);
     //console.log('throwing error');
     throw nlapiCreateError('EXISTING_CUSTOMER', 'Please try a different password.');
    }
   }
   else {
    console.log('login did not exist');
   }

  });

  AccountModel.forgotPassword = function (email)
  {
   //console.log('Account.forgotPassword override - email', email);

   var result = {
                 success: true
                },
       args = _.toArray(arguments).slice(0);
   
   Application.trigger.apply(Application, ['before:Account.forgotPassword', this].concat(args));

   PasswordResetModel.sendPasswordRetrievalEmail(email);
  
   Application.trigger.apply(Application, ['after:Account.forgotPassword', this, result].concat(args));

   return result;
  };
  
  AccountModel.resetPassword = function (params, password)
  {
   //console.log('Account.resetPassword override - params', JSON.stringify(params));
   
   var result = {
                 success: true
                },
       args = _.toArray(arguments).slice(0);
   
   Application.trigger.apply(Application, ['before:Account.resetPassword', this].concat(args));

   if (!PasswordResetModel.doChangePassword(params.cb, password))
   {
    throw new Error('An error has occurred');
   }
   else
   {
    return result;
   }
   
   Application.trigger.apply(Application, ['after:Account.resetPassword', this, result].concat(args));

  };
  
 }
);

// @module bb1.PetshopShopping.BrandReferral
define(
	'bb1.PetshopShopping.BrandReferral',
	[
		'Application',
		'Models.Init',
		'Configuration',
		'Utils',
		'underscore'
	],
	function (
		Application,
		ModelsInit,
		Configuration,
		Utils,
		_
	)
 {
  'use strict';
  
  function getCookies(cookieName) {
   
   var cookieLookup = {};
   var cookies = (request.getHeader('Cookie') || '').split('; ');
   
   _.each(cookies, function(cookie) {
    var cookieValues = cookie.split('=');
    
    if (cookieValues.length == 2)
     cookieLookup[cookieValues[0]] = decodeURIComponent(cookieValues[1]);
   });
   
   console.log('bb1.PetshopShopping.BrandReferral getCookies - cookieLookup', JSON.stringify(cookieLookup));
   
   return cookieName ? cookieLookup[cookieName] : cookieLookup;
  }
  
  function postProcessBrandReferral() {
   
   //ModelsInit.context.setSessionObject('brpProcessScripts', 'T');
   
   var referralShareCode = request.getParameter('referral-share-code') || getCookies('referral-share-code') || '';
   
   console.log('bb1.PetshopShopping.BrandReferral postProcessBrandReferral - referralShareCode', referralShareCode);
   
   //if (referralShareCode)
    ModelsInit.context.setSessionObject('brpReferralShareCode', referralShareCode);
   
   ModelsInit.customer.updateProfile({
    customfields: {
     custentity_bb1_brp_processscripts: 'T'
     //custentity_bb1_brp_sharecode: referralShareCode
    }
   });

   /*var customerId = nlapiGetRecordId();
   
   if (['80423', '4636695'].indexOf(customerId) == -1) {
    console.log('bb1.PetshopShopping.BrandReferral Customer is not a tester. Skipping.', customerId);
    return;
   }
   
   var parms = {custscript_bb1_brp_sbrp_referrer: customerId};
   var status = nlapiScheduleScript('customscript_bb1_brp_sbrp', null, parms); // 20 units
   
   if (status == 'QUEUED') {
    console.log('Setup Brand Referral Programme script has been successfully scheduled.', customerId);
   }
   else {
    console.error('There was an error while trying to schedule the Setup Brand Referral Programme script.', customerId)
   }*/
  }
  
  Application.on('after:Account.register', function(model, result, data) {

   //console.log('bb1.PetshopShopping.BrandReferral after:Account.register - data', JSON.stringify(data));
   
   postProcessBrandReferral();
   
  });

  Application.on('after:Account.login', function(model, result, email, password, redirect) {

   //console.log('bb1.PetshopShopping.BrandReferral after:Account.login - result', JSON.stringify(result));
   
   postProcessBrandReferral();
   
  });
  
 }
);

// @module bb1.PetshopShopping.LoginRegister
define(
	'bb1.PetshopShopping.LoginRegister',
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
	
 Application.on('before:Account.register', function(model, data) {
  
  var defaultMarketingOptedIn = Configuration.get('registrationMarketingOptions.defaultMarketingOptedIn');
  
  if (defaultMarketingOptedIn)
   data.emailsubscribe = data.emailunsubscribe === 'T' ? 'F' : 'T';
  
  if (defaultMarketingOptedIn)
   data.smssubscribe = data.smsunsubscribe === 'T' ? 'F' : 'T';
  
  //console.log('before:Account.register - data', JSON.stringify(data));
  
 });

 Application.on('after:Account.register', function(model, result, data) {

  //console.log('after:Account.register - data', JSON.stringify(data));

  var webSiteAccessId = Configuration.get('websiteAccess.internalId');
  
  //console.log('after:Account.login - webSiteAccessId', webSiteAccessId);
  
  ModelsInit.customer.updateProfile({
   //pricelevel: Configuration.get('defaultPriceLevel'),
   customfields: {
    custentity_bb1_websiteaccess: webSiteAccessId
   }
  });

 });

});

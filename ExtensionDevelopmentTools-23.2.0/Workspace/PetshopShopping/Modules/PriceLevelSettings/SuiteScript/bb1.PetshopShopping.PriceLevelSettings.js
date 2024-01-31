// @module bb1.PetshopShopping.PriceLevelSettings
define(
	'bb1.PetshopShopping.PriceLevelSettings',
	[
  'SiteSettings.Model',
  'Application',
  'Configuration',
		'Utils',
		'SC.Model',
		'Models.Init',

		'underscore'
	],
	function (
  SiteSettingsModel,
		Application,
  Configuration,
		Utils,
		SCModel,
  ModelsInit,

 	_
	)
 {
  'use strict';
  
  Application.on('after:SiteSettings.get', function (model, siteSettings)
  {
   //console.log('after:Profile.get siteSettings.defaultpricelevel', siteSettings.defaultpricelevel);
   
   siteSettings.defaultpricelevel = Configuration.defaultPriceLevel;
   
   siteSettings.displayname = 'VetShop.co.uk';
  });
  
  Application.getEnvironment = _.wrap(Application.getEnvironment, function (originalGetEnvironment, request) {
   
   var result = originalGetEnvironment.apply(this, _.rest(arguments)),
       shopperPriceLevel = ModelsInit.session.getShopperPriceLevel().internalid;
   
   //console.log('Application.getEnvironment isRecognized/shopperPriceLevel/Configuration.defaultPriceLevel', ModelsInit.session.isRecognized() + '/' + shopperPriceLevel + '/' + Configuration.defaultPriceLevel);
   
   result.currentPriceLevel = ModelsInit.session.isRecognized() ? shopperPriceLevel : Configuration.defaultPriceLevel;
   
   //console.log('Application.getEnvironment result', JSON.stringify(result));
   
   return result;
   
  });

  Application.on('after:Profile.get', function (model, profile)
  {
   //console.log('after:Profile.get model.isLoggedIn/model.isSecure', model.isLoggedIn + '/' + model.isSecure);
   
   var shopperPriceLevel = ModelsInit.session.getShopperPriceLevel().internalid;
   
   if (model.isLoggedIn && model.isSecure)
   {
    profile.priceLevel = shopperPriceLevel ? shopperPriceLevel : Configuration.defaultPriceLevel;
   }
   else
   {
    profile.priceLevel = shopperPriceLevel ? shopperPriceLevel : Configuration.defaultPriceLevel;
   }
  });
  
 }
);

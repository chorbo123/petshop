// @module bb1.PetshopShopping.SubscriptionOrders
define(
	'bb1.PetshopShopping.SubscriptionOrders',
	[
  'bb1.PetshopShopping.SubscriptionOrders.Settings.Model',
		'Utils',
		'underscore'
	],
	function (
		SubscriptionOrdersSettingsModel,
		Utils,
		_
	)
 {
  'use strict';
  
  var Application = require("Application"); // workaround for Extension Manager obfuscating Application module properties
 
  Application.getEnvironment = _.wrap(Application.getEnvironment, function(originalGetEnvironment) {
   
   var environment = originalGetEnvironment.apply(this, _.rest(arguments));
   
   _.extend(environment, {
    
    subscriptionOrderSettings: SubscriptionOrdersSettingsModel.get()
    
   });
   
   return environment;
   
  });
 
 }
);

// @module bb1.PetshopShopping.SubscriptionOrders
define(
	'bb1.PetshopShopping.SubscriptionOrders.Settings.ServiceController',
	[
		'ServiceController',
		'Models.Init',
		'bb1.PetshopShopping.SubscriptionOrders.Settings.Model'
	],
	function(
		ServiceController,
		ModelsInit,
		SubscriptionOrdersSettingsModel
	)
	{
		'use strict';
  
  try {
   // @class SubscriptionOrderSettings.ServiceController Manage pet setting requests
   // @extend ServiceController
   return ServiceController.extend({

    // @property {String} name Mandatory for all ssp-libraries model
    name: 'bb1.PetshopShopping.SubscriptionOrderSettings.ServiceController',

    cache: response.CACHE_DURATION_LONG,
   
    // @method get The call to SubscriptionOrderSettings.Service.ss with http method 'get' is managed by this function
    // @return {bb1.PetshopShopping.SubscriptionOrderSettings.Model.Data}
    get: function ()
    {
     return SubscriptionOrdersSettingsModel.get();
    }

   });
  }
		catch (e)
		{
			console.warn('bb1.PetshopShopping.SubscriptionOrders.Settings.Service.ss' + e.name, e);
			this.sendError(e);
		}
  
	}
);

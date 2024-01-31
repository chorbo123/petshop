// @module bb1.PetshopShopping.Pets
define(
	'bb1.PetshopShopping.Pets.Settings.ServiceController',
	[
  'bb1.PetshopShopping.Pets.Settings.Model',
		'ServiceController'
	],
	function (
		PetSettingsModel,
  ServiceController
	)
	{
		'use strict';
  
  try {
   // @class Pets.Settings.ServiceController Manage pet setting requests
   // @extend ServiceController
   return ServiceController.extend({

    // @property {String} name Mandatory for all ssp-libraries model
    name: 'bb1.PetshopShopping.Pets.Settings.ServiceController',

    options: {
     common: {
      requireLogin: true
     }
    },
    
    cache: response.CACHE_DURATION_LONG,
   
    // @method get The call to Pets.Settings.Service.ss with http method 'get' is managed by this function
    // @return {bb1.PetshopShopping.Pets.Settings.Model.Data}
    get: function ()
    {
     return PetSettingsModel.get();
    }

   });
  }
		catch (e)
		{
			console.warn('bb1.PetshopShopping.Pets.SettingsService.ss' + e.name, e);
			this.sendError(e);
		}
	}
);

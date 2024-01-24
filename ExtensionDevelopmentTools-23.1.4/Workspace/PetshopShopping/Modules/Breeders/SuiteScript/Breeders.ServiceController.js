// @module bb1.PetshopShopping.Breeders
define(
	'bb1.PetshopShopping.Breeders.ServiceController',
	[
  'bb1.PetshopShopping.Breeders.Model',
		'ServiceController'
	],
	function(
  BreedersModel,
		ServiceController
	)
	{
		'use strict';
  
  try {
   // @class Breeders.ServiceController Manage breeder applications
   // @extend ServiceController
   return ServiceController.extend({

    // @property {String} name Mandatory for all ssp-libraries model
    name: 'bb1.PetshopShopping.Breeders.ServiceController',

    // @method get The call to Breeders.Service.ss with http method 'get' is managed by this function
    // @return {bb1.PetshopShopping.Breeders.Model.Data}
    get: function ()
    {
     return BreedersModel.get();
    }
    
   });
  }
		catch (e)
		{
			console.warn('bb1.PetshopShopping.Breeders.Service.ss' + e.name, e);
			this.sendError(e);
		}
  
	}
);

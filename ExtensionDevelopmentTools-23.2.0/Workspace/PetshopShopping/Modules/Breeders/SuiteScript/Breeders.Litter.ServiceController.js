// @module bb1.PetshopShopping.Breeders
define(
	'bb1.PetshopShopping.Breeders.Litter.ServiceController',
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
    name: 'bb1.PetshopShopping.Breeders.Litter.ServiceController',

    // @method get The call to Breeders.Service.ss with http method 'get' is managed by this function
    // @return {bb1.PetshopShopping.Breeders.Litter.Model.Data}
    get: function ()
    {
     var id = this.request.getParameter('id'),
         applicationId = this.request.getParameter('applicationId');
         
     return BreedersModel.get(id, applicationId);
    },

    // @method post The call to Breeders.Service.ss with http method 'post' is managed by this function
    // @return {bb1.PetshopShopping.Breeders.Litter.Model.Data}
    post: function ()
    {
     return BreedersModel.createLitter(this.data);
    }
    
   });
  }
		catch (e)
		{
			console.warn('bb1.PetshopShopping.Breeders.Litter.Service.ss' + e.name, e);
			this.sendError(e);
		}
  
	}
);

// @module bb1.PetshopShopping.Breeders
define(
	'bb1.PetshopShopping.Breeders.Programme.ServiceController',
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
    name: 'bb1.PetshopShopping.Breeders.Programme.ServiceController',

    // @method get The call to Breeders.Programme.Service.ss with http method 'get' is managed by this function
    // @return {bb1.PetshopShopping.Breeders.Programme.Model.Data}
    get: function ()
    {
     var id = this.request.getParameter('id'),
         applicationId = this.request.getParameter('applicationId');
         
     return BreedersModel.get(id, applicationId);
    },

    // @method post The call to Breeders.Programme.Service.ss with http method 'post' is managed by this function
    // @return {bb1.PetshopShopping.Breeders.Programme.Model.Data}
    post: function ()
    {
     return BreedersModel.createApplication(this.data);
    }
    
   });
  }
		catch (e)
		{
			console.warn('bb1.PetshopShopping.Breeders.Programme.Service.ss' + e.name, e);
			this.sendError(e);
		}
  
	}
);

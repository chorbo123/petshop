// @module bb1.PetshopShopping.Pets
define(
	'bb1.PetshopShopping.Pets.ServiceController',
	[
		'bb1.PetshopShopping.Pets.Model',
  'ServiceController'
	],
	function (
  PetsModel,
  ServiceController
	)
	{
		'use strict';

  try {
   // @class bb1.PetshopShopping.Pets.ServiceController Manage pet requests
   // @extend ServiceController
   return ServiceController.extend({

    // @property {String} name Mandatory for all ssp-libraries model
    name: 'bb1.PetshopShopping.Pets.ServiceController',
    
    options: {
					common: {
						requireLogin: true
					}
				},
    
    // @method get The call to Pets.Service.ss with http method 'get' is managed by this function
    // @return {bb1.PetshopShopping.Pets.Model.Data}
    get: function ()
    {
     var id = request.getParameter('internalid');
     
     return PetsModel.get(id);
    },

    // @method post The call to Pets.Service.ss with http method 'post' is managed by this function
    // @return {Pets.Model.Data}
    post: function ()
    {
     // Updates the order with the passed in data
     PetsModel.create(this.data);
     return PetsModel.get();
    },

    // @method put The call to Pets.Service.ss with http method 'put' is managed by this function
    // @return {Pets.Model.Data}
    put: function()
    {
     PetsModel.update(this.data);
     return PetsModel.get();
    },
    
    // @method delete The call to Pets.Service.ss with http method 'delete' is managed by this function
    // @return {Pets.Model.Data}
    delete: function()
    {
     PetsModel.delete(this.data);
     return PetsModel.get();
    }
   });
  }
		catch (e)
		{
			console.warn('bb1.PetshopShopping.Pets.Service.ss' + e.name, e);
			this.sendError(e);
		}
	}
);

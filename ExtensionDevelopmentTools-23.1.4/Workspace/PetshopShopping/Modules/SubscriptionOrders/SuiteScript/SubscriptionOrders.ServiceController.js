// @module bb1.PetshopShopping.SubscriptionOrders
define(
	'bb1.PetshopShopping.SubscriptionOrders.ServiceController',
	[
		'ServiceController',
		'Models.Init',
		'bb1.PetshopShopping.SubscriptionOrders.Model'
	],
	function(
		ServiceController,
		ModelsInit,
		SubscriptionOrdersModel
	)
	{
		'use strict';
  
  try {
   // @class SubscriptionOrders.ServiceController Manage pet requests
   // @extend ServiceController
   return ServiceController.extend({

    // @property {String} name Mandatory for all ssp-libraries model
    name: 'bb1.PetshopShopping.SubscriptionOrders.ServiceController',

    // @method get The call to SubscriptionOrders.Service.ss with http method 'get' is managed by this function
    // @return {bb1.PetshopShopping.SubscriptionOrders.Model.Data}
    get: function ()
    {
     var id = request.getParameter('internalid');
     
     return SubscriptionOrdersModel.get(id);
    },

    // @method put The call to SubscriptionOrders.Service.ss with http method 'put' is managed by this function
    // @return {SubscriptionOrders.Model.Data}
    put: function()
    {
     return SubscriptionOrdersModel.update(this.data);
    },

    // @method put The call to SubscriptionOrders.Service.ss with http method 'post' is managed by this function
    // @return {SubscriptionOrders.Model.Data}
    post: function()
    {
     return SubscriptionOrdersModel.create(this.data);
    }
    
   });
  }
		catch (e)
		{
			console.warn('bb1.PetshopShopping.SubscriptionOrders.Service.ss' + e.name, e);
			this.sendError(e);
		}
  
	}
);

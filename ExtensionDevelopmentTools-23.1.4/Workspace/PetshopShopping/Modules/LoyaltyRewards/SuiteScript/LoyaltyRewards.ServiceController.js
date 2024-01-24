// @module bb1.PetshopShopping.LoyaltyRewards
define(
	'bb1.PetshopShopping.LoyaltyRewards.ServiceController',
	[
		'bb1.PetshopShopping.LoyaltyRewards.Model',
  'ServiceController'
	],
	function (
  LoyaltyRewardsModel,
  ServiceController
	)
	{
		'use strict';

  try {
   // @class bb1.PetshopShopping.LoyaltyRewards.ServiceController Manage pet requests
   // @extend ServiceController
   return ServiceController.extend({

    // @property {String} name Mandatory for all ssp-libraries model
    name: 'bb1.PetshopShopping.LoyaltyRewards.ServiceController',
    
    options: {
					common: {
						requireLogin: true
					}
				},
    
    // @method get The call to LoyaltyRewards.Service.ss with http method 'get' is managed by this function
    // @return {bb1.PetshopShopping.LoyaltyRewards.Model.Data}
    get: function ()
    {
     var id = request.getParameter('internalid');
     
     return LoyaltyRewardsModel.get(id);
    }
    
   });
  }
		catch (e)
		{
			console.warn('bb1.PetshopShopping.LoyaltyRewards.Service.ss' + e.name, e);
			this.sendError(e);
		}
	}
);

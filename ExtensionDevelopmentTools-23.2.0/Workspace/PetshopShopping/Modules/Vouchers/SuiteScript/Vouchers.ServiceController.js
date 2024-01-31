// @module bb1.PetshopShopping.Vouchers
define(
	'bb1.PetshopShopping.Vouchers.ServiceController',
	[
		'bb1.PetshopShopping.Vouchers.Model',
  'ServiceController'
	],
	function (
  VouchersModel,
  ServiceController
	)
	{
		'use strict';

  try {
   // @class bb1.PetshopShopping.Vouchers.ServiceController Manage pet requests
   // @extend ServiceController
   return ServiceController.extend({

    // @property {String} name Mandatory for all ssp-libraries model
    name: 'bb1.PetshopShopping.Vouchers.ServiceController',
    
    options: {
					common: {
						requireLogin: true
					}
				},
    
    // @method get The call to Vouchers.Service.ss with http method 'get' is managed by this function
    // @return {bb1.PetshopShopping.Vouchers.Model.Data}
    get: function ()
    {
     var id = request.getParameter('internalid');
     
     return VouchersModel.get(id);
    }
    
   });
  }
		catch (e)
		{
			console.warn('bb1.PetshopShopping.Vouchers.Service.ss' + e.name, e);
			this.sendError(e);
		}
	}
);

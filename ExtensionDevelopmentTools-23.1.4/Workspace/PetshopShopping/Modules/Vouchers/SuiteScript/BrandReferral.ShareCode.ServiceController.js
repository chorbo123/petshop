// @module bb1.PetshopShopping.BrandReferral
define(
	'bb1.PetshopShopping.BrandReferral.ShareCode.ServiceController',
	[
		'bb1.PetshopShopping.BrandReferral.ShareCode.Model',
  'ServiceController'
	],
	function (
  BrandReferralShareCodeModel,
  ServiceController
	)
	{
		'use strict';

  try {
   // @class bb1.PetshopShopping.BrandReferral.ShareCode.ServiceController Manage brand referral share code requests
   // @extend ServiceController
   return ServiceController.extend({

    // @property {String} name Mandatory for all ssp-libraries model
    name: 'bb1.PetshopShopping.BrandReferral.ShareCode.ServiceController',
    
    options: {
					common: {
						requireLogin: true
					}
				},
    
    // @method get The call to BrandReferralShareCode.Service.ss with http method 'get' is managed by this function
    // @return {bb1.PetshopShopping.BrandReferral.ShareCode.Model.Data}
    get: function ()
    {
     var id = request.getParameter('internalid');
     
     return BrandReferralShareCodeModel.get(id);
    },

    // @method post The call to BrandReferralShareCode.Service.ss with http method 'post' is managed by this function
    // @return {bb1.PetshopShopping.BrandReferral.ShareCode.Model.Data}
    post: function ()
    {
     return BrandReferralShareCodeModel.sendShareCode(this.data);
    }

   });
  }
		catch (e)
		{
			console.warn('bb1.PetshopShopping.BrandReferral.ShareCode.Service.ss' + e.name, e);
			this.sendError(e);
		}
	}
);

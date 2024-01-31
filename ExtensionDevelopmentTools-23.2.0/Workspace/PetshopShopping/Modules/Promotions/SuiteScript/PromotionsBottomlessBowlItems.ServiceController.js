// @module bb1.PetshopShopping.Promotions
define(
	'bb1.PetshopShopping.Promotions.BottomlessBowlItems.ServiceController',
	[
		'ServiceController',
		'Models.Init',
		'bb1.PetshopShopping.Promotions.BottomlessBowlItems.Model'
	],
	function (
		ServiceController,
		ModelsInit,
		PromotionsBottomlessBowlItemsModel
	)
	{
		'use strict';

		// @class bb1.PetshopShopping.Promotions.BottomlessBowlItems.ServiceController Manage promotion bottomless bowl item requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'bb1.PetshopShopping.Promotions.BottomlessBowlItems.ServiceController',
   
   options:
   {
    common:
    {
     requireLogin: true
    }
   },

			// @method get The call to PrescriptionsItem.Service.ss with http method 'get' is managed by this function
			// @return {bb1.PetshopShopping.Promotions.BottomlessBowlItems.Model.Data}
			get: function ()
			{
    var id = request.getParameter('orderid');
    
				return PromotionsBottomlessBowlItemsModel.get(id);
			},

			// @method post The call to PrescriptionsItem.Service.ss with http method 'post' is managed by this function
			// @return {bb1.PetshopShopping.Promotions.BottomlessBowlItems.Model.Data}
			post: function ()
			{
				return PromotionsBottomlessBowlItemsModel.update(this.data);
			}

		});
	}
);

// @module bb1.PetshopShopping.Prescriptions
define(
	'bb1.PetshopShopping.Prescriptions.Order.ServiceController',
	[
		'ServiceController',
		'Models.Init',
		'bb1.PetshopShopping.Prescriptions.Order.Model'
	],
	function (
		ServiceController,
		ModelsInit,
		PrescriptionsOrderModel
	)
	{
		'use strict';

		// @class bb1.PetshopShopping.PrescriptionsOrder.ServiceController Manage prescription order requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'bb1.PetshopShopping.Prescriptions.Order.ServiceController',

			// @method get The call to PrescriptionsOrder.Service.ss with http method 'get' is managed by this function
			// @return {bb1.PetshopShopping.Prescriptions.Order.Model.Data}
			get: function ()
			{
				var id = request.getParameter('orderid');
				
				return PrescriptionsOrderModel.get(id);
			}
			
		});
	}
);

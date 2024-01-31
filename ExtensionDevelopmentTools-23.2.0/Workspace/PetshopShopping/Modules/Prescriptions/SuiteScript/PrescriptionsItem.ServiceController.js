// @module bb1.PetshopShopping.Prescriptions
define(
	'bb1.PetshopShopping.Prescriptions.Item.ServiceController',
	[
		'ServiceController',
		'Models.Init',
		'bb1.PetshopShopping.Prescriptions.Item.Model'
	],
	function (
		ServiceController,
		ModelsInit,
		PrescriptionsItemModel
	)
	{
		'use strict';

		// @class bb1.PetshopShopping.Prescriptions.Item.ServiceController Manage prescription item requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'bb1.PetshopShopping.Prescriptions.Item.ServiceController',

			// @method get The call to PrescriptionsItem.Service.ss with http method 'get' is managed by this function
			// @return {bb1.PetshopShopping.Prescriptions.Item.Model.Data}
			put: function ()
			{
				return PrescriptionsItemModel.update(this.data);
			}

		});
	}
);

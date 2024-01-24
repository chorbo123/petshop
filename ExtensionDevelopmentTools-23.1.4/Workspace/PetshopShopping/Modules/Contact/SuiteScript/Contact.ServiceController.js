// @module bb1.PetshopShopping.Contact
define(
	'bb1.PetshopShopping.Contact.ServiceController',
	[
  'bb1.PetshopShopping.Contact.Model',
		'ServiceController'
	],
	function(
  ContactModel,
		ServiceController
	)
	{
		'use strict';
  
  try {
   // @class Contact.ServiceController Manage contact emails
   // @extend ServiceController
   return ServiceController.extend({

    // @property {String} name Mandatory for all ssp-libraries model
    name: 'bb1.PetshopShopping.Contact.ServiceController',

    // @method post The call to Contact.Service.ss with http method 'post' is managed by this function
    // @return {bb1.PetshopShopping.Contact.Model.Data}
    get: function ()
    {
     return ContactModel.create(this.data);
    }
    
   });
  }
		catch (e)
		{
			console.warn('bb1.PetshopShopping.Contact.Service.ss' + e.name, e);
			this.sendError(e);
		}
  
	}
);

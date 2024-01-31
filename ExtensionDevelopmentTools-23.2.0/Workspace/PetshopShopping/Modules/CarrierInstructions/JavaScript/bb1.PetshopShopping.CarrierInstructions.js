// @module bb1.PetshopShopping.CarrierInstructions
define(
	'bb1.PetshopShopping.CarrierInstructions',
	[
  'OrderWizard.Module.ShowShipments',
  'underscore',
		'jQuery',
		'Utils'
	],
	function (
		OrderWizardModuleShowShipments,

		_,
		jQuery
	)
 {
  'use strict';

   _.extend(OrderWizardModuleShowShipments.prototype, {
     
    changeCarrierInstructions: function(e)
    {
     var value = this.$(e.target).val()
     ,	self = this;

     this.model.set('carrierInstructions', value);
    },

    parseCarrierInstructions: function(e)
    {
     if (e.keyCode == 13) {
      return false;
     }
    }

   });
   
   _.extend(OrderWizardModuleShowShipments.prototype.events, {
     'change #carrierInstructions': 'changeCarrierInstructions',
     'keypress #carrierInstructions': 'parseCarrierInstructions'
   });
   
 }
);

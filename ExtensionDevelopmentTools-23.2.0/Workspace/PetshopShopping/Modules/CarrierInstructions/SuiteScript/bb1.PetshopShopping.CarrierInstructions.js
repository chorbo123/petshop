// @module bb1.PetshopShopping.CarrierInstructions
define(
	'bb1.PetshopShopping.CarrierInstructions',
	[
  'LiveOrder.Model',
  'Application',
  'Configuration',
		'Utils',
		'SC.Model',
		'Models.Init',

		'underscore'
	],
	function (
  LiveOrderModel,
		Application,
  Configuration,
		Utils,
		SCModel,
  ModelsInit,

 	_
	)
 {
  'use strict';

  _.extend(LiveOrderModel, {
  
   getCarrierInstructions: function()
   {
    'use strict';
    
    if (this.isSecure)
    {
     return (_.findWhere(order.getCustomFieldValues(), {name: 'custbody_bb1_pre_instructions'}) || {}).value || '';
    }
   },

   setCarrierInstructions: function(data)
   {
    'use strict';
    
    if (this.isSecure)
    {
     order.setCustomFieldValues({'custbody_bb1_pre_instructions': data.carrierInstructions || ''});
    }
   }
   
  });
  
  Application.on('after:LiveOrder.get', function(model, result) {

   result.carrierInstructions = model.getCarrierInstructions();
   
  });

  Application.on('after:LiveOrder.update', function(model, result, data) {

   model.setCarrierInstructions(data);
   
  });

 }
);

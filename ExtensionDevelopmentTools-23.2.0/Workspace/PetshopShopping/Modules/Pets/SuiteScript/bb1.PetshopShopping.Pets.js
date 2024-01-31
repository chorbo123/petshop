// @module bb1.PetshopShopping.Pets
define(
	'bb1.PetshopShopping.Pets',
	[
  'bb1.PetshopShopping.Pets.Settings.Model',
		'Utils',
		'underscore'
	],
	function (
		PetsSettingsModel,
		Utils,
		_
	)
 {
  'use strict';

  var Application = require("Application"); // workaround for Extension Manager obfuscating Application module properties
 
  Application.getEnvironment = _.wrap(Application.getEnvironment, function(originalGetEnvironment) {
   
   var environment = originalGetEnvironment.apply(this, _.rest(arguments));
   
   _.extend(environment, {
    
    petSettings: PetsSettingsModel.get()
    
   });
   
   return environment;
   
  });
  
 }
);

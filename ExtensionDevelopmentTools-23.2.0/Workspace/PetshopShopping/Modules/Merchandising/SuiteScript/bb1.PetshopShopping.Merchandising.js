// @module bb1.PetshopShopping.Merchandising
define(
	'bb1.PetshopShopping.Merchandising',
	[
  'Utils',
		'underscore'
	],
	function (
		Utils,
		_
	)
 {
  'use strict';

  var Application = require("Application"); // workaround for Extension Manager obfuscating Application module properties
 
  Application.getEnvironment = _.wrap(Application.getEnvironment, function(originalGetEnvironment) {
   
   var environment = originalGetEnvironment.apply(this, _.rest(arguments));
   
   if (typeof psg_dm !== 'undefined')
			{
				environment.MERCHANDISING = psg_dm.getMerchRule();
			}
			else
			{
				console.warn('Merchandising Module not present in ShopFlow SSP');
			}
   
   return environment;
   
  });
  
 }
);

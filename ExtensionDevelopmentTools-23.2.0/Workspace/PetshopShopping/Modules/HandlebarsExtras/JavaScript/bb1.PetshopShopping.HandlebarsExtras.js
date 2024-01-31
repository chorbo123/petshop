define(
	'bb1.PetshopShopping.HandlebarsExtras',
	[
		'Handlebars',
		'Backbone',
		'underscore',
		'jQuery'
	],
	function (
		Handlebars,
		Backbone,
		_,
		jQuery
	)
 {
  'use strict';

  Handlebars.registerHelper('uniqueId', function()
  {
    return new Handlebars.SafeString(_.uniqueId());
  });
  
  Handlebars.registerHelper('getAbsoluteUrl', function (url)
  {
   return _.getAbsoluteUrl(url);
  });

  Handlebars.registerHelper('ifEquals', function(v1, v2, options) 
  {
   if(v1 == v2) 
   {
    return options.fn(this);
   }
   return options.inverse(this);
  });
  
 }
);

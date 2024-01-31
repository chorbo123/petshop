// @module bb1.PetshopShopping.LoginRegister
define(
	'bb1.PetshopShopping.LoginRegister',
	[
		'LoginRegister.Register.View',
  'SC.Configuration',
  
		'Backbone',
  'Utils',
		'underscore',
  'jQuery'
	],
	function(
		LoginRegisterRegisterView,
  Configuration,
  
		Backbone,
  Utils,
		_,
  jQuery
	)
{
	'use strict';

 LoginRegisterRegisterView.prototype.getContext = _.wrap(LoginRegisterRegisterView.prototype.getContext, function(originalGetContext) {
  var results = originalGetContext.apply(this, _.rest(arguments));
  
  var defaultMarketingOptedIn = this.options.application.getConfig('registrationMarketingOptions.defaultMarketingOptedIn');
  
  _.extend(results, {
   // @property {Boolean} defaultMarketingOptedIn
			defaultMarketingOptedIn: !!defaultMarketingOptedIn
  });
  
  return results;
 });
 
});

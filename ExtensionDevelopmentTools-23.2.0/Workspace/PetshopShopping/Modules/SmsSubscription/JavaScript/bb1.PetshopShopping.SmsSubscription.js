// @module bb1.PetshopShopping.SmsSubscription
define(
	'bb1.PetshopShopping.SmsSubscription',
	[
		'bb1.PetshopShopping.SmsSubscription.MobilePhone.View',
		'bb1.PetshopShopping.SmsSubscription.OrderWizard.Module.MobilePhone',
		'LoginRegister.Register.View',
		'Account.Register.Model',
  'OrderWizard.Router',
  'SC.Configuration',
  
  'Backbone.CompositeView',
		'Backbone',
  'Utils',
		'underscore',
  'jQuery'
	],
	function(
  SmsSubscriptionMobilePhoneView,
  SmsSubscriptionOrderWizardModuleMobilePhone,
		LoginRegisterRegisterView,
  AccountRegisterModel,
  OrderWizardRouter,
  Configuration,
  
  BackboneCompositeView,
		Backbone,
  Utils,
		_,
  jQuery
	)
 {
  'use strict';

  LoginRegisterRegisterView.prototype.initialize = _.wrap(LoginRegisterRegisterView.prototype.initialize, function(originalInitialize) {
   //console.log('LoginRegisterRegisterView.prototype.initialize');
   BackboneCompositeView.add(this);
   
   var results = originalInitialize.apply(this, _.rest(arguments));
   
   return results;
  });
  
  LoginRegisterRegisterView.prototype.getContext = _.wrap(LoginRegisterRegisterView.prototype.getContext, function(originalGetContext) {
   var results = originalGetContext.apply(this, _.rest(arguments));
   
   _.extend(results, {
    // @property {Boolean} isSmsSubscribeChecked
    isSmsSubscribeChecked: this.options.isSmsSubscribeChecked || false
   });
   
   return results;
  });
  
  /*_.extend(AccountRegisterModel.prototype.validation, {
   
   mobilephone: { fn: _.validateMobilePhone }
   
  });*/
  
  LoginRegisterRegisterView.prototype.childViews = _.extend(LoginRegisterRegisterView.prototype.childViews || {}, {
   
   'Register.MobilePhone': function() {
    //console.log('Register.MobilePhone');
    return new SmsSubscriptionMobilePhoneView({
     application: this.application
    });
    
   }
   
  });
  
  OrderWizardRouter.prototype.initialize = _.wrap(OrderWizardRouter.prototype.initialize, function(originalInitialize, application, options) {
   
   var shipAddressCheckoutStepGroup = options.steps[0],
       shipAddressCheckoutStep = shipAddressCheckoutStepGroup.steps[0];
   
    //console.log('shipAddressCheckoutStep');
    //console.log(shipAddressCheckoutStep);
    
   //shipAddressCheckoutStep.modules.push(SmsSubscriptionOrderWizardModuleMobilePhone);
  
   return originalInitialize.apply(this, _.rest(arguments));
  });
  
 }
);

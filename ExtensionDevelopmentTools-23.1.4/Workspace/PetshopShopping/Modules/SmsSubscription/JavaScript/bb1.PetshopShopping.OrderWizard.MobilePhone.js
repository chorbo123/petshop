//@module bb1.PetshopShopping.SmsSubscription
define(
	'bb1.PetshopShopping.SmsSubscription.OrderWizard.MobilePhone',
 [
		'OrderWizard.Router',
  'bb1.PetshopShopping.SmsSubscription.OrderWizard.Module.MobilePhone',
 
		'underscore',
		'jQuery'
	],
	function (
  OrderWizardRouter,
  SmsSubscriptionOrderWizardModuleMobilePhone,
  
		_,
		jQuery
	)
 {
  'use strict';
  
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

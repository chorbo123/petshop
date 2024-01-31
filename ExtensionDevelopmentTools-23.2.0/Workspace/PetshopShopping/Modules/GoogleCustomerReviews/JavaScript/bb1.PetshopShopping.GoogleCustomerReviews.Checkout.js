// @module bb1.PetshopShopping.GoogleCustomerReviews
define(
	'bb1.PetshopShopping.GoogleCustomerReviews.Checkout',
	[
  'bb1.PetshopShopping.GoogleCustomerReviews.OrderWizard.Module.OrderCompleted',
  'OrderWizard.Router',
  'SC.Configuration',
  
  'underscore',
		'Utils'
	],
	function (
 GoogleCustomerReviewsOrderWizardModuleOrderCompleted,
 OrderWizardRouter,
 Configuration,

		_,
  Utils
	)
 {
  'use strict';
     
  var googleCustomerReviewsConfig = Configuration.get('googleCustomerReviews') || {};
  
  if (googleCustomerReviewsConfig.enabled) {
  
   OrderWizardRouter.prototype.initialize = _.wrap(OrderWizardRouter.prototype.initialize, function(originalInitialize, application, options) {
    
    var reviewCheckoutStepGroup = _.findWhere(options.steps, {name: 'Review'}) || {},
        reviewCheckoutStep = reviewCheckoutStepGroup.steps[0],
        confirmationCheckoutStep = reviewCheckoutStepGroup.steps[1];
    
    //reviewCheckoutStep.modules.push(GoogleCustomerReviewsOrderWizardModuleOrderCompleted);
    confirmationCheckoutStep.modules.push(GoogleCustomerReviewsOrderWizardModuleOrderCompleted);
   
    return originalInitialize.apply(this, _.rest(arguments));
    
   });
   
  }
  
 }
);

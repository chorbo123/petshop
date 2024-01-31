// @module bb1.PetshopShopping.Prescriptions
define(
 'bb1.PetshopShopping.Prescriptions',
 [
  'bb1.PetshopShopping.Prescriptions.OrderWizard.Module.PrescriptionItems',
  'OrderWizard.Router',
  'Header.View',
  'Footer.View',
  'OrderWizard.Step',
  'Transaction.Line.Views.Option.View'
 ],
 function (
  OrderWizardModulePrescriptionItems,
  OrderWizardRouter,
  HeaderView,
  FooterView,
  OrderWizardStep
 )
 {
  'use strict';
  
  //OrderWizardStep.prototype.headerView = HeaderView;
  //OrderWizardStep.prototype.footerView = FooterView;
  
  OrderWizardRouter.prototype.initialize = _.wrap(OrderWizardRouter.prototype.initialize, function(originalInitialize, application, options) {
   
   var reviewCheckoutStepGroup = _.findWhere(options.steps, {name: 'Review'}) || {},
       reviewCheckoutStep = reviewCheckoutStepGroup.steps[0],
       confirmationCheckoutStep = reviewCheckoutStepGroup.steps[1]; //this.steps.review; //confirmation; //application.Configuration.checkoutSteps[4].steps[0];
   
   //confirmationCheckoutStep.headerView = HeaderView;
   //confirmationCheckoutStep.footerView = FooterView;
   
   reviewCheckoutStep.modules.push(OrderWizardModulePrescriptionItems);
   confirmationCheckoutStep.modules.push(OrderWizardModulePrescriptionItems);
  
   return originalInitialize.apply(this, _.rest(arguments));
  });
  
  return {
   
   mountToApp: function (application)
   {
    
   }
   
  };
 }
);

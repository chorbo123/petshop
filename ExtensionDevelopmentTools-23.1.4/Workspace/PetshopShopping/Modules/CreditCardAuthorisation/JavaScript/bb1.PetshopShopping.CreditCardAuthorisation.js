// @module bb1.PetshopShopping.CreditCardAuthorisation
define(
	'bb1.PetshopShopping.CreditCardAuthorisation',
	[
		'OrderWizard.Module.PaymentMethod.Creditcard',
  'SC.Configuration',
  
		'underscore',
		'Backbone'
	],
	function (
		OrderWizardModulePaymentMethodCreditcard,
  Configuration,
  
		_,
		Backbone
	)
{
	'use strict';
 
 OrderWizardModulePaymentMethodCreditcard.prototype.initialize = _.wrap(OrderWizardModulePaymentMethodCreditcard.prototype.initialize, function(originalInitialize) {
  
  var result = originalInitialize.apply(this, _.rest(arguments));
  var	order_creditcard = this.paymentMethod.get('creditcard');
  
  this.requireccsecuritycode = Configuration.get('siteSettings.checkout.requireccsecuritycode', 'T') === 'T' || !(order_creditcard && order_creditcard.authorised);
  
  return result;
  
 });
 
});

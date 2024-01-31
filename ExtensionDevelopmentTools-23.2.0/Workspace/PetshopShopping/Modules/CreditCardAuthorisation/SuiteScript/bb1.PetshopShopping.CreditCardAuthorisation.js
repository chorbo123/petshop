// @module bb1.PetshopShopping.CreditCardAuthorisation
define(
	'bb1.PetshopShopping.CreditCardAuthorisation',
	[
  'bb1.PetshopShopping.CreditCardAuthorisation.Model',
  'Application',
		'Utils',

		'underscore'
	],
	function (
  CreditCardAuthorisationModel,
		Application,
		Utils,

 	_
	)
{
	'use strict';

 Application.on('after:CreditCard.list', function(model, result) {

  //console.log('after:CreditCard.list');
  
  return _.each(result, function (credit_card)
  {
   credit_card.authorised = CreditCardAuthorisationModel.isCreditCardAuthorised(credit_card.internalid);
  });
  
  //console.log(JSON.stringify(result));
  
 });

});

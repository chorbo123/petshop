// @module bb1.PetshopShopping.CreditCardAuthorisation
define(
	'bb1.PetshopShopping.CreditCardAuthorisation.Model',
	[
  'Application',
  'Configuration',
		'Utils',
		'SC.Model',
		'Models.Init',

		'underscore'
	],
	function (
		Application,
  Configuration,
		Utils,
		SCModel,
  ModelsInit,

 	_
	)
 {
  'use strict';

  // @extends SCModel
  return SCModel.extend({

   name: 'bb1.PetshopShopping.CreditCardAuthorisation',
    
   isCreditCardAuthorised: function (id)
   {
    var creditCardApproval = {},
        creditCardApprovalCache = ''; //ModelsInit.context.getSessionObject('credit_card_approval');
    
    try {
    
     if (session.isLoggedIn2()) {
     
      if (creditCardApprovalCache) {
      
       creditCardApproval = JSON.parse(creditCardApprovalCache) || {};
       
      }
      else {
      
       var	filters = [
            new nlobjSearchFilter('entity', null, 'is', nlapiGetUser()),
            new nlobjSearchFilter('mainline', null, 'is', 'T'),
            new nlobjSearchFilter('paymentapproved', null, 'is', 'T'),
            new nlobjSearchFilter('custbody_bb1_creditcardid', null, 'isnotempty')
           ],
           columns = [
            new nlobjSearchColumn('custbody_bb1_creditcardid', null, 'group'),
            new nlobjSearchColumn('paymentapproved', null, 'group')
           ];

       var results = Application.getAllSearchResults('salesorder',	filters,	columns);

       _.each(results, function (result)
       {
        var creditCardId = result.getValue('custbody_bb1_creditcardid', null, 'group');
        creditCardApproval[creditCardId] = true;
       });
       
       ModelsInit.context.setSessionObject('credit_card_approval', JSON.stringify(creditCardApproval));
      
      }
      
     }
     
    }
    catch (e) {
    
     console.log('error in isCreditCardAuthorised', e && e.getDetails ? e.getDetails() : e);
     
    }
    
    //console.log('isCreditCardAuthorised before return, creditCardApproval', JSON.stringify(creditCardApproval));
    
    return creditCardApproval[id] === true;
   
   }
   
  });

 }
);

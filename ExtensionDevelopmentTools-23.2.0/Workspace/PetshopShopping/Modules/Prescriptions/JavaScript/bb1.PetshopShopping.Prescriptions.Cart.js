// @module bb1.PetshopShopping.Prescriptions
define(
 'bb1.PetshopShopping.Prescriptions.Cart',
 [
  'Transaction.Line.Views.Option.View'
 ],
 function (
  TransactionLineViewsOptionView
 )
 {
  'use strict';
  
  TransactionLineViewsOptionView.prototype.render = _.wrap(TransactionLineViewsOptionView.prototype.render, function(originalRender) {
   
   var skippedOptionIds = ['custcol_bb1_psi_petsusingprescription', 'custcol_bb1_psi_petisnotpregnant', 'custcol_bb1_psi_petsusingrxjson'];
   var cartOptionId = this.model.get('cartOptionId');
   
   if (skippedOptionIds.indexOf(cartOptionId) != -1)
				return this;
   
   return originalRender.apply(this, _.rest(arguments));
  });
   
  return {
   
   mountToApp: function (application)
   {
    
   }
   
  };
 }
);

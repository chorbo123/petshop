//@module bb1.PetshopShopping.Promotions
define(
 'bb1.PetshopShopping.Promotions.ItemKeyMapping',
 [
  'Item.KeyMapping',
  'Cart.Confirmation.View',
 
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  ItemKeyMapping,
  CartConfirmationView,
  
  Backbone,
  _,
  Utils
 )
 {
  'use strict';
  
  ItemKeyMapping.getKeyMapping = _.wrap(ItemKeyMapping.getKeyMapping, function(originalGetKeyMapping) {
   
   var keyMapping = originalGetKeyMapping.apply(this, _.rest(arguments));
   
   _.extend(keyMapping, {
    
    _currentPromotions: function (item)
    {
     return JSON.parse(item.get('custitem_bb1_cop_currentpromotionsjson'));
     
     // why is the code below resetting the selected order schedule option????
     var currentPromotions = item.get('custitem_bb1_cop_currentpromotionsjson') || null;
     
     if (currentPromotions && typeof currentPromotions != 'object') {
      currentPromotions = JSON.parse(currentPromotions);
      item.set('custitem_bb1_cop_currentpromotionsjson', currentPromotions);
     }
     
     return currentPromotions;
    },
    
    _specials: function (item)
    {
     var specials = (item.get('custitem_bb1_specials') || "").split(/\s*,\s*/);
     
     specials = _.map(specials, function(special) {
      return specials != '&nbsp;' ? specials : ''; 
     });
     
     return specials.length ? specials : null;
    },
    
    _prescriptionTreatmentType: 'custitem_bb1_psi_treatmenttype',
    
    _prescriptionItemsPerPack: function (item)
    {
     return parseInt(item.get('custitem_bb1_psi_itemsperpack' )) || 1;
    },
    
    _prescriptionWeightPerTablet: function (item)
    {
     return parseFloat(item.get('custitem_bb1_psi_weightpertablet' )) || 1;
    }
    
   });
   
   return keyMapping;
   
  });
  
  return {
   
   mountToApp: function(application) {
    
    _.extend(CartConfirmationView.prototype, {
     
     render: _.wrap(CartConfirmationView.prototype.render, function(originalRender) {
      var result = originalRender.apply(this, _.rest(arguments));
      
      application.trigger('CartConfirmationView.AfterRender', this);
      
      return result;
     })
     
    });
    
   }
   
  };
  
 }
);

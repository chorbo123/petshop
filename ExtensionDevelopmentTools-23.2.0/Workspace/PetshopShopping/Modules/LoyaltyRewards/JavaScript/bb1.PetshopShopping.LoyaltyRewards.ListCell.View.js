// @module bb1.PetshopShopping.LoyaltyRewards
define(
 'bb1.PetshopShopping.LoyaltyRewards.ListCell.View',
 [
  'GlobalViews.Message.View',
  
  'bb1_petshopshopping_loyaltyrewards_list_cell.tpl',
  
  'Backbone',
  'underscore'
 ],
 function (
  GlobalViewsMessageView,
  
  bb1_petshopshopping_loyaltyrewards_list_cell_tpl,
  
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_loyaltyrewards_list_cell_tpl,

   initialize: function (options)
   {
    this.application = options.application;
   },

   getContext: function ()
   {
    var card = this.model || new Backbone.Model();
    //var stamps = [];
    var quantityRequired = parseFloat(card.get('quantityRequired1'), 10) || 0;
    var quantityPurchased = parseFloat(card.get('quantityPurchased'), 10) || 0;
    //var purchasesRemaining = quantityRequired - quantityPurchased;
    //var purchasesRemainingText = purchasesRemaining > 0 ? _('Only $(0) $(1) away...').translate(purchasesRemaining, purchasesRemaining > 1 ? 'bags' : 'bag') : '';
    var brandFacetUrl = (card.get('brand').name || '').replace(/\W+/gi, '-');
    var rewards = card.get('rewards');
    var status = card.get('status') || {};
    var dateRedeemed = card.get('dateRedeemed');
    
    console.log('rewards');
    console.log(rewards);
    //console.log('card.get(brand)');
    //console.log(card.get('brand'));
    /*for (var i=0; i < quantityRequired; i++) {
     stamps.push({
      collected: quantityPurchased > 0
     });
     
     if (quantityPurchased > 0) quantityPurchased--;
    }*/
    
    //card.set('stamps', stamps);
    
    var firstUnusedCouponCode = '';
    
    var nextReward = _.find(rewards, function(reward) {
     if (!reward.couponCode) {
      quantityRequired = reward.quantityRequired;
      return true;
     }
     
     if (!firstUnusedCouponCode && reward.couponCode && !reward.dateRedeemed) {
      firstUnusedCouponCode = reward.couponCode;
      quantityRequired = reward.quantityRequired;
      //return true;
     }
     
     return false;
    });
    
    var purchasesRemaining = quantityRequired - quantityPurchased;
    var purchasesRemainingText = purchasesRemaining > 0 ? _('Only $(0) $(1) away...').translate(purchasesRemaining, purchasesRemaining > 1 ? 'bags' : 'bag') : '';
    
    //@class bb1.PetshopShopping.LoyaltyRewards.ListCell.View.Context
    return {
     //@property {Backbone.Model} card
     card: card,
     //@property {Array} stamps
     //stamps: stamps,
     //@property {Number} purchasesRemaining
     purchasesRemaining: purchasesRemaining,
     //@property {String} purchasesRemainingText
     purchasesRemainingText: purchasesRemainingText,
     //@property {String} qualifyingItemsUrl
     qualifyingItemsUrl: 'loyalty-reward-items/' + brandFacetUrl,
     //@property {String} firstUnusedCouponCode
     firstUnusedCouponCode: firstUnusedCouponCode,
     //@property {Boolean} showRedeemedDate
     showRedeemedDate: status.internalId == 3 && dateRedeemed
    };
   }
   
  });

 }
);

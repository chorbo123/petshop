// @module bb1.PetshopShopping.LoyaltyRewards
define(
 'bb1.PetshopShopping.LoyaltyRewards.Model',
 [
  'SC.Model',
  'Application',
  'Profile.Model',
  'StoreItem.Model',
  'Models.Init',
  'SiteSettings.Model',
  'Utils',
  'underscore'
 ],
 function (
  SCModel,
  Application,
  Profile,
  StoreItem,
  ModelsInit,
  SiteSettings,
  Utils,
  _
 )
 {
  'use strict';

  // @extends SCModel
  return SCModel.extend({

   name: 'bb1.PetshopShopping.LoyaltyRewards',
   
   maxRewardsPerCard: 5,
   
   // @method get
   // @returns {bb1.PetshopShopping.LoyaltyRewards.Model.Data}
   get: function (id)
   {
    'use strict';

    if (!ModelsInit.session.isLoggedIn())
     throw unauthorizedError;

    var customerId = nlapiGetUser(),
        filters = [new nlobjSearchFilter('isinactive', null, 'is', 'F'),
                   new nlobjSearchFilter('custrecord_bb1_lrc_customer', null, 'anyof', customerId),
                   new nlobjSearchFilter('custrecord_bb1_lrc_status', null, 'anyof', [1, 2, 3])],
        columns = this.getColumnsArray();
        
    if (id)
     filters.push(new nlobjSearchFilter('internalid', null, 'anyof', id));
     
    var result = this.searchHelper(filters, columns, 'all');
    
    if (id) {
     if (result.cards.length)
      result = result.cards[0];
     else
      throw notFoundError;
    }

    return result;
   },
   
   getColumnsArray: function ()
   {
    'use strict';

    return [
     new nlobjSearchColumn('name', 'custrecord_bb1_lrc_lrp'),
     //new nlobjSearchColumn('internalid', 'custrecord_bb1_lrc_status').setSort(true),
     new nlobjSearchColumn('custrecord_bb1_lrc_qtypurchased'),
     new nlobjSearchColumn('internalid').setSort(),
     new nlobjSearchColumn('custrecord_bb1_lrc_brand'),
     //new nlobjSearchColumn('custrecord_bb1_lrp_brand', 'custrecord_bb1_lrc_lrp'),
     new nlobjSearchColumn('custrecord_bb1_lrc_qtyrequired_1'),
     new nlobjSearchColumn('custrecord_bb1_lrc_qtyrequired_2'),
     new nlobjSearchColumn('custrecord_bb1_lrc_qtyrequired_3'),
     new nlobjSearchColumn('custrecord_bb1_lrc_qtyrequired_4'),
     new nlobjSearchColumn('custrecord_bb1_lrc_qtyrequired_5'),
     //new nlobjSearchColumn('custrecord_bb1_lrp_qtyrequired', 'custrecord_bb1_lrc_lrp'),
     new nlobjSearchColumn('custrecord_bb1_lrc_promotioncode_1'),
     new nlobjSearchColumn('custrecord_bb1_lrc_promotioncode_2'),
     new nlobjSearchColumn('custrecord_bb1_lrc_promotioncode_3'),
     new nlobjSearchColumn('custrecord_bb1_lrc_promotioncode_4'),
     new nlobjSearchColumn('custrecord_bb1_lrc_promotioncode_5'),
     //new nlobjSearchColumn('custrecord_bb1_lrp_promotioncode', 'custrecord_bb1_lrc_lrp'),
     new nlobjSearchColumn('custrecord_bb1_lrc_brandimage'),
     //new nlobjSearchColumn('custrecord_bb1_lrp_brandimage', 'custrecord_bb1_lrc_lrp'),
     new nlobjSearchColumn('custrecord_bb1_lrc_allowblbdiscounts'),
     //new nlobjSearchColumn('custrecord_bb1_lrp_allowblbdiscounts', 'custrecord_bb1_lrc_lrp'),
     new nlobjSearchColumn('custrecord_bb1_lrc_lrp'),
     new nlobjSearchColumn('custrecord_bb1_lrc_couponcode_1'),
     new nlobjSearchColumn('custrecord_bb1_lrc_couponcode_2'),
     new nlobjSearchColumn('custrecord_bb1_lrc_couponcode_3'),
     new nlobjSearchColumn('custrecord_bb1_lrc_couponcode_4'),
     new nlobjSearchColumn('custrecord_bb1_lrc_couponcode_5'),
     new nlobjSearchColumn('custrecord_bb1_lrc_rewardimage_1'),
     new nlobjSearchColumn('custrecord_bb1_lrc_rewardimage_2'),
     new nlobjSearchColumn('custrecord_bb1_lrc_rewardimage_3'),
     new nlobjSearchColumn('custrecord_bb1_lrc_rewardimage_4'),
     new nlobjSearchColumn('custrecord_bb1_lrc_rewardimage_5'),
     new nlobjSearchColumn('custrecord_bb1_lrc_status'),
     new nlobjSearchColumn('lastmodified')
    ];
   },
   
   searchHelper: function (filters, columns, page)
   {
    'use strict';
    
    var self = this,
        cardSearchResults = Application.getAllSearchResults('customrecord_bb1_lrc', filters, columns),
        result = {cards: [], redeemedCards: []},
        rewardsByCouponCodeLookup = {},
        stampsByCouponCodeLookup = {},
        cardsByCouponCodeLookup = {},
        couponCodes = [];
        
    _.each(cardSearchResults, function (cardSearchResult)
    {
     var quantityPurchased = parseInt(cardSearchResult.getValue('custrecord_bb1_lrc_qtypurchased'), 10) || 0,
         statusId = cardSearchResult.getValue('custrecord_bb1_lrc_status'),
         lastModified = nlapiStringToDate(cardSearchResult.getValue('lastmodified')),
         card = {
          internalId: cardSearchResult.getId(),
          loyaltyRewardsProgramme: {
           internalId: cardSearchResult.getValue('custrecord_bb1_lrc_lrp'),
           name: cardSearchResult.getText('custrecord_bb1_lrc_lrp')
          },
          name: cardSearchResult.getValue('name', 'custrecord_bb1_lrc_lrp'),
          brand: {
           internalId: cardSearchResult.getValue('custrecord_bb1_lrc_brand'),
           name: cardSearchResult.getText('custrecord_bb1_lrc_brand')
          },
          quantityRequired1: cardSearchResult.getValue('custrecord_bb1_lrc_qtyrequired_1'),
          promotionCode1: cardSearchResult.getValue('custrecord_bb1_lrc_promotioncode_1'),
          brandImage: cardSearchResult.getText('custrecord_bb1_lrc_brandimage'),
          allowBottomlessBowlDiscounts: cardSearchResult.getValue('custrecord_bb1_lrc_allowblbdiscounts') == 'T',
          quantityPurchased: quantityPurchased,
          couponCode1: cardSearchResult.getValue('custrecord_bb1_lrc_couponcode_1'),
          status: {
           internalId: statusId,
           name: cardSearchResult.getText('custrecord_bb1_lrc_status')
          },
          lastModified: lastModified ? nlapiDateToString(lastModified, 'datetime') : ''
         };
         
     card.rewards = [];
     
     var previousQuantityRequired = 0;
     
     for (var rewardIndex=1; rewardIndex <= self.maxRewardsPerCard; rewardIndex++) {
      var quantityRequired = parseInt(cardSearchResult.getValue('custrecord_bb1_lrc_qtyrequired_' + rewardIndex)) || 0;
      var promotionCode = cardSearchResult.getValue('custrecord_bb1_lrc_promotioncode_' + rewardIndex);
      var couponCode = cardSearchResult.getValue('custrecord_bb1_lrc_couponcode_' + rewardIndex);
      
      if (quantityRequired > previousQuantityRequired && promotionCode) {
       var reward = {
        quantityRequired: quantityRequired,
        promotionCode: promotionCode,
        couponCode: couponCode,
        rewardImage: cardSearchResult.getText('custrecord_bb1_lrc_rewardimage_' + rewardIndex)
       };
       
       previousQuantityRequired = quantityRequired;
       
       card.rewards.push(reward);
       
       if (couponCode) {
        couponCodes.push(couponCode);
        rewardsByCouponCodeLookup[couponCode] = reward;
       }
      }
     }
     
     card.stamps = [];
     
     var rewards = card.rewards.slice(0);
     var stampIndex = 1;
     card.maxQuantityRequired = previousQuantityRequired;
     
     while (rewards.length) {
      var reward = rewards.shift();
      
      for (; stampIndex <= reward.quantityRequired; stampIndex++) {
       var stamp = {
        number: stampIndex,
        collected: stampIndex <= quantityPurchased
       };
       
       if (stampIndex == reward.quantityRequired) {
        _.extend(stamp, {
         rewardStamp: true,
         rewardImage: reward.rewardImage,
         couponCode: reward.couponCode
        });
        
        stampsByCouponCodeLookup[reward.couponCode] = stamp;
        cardsByCouponCodeLookup[reward.couponCode] = card;
       }
       
       card.stamps.push(stamp);
      }
     }
     
     if (statusId == 3)
      result.redeemedCards.push(card);
     else
      result.cards.push(card);
    });
    
    if (couponCodes.length) {
     var couponCodeFilters = [];
     
     console.log('couponCodes', JSON.stringify(couponCodes));
     console.log('rewardsByCouponCodeLookup', JSON.stringify(rewardsByCouponCodeLookup));
     
     for (var i=0; i < couponCodes.length; i++) {
      var couponCode = couponCodes[i];
      
      couponCodeFilters.push(["couponcode", "is", couponCode], "or");
     }
     
     couponCodeFilters.pop();
     
     console.log('couponCodeFilters', JSON.stringify(couponCodeFilters));
     
     var salesOrderFilters = [
                              ["voided", "is", "F"], "and",
                              ["mainline", "is", "T"], "and",
                              //["cogs", "is", "F"], "and",
                              //["memorized", "is", "F"], "and",
                              //["shipping", "is", "F"], "and",
                              //["taxline", "is", "F"], "and",
                              couponCodeFilters
                             ];
     var salesOrderColumns = [
                              new nlobjSearchColumn("trandate"),
                              new nlobjSearchColumn("couponcode")
                             ];
     var salesOrderSearchResults = Application.getAllSearchResults('salesorder', salesOrderFilters, salesOrderColumns);
     
     result.salesOrderSearchResults = salesOrderSearchResults;
     
     _.each(salesOrderSearchResults, function(salesOrderSearchResult) {
      var tranDate = salesOrderSearchResult.getValue('trandate');
      var couponCode = salesOrderSearchResult.getText('couponcode');
      var reward = rewardsByCouponCodeLookup[couponCode];
      var stamp = stampsByCouponCodeLookup[couponCode];
      var card = cardsByCouponCodeLookup[couponCode];
      
      //if (card.status.internalId == 3) {
       if (reward)
        reward.dateRedeemed = tranDate;
       
       if (stamp)
        stamp.dateRedeemed = tranDate;
       
       if (card && (!card.dateRedeemed || nlapiStringToDate(tranDate).getTime() > nlapiStringToDate(card.dateRedeemed).getTime()))
        card.dateRedeemed = tranDate;
      //}
     });
    }
    
    return result;
   }

  });

 }
);

//@module bb1.PetshopShopping.LoyaltyRewards.Profile
define(
 'bb1.PetshopShopping.LoyaltyRewards.Profile',
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
 
 Application.on('after:Profile.get', function(model, profile) {
  
  //console.log('bb1.PetshopShopping.LoyaltyRewards.Profile after:Profile.get profile', JSON.stringify(profile));
  
   var loyaltyRewardCard = {},
       customerId = nlapiGetUser(),
       loyaltyRewardCardFilters = [
                                   new nlobjSearchFilter("isinactive", null, "is", "F"),
                                   new nlobjSearchFilter("custrecord_bb1_lrc_customer", null, "anyof", customerId)
                                  ],
       loyaltyRewardCardColumns = [
                                   new nlobjSearchColumn("formulanumeric", null, "sum").setFormula("CASE WHEN {custrecord_bb1_lrc_status.id} = 2 THEN 1 ELSE 0 END"),
                                   new nlobjSearchColumn("formulanumeric", null, "min").setFormula("CASE WHEN {custrecord_bb1_lrc_status.id} = 1 AND {custrecord_bb1_lrc_qtypurchased} >= 0 THEN {custrecord_bb1_lrc_qtyrequired} - {custrecord_bb1_lrc_qtypurchased} ELSE NULL END")
                                  ],
       loyaltyRewardCardResults = Application.getAllSearchResults('customrecord_bb1_lrc', loyaltyRewardCardFilters, loyaltyRewardCardColumns);

   _.each(loyaltyRewardCardResults, function (loyaltyRewardCardResult) {
    _.extend(loyaltyRewardCard, {
     loyaltyRewardsAccrued: parseFloat(loyaltyRewardCardResult.getValue(loyaltyRewardCardColumns[0]), 10) || 0,
     minPurchasesForNextReward: parseFloat(loyaltyRewardCardResult.getValue(loyaltyRewardCardColumns[1]), 10) || 0
    });
   });
   
  _.extend(profile, {
   loyaltyRewardCards: loyaltyRewardCard
  });
  
  //console.log('bb1.PetshopShopping.LoyaltyRewards.Profile after:Profile.get profile after', JSON.stringify(profile));
  
 });
 
});

// @module bb1.PetshopShopping.LoyaltyRewards
define(
 'bb1.PetshopShopping.LoyaltyRewards.Collection',
 [
  'bb1.PetshopShopping.LoyaltyRewards.Model',
  
  'Backbone',
  'underscore'
 ],
 function (
  LoyaltyRewardsModel,
  
  Backbone,
  _
 )
 {
  'use strict';
  
  return Backbone.Collection.extend(
  {
   model: LoyaltyRewardsModel,
   
   url: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/LoyaltyRewards.Service.ss'),
   
   parse: function(response) {
    return response.records;
   }
  });
  
 }
);

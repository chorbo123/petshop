// @module bb1.PetshopShopping.LoyaltyRewards
define(
 'bb1.PetshopShopping.LoyaltyRewards.Model',
 [
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.Model.extend(
  {
   urlRoot: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/LoyaltyRewards.Service.ss'),
   
   parse: function(response) {
    response.cards = new Backbone.Collection(response.cards);
    
    return response;
   }
  });
  
 }
);

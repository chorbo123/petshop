// @module bb1.PetshopShopping.Vouchers
define(
 'bb1.PetshopShopping.Vouchers.Model',
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
   urlRoot: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/Vouchers.Service.ss'),
   
   parse: function(response) {
    response.cards = new Backbone.Collection(response.vouchers);
    
    return response;
   }
  });
  
 }
);

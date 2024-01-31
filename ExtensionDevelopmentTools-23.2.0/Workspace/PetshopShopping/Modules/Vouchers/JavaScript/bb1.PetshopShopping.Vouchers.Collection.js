// @module bb1.PetshopShopping.Vouchers
define(
 'bb1.PetshopShopping.Vouchers.Collection',
 [
  'bb1.PetshopShopping.Vouchers.Model',
  
  'Backbone',
  'underscore'
 ],
 function (
  VouchersModel,
  
  Backbone,
  _
 )
 {
  'use strict';
  
  return Backbone.Collection.extend(
  {
   model: VouchersModel,
   
   url: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/Vouchers.Service.ss'),
   
   parse: function(response) {
    return response.records;
   }
  });
  
 }
);

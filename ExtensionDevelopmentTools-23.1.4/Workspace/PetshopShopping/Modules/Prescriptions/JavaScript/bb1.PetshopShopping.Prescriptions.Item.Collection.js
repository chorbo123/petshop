// @module bb1.PetshopShopping.Prescriptions
define(
 'bb1.PetshopShopping.Prescriptions.Item.Collection',
 [
  'bb1.PetshopShopping.Prescriptions.Item.Model',
  
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  PrescriptionItemModel,
  
  Backbone,
  _
 )
 {
  'use strict';
  
  return Backbone.Collection.extend(
  {
   model: PrescriptionItemModel,
   
   url: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/PrescriptionsItem.Service.ss')
  });
  
 }
);

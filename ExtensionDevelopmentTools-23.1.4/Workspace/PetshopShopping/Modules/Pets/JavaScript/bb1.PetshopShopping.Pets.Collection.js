// @module bb1.PetshopShopping.Pets
define(
 'bb1.PetshopShopping.Pets.Collection',
 [
  'bb1.PetshopShopping.Pets.Model',
  
  'Backbone',
  'underscore'
 ],
 function (
  PetsModel,
  
  Backbone,
  _
 )
 {
  'use strict';
  
  return Backbone.Collection.extend(
  {
   model: PetsModel,
   url: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/Pets.Service.ss')
  });
  
 }
);

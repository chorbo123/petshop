// @module bb1.PetshopShopping.Breeders
define(
 'bb1.PetshopShopping.Breeders.Collection',
 [
  'bb1.PetshopShopping.Breeders.Model',
  
  'Backbone',
  'underscore'
 ],
 function (
  BreedersModel,
  
  Backbone,
  _
 )
 {
  'use strict';
  
  return Backbone.Collection.extend(
  {
   model: BreedersModel,
   url: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/Breeders.Service.ss')
  });
  
 }
);

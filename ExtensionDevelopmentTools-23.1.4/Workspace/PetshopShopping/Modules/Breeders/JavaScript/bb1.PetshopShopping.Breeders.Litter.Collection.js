// @module bb1.PetshopShopping.Breeders
define(
 'bb1.PetshopShopping.Breeders.PetParent.Collection',
 [
  'bb1.PetshopShopping.Breeders.PetParent.Model',
  
  'Backbone',
  'underscore'
 ],
 function (
  BreedersPetParentModel,
  
  Backbone,
  _
 )
 {
  'use strict';
  
  return Backbone.Collection.extend(
  {
   
   model: BreedersPetParentModel,
   
   initialize: function(options) {
    
    this.on('add', function() {
     console.log('add model');
     console.log(arguments);
    });
   
   }
   
  });
  
 }
);

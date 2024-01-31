// @module bb1.PetshopShopping.Pets
define(
 'bb1.PetshopShopping.Pets.BreedsDropdown.View',
 [
  'bb1_petshopshopping_pets_breeds_dropdown.tpl',
  
  'Backbone',
  'underscore'
 ],
 function (
  bb1_petshopshopping_pets_breeds_dropdown_tpl,
  
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_pets_breeds_dropdown_tpl,

   initialize: function (options)
   {
    this.application = options.application;
   },
   
   getContext: function ()
   {
    var options = this.options,
        petType = options.selectedType && _.findWhere(options.petTypes, {id: options.selectedType}),
        petBreeds = petType && petType.breeds,
        manage = options.manage ? options.manage : '';
        
    //@class Address.List.View.Context
    return {
     //@property {Boolean} hasTypeAndBreeds
     hasTypeAndBreeds: !!(petType && petBreeds),
     //@property {String} selectClass
     selectClass: options.cssclass,
     //@property {String} manage
     manage: options.manage,
     //@property {Array} petBreeds
     petBreeds: petBreeds,
     //@property {String} selectedBreed
     selectedBreed: options.selectedBreed
    };
   }
   
  });

 }
);

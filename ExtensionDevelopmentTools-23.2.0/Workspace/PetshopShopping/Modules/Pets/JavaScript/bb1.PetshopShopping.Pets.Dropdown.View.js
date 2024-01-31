// @module bb1.PetshopShopping.Pets
define(
 'bb1.PetshopShopping.Pets.Dropdown.View',
 [
  'bb1_petshopshopping_pets_dropdown.tpl',
  
  'Backbone',
  'underscore'
 ],
 function (
  bb1_petshopshopping_pets_dropdown_tpl,
  
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_pets_dropdown_tpl,

   initialize: function (options)
   {
    this.application = options.application;
   },
   
   getContext: function ()
   {
    var options = this.options;
    
    //@class Pets.Dropdown.View.Context
    return {
     //@property {Backbone.Collection} pets
     pets: options.pets,
     //@property {String} selectedPet
     selectedPet: options.selectedPet
    };
   }
   
   
  });

 }
);

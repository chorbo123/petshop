// @module bb1.PetshopShopping.Breeders
define(
 'bb1.PetshopShopping.Breeders.PetParentFormCell.View',
 [
  'bb1_petshopshopping_breeders_pet_parent_form_cell.tpl',
  
  'Backbone',
  'underscore',
  'Handlebars'
 ],
 function (
  bb1_petshopshopping_breeders_pet_parent_form_cell_tpl,
  
  Backbone,
  _,
  Handlebars
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_breeders_pet_parent_form_cell_tpl,
   
   initialize: function (options)
   {
    this.application = options.application;
    
    Backbone.Validation.bind(this);
   },

   getContext: function ()
   {
    var model = this.model;
    
    //@class bb1.PetshopShopping.Breeders.PetParentFormCell.View.Context
    return {
     //@property {Backbone.Model} petparent
     petparent: model
    };
   }
   
  });

 }
);

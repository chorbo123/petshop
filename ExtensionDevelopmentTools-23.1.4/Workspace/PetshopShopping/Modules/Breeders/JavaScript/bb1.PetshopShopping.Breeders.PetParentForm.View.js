// @module bb1.PetshopShopping.Pets
define(
 'bb1.PetshopShopping.Breeders.PetParentForm.View',
 [
  'bb1.PetshopShopping.Breeders.PetParentFormCell.View',
  
  'bb1_petshopshopping_breeders_pet_parent_form.tpl',
  
  'Backbone.CollectionView',
  'Backbone.CompositeView',
  'Backbone',
  'underscore'
 ],
 function (
  BreedersPetParentFormCellView,
  
  bb1_petshopshopping_breeders_pet_parent_form_tpl,
  
  BackboneCollectionView,
  BackboneCompositeView,
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_breeders_pet_parent_form_tpl,
   
   childViews: {
    
    'PetParent.Cell': function() {
     return new BackboneCollectionView(
     {
      childView: BreedersPetParentFormCellView,
      collection: this.model.get('petparents'),
      viewsPerRow: 1
     });
    }
    
   },
   
   initialize: function (options)
   {
    this.application = options.application;
    
    BackboneCompositeView.add(this);
   },

   getContext: function ()
   {
    var options = this.options || {},
        model = this.model;
    
    //@class Address.List.View.Context
    return {
     //@property {Backbone.Model} litter
     litter: model
    };
   }
   
  });

 }
);

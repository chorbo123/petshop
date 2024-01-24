// @module bb1.PetshopShopping.Pets
define(
 'bb1.PetshopShopping.Pets.List.View',
 [
  'bb1.PetshopShopping.Pets.ListCell.View',
  'GlobalViews.Message.View',
  
  'bb1_petshopshopping_pets_list.tpl',
  
  'Backbone.CollectionView',
  'Backbone.CompositeView',
  'Backbone',
  'underscore'
 ],
 function (
  PetsListCellView,
  GlobalViewsMessageView,
  
  bb1_petshopshopping_pets_list_tpl,
  
  BackboneCollectionView,
  BackboneCompositeView,
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_pets_list_tpl,
   
   page_header: _('My Pets').translate(),
   
   title: _('My Pets').translate(),
   
   attributes: {'class': 'PetListView'},

   initialize: function (options)
   {
    this.application = options.application;
    BackboneCompositeView.add(this);
   },

   childViews: {
    
    'Pets.List': function() {
     return new BackboneCollectionView(
     {
      childView: PetsListCellView,
      collection: this.model.get('pets'),
      viewsPerRow: 1
     });
    }
    
   },
   
   showContent: function ()
   {
    var paths = [
     {
      text: this.page_header,
      href: '/pets'
     }
    ];

    return this.application.getLayout().showContent(this, 'pet_list', paths);
   },
   
   getContext: function ()
   {
    //@class Address.List.View.Context
    return {
     //@property {String} pageHeader
     pageHeader: this.page_header,
     //@property {Boolean} hasPets
     hasPets: this.model.get('pets').length > 0
    };
   }
   
  });

 }
);

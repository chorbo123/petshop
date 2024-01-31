// @module bb1.PetshopShopping.Breeders
define(
 'bb1.PetshopShopping.Breeders.LitterList.View',
 [
  'bb1.PetshopShopping.Breeders.LitterListCell.View',
  'bb1.PetshopShopping.Breeders.Programme.Model',
  'GlobalViews.Message.View',
  
  'bb1_petshopshopping_breeders_litter_list.tpl',
  
  'Backbone.CollectionView',
  'Backbone.CompositeView',
  'Backbone',
  'underscore'
 ],
 function (
  BreedersLitterListCellView,
  BreedersProgrammeModel,
  GlobalViewsMessageView,
  
  bb1_petshopshopping_breeders_litter_list_tpl,
  
  BackboneCollectionView,
  BackboneCompositeView,
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_breeders_litter_list_tpl,
   
   page_header: _('Existing Litters and Owners').translate(),
   
   title: _('Existing Litters and Owners').translate(),
   
   attributes: {'class': 'BreedersLitterListView'},

   initialize: function (options)
   {
    this.application = options.application;    
    this.model = new BreedersProgrammeModel();

    BackboneCompositeView.add(this);
   },

   childViews: {
    
    'Litter.List': function() {
     return new BackboneCollectionView(
     {
      childView: BreedersLitterListCellView,
      collection: this.model.get('litters'),
      viewsPerRow: 1
     });
    }
    
   },
   
   beforeShowContent: function beforeShowContent()
   {
    var self = this,
        promise = jQuery.Deferred(),
        programmeId = this.options.routerArguments[0];

    this.model.fetch({
     data: {
      id: programmeId
     }
    }).done(function() {
     self.menuItem = 'breeder_' + self.model.get('applicationid');
     
     promise.resolve();
    });
    
    return promise;
   },

   showContent2: function ()
   {
    var paths = [
     {
      text: this.page_header,
      href: '/breeders'
     }
    ];

    return this.application.getLayout().showContent(this, this.menuItem, paths);
   },
   
   getContext: function ()
   {
    var applications = this.model.get('applications') || new Backbone.Collection(),
        application = applications.length ? applications.at(0) : null,
        litters = this.model.get('litters') || new Backbone.Collection(),
        cmsSectionId = 'breeders_form_cms_area_top_' + this.options.routerArguments[0].toLowerCase().replace(/-/g, '_');
    
    //@class Address.List.View.Context
    return {
     //@property {String} pageHeader
     pageHeader: this.page_header,
     //@property {Backbone.Model} application
     application: application,
     //@property {String} cmsSectionId
     cmsSectionId: cmsSectionId,
     //@property {Backbone.Collection} litters
     litters: litters,
     //@property {Boolean} hasLitters
     hasLitters: litters.length > 0
    };
   }
   
  });

 }
);

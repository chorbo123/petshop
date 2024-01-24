// @module bb1.PetshopShopping.LoyaltyRewards
define(
 'bb1.PetshopShopping.LoyaltyRewards.List.View',
 [
  'bb1.PetshopShopping.LoyaltyRewards.ListCell.View',
  'GlobalViews.Message.View',
  
  'bb1_petshopshopping_loyaltyrewards_list.tpl',
  
  'Backbone.CollectionView',
  'Backbone.CompositeView',
  'Backbone',
  'underscore'
 ],
 function (
  LoyaltyRewardsListCellView,
  GlobalViewsMessageView,
  
  bb1_petshopshopping_loyaltyrewards_list_tpl,
  
  BackboneCollectionView,
  BackboneCompositeView,
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_loyaltyrewards_list_tpl,
   
   page_header: _('Your Loyalty Stamp Cards - <small>because we love loyalty</small>').translate(),
   
   title: _('Your Loyalty Stamp Cards').translate(),
   
   attributes: {'class': 'LoyaltyRewardsListView'},

   initialize: function (options)
   {
    this.application = options.application;
    BackboneCompositeView.add(this);
   },

   childViews: {
    
    'LoyaltyRewards.ActiveList': function() {
     return new BackboneCollectionView(
     {
      childView: LoyaltyRewardsListCellView,
      collection: this.model.get('cards'),
      viewsPerRow: 2,
      childViewOptions: {
       parentModel: this.model
      }
     });
    },
    
    'LoyaltyRewards.RedeemedList': function() {
     return new BackboneCollectionView(
     {
      childView: LoyaltyRewardsListCellView,
      collection: this.model.get('redeemedCards'),
      viewsPerRow: 2,
      childViewOptions: {
       parentModel: this.model
      }
     });
    }
    
   },
   
   showContent: function ()
   {
    var paths = [
     {
      text: this.page_header,
      href: '/loyalty-rewards'
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
     //@property {Boolean} hasCards
     hasCards: this.model.get('cards').length > 0,
     //@property {Boolean} hasRedeemedCards
     hasRedeemedCards: this.model.get('redeemedCards').length > 0
    };
   }
   
  });

 }
);

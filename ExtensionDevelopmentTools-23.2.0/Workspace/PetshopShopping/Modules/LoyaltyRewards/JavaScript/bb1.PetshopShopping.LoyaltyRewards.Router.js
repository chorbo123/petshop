// @module bb1.PetshopShopping.LoyaltyRewards
define(
 'bb1.PetshopShopping.LoyaltyRewards.Router',
 [
  'bb1.PetshopShopping.LoyaltyRewards.List.View',
  'bb1.PetshopShopping.LoyaltyRewards.QualifyingItems.View',
  'bb1.PetshopShopping.LoyaltyRewards.Model',
  'GlobalViews.Message.View',
  
  'facets_faceted_navigation_item_range_buckets.tpl',
  
  'Backbone',
  'underscore'
 ],
 function (
  LoyaltyRewardsListView,
  LoyaltyRewardsQualifyingItemsView,
  LoyaltyRewardsModel,
  GlobalViewsMessageView,
  
  facets_faceted_navigation_item_range_buckets_tpl,
  
  Backbone,
  _
 )
 {
  'use strict';
  
  return Backbone.Router.extend({
   
   routes: {
    'loyalty-rewards': 'loyaltyRewardsList',
    'loyalty-reward-items/:id': 'loyaltyRewardsItemsList',
    'loyalty-reward-items/:id?params': 'loyaltyRewardsItemsList'
   },
   
   initialize: function (application)
   {
    this.application = application;
   },
   
   loyaltyRewardsList: function (params)
   {
    var options = null;

    if (params)
    {
     options = SC.Utils.parseUrlOptions(params);
    }
    
    var self = this,
        application = this.application,
        model = new LoyaltyRewardsModel(),
        view = new LoyaltyRewardsListView({
         model: model,
         application: this.application,
         urlOptions: options
        });

    model.fetch({
     data: _.extend({}, options),
     killerId: this.application.killerId
    }).then(function (data) {
     view.showContent().then(function (view) {});
    });
   },
   
   loyaltyRewardsItemsList: function (brandUrlValue, params)
   {
    console.log('brandUrlValue');
    console.log(brandUrlValue);
    
    var self = this,
        application = this.application,
        view = new LoyaltyRewardsQualifyingItemsView({
         application: this.application,
         brandUrlValue: brandUrlValue
        });
        
        
    view.translator.parseUrlFacet('Loyalty-Items', 'true');
    view.translator.parseUrlFacet('Brand', brandUrlValue);
    
    view.model.options.data = view.translator.getApiParams();
    
    /*_.extend(view.model.options.data, {
     'Loyalty-Items': true,
     'Brands': brandUrlValue
    });*/
    
    view.beforeShowContent().done(function() {
     view.showContent();
    });
    /*model.fetch({
     data: _.extend({
      'Loyalty-Items': true,
      'Brands': brandUrlValue
     }, options),
     killerId: this.application.killerId
    }).then(function (data) {
     view.showContent().then(function (view) {});
    });*/
   }
   
  });
 }
);

// @module bb1.PetshopShopping.SubscriptionOrders
define(
 'bb1.PetshopShopping.SubscriptionOrders.List.View',
 [
  'bb1.PetshopShopping.SubscriptionOrders.ListCell.View',
  'GlobalViews.Message.View',
  
  'bb1_petshopshopping_subscriptionorder_list.tpl',
  
  'Backbone.CollectionView',
  'Backbone.CompositeView',
  'Backbone',
  'underscore'
 ],
 function (
  SubscriptionOrdersListCellView,
  GlobalViewsMessageView,
  
  bb1_petshopshopping_subscriptionorder_list_tpl,
  
  BackboneCollectionView,
  BackboneCompositeView,
  Backbone,
  _
  )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_subscriptionorder_list_tpl,
   
   page_header: _('Your furbaby\'s goodies:').translate(),
   
   title: _('Your furbaby\'s goodies:').translate(),
   
   attributes: { 'class': 'subscription-orders' },

   initialize: function (options)
   {
    this.application = options.application;
    BackboneCompositeView.add(this);
    
    //var subscriptionOrderSettings = SC.ENVIRONMENT.subscriptionOrderSettings && SC.ENVIRONMENT.subscriptionOrderSettings || {},
        //petNames = subscriptionOrderSettings.petNames;
        
   },

   childViews: {
    
    'SubscriptionOrders.List': function() {
     return new BackboneCollectionView(
     {
      childView: SubscriptionOrdersListCellView,
      collection: this.collection,
      viewsPerRow: 1,
      childViewOptions: {
       application: this.application
      }
     });
    }
    
   },
   
   showContent: function ()
   {
    var paths = [
                 {
                  text: this.page_header,
                  href: '/subscription-orders'
                 }
                ];

    if (this.collection.petNames)
     this.page_header = this.title = _('$(0)\'s goodies:').translate(this.collection.petNames);
    
    return this.application.getLayout().showContent(this, 'subscriptionorders_list', paths);
   },
   
   getContext: function ()
   {
    var subscriptionOrderSettings = SC.ENVIRONMENT.subscriptionOrderSettings && SC.ENVIRONMENT.subscriptionOrderSettings || {},
        petNames = this.collection.petNames || ''; //subscriptionOrderSettings.petNames;
        
    //@class bb1.PetshopShopping.SubscriptionOrders.List.View.Context
    return {
     //@property {String} pageHeader
     pageHeader: this.page_header,
     //@property {Boolean} hasSubscriptionOrders
     hasSubscriptionOrders: this.collection.length > 0,
     //@property {Boolean} showBackToAccount
     showBackToAccount: false,
     //@property {String} petNames
     petNames: petNames
    };
   }
   
  });

 }
);

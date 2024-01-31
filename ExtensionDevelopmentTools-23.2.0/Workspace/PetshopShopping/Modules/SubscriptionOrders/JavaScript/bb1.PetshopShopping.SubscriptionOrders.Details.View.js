// @module bb1.PetshopShopping.SubscriptionOrders
define(
 'bb1.PetshopShopping.SubscriptionOrders.Details.View',
 [
  'bb1.PetshopShopping.SubscriptionOrders.List.View',
  
  'bb1_petshopshopping_subscriptionorder_details.tpl',
  
  'Backbone.CompositeView',
  'Backbone',
  'underscore'
 ],
 function (
  SubscriptionOrdersListView,
  
  bb1_petshopshopping_subscriptionorder_details_tpl,
  
  BackboneCompositeView,
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_subscriptionorder_details_tpl,
   
   page_header: _('View Your Subscribe & Save Order').translate(),
   
   title: _('View Your Subscribe & Save Order').translate(),
   
   attributes: { 'class': 'subscription-orders-details-view' },
   
   menuItem: 'subscription_orders',
   
   initialize: function (options)
   {
    this.application = options.application;
   },

   showContent: function ()
   {
    var paths = [
                 {
                  text: SubscriptionOrdersListView.prototype.page_header,
                  href: '/subscription-orders'
                 },
                 {
                  text: this.page_header,
                  href: '/subscription-orders/view'
                 }
                ];

    return this.application.getLayout();
   },

   getContext: function ()
   {
    var options = this.options || {},
        model = this.model,
        manage = options.manage ? options.manage + '-' : '',
        itemDetails = model.get('item_details');
        
    //@class bb1.PetshopShopping.SubscriptionOrders.Details.View.Context
    return {
     //@property {String} pageHeader
     pageHeader: this.page_header,
     //@property {Backbone.Model} item
     item: model,
     //@property {Backbone.Model} itemDetails
     itemDetails: itemDetails,
     //@property {Boolean} inModal
     isInModal: false
    };
   }
   
  });

 }
);

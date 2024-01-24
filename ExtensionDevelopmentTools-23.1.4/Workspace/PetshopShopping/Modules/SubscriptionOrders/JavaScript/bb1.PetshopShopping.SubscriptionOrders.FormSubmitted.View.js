// @module bb1.PetshopShopping.SubscriptionOrders
define(
 'bb1.PetshopShopping.SubscriptionOrders.FormSubmitted.View',
 [
  'bb1.PetshopShopping.SubscriptionOrders.List.View',
  'GlobalViews.Message.View',
  
  'bb1_petshopshopping_subscriptionorder_form_submitted.tpl',
  
  'Backbone',
  'underscore'
 ],
 function (
  SubscriptionOrdersListView,
  GlobalViewsMessageView,
  
  bb1_petshopshopping_subscriptionorder_form_submitted_tpl,
  
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_subscriptionorder_form_submitted_tpl,
   page_header: _('Updated Your Subscription Order').translate(),
   title: _('Updated Your Subscription Order').translate(),
   attributes: { 'class': 'subscription-orders-form-confirmation' },

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
                  href: '/subscription-orders/added'
                 }
                ];

    return showContent.call(this, 'subscriptionorder_details', paths);
   },
   
   getContext: function ()
   {
    //@class bb1.PetshopShopping.SubscriptionOrders.FormSubmitted.View.Context
    return {
     //@property {String} pageHeader
     pageHeader: this.page_header
    };
   }
   
  });

 }
);

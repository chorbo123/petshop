// @module bb1.PetshopShopping.SubscriptionOrders
define(
 'bb1.PetshopShopping.SubscriptionOrders',
 [
  'bb1.PetshopShopping.SubscriptionOrders.Model',
  'bb1.PetshopShopping.SubscriptionOrders.Router',
  'bb1.PetshopShopping.SubscriptionOrders.Collection'
 ],
 function (
  SubscriptionOrdersModel,
  SubscriptionOrdersRouter,
  SubscriptionOrdersCollection
 )
 {
  'use strict';
  
  return {
   
   Model: SubscriptionOrdersModel,
   
   Router: SubscriptionOrdersRouter,
   
   Collection: SubscriptionOrdersCollection,
   
   mountToApp: function (application)
   {
    var myAccountMenu = application.getComponent('MyAccountMenu');
    
    if (myAccountMenu) {
     myAccountMenu.addGroup({
      id: 'subscriptions',
      name: _('Your Bottomless Bowl').translate(),
      index: 2
     });
     myAccountMenu.addGroupEntry({
      groupid: 'subscriptions',
      id: 'subscription_orders',
      name: _('Manage Bottomless Bowl').translate(),
      url: 'subscription-orders',
      index: 1
     });
     myAccountMenu.addGroupEntry({
      groupid: 'subscriptions',
      id: 'new_subscription',
      name: _('Set Up Bottomless Bowl').translate(),
      url: 'subscription-orders/new',
      index: 2
     });
    }
    
    // Initializes the router
    return new SubscriptionOrdersRouter(application);
   }
   
  };
 }
);

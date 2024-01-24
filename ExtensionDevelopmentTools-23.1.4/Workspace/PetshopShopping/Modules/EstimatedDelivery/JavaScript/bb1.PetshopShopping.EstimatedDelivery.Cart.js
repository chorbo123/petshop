//@module bb1.PetshopShopping.EstimatedDelivery
define(
 'bb1.PetshopShopping.EstimatedDelivery.Cart',
 [
  'bb1.PetshopShopping.EstimatedDelivery.ItemKeyMapping',
  'bb1.PetshopShopping.EstimatedDelivery.Utils',
  'bb1.PetshopShopping.EstimatedDelivery.Cart.Stock.View',
  'Cart.Detailed.View',
  'Cart.Lines.View',
  'LiveOrder.Model',
  'Profile.Model',
  'SC.Configuration',
 
  'Backbone.CollectionView',
  'Backbone',
  'underscore'
 ],
 function (
  EstimatedDeliveryItemKeyMapping,
  EstimatedDeliveryUtils,
  EstimatedDeliveryCartStockView,
  CartDetailedView,
  CartLinesView,
  LiveOrderModel,
  ProfileModel,
  Configuration,
  
  BackboneCollectionView,
  Backbone,
  _
 )
 {
  'use strict';
  
  var estimatedDeliveryConfig = Configuration.get('estimatedDelivery');
   
  if (estimatedDeliveryConfig.enabled) {
    
   CartDetailedView.prototype.getContext = _.wrap(CartDetailedView.prototype.getContext, function(originalGetContext) {

    var context = originalGetContext.apply(this, _.rest(arguments));
    var expressDeliveryDetailsForCart = EstimatedDeliveryUtils.getExpressDeliveryDetailsForCart();
    var expressDeliveryDateForCartFormatted = EstimatedDeliveryUtils.formatDeliveryDate(expressDeliveryDetailsForCart.expressDeliveryDate);
    var allCartItemsHaveSameExpressDeliveryDateMessage = estimatedDeliveryConfig.allCartItemsHaveSameExpressDeliveryDateMessage || '<p>We love our environment ☺ To help reduce our carbon footprint, all items for your order are shipped together.</p><p>With our free standard delivery your order will arrive in 3-5 days. If you would like to receive $(0) upgrade for £1.99 at checkout.</p>';
    var cartItemsHaveDifferentExpressDeliveryDateMessage = estimatedDeliveryConfig.cartItemsHaveDifferentExpressDeliveryDateMessage || '<p>We love our environment ☺ To help reduce our carbon footprint, all items for your order are shipped together.</p><p>With our free standard delivery your order will arrive in 3-5 days. If you would like to receive $(0) upgrade for £1.99 at checkout & remove non eligible items from cart below.</p>';
    var someCartItemsOutOfStockMessage = estimatedDeliveryConfig.someCartItemsOutOfStockMessage || '<p>We love our environment ☺ To help reduce our Carbon footprint, all items for your order are shipped together.</p><p>Your order will be sent out as soon as your “Just sold out” product is back in stock. If you would like to receive $(0) upgrade for £1.99 at checkout & remove non eligible items from cart below.</p>';
    var allCartItemsOutOfStockMessage = estimatedDeliveryConfig.allCartItemsOutOfStockMessage || '<p>We love our environment ☺ To help reduce our Carbon footprint, all items for your order are shipped together.</p><p>Your order will be sent out once your products are back in stock.</p>';
    
    if (expressDeliveryDetailsForCart.allCartItemsOutOfStock)
     context.expressDeliveryMessage = _(allCartItemsOutOfStockMessage).translate();
    else if (expressDeliveryDetailsForCart.someCartItemsOutOfStock && expressDeliveryDateForCartFormatted)
     context.expressDeliveryMessage = _(someCartItemsOutOfStockMessage).translate(expressDeliveryDateForCartFormatted);
    else if (expressDeliveryDetailsForCart.allCartItemsHaveSameExpressDeliveryDate && expressDeliveryDateForCartFormatted)
     context.expressDeliveryMessage = _(allCartItemsHaveSameExpressDeliveryDateMessage).translate(expressDeliveryDateForCartFormatted);
    else if (expressDeliveryDateForCartFormatted)
     context.expressDeliveryMessage = _(cartItemsHaveDifferentExpressDeliveryDateMessage).translate(expressDeliveryDateForCartFormatted);
    
    return context;
    
   });
   
   _.extend(CartLinesView.prototype.childViews, {
    
    'Product.Stock.Info': function ()
    {
     return new EstimatedDeliveryCartStockView({
      model: this.model
     });
    }
    
   });
   
  }
   
 }
);

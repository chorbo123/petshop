//@module bb1.PetshopShopping.EstimatedDelivery
define(
 'bb1.PetshopShopping.EstimatedDelivery.Checkout',
 [
  'bb1.PetshopShopping.EstimatedDelivery.ItemKeyMapping',
  'bb1.PetshopShopping.EstimatedDelivery.Utils',
  'OrderWizard.Module.Shipmethod',
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
  OrderWizardModuleShipmethod,
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
    
   OrderWizardModuleShipmethod.prototype.getContext = _.wrap(OrderWizardModuleShipmethod.prototype.getContext, function(originalGetContext) {
   
    var context = originalGetContext.apply(this, _.rest(arguments));
    //console.log('OrderWizardModuleShipmethod.prototype.getContext');
    
    var cartStockStatus = EstimatedDeliveryUtils.getCartStockStatus();
    
    //console.log('cartStockStatus 2222');
    //console.log(cartStockStatus);
    
    var inventoryLocation = cartStockStatus == 'Backordered' ? 'No Stock Required' : cartStockStatus;
    
    context.shippingMethods = _.sortBy(_.each(context.shippingMethods, function(shippingMethod) {
     //console.log('EstimatedDeliveryUtils.getEstimatedDeliveryFormatted11111111111111111');
     shippingMethod.estimatedDeliveryMessage = EstimatedDeliveryUtils.getEstimatedDeliveryFormatted(shippingMethod);
     //console.log('shippingMethod.estimatedDeliveryMessage');
     //console.log(shippingMethod.estimatedDeliveryMessage);
    }), function(shippingMethod) {
     var shippingMethodConfig = shippingMethod.internalid && _.findWhere(estimatedDeliveryConfig.shippingMethods, {internalid: parseInt(shippingMethod.internalid), inventoryLocation: inventoryLocation});
       
     if (!shippingMethodConfig && shippingMethod.internalid) {
      if (cartStockStatus == 'Local Warehouse')
       shippingMethodConfig = _.findWhere(estimatedDeliveryConfig.shippingMethods, {internalid: parseInt(shippingMethod.internalid), inventoryLocation: 'Preferred Supplier Warehouse'});
      else if (cartStockStatus == 'Preferred Supplier Warehouse')
       shippingMethodConfig = _.findWhere(estimatedDeliveryConfig.shippingMethods, {internalid: parseInt(shippingMethod.internalid), inventoryLocation: 'No Stock Required'});
      else
       shippingMethodConfig = _.findWhere(estimatedDeliveryConfig.shippingMethods, {internalid: parseInt(shippingMethod.internalid)});
     }
     
     console.log('shippingMethodConfig.priority');
     console.log(shippingMethodConfig && shippingMethodConfig.priority);
     console.log(shippingMethodConfig && shippingMethod.internalid);
     console.log(inventoryLocation);
     return shippingMethodConfig && parseFloat(shippingMethodConfig.priority, 10) || Infinity;
    });
    //console.log(context);
    return context;
    
   });
   
  }
   
 }
);

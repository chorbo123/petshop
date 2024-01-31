//@module bb1.PetshopShopping.EstimatedDelivery
define(
 'bb1.PetshopShopping.EstimatedDelivery.ItemKeyMapping',
 [
  'bb1.PetshopShopping.EstimatedDelivery.Utils',
  'Item.KeyMapping',
  'Product.Model',
  'LiveOrder.Model',
  'SC.Configuration',
  
  'Utils',
  'underscore'
 ],
 function (
  EstimatedDeliveryUtils,
  ItemKeyMapping,
  ProductModel,
  LiveOrderModel,
  Configuration,
  
  Utils,
  _
 )
 {
  'use strict';
  
  function getEstimateDelivery(item, includeCartItems)
  {
   var estimatedDeliveryConfig = Configuration.get('estimatedDelivery'),
       warehouseMinStockLevel = estimatedDeliveryConfig.warehouseMinStockLevel,
       supplierWarehouseMinStockLevel = estimatedDeliveryConfig.supplierWarehouseMinStockLevel;
       
       //console.log('estimatedDeliveryConfig 2222222222222');
       //console.log(estimatedDeliveryConfig);
   if (!estimatedDeliveryConfig.enabled) return;
   
   //var warehouseAvailable = item.get('quantityavailable'); // TODO: Should be using quantityavailabledetail
   var quantityAvailableDetail = item.get('quantityavailable_detail') || {},
       warehouseAvailable = (_.findWhere(quantityAvailableDetail.locations, {internalid: 6}) || {}).quantityavailable || 0,
       phWarehouseAvailable = (_.findWhere(quantityAvailableDetail.locations, {internalid: 7}) || {}).quantityavailable || 0;
   var supplierQuantityAvailable = item.get('custitem_bb1_supplier_stock');
   var cartStockStatus = includeCartItems ? EstimatedDeliveryUtils.getCartStockStatus(item) : EstimatedDeliveryUtils.getItemStockStatus(item);
   var beforeDeliveryCutoff = EstimatedDeliveryUtils.isBeforeDeliveryCutoff();
   var supplierDeliveryCutoff = EstimatedDeliveryUtils.getSupplierDeliveryCutoff(item);
   var beforeSupplierDeliveryCutoff = EstimatedDeliveryUtils.isBeforeSupplierDeliveryCutoff(item);
   var expressDeliveryDetails = {
    nextDayAvailable: false,
    twoDayAvailable: false,
    beforeDeliveryCutoff: beforeDeliveryCutoff,
    beforeSupplierDeliveryCutoff: beforeSupplierDeliveryCutoff,
    supplierDeliveryCutoff: supplierDeliveryCutoff,
    warehouseStock: false
   };
    
    //console.log('supplierDeliveryCutoff');
    //console.log(supplierDeliveryCutoff);
    //console.log('cartStockStatus 2222111');
    //console.log(cartStockStatus);
    //console.log(warehouseAvailable);
    
   var today = EstimatedDeliveryUtils.toUKDateTime(new Date),
     dateStockExpected = item.get('custitem_bb1_datestockexpected'),
     dateStockExpectedDate = dateStockExpected && _.stringToDate(dateStockExpected, {format: 'dd-MM-YYYY', dateSplitCharacter: '/'}),
     daysUntilStockArrives = dateStockExpectedDate && Math.ceil((dateStockExpectedDate.getTime() - today.getTime()) / 86400000) || 0;
      
  //console.log('dateStockExpected');
  //console.log(dateStockExpected);
  //console.log('dateStockExpectedDate');
  //console.log(dateStockExpectedDate);
  //console.log('daysUntilStockArrives');
  //console.log(daysUntilStockArrives);
  
   if (warehouseAvailable >= warehouseMinStockLevel) {
    if (cartStockStatus == 'Local Warehouse') {
     expressDeliveryDetails.nextDayAvailable = beforeDeliveryCutoff;
     expressDeliveryDetails.twoDayAvailable = !beforeDeliveryCutoff;
     expressDeliveryDetails.warehouseStock = true;
    }
    else if (cartStockStatus == 'Preferred Supplier Warehouse') {
     expressDeliveryDetails.twoDayAvailable = true;
     //expressDeliveryDetails.warehouseStock = true;
    }
   }
   
   if (estimatedDeliveryConfig.preferredSupplierEnabled && beforeSupplierDeliveryCutoff && supplierQuantityAvailable >= supplierWarehouseMinStockLevel && ['Local Warehouse','Preferred Supplier Warehouse'].indexOf(cartStockStatus) != -1) {
   //if (cartStockStatus == 'Preferred Supplier Warehouse') {
    expressDeliveryDetails.twoDayAvailable = true;
   }
   
  if (estimatedDeliveryConfig.poExpectedDateEnabled && !expressDeliveryDetails.nextDayAvailable && !expressDeliveryDetails.twoDayAvailable && daysUntilStockArrives >= 0 && daysUntilStockArrives <= 2) {
   //var estimatedDeliveryDate = EstimatedDeliveryUtils.addWorkingDays(dateStockExpectedDate, 3);
   //expressDeliveryDetails.estimatedDeliveryDate = _.stringToDate(estimatedDeliveryDate, {format: 'dd-MM-YYYY', dateSplitCharacter: '/'});
   expressDeliveryDetails.expectedDeliveryDate = dateStockExpectedDate; //_('$(0)/$(1)/$(2)').translate(estimatedDeliveryDate.getDate(), estimatedDeliveryDate.getMonth()+1, estimatedDeliveryDate.getFullYear());
  }
  
    //console.log('expressDeliveryDetails');
    //console.log(expressDeliveryDetails);
    //console.log(item.get('_sku'));
  
  
   ////
   var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
       deliveryCutoffTime = expressDeliveryDetails.warehouseStock ? estimatedDeliveryConfig.deliveryCutoffTime : expressDeliveryDetails.supplierDeliveryCutoff || estimatedDeliveryConfig.deliveryCutoffTime,
       todaysDate = EstimatedDeliveryUtils.toUKDateTime(new Date()),
       beforeDeliveryCutoff = todaysDate.getHours() < deliveryCutoffTime,
       //currentDay = (todaysDate.getDay() + (beforeDeliveryCutoff ? 0 : 1)) % 7,
       isWeekend = todaysDate.getDay() == 0 || todaysDate.getDay() == 6,
       cutoffDate = EstimatedDeliveryUtils.nextDeliveryCutoffDate(todaysDate, deliveryCutoffTime), //new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate() + (beforeDeliveryCutoff ? 0 : 1) + (currentDay == 0 ? 1 : currentDay == 6 ? 2 : 0), deliveryCutoffTime, 0, 0),
       deliveryDate,
       deliveryCutoffCountdown = EstimatedDeliveryUtils.dateDifferenceFormatted(todaysDate, cutoffDate); //'1hr 30min 10 secs';
       
   //console.log('expressDeliveryDetails');
   //console.log(expressDeliveryDetails);
   //console.log('deliveryCutoffTime');
   //console.log(deliveryCutoffTime);
   if (expressDeliveryDetails.nextDayAvailable || expressDeliveryDetails.twoDayAvailable) {
    deliveryDate = EstimatedDeliveryUtils.addWorkingDays(cutoffDate, expressDeliveryDetails.warehouseStock ? 1 : 2, expressDeliveryDetails.warehouseStock && beforeDeliveryCutoff); // deliveryDate.setDate(deliveryDate.getDate() + (expressDelivery.warehouseStock ? 1 : 2));
   }
   else if (expressDeliveryDetails.expectedDeliveryDate) {
    deliveryDate = EstimatedDeliveryUtils.addWorkingDays(expressDeliveryDetails.expectedDeliveryDate, 3);
   }
   
   if (deliveryDate) {
    var deliveryDayName = deliveryDate.getDate() - 1 == todaysDate.getDate() ? 'Tomorrow' : daysOfWeek[deliveryDate.getDay()];
    //console.log(deliveryDayName);
    
    expressDeliveryDetails.cutoffDate = cutoffDate;
    expressDeliveryDetails.beforeDeliveryCutoff = beforeDeliveryCutoff;
    expressDeliveryDetails.isWeekend = isWeekend;
    expressDeliveryDetails.deliveryDayName = deliveryDayName;
    expressDeliveryDetails.deliveryDate = deliveryDate;
    expressDeliveryDetails.deliveryCutoffCountdown = deliveryCutoffCountdown;
   }
   
   var estimatedDaysForStandardDelivery = estimatedDeliveryConfig.estimatedDaysForStandardDelivery || 4,
       standardDeliveryCutoffTime = estimatedDeliveryConfig.deliveryCutoffTime || 4,
       standardDeliveryCutoffDate = EstimatedDeliveryUtils.nextDeliveryCutoffDate(todaysDate, standardDeliveryCutoffTime),
       standardDeliveryDate = EstimatedDeliveryUtils.addWorkingDays(standardDeliveryCutoffDate, estimatedDaysForStandardDelivery),
       standardDeliveryDateFormatted = EstimatedDeliveryUtils.formatDeliveryDate(standardDeliveryDate),
       standardDeliveryDayName = standardDeliveryDate.getDate() - 1 == todaysDate.getDate() ? 'Tomorrow' : daysOfWeek[standardDeliveryDate.getDay()];
    
   expressDeliveryDetails.standardDeliveryDate = standardDeliveryDate;
   expressDeliveryDetails.standardDeliveryDateFormatted = standardDeliveryDateFormatted;
   expressDeliveryDetails.standardDeliveryDayName = standardDeliveryDayName;
   
   return expressDeliveryDetails;
  };
    
  ItemKeyMapping.getKeyMapping = _.wrap(ItemKeyMapping.getKeyMapping, function(originalGetKeyMapping) {
   
   var keyMapping = originalGetKeyMapping.apply(this, _.rest(arguments));
   
   _.extend(keyMapping, {
    
    _expressDelivery: function (item)
    {
     return getEstimateDelivery(item);
    },

    _expressDeliveryOnCartItems: function (item)
    {
     return getEstimateDelivery(item, true);
    }

   });
   
   return keyMapping;
   
  });
  
 }
);

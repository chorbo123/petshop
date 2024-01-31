//@module bb1.PetshopShopping.EstimatedDelivery
define(
 'bb1.PetshopShopping.EstimatedDelivery.Utils',
 [
  'LiveOrder.Model',
  'SC.Configuration',
 
  'Backbone.CollectionView',
  'Backbone',
  'underscore'
 ],
 function (
  LiveOrderModel,
  Configuration,
  
  BackboneCollectionView,
  Backbone,
  _
 )
 {
  'use strict';
   
  function getNumberWithOrdinal(number) {
   var suffix = ["th", "st", "nd", "rd"],
       value = number % 100;

   return number + (suffix[(value - 20) % 10] || suffix[value] || suffix[0]);
  }
  
  function toUKDateTime(date) {
   var bstStartDate = new Date(Date.UTC(date.getFullYear(), 2, 31, 1, 0, 0)),
       bstEndDate = new Date(Date.UTC(date.getFullYear(), 9, 31, 1, 0, 0)),
       ukDateTime = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
      
   bstStartDate.setDate(bstStartDate.getDate() - bstStartDate.getDay());
   bstEndDate.setDate(bstEndDate.getDate() - bstEndDate.getDay());

   if (bstStartDate.getTime() <= date.getTime() && date.getTime() < bstEndDate.getTime())
    ukDateTime.setHours(ukDateTime.getHours() + 1);

   return ukDateTime; //new Date(2020, 9, 27, 14, 2, 1);
  }

  function isBeforeDeliveryCutoff(date) {
   date = date || toUKDateTime(new Date());
   
   var estimatedDeliveryConfig = Configuration.get('estimatedDelivery');
   var deliveryCutoffTime = estimatedDeliveryConfig.deliveryCutoffTime;
   
   return date.getHours() < deliveryCutoffTime; 
  }
  
  function isBeforeSupplierDeliveryCutoff(item, date) {
   
   date = date || toUKDateTime(new Date());
   
   var deliveryCutoffTime = getSupplierDeliveryCutoff(item, date);
   
   return date.getHours() < deliveryCutoffTime; 
  }
  
  function getSupplierDeliveryCutoff(item) {
   
   var estimatedDeliveryConfig = Configuration.get('estimatedDelivery');
   var deliveryCutoffTime = estimatedDeliveryConfig.deliveryCutoffTime;
   
   if (item) {
    var suppliers = estimatedDeliveryConfig.suppliers;
    var supplierId = parseInt(item.get('vendor') || item.get('custitem_bb1_preferredsupplier'));
    
    //console.log('preferred supplier id');
    //console.log(supplierId);
    //console.log(suppliers);
    
    if (supplierId) {
    
     var supplier = _.findWhere(suppliers, {internalid: supplierId}) || {};
     
     if (supplier.deliveryCutoffTime) deliveryCutoffTime = supplier.deliveryCutoffTime;
     
     //console.log('supplier');
     //console.log(supplier);
    }
   }
   
   //console.log('deliveryCutoffTime');
   //console.log(deliveryCutoffTime);
   
   return deliveryCutoffTime; 
  }
  
  function getCartStockStatus(item) {
   
   //console.log('getCartStockStatusgetCartStockStatus');
   //console.log(item);
   var estimatedDeliveryConfig = Configuration.get('estimatedDelivery') || {},
       cart = LiveOrderModel.getInstance(),
       itemId = item && item.get('internalid') || '',
       itemQuantity = item && item.get('quantity') || 1,
       itemQuantities = {};
       
   if (!estimatedDeliveryConfig.enabled) return;
   
   //console.log(item && item.get('quantity'));
   //console.log(itemQuantity);
   //console.log(item);
   if (itemId)
    itemQuantities[itemId] = itemQuantity;
   
    //console.log('itemQuantities');
    //console.log(_.extend({}, itemQuantities));
   var status = 'Local Warehouse';
   
   if (item)
    status = getItemStockStatus(item, itemQuantity, 'Local Warehouse');
   
    //console.log('status');
    //console.log(status);
    //console.log(cart.get('lines').length);
   return cart.get('lines').reduce(function(status, line) {
    var item = line.get('item'),
        itemId = item.get('internalid'),
        lineQuantity = line.get('quantity') || 1;
    
//console.log('item');    
//console.log(item);    
//console.log(itemId);    
//console.log(lineQuantity);    
    //console.log('itemQuantities11');
    //console.log(_.extend({}, itemQuantities));
    if (!itemQuantities[itemId])
     itemQuantities[itemId] = 0;
    
    itemQuantities[itemId] += lineQuantity;
    //console.log('itemQuantities');
    //console.log(_.extend({}, itemQuantities));
    return getItemStockStatus(item, itemQuantities[itemId], status);
   }, status);
  }
  
  function getDeliveryCutoffForCartItems() {
   
   var estimatedDeliveryConfig = Configuration.get('estimatedDelivery') || {},
       cart = LiveOrderModel.getInstance();
       
   if (!estimatedDeliveryConfig.enabled) return;
   
   var cutoffHour = estimatedDeliveryConfig.deliveryCutoffTime;
   
   return cart.get('lines').reduce(function(cutoffHour, line) {
    var item = line.get('item');
    var quantityAvailableDetail = item.get('quantityavailable_detail') || {};
    var warehouseAvailable = (_.findWhere(quantityAvailableDetail.locations, {internalid: 6}) || {}).quantityavailable || 0;
    var cartStockStatus = getCartStockStatus(item);
    var supplierDeliveryCutoff = getSupplierDeliveryCutoff(item);
    var warehouseStock = false;
   
    if (warehouseAvailable >= estimatedDeliveryConfig.warehouseMinStockLevel && cartStockStatus == 'Local Warehouse')
     warehouseStock = true;
    
    var lineCutoffHour = warehouseStock ? estimatedDeliveryConfig.deliveryCutoffTime : supplierDeliveryCutoff || estimatedDeliveryConfig.deliveryCutoffTime;
        
         
    return Math.min(lineCutoffHour, cutoffHour);
   }, cutoffHour);
  }
  
  function getItemStockStatus(item, quantity, status) {
   
   status = status || 'Local Warehouse';
   
   if (!item || !item.get('internalid')) return status;
   //console.log('getItemStockStatus')
   //console.log(item)
   
   quantity = quantity || item.get('quantity') || 1;
   
   var estimatedDeliveryConfig = Configuration.get('estimatedDelivery') || {},
       warehouseMinStockLevel = estimatedDeliveryConfig.warehouseMinStockLevel,
       supplierWarehouseMinStockLevel = estimatedDeliveryConfig.supplierWarehouseMinStockLevel,
       itemId = item.get('internalid'),
       quantityAvailableDetail = item.get('quantityavailable_detail') || {},
       supplierQuantityAvailable = item.get('custitem_bb1_supplier_stock'),
       warehouseAvailable = (_.findWhere(quantityAvailableDetail.locations, {internalid: 6}) || {}).quantityavailable || 0,
       phWarehouseAvailable = (_.findWhere(quantityAvailableDetail.locations, {internalid: 7}) || {}).quantityavailable || 0,
       today = toUKDateTime(new Date),
       dateStockExpected = item.get('custitem_bb1_datestockexpected'),
       dateStockExpectedDate = dateStockExpected && _.stringToDate(dateStockExpected, {format: 'dd-MM-YYYY', dateSplitCharacter: '/'}),
       daysUntilStockArrives = dateStockExpectedDate && Math.ceil((dateStockExpectedDate.getTime() - today.getTime()) / 86400000) || 0;
        
    //console.log('warehouseAvailable');
    //console.log(supplierQuantityAvailable);
    //console.log(quantity);
    //console.log(warehouseAvailable);
    //console.log(warehouseMinStockLevel);
    //console.log(warehouseMinStockLevel + quantity <= warehouseAvailable);
    
    //if (warehouseAvailable == 0 && supplierQuantityAvailable == 0 && daysUntilStockArrives > 0 && daysUntilStockArrives <= 2)
    // warehouseAvailable = 20;
    
    //console.log('warehouseAvailable');
    //console.log(warehouseAvailable);
    
    if (status == 'Local Warehouse') {
     if ((warehouseMinStockLevel + quantity <= warehouseAvailable))// ||
          //((!estimatedDeliveryConfig.preferredSupplierEnabled || supplierWarehouseMinStockLevel + quantity > supplierQuantityAvailable)  && daysUntilStockArrives > 0 && daysUntilStockArrives <= 2))
      return status;
     else if (estimatedDeliveryConfig.preferredSupplierEnabled)
      status = 'Preferred Supplier Warehouse';
     else
      status = 'Backordered';
    }
    
    if (status == 'Preferred Supplier Warehouse') {
     if ((isBeforeSupplierDeliveryCutoff(item, today) && supplierWarehouseMinStockLevel + quantity <= supplierQuantityAvailable) || (warehouseMinStockLevel + quantity <= warehouseAvailable))
      return status;
     else
      status = 'Backordered';
    }
    
    return status;
  }
  
  function getEstimatedDeliveryFormatted(shippingMethod, item) {
   
   var estimatedDeliveryConfig = Configuration.get('estimatedDelivery');
   
   if (!estimatedDeliveryConfig || !shippingMethod) return;
   
   var cartStockStatus = getCartStockStatus(item);
   
   //console.log('cartStockStatus');
   //console.log(cartStockStatus);
   
   var inventoryLocation = cartStockStatus == 'Backordered' ? 'No Stock Required' : cartStockStatus;
   var shippingMethodConfig = _.findWhere(estimatedDeliveryConfig.shippingMethods, {internalid: parseInt(shippingMethod.internalid), inventoryLocation: inventoryLocation});
   
   if (!shippingMethodConfig && cartStockStatus == 'Local Warehouse') {
    shippingMethodConfig = _.findWhere(estimatedDeliveryConfig.shippingMethods, {internalid: parseInt(shippingMethod.internalid), inventoryLocation: 'Preferred Supplier Warehouse'});
   }
   
   if (!shippingMethodConfig) {
    shippingMethodConfig = _.findWhere(estimatedDeliveryConfig.shippingMethods, {internalid: parseInt(shippingMethod.internalid), inventoryLocation: 'No Stock Required'});
   }
    
   if (!shippingMethodConfig) return;
  
   //console.log(shippingMethodConfig.inventoryLocation);
   
   //if ((shippingMethodConfig.inventoryLocation == 'Local Warehouse' && cartStockStatus != 'Local Warehouse') ||
   //    (shippingMethodConfig.inventoryLocation == 'Preferred Supplier Warehouse' && ['Local Warehouse', 'Preferred Supplier Warehouse'].indexOf(cartStockStatus) == -1)) return;
   
   // get stock status of cart items
   var todaysDate = toUKDateTime(new Date()),
       tomorrowsDate = new Date(todaysDate.getTime()),
       deliveryCutoffTime = getDeliveryCutoffForCartItems(item),
       estimatedDeliveryInDays = shippingMethodConfig.estimatedDeliveryInDays,
       cutoffDate = nextDeliveryCutoffDate(todaysDate, deliveryCutoffTime),
       deliveryDate = addWorkingDays(cutoffDate, estimatedDeliveryInDays, shippingMethodConfig.saturdayShipping); //TODO: is this correct? deliveyr on sat but don't include otherwise // handled further down
   
   tomorrowsDate.setDate(tomorrowsDate.getDate() + 1);
   
   if (shippingMethodConfig.saturdayShipping && deliveryDate.getDay() != 6)
    deliveryDate.setDate(deliveryDate.getDate() + (6 - deliveryDate.getDay()))
   
   if (deliveryDate.getDate() == tomorrowsDate.getDate() && deliveryDate.getMonth() == tomorrowsDate.getMonth() && deliveryDate.getFullYear() == tomorrowsDate.getFullYear()) {
    var deliveryDateFormatted = _('Get it Tomorrow').translate();
   }
   else {
    var deliveryDateFormatted = _('Get it by $(0)').translate(formatDeliveryDate(deliveryDate));
   }
   
   return deliveryDateFormatted; 
  }
  
  function dateDifferenceFormatted(startDate, endDate) {
   var delta = (endDate.getTime() - startDate.getTime()) / 1000;
   
   if (delta < 0) return;

   // calculate (and subtract) whole days
   var days = Math.floor(delta / 86400);
   delta -= days * 86400;

   // calculate (and subtract) whole hours
   var hours = Math.floor(delta / 3600) % 24;
   delta -= hours * 3600;

   // calculate (and subtract) whole minutes
   var minutes = Math.floor(delta / 60) % 60;
   delta -= minutes * 60;

   // what's left is seconds
   var seconds = Math.round(delta % 60);
   
   return ((days > 1 ? days + ' days ' : days ? days + ' day ' : '') + (hours > 1 ? hours + 'hrs ' : hours ? hours + 'hr ' : '') + (minutes > 1 ? minutes + 'mins ' : minutes ? minutes + 'min ' : '') + (hours < 3 && days == 0 ? (seconds > 1 ? seconds + 'secs' : seconds ? seconds + 'sec' : '') : '')).trim();
  }
  
  function isHoliday(date) {
   
   if (!date) return false;
   
   var dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
   var holidays = Configuration.get('estimatedDelivery.holidays') || [];
   
   //console.log('holidays');
   //console.log(holidays);
   
   return !!_.find(holidays, function(holiday) {
    if (!holiday || !holiday.date)
     return false;
    
    var holidayDate = _.stringToDate(holiday.date, {format: 'dd-MM-YYYY', dateSplitCharacter: '/'});
    //console.log('holidayDate');
   //console.log(holidayDate);
   //console.log(dateOnly.getTime() == holidayDate.getTime());
    return dateOnly.getTime() == holidayDate.getTime();
   });
  }
  
  function nextDeliveryCutoffDate(startDate, deliveryCutoffTime) {
   
   var date = new Date(startDate),
       days = 0;
   
   date.setMinutes(0);
   date.setSeconds(0);
   date.setMilliseconds(0);
   
   if (startDate.getHours() >= deliveryCutoffTime)
    days++;
   
   if (deliveryCutoffTime >= 0)
    date.setHours(deliveryCutoffTime);
   
   //console.log('deliveryCutoffTime');
   //console.log(deliveryCutoffTime);
   //console.log('days');
   //console.log(days);
   
   while (days > 0 || date.getDay() == 0 || date.getDay() == 6 || isHoliday(date)) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() != 0 && date.getDay() != 6 && !isHoliday(date)) {
     days--;
    }
   }
   
   return date;
  }

  function addWorkingDays(startDate, days, saturdayDeliveryPossible) { // canEndOnSaturdayOnly
   var date = new Date(startDate);
   
   while (days > 0) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() != 0 && ((saturdayDeliveryPossible && days == 1) || date.getDay() != 6) && !isHoliday(date)) {
     days--;
    }
   }
   
   return date;
  }

  function addWorkDays2(startDate, days) {
   
    var isAddingDays = (days > 0);
    var isDaysToAddMoreThanWeek = (days > 5 || days < -5);

    if (isNaN(days)) {
        console.log("Value provided for \"days\" was not a number");
        return
    }
    if (!(startDate instanceof Date)) {
        console.log("Value provided for \"startDate\" was not a Date object");
        return
    }
    var newDate = new Date(startDate);
    var dow = startDate.getDay();
    var daysToAdd = parseInt(days);

    if ((dow === 0 && isAddingDays) || (dow === 6 && !isAddingDays)) {
        daysToAdd = daysToAdd + (isAddingDays ? 1 : -1);
    } else if ((dow === 6 && isAddingDays) || (dow === 0 && !isAddingDays)) {
        daysToAdd = daysToAdd + (isAddingDays ? 2 : -2);
    }

    if (isDaysToAddMoreThanWeek) {
        daysToAdd = daysToAdd + (2 * (Math.floor(days / 5)));

        if (days % 5 != 0)
            daysToAdd = daysToAdd + (isAddingDays ?  -2 : 2);

    }

    newDate.setDate(startDate.getDate() + daysToAdd);
    return newDate;
  }
  
  function getNextDayDeliveryDateForCart() {
   var estimatedDeliveryConfig = Configuration.get('estimatedDelivery') || {},
       cart = LiveOrderModel.getInstance();
       
   if (!estimatedDeliveryConfig.enabled) return;
   
   return cart.get('lines').reduce(function(nextDayDeliveryDateForCart, line) {
    var item = line.get('item'),
        itemEstimatedDelivery = item.get('_expressDelivery');
    
    
    return itemEstimatedDelivery.nextDayAvailable && (!nextDayDeliveryDateForCart || itemEstimatedDelivery.deliveryDate.getTime() < nextDayDeliveryDateForCart.getTime()) ? itemEstimatedDelivery.deliveryDate : nextDayDeliveryDateForCart;
   });
  }
  
  function getExpressDeliveryDateForCart() {
   var estimatedDeliveryConfig = Configuration.get('estimatedDelivery') || {},
       cart = LiveOrderModel.getInstance();
       
   if (!estimatedDeliveryConfig.enabled) return;
   
   return cart.get('lines').reduce(function(expressDeliveryDateForCart, line) {
    var item = line.get('item'),
        itemEstimatedDelivery = item.get('_expressDelivery');
    
    return (itemEstimatedDelivery.nextDayAvailable || itemEstimatedDelivery.twoDayAvailable || itemEstimatedDelivery.expectedDeliveryDate)  && (!expressDeliveryDateForCart || itemEstimatedDelivery.deliveryDate.getTime() > expressDeliveryDateForCart.getTime()) ? itemEstimatedDelivery.deliveryDate : nextDayDeliveryDateForCart;
   });
  }
  
  function getExpressDeliveryDetailsForCart() {
   var estimatedDeliveryConfig = Configuration.get('estimatedDelivery') || {},
       cart = LiveOrderModel.getInstance();
       
   if (!estimatedDeliveryConfig.enabled) return;
   
   var previousExpressDeliveryDate;
   
   return cart.get('lines').reduce(function(expressDeliveryDetailsForCart, line) {
    var item = line.get('item'),
        itemEstimatedDelivery = item.get('_expressDelivery'),
        isOutOfStock = !item.get('_isInStock');
    
    //expressDeliveryDetailsForCart.expressDeliveryDate = (itemEstimatedDelivery.nextDayAvailable || itemEstimatedDelivery.twoDayAvailable || itemEstimatedDelivery.expectedDeliveryDate)  && (!expressDeliveryDetailsForCart.expressDeliveryDate || itemEstimatedDelivery.deliveryDate.getTime() > expressDeliveryDetailsForCart.expressDeliveryDate.getTime()) ? itemEstimatedDelivery.deliveryDate : expressDeliveryDetailsForCart.expressDeliveryDate;
    
    //expressDeliveryDetailsForCart.allCartItemsHaveSameExpressDeliveryDate = itemEstimatedDelivery.deliveryDate !== undefined && (expressDeliveryDetailsForCart.allCartItemsHaveSameExpressDeliveryDate === true || expressDeliveryDetailsForCart.allCartItemsHaveSameExpressDeliveryDate === undefined) && (!previousExpressDeliveryDate || previousExpressDeliveryDate.getTime() === itemEstimatedDelivery.deliveryDate.getTime());
    
    //if (itemEstimatedDelivery.nextDayAvailable && !expressDeliveryDetailsForCart.expressDeliveryDate)
     //expressDeliveryDetailsForCart.expressDeliveryDate = itemEstimatedDelivery.deliveryDate;
    
    //expressDeliveryDetailsForCart.allCartItemsHaveSameExpressDeliveryDate = itemEstimatedDelivery.nextDayAvailable === true && (expressDeliveryDetailsForCart.allCartItemsHaveSameExpressDeliveryDate === undefined || expressDeliveryDetailsForCart.allCartItemsHaveSameExpressDeliveryDate === true);
    
    
    expressDeliveryDetailsForCart.expressDeliveryDate = (itemEstimatedDelivery.nextDayAvailable || itemEstimatedDelivery.twoDayAvailable || itemEstimatedDelivery.expectedDeliveryDate)  && (!expressDeliveryDetailsForCart.expressDeliveryDate || itemEstimatedDelivery.deliveryDate.getTime() < expressDeliveryDetailsForCart.expressDeliveryDate.getTime()) ? itemEstimatedDelivery.deliveryDate : expressDeliveryDetailsForCart.expressDeliveryDate;
    
    expressDeliveryDetailsForCart.allCartItemsHaveSameExpressDeliveryDate = itemEstimatedDelivery.deliveryDate !== undefined && (expressDeliveryDetailsForCart.allCartItemsHaveSameExpressDeliveryDate === true || expressDeliveryDetailsForCart.allCartItemsHaveSameExpressDeliveryDate === undefined) && (!previousExpressDeliveryDate || previousExpressDeliveryDate.getTime() === itemEstimatedDelivery.deliveryDate.getTime());
    
    previousExpressDeliveryDate = itemEstimatedDelivery.deliveryDate;
    
    
    
    //expressDeliveryDetailsForCart.expressDeliveryDate = (!itemEstimatedDelivery.nextDayAvailable && !itemEstimatedDelivery.twoDayAvailable && !itemEstimatedDelivery.expectedDeliveryDate) && !expressDeliveryDetailsForCart.expressDeliveryDate) ? undefined : itemEstimatedDelivery.deliveryDate.getTime() > expressDeliveryDetailsForCart.expressDeliveryDate.getTime()) ? itemEstimatedDelivery.deliveryDate : expressDeliveryDetailsForCart.expressDeliveryDate;
    
    //expressDeliveryDetailsForCart.allCartItemsHaveSameExpressDeliveryDate = !!(!previousExpressDeliveryDate || previousExpressDeliveryDate.getTime() == expressDeliveryDetailsForCart.expressDeliveryDate.getTime());
    
    //expressDeliveryDetailsForCart.allCartItemsHaveSameExpressDeliveryDate = expressDeliveryDetailsForCart.allCartItemsHaveSameExpressDeliveryDate == undefined || (expressDeliveryDetailsForCart.allCartItemsHaveSameExpressDeliveryDate && previousExpressDeliveryDate.getTime() == expressDeliveryDetailsForCart.expressDeliveryDate.getTime());
    
    expressDeliveryDetailsForCart.allCartItemsOutOfStock = (expressDeliveryDetailsForCart.allCartItemsOutOfStock === undefined || expressDeliveryDetailsForCart.allCartItemsOutOfStock === true) && isOutOfStock === true;
    
    expressDeliveryDetailsForCart.someCartItemsOutOfStock = expressDeliveryDetailsForCart.someCartItemsOutOfStock === true || isOutOfStock === true;
    
    return expressDeliveryDetailsForCart;
   }, {});
  }
  
  function formatDeliveryDate(deliveryDate) {
   
   if (!(deliveryDate instanceof Date)) return '';
   
   var tomorrowsDate = toUKDateTime(new Date()),
       daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
       monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
       
   tomorrowsDate.setDate(tomorrowsDate.getDate() + 1);

   if (deliveryDate.getDate() == tomorrowsDate.getDate() && deliveryDate.getMonth() == tomorrowsDate.getMonth() && deliveryDate.getFullYear() == tomorrowsDate.getFullYear()) {
    var deliveryDateFormatted = _('Tomorrow').translate();
   }
   else {
    var deliveryDayName = daysOfWeek[deliveryDate.getDay()];
    var deliveryMonthName = monthsOfYear[deliveryDate.getMonth()];
    var deliveryDateOrdinal = getNumberWithOrdinal(deliveryDate.getDate());
    var deliveryDateFormatted = _('$(0) $(1), $(2)').translate(deliveryDayName, deliveryMonthName, deliveryDateOrdinal);
   }
   
   return deliveryDateFormatted;
   
  }
 
  var Utils = {
   toUKDateTime: toUKDateTime,
   isBeforeDeliveryCutoff: isBeforeDeliveryCutoff,
   isBeforeSupplierDeliveryCutoff: isBeforeSupplierDeliveryCutoff,
   getSupplierDeliveryCutoff: getSupplierDeliveryCutoff,
   getItemStockStatus: getItemStockStatus,
   getCartStockStatus: getCartStockStatus,
   getEstimatedDeliveryFormatted: getEstimatedDeliveryFormatted,
   dateDifferenceFormatted: dateDifferenceFormatted,
   nextDeliveryCutoffDate: nextDeliveryCutoffDate,
   addWorkingDays: addWorkingDays,
   getNextDayDeliveryDateForCart: getNextDayDeliveryDateForCart,
   getExpressDeliveryDateForCart: getExpressDeliveryDateForCart,
   getExpressDeliveryDetailsForCart: getExpressDeliveryDetailsForCart,
   formatDeliveryDate: formatDeliveryDate
  };
  
  return Utils;
  
 }
);

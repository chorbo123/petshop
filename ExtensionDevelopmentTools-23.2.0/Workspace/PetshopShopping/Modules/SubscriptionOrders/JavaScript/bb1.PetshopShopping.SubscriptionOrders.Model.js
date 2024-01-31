// @module bb1.PetshopShopping.SubscriptionOrders
define(
 'bb1.PetshopShopping.SubscriptionOrders.Model',
 [
  'Item.Model',
  
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  ProductModel,
  
  Backbone,
  _
 )
 {
  'use strict';

  function stringToDate(date) {
   var dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
   
   if (!dateRegex.test(date)) return null;
   
   var dateTokens = dateRegex.exec(date),
       dateObject = new Date(dateTokens[3], parseInt(dateTokens[2], 10)-1, dateTokens[1]);
       
   return dateObject;
  }
  
  function validateNextOrderDate(value, valName, form) {
   var newDate = stringToDate(value),
       today = new Date(),
       selectedOrderSchedule = form.orderschedule,
       scheduleForSetDate = form.scheduleforsetdate === 'T',
       scheduledDayOfMonth = parseInt(form.scheduleddayofmonth),
       subscriptionOrderSettings = SC.ENVIRONMENT.subscriptionOrderSettings && SC.ENVIRONMENT.subscriptionOrderSettings || {},
       orderSchedules = subscriptionOrderSettings.orderSchedules || {},
       orderScheduleInDays = (_.findWhere(orderSchedules, {id: selectedOrderSchedule}) || {}).scheduleindays || 1,
       canScheduleMonthly = orderScheduleInDays % 28 === 0,
       lastDateOfMonth = newDate && new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate(),
       firstOrNextLabel = form.internalid ? _('Next').translate() : _('First').translate();
       
   if (!newDate || newDate.getTime() <= today.getTime())
    return _('Valid $(0) Order Date is required').translate(firstOrNextLabel);
   else if (canScheduleMonthly && scheduleForSetDate && newDate.getDate() !== Math.min(scheduledDayOfMonth, lastDateOfMonth))
    return _('$(0) Order Date must be on the selected Day of the Month').translate(firstOrNextLabel);
  }
  
  function validateItem(value, valName, form) {
   return !form.internalid && !value ? _('Item is required').translate() : null;
  }
  
  return Backbone.Model.extend(
  {
   urlRoot: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/SubscriptionOrders.Service.ss'),
   
   validation: {
    //internalid: { required: true, msg: _('Internal ID is required').translate() },
    item: { fn: validateItem },
    quantity: { required: true, msg: _('Quantity is required').translate() },
    orderschedule: { required: true, msg: _('Order Schedule is required').translate() },
    nextorderdate: { fn: validateNextOrderDate }
   },
   
   initialize: function (data)
   {
    this.updateItemDetails(data);
    this.updateSalesOrders(data);
    this.on('sync', function (model, response, options) {
     this.updateItemDetails(model);
     this.updateSalesOrders(model);
    });
   },

   getProductName: function()
   {
    var item = this.item_details;
    
    if (!item)
     return null;
     
    if (item && item.matrix_parent && item.matrix_parent.internalid) 
    {
     return item.matrix_parent.storedisplayname2 || item.matrix_parent.displayname;
    }

    return item.storedisplayname2 || item.displayname;
   },
  
   updateItemDetails: function(data)
   {
    if (!data) return;
    
    this.item_details = data instanceof Backbone.Model ? data.get('item_details') : data.item_details;

    if (this.item_details && this.item_details.matrix_parent && this.item_details.itemoptions_detail)
    {
     this.item_details.itemoptions_detail.fields = this.item_details.matrix_parent.itemoptions_detail.fields;
     this.item_details.matrixchilditems_detail = this.item_details.matrix_parent.matrixchilditems_detail;
    }

    var itemDetailModel = new ProductModel(this.item_details);

    this.set('item_details', itemDetailModel);
    this.on('change:item_details', function(model, data) {
     if (!(data instanceof ProductModel))
      model.set('item_details', new ProductModel(data));
    });
   },
  
   updateSalesOrders: function(data)
   {
    if (!data) return;
    
    this.orders = data instanceof Backbone.Model ? data.get('orders') : data.orders;

    var ordersCollection = new Backbone.Collection(this.orders);
    
    this.set('orders', ordersCollection);
   }
  });
  
 }
);

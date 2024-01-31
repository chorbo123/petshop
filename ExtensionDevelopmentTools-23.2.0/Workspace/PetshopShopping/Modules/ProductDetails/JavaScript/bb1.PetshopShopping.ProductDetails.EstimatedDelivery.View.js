// @module bb1.PetshopShopping.ProductDetails
define(
	'bb1.PetshopShopping.ProductDetails.EstimatedDelivery.View',
 [
  'LiveOrder.Model',
  
  'bb1_petshopshopping_productdetails_estimateddelivery.tpl',
	
	 'Backbone',
		'underscore'
	],
	function (
  LiveOrderModel,
  
  bb1_petshopshopping_productdetails_estimateddelivery_tpl,

		Backbone,
		_
	)
 {
  'use strict';

  function toUKDateTime(date) {
   var bstStartDate = new Date(Date.UTC(date.getFullYear(), 2, 31, 1, 0, 0)),
       bstEndDate = new Date(Date.UTC(date.getFullYear(), 9, 31, 1, 0, 0)),
       ukDateTime = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
      
   bstStartDate.setDate(bstStartDate.getDate() - bstStartDate.getDay());
   bstEndDate.setDate(bstEndDate.getDate() - bstEndDate.getDay());

   if (bstStartDate.getTime() <= date.getTime() && date.getTime() < bstEndDate.getTime())
    ukDateTime.setHours(ukDateTime.getHours() + 1);

   return ukDateTime;
  }

  // @class bb1.PetshopShopping.ProductDetails.EstimatedDelivery.View @extends Backbone.View
  return Backbone.View.extend({
   
   template: bb1_petshopshopping_productdetails_estimateddelivery_tpl,

   // @method getContext @returns {bb1.PetshopShopping.ProductDetails.EstimatedDelivery.View.Context}
   getContext: function ()
   {
    var model = this.model,
        line = this.options.item,
        item = line.get('item'),
        cart = LiveOrderModel.getInstance(),
        itemCart = cart.findLine(line),
        cartQuantity = itemCart && itemCart.get('quantity') || 0,
        quantity = item.get('quantity') || 1,
        totalQuantity = cartQuantity + quantity,
        quantityAvailableDetail = item.get('quantityavailable_detail'),
        warehouseAvailable = (_.findWhere(quantityAvailableDetail.locations, {internalid: 6}) || {}).quantityavailable || 0,
        phWarehouseAvailable = (_.findWhere(quantityAvailableDetail.locations, {internalid: 7}) || {}).quantityavailable || 0,
        ukDateTime = toUKDateTime(new Date()),
        ukHour = ukDateTime.getHours() + (ukDateTime.getMinutes() / 60),
        before11 = ukHour < 11,
        earliestDeliveryDateFormatted = model.get('earliestDeliveryDateFormatted'),
        latestDeliveryDateFormatted = model.get('latestDeliveryDateFormatted'),
        earliestDeliveryDatePhFormatted = model.get('earliestDeliveryDatePhFormatted'),
        latestDeliveryDatePhFormatted = model.get('latestDeliveryDatePhFormatted'),
        showWarehouseDeliveryMessage = earliestDeliveryDateFormatted && latestDeliveryDateFormatted && totalQuantity <= warehouseAvailable,
        showPhWarehouseDeliveryMessage = earliestDeliveryDatePhFormatted && latestDeliveryDatePhFormatted && totalQuantity <= phWarehouseAvailable;
        
        //console.log('warehouseAvailable: ' + warehouseAvailable);
        //console.log('phWarehouseAvailable: ' + phWarehouseAvailable);
        //console.log('showWarehouseDeliveryMessage: ' + showWarehouseDeliveryMessage);
        //console.log('showPhWarehouseDeliveryMessage: ' + showPhWarehouseDeliveryMessage);
        
    //@class bb1.PetshopShopping.ProductDetails.EstimatedDelivery.View.Context
    return {
     // @property {Boolean} showWarehouseDeliveryMessage
     showWarehouseDeliveryMessage: showWarehouseDeliveryMessage,
     // @property {Boolean} showPhWarehouseDeliveryMessage
     showPhWarehouseDeliveryMessage: showPhWarehouseDeliveryMessage,
     // @property {String} earliestDeliveryDateFormatted
     earliestDeliveryDateFormatted: earliestDeliveryDateFormatted,
     // @property {String} latestDeliveryDateFormatted
     latestDeliveryDateFormatted: latestDeliveryDateFormatted,
     // @property {String} timeBeforeTime11amFormatted
     timeBeforeTime11amFormatted: model.get('timeBeforeTime11amFormatted'),
     // @property {String} earliestDeliveryDatePhFormatted
     earliestDeliveryDatePhFormatted: earliestDeliveryDatePhFormatted,
     // @property {String} latestDeliveryDatePhFormatted
     latestDeliveryDatePhFormatted: latestDeliveryDatePhFormatted
    };
   }
  });
 
 }
);


//@class bb1.PetshopShopping.ProductDetails.EstimatedDelivery.View.Initialize.Options
//@property {Item.Model} model

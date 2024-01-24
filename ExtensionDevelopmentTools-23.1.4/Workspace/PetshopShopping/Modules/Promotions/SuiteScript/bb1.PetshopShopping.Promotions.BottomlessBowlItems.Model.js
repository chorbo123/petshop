// @module bb1.PetshopShopping.Promotions
define(
	'bb1.PetshopShopping.Promotions.BottomlessBowlItems.Model',
	[
  'StoreItem.Model',
		'SC.Model',
		'Application',
		'Models.Init',
  'LiveOrder.Model',
		'SiteSettings.Model',
		'Utils',
		'underscore'
	],
	function (
  StoreItem,
		SCModel,
		Application,
		ModelsInit,
  LiveOrderModel,
		SiteSettings,
		Utils,
		_
	)
{
	'use strict';
 
	// @extends SCModel
	return SCModel.extend({

		name: 'bb1.PetshopShopping.Prescriptions.Item',

		validation: {
			salesorder: {required: true, msg: 'Order ID is required. Contact support for help.'},
			custcol_bb1_blbi_orderschedule: {required: true, msg: 'Order Schedule is required.'}
		},

		get: function (id)
		{
			'use strict';

			if (!id)
				throw notFoundError;
			
			if (!ModelsInit.session.isLoggedIn2())
				throw unauthorizedError;

   var result = {};

			try {
    
    if (id) {
     var customerId = nlapiGetUser(),
         filters = [new nlobjSearchFilter("mainline", null, "is", "F"),
                    new nlobjSearchFilter("shipping", null, "is", "F"),
                    new nlobjSearchFilter("taxline", null, "is", "F"),
                    new nlobjSearchFilter("cogs", null, "is", "F"),
                    new nlobjSearchFilter("memorized", null, "is", "F"),
                    new nlobjSearchFilter("entity", null, "anyof", customerId),
                    new nlobjSearchFilter("internalid", null, "anyof", id),
                    new nlobjSearchFilter("custcol_bb1_blbi_orderschedule", null, "anyof", "@NONE@"),
                    new nlobjSearchFilter("custcol_bb1_blbi_discount", null, "lessthan", 0)],
                    //new nlobjSearchFilter("custitem_bb1_bb_discountrate", "item", "lessthan", 0)],
         columns = this.getColumnsArray();
         
     result = {internalid: id};

     result.items = this.searchHelper(filters, columns, "all");
    }
    
			}
			catch(e) {
    var errorMessage = e && e.getDetails ? e.getDetails : e;
				
    nlapiLogExecution("DEBUG", "error occurred in PrescriptionOrder.get", errorMessage);
				
    return {
     errorCode: e.getCode && e.getCode() || '',
     errorMessage: errorMessage
    };
			}
			
			return result;
		},
		
		getColumnsArray: function ()
		{
			'use strict';

			return [
				new nlobjSearchColumn("formulacurrency").setFormula("({amount}+{taxamount})*ABS({custcol_bb1_blbi_discount}/100)").setSort(true),
				new nlobjSearchColumn("custcol_bb1_blbi_discount").setSort(),
				new nlobjSearchColumn("line"),
				new nlobjSearchColumn("item"),
				new nlobjSearchColumn("type", "item"),
				new nlobjSearchColumn("parent", "item"),
				new nlobjSearchColumn("quantity"),
				new nlobjSearchColumn("rate"),
				new nlobjSearchColumn("rate", "taxitem"),
				new nlobjSearchColumn("amount"),
				new nlobjSearchColumn("taxamount"),
				new nlobjSearchColumn("grossamount"),
				new nlobjSearchColumn("custcol_bb1_blbi_orderschedule")
			];
		},
		
		searchHelper: function (filters, columns, page)
		{
			'use strict';
			
			var self = this,
       salesOrderRec,
							result = Application.getAllSearchResults('salesorder', filters, columns),
       storeItemReferences = [];

			var items = _.map(result, function (item)
			{
				var salesOrderId = item.getId(),
        lineId = item.getValue('line');
        
    //if (!salesOrderRec)
			 // salesOrderRec = nlapiLoadRecord("salesorder", salesOrderId),
    
    var	quantity = parseFloat(item.getValue('quantity')),
        taxRate = parseFloat(item.getValue("rate", "taxitem")) || 0,
								rate = parseFloat(item.getValue('rate')) || 0,
								rateIncTax = rate * (1 + (taxRate / 100)),
								amount = parseFloat(item.getValue('amount')) || 0,
								taxAmount = parseFloat(item.getValue('taxamount')) || 0,
								grossAmount = quantity * rateIncTax, //amount + taxAmount, //parseFloat(item.getValue('grossamount')) || 0,
								itemId = item.getValue('item'),
								itemName = item.getText('item'),
        itemType = item.getValue('type', 'item'),
        itemMatrixParent = item.getValue('parent', 'item'),
        discountRate = parseFloat(item.getValue('custcol_bb1_blbi_discount')) || 0,
        discountedRate = rateIncTax * (1 + (discountRate / 100)),
        discountedTotal = grossAmount * (1 + (discountRate / 100)),
        totalDiscountSavings = parseFloat(item.getValue('formulacurrency')) || 0,
								newItem = {
									salesorder: item.getId(),
									line: lineId,
									itemId: itemId,
									itemType: itemType,
         quantity: quantity,
         rate: rateIncTax,
         rateFormatted: Utils.formatCurrency(rateIncTax),
         discountedRate:  discountedRate,
         discountedRateFormatted: Utils.formatCurrency(discountedRate),
         amount: amount,
         amountFormatted: Utils.formatCurrency(amount),
         taxAmount: taxAmount,
         taxAmountFormatted: Utils.formatCurrency(taxAmount),
         grossAmount: grossAmount,
         grossAmountFormatted: Utils.formatCurrency(grossAmount),
         discountedTotal: discountedTotal,
         discountedTotalFormatted: Utils.formatCurrency(discountedTotal),
         taxRate: taxRate,
         discountRate: discountRate,
         totalDiscountSavings: totalDiscountSavings,
         totalDiscountSavingsFormatted: Utils.formatCurrency(totalDiscountSavings),
         orderSchedule: {
          id: item.getValue('custcol_bb1_blbi_orderschedule'),
          label: item.getText('custcol_bb1_blbi_orderschedule')
         }
								},
        storeItemReference = {
         id: itemId,
         internalid: itemId,
         type: itemType,
         matrix_parent: itemMatrixParent,
         itemid: itemName
        };
				
    storeItemReferences.push(storeItemReference);
    
				return newItem;
			});
   
   //delete result.records;
   
   StoreItem && StoreItem.preloadItems(storeItemReferences);

   _(items).each(function (item)
   {
    var store_item = StoreItem && StoreItem.get(item.itemId, item.itemType);

    if (!store_item)
     return;
    
    var quantity = parseFloat(item.quantity, 10);
    var onlineCustomerPrice = store_item.onlinecustomerprice_detail;
    var priceSchedules = onlineCustomerPrice.priceschedule || [];
    //console.log('quantity', quantity);
    //console.log('priceSchedules', JSON.stringify(priceSchedules));
    if (priceSchedules.length) {
     var priceSchedule = _.find(priceSchedules, function(schedule) { return (schedule.minimumquantity <= quantity) && (quantity < (schedule.maximumquantity || Infinity)); });
    //console.log('priceSchedule', JSON.stringify(priceSchedule));
     if (priceSchedule) {
      onlineCustomerPrice.onlinecustomerprice = priceSchedule.price;
      onlineCustomerPrice.onlinecustomerprice_formatted = priceSchedule.price_formatted;
     }
    }
    
    delete onlineCustomerPrice.priceschedule;
    
    //console.log('store_item.custitem_bb1_bb_discountrate', store_item.custitem_bb1_bb_discountrate);
    if (store_item.custitem_bb1_bb_discountrate) {
     onlineCustomerPrice.onlinecustomerprice *= 1 + (store_item.custitem_bb1_bb_discountrate / 100);
     onlineCustomerPrice.onlinecustomerprice_formatted = Utils.formatCurrency(onlineCustomerPrice.onlinecustomerprice);
    }
    
    item.item = store_item; 
   });
    
   return items;
		},

		update: function (data)
		{
			'use strict';

			if (!ModelsInit.session.isLoggedIn2())
				throw unauthorizedError;

			nlapiLogExecution("DEBUG", "data", JSON.stringify(data));
			
			this.validate(data);

			var customerId = nlapiGetUser();
  
   try {
     
    var salesorder = nlapiLoadRecord("salesorder", data.salesorder, {recordmode: 'dynamic'}),
        orderCustomerId = salesorder.getFieldValue("entity"),
        orderStatus = salesorder.getFieldValue("orderstatus"),
        lineOrderSchedule = salesorder.getLineItemValue("item", "custcol_bb1_blbi_orderschedule", data.line);
   
    nlapiLogExecution("DEBUG", "lineOrderSchedule/orderStatus/orderCustomerId", lineOrderSchedule + '/' + orderStatus + '/' + orderCustomerId);
  
   }
   catch (e) {
    nlapiLogExecution("ERROR", "Error occurred while updating sales order lines for order id: " + data.salesorder, e && e.getDetails ? e.getDetails() : e);
   }
   
   if (salesorder && customerId == orderCustomerId && ['A', 'B', 'C'].indexOf(orderStatus) != -1) {
     
    try {
     
     salesorder.selectLineItem('item', data.line);
     data.originalItemRate = salesorder.getCurrentLineItemValue("item", "rate");
     salesorder.setCurrentLineItemValue("item", "custcol_bb1_blbi_orderschedule", data.custcol_bb1_blbi_orderschedule);
     var originalItemQuantity = salesorder.getCurrentLineItemValue("item", "quantity");
     var discountRate = salesorder.getCurrentLineItemValue("item", "custcol_bb1_blbi_discount");
     salesorder.setCurrentLineItemValue("item", "quantity", originalItemQuantity+1);
     salesorder.setCurrentLineItemValue("item", "quantity", originalItemQuantity);
     data.originalItemRateReset = salesorder.getCurrentLineItemValue("item", "rate");
     data.discountedItemRate = data.originalItemRateReset * (1 - Math.abs(discountRate / 100));
     salesorder.setCurrentLineItemValue("item", "rate", data.discountedItemRate);
     salesorder.commitLineItem('item');
     nlapiLogExecution("DEBUG", "data.line/data.orderschedule", data.line + "/" + data.custcol_bb1_blbi_orderschedule);
     
     data.orderSchedule = {
      id: salesorder.getLineItemValue("item", "custcol_bb1_blbi_orderschedule", data.line),
      label: salesorder.getLineItemText("item", "custcol_bb1_blbi_orderschedule", data.line)
     };
    
     data.orderTotal = parseFloat(salesorder.getFieldValue('total'), 10) || 0;
     data.orderTotalFormatted = Utils.formatCurrency(data.orderTotal);
    
     nlapiSubmitRecord(salesorder, false, true);
     nlapiLogExecution("DEBUG", "order submitted");
     
    }
    catch (e) {
     nlapiLogExecution("ERROR", "Error occurred while updating sales order lines for order id: " + data.salesorder, e && e.getDetails ? e.getDetails() : e);
    }
   }
   else {
    throw {
     // @property {Number} status
     status: 500,
     // @property {String} code
     code: 'ERR_ORDER_CANNOT_BE_EDITED',
     // @property {String} message
     message: 'Your sales order can no longer be edited. Contact support for further help.'
    };
   }
   
   delete data.item;
   
			return data;
		}

 });

});

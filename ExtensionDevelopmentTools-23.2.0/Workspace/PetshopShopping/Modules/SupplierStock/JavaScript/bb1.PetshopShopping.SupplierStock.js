//@module bb1.PetshopShopping.SupplierStock
define(
 'bb1.PetshopShopping.SupplierStock',
 [
  'ProductLine.Stock.View',
  'Item.KeyMapping',
  
  'Backbone',
  'underscore'
 ],
 function (
  ProductLineStockView,
  ItemKeyMapping,
  
  Backbone,
  _
 )
 {
  'use strict'

  return  {
   
   mountToApp: function (application)
   {
    
    ItemKeyMapping.getKeyMapping = _.wrap(ItemKeyMapping.getKeyMapping, function(originalGetKeyMapping) {
     
     var keyMapping = originalGetKeyMapping.apply(this, _.rest(arguments));
     
     _.extend(keyMapping, {

      _quantityavailable: function (item)
      {
       return item.get('quantityavailable');
       
       var orderReservationQtyCommitted = item.get('custitem_bb1_orderreservationqtycommit') || 0;
       var quantityAvailable = Math.max(item.get('quantityavailable') - orderReservationQtyCommitted, 0);
       
       //console.log('orderReservationQtyCommitted');
       //console.log(item);
       //console.log(orderReservationQtyCommitted);
       //console.log(quantityAvailable);
       //console.log(item.get('quantityavailable'));
       
       return quantityAvailable;
      },
      
      isinstock: function (item)
      {
       var quantityAvailable = item.get('_quantityavailable', true);
       
       return quantityAvailable > 0;
      },
      
      _isInStock: function (item)
      {
       var outOfStockBehavior = item.get('outofstockbehavior');
       
       switch (outOfStockBehavior) {
        case 'Disallow back orders but display out-of-stock message':
        //case 'Remove out-of-stock items from store':
        //case 'Allow back orders but display out-of-stock message':
        //case 'Allow back orders with no out-of-stock message':
         return item.get('isinstock', true);
       }
       
       var preferredSupplierStock = parseFloat(item.get('custitem_bb1_supplier_stock'), 10) || 0;
       var matrixChilds = item.get('_matrixChilds') || [];
       
       //console.log(preferredSupplierStock);
       if (matrixChilds.length)
       {
        preferredSupplierStock = matrixChilds.reduce(function(memo, child) {
         
       //console.log(parseFloat(child.get('custitem_bb1_supplier_stock'), 10));
         return Math.max(memo, parseFloat(child.get('custitem_bb1_supplier_stock'), 10) || 0);
        }, 0) || 0;
       }
       //console.log('preferredSupplierStock');
       //console.log(preferredSupplierStock);
       //console.log(item);
       //console.log(matrixChilds);
       return item.get('isinstock', true) || preferredSupplierStock >= 3;
      },
      
      _showInStockMessage: function (item)
      {
       return true;
      },
      
      _showOutOfStockMessage: function (item)
      {
       return true;
      },
      
      _inStockMessage: function ()
      {
       return _('In stock ☺').translate();
      },
      
      _outOfStockMessage: function (item)
      {
       return item.get('outofstockmessage2') || item.get('outofstockmessage') || _('Just sold out!').translate();
      },
      
      _isPurchasable: function (item)
      {
       return item.get('ispurchasable') && (!(/^Disallow back orders/.test(item.get('outofstockbehavior'))) || item.get('_isInStock'));
      }

     });
     
     return keyMapping;
     
    });
    
    ProductLineStockView.prototype.getContext = _.wrap(ProductLineStockView.prototype.getContext, function(originalGetContext) {
     var results = originalGetContext.apply(this, _.rest(arguments)),
         item = this.model.get('item') || this.model,
         itemClass = item.get('class'),
         isFoodItem = /^Foods/i.test(itemClass);
     
     results.showFullStockMessage = !!this.options.showFullStockMessage;
     results.isFoodItem = isFoodItem;
     
     if (results.showFullStockMessage) {
      var outOfStockMessage = item.get('outofstockmessage2') || item.get('outofstockmessage') || '';
      
      if (outOfStockMessage)
       results.outOfStockMessage = _(outOfStockMessage).translate();
      else if (isFoodItem)
       results.outOfStockMessage = _('‘Oh Cockapoo!’ Just sold out. Be back in stock soon, pick another flavour for quick dispatch ☺').translate();
      else
       results.outOfStockMessage = _('‘Oh Cockapoo!’ Just sold out. Be back in stock soon, pick something else for quick dispatch ☺').translate();
     }
     
     return results;
    });
    
   }
  };
 
 }
);

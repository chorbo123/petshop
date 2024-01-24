//@module bb1.PetshopShopping.Promotions
define(
	'bb1.PetshopShopping.Promotions.QuickView.View',
 [
  'ProductDetails.QuickView.View',
  'Cart.Confirmation.Helpers',
  'LiveOrder.Model',
  'LiveOrder.Line.Model',
  'Product.Model',
  
  'Backbone.CompositeView',
  'Backbone',
  'underscore',
  'jQuery'
	],
 function
 (
  ProductDetailsQuickView,
  CartConfirmationHelpers,
  LiveOrderModel,
  LiveOrderLineModel,
  ProductModel,
  
  BackboneCompositeView,
  Backbone,
  _,
  jQuery
	)
 {
  'use strict';
  
  //@class bb1.PetshopShopping.Promotions.SaleItems.Item.View @extends Facets.ItemCell.View
  return ProductDetailsQuickView.extend({

   //@method initialize
  	initialize: function (options)
   {
    ProductDetailsQuickView.prototype.initialize.apply(this, arguments);
    
    this.mainActionViewInstance.addToCart = this.addToCart;
   },

   //@method addToCart
  	addToCart: function (event)
   {
    event.preventDefault();
    
    var self = this,
        cart_promise,
        product = this.model;
        
    product.setOption('custcol_bb1_cop_promotext', 'Flash Sale!');
        
    
    console.log('product');
    console.log(product);
    if (!product.areAttributesValid(['options','quantity'], self.getAddToCartValidators()))
    {
     return;
    }

    if (!product.isNew() && product.get('source') === 'cart')
    {
      cart_promise = this.cart.updateProduct(product);
      cart_promise.done(function ()
      {
       self.options.application.getLayout().closeModal();
      });
    }
    else
    {
     var line = LiveOrderLineModel.createFromProduct(product);
     cart_promise = this.cart.addLine(line);
     /*cart_promise.done(function ()
      {
       self.options.wizard.goToNextStep();
      });*/
     CartConfirmationHelpers.showCartConfirmation(cart_promise, line, self.options.application);
    }

    cart_promise.fail(function (jqXhr)
    {
     var error_details = null;
     try
     {
      var response = JSON.parse(jqXhr.responseText);
      error_details = response.errorDetails;
     }
     finally
     {
      if (error_details && error_details.status === 'LINE_ROLLBACK')
      {
       self.model.set('internalid', error_details.newLineId);
      }
     }

    });

    this.disableElementsOnPromise(cart_promise, event.target);
    return false;
   },
   
   getAddToCartValidators: function ()
   {
    var self = this;

    return {
     quantity: {
      fn : function ()
      {
       var line_on_cart = self.cart.findLine(self.model)
       ,	quantity = self.model.get('quantity')
       ,	minimum_quantity = self.model.getItem().get('_minimumQuantity') || 1
       ,	maximum_quantity = self.model.getItem().get('_maximumQuantity');

       if (!_.isNumber(quantity) || _.isNaN(quantity) || quantity < 1)
       {
        return _.translate('Invalid quantity value');
       }
       else if (!line_on_cart && line_on_cart + quantity < minimum_quantity)
       {
        return _.translate('Please add $(0) or more of this item', minimum_quantity);
       }
       else if(!!maximum_quantity)
       {
        maximum_quantity = (!line_on_cart) ? maximum_quantity : maximum_quantity - line_on_cart.quantity;

        if(quantity > maximum_quantity)
        {
         return _.translate('Please add $(0) or less of this item', maximum_quantity);
        }
       }
      }
     }
    };
   },
   
   getContext: _.wrap(ProductDetailsQuickView.prototype.getContext, function(originalGetContext) {
    var context = originalGetContext.apply(this, _.rest(arguments));
    
    return _.extend(context, {
     displaySalePriceLevel: this.options.displaySalePriceLevel
    });
   })
   
  })
  
 }
);

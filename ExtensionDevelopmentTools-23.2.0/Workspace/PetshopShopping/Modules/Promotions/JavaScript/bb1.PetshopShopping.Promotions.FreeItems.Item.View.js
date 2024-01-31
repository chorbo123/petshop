//@module bb1.PetshopShopping.Promotions.FreeItems.Item.View
define(
	'bb1.PetshopShopping.Promotions.FreeItems.Item.View',
 [
  'Facets.ItemCell.View',
  'Cart.Confirmation.Helpers',
  'LiveOrder.Line.Model',
  'Product.Model',
  
  'bb1_petshopshopping_promotions_freeitems_item.tpl',
  
  'Backbone.CompositeView',
  'Backbone',
  'underscore',
  'jQuery'
	],
 function
 (
  FacetsItemCellView,
  CartConfirmationHelpers,
  LiveOrderLineModel,
  ProductModel,
  
  bb1_petshopshopping_promotions_freeitems_item_tpl,
  
  BackboneCompositeView,
  Backbone,
  _,
  jQuery
	)
 {
  'use strict';
  
  //@class bb1.PetshopShopping.Promotions.FreeItems.Item.View @extends Facets.ItemCell.View
  return FacetsItemCellView.extend({

   //@property {Function} template
   template: bb1_petshopshopping_promotions_freeitems_item_tpl,
   
   //@property {Object} events
   events: {
   	'click [data-action="add-item-to-cart"]': 'addItemToCart'
   },
   
   //@method initialize
  	initialize: function (options)
   {
    this.application = options.application;
    this.cart = options.wizard.model;
    BackboneCompositeView.add(this);
   },

   //@method addItemToCart
  	addItemToCart: function (event)
   {
    event.preventDefault();
    
    var self = this,
        cart_promise,
        product = new ProductModel({
         item: this.model, options: [{
          cartOptionId: 'custcol_bb1_cop_promotext', value: {
           internalid: 'Free Gift!',
           label: 'Free Gift!'
          }
         }
        ]
       });
        
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
     cart_promise.done(function ()
      {
       self.options.wizard.goToNextStep();
      });
     //CartConfirmationHelpers.showCartConfirmation(cart_promise, line, self.application);
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

    this.application.getLayout().disableElementsOnPromise(cart_promise, '.promotions-freeitems-item-addtocart-btn, button');
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
  
   childViews: _.extend(FacetsItemCellView.prototype.childViews, {
    
    'StockDescription': function() {},
    
    'ItemViews.Promotions': function() {}
    
   }),

   //@method getContext
   //@returns {bb1.PetshopShopping.Promotions.FreeItems.Item.View.Context}
  	getContext: function getContext ()
   {
    var context = FacetsItemCellView.prototype.getContext.apply(this, arguments);

    //@class bb1.PetshopShopping.Promotions.FreeItems.Item.View.Context
    return _.extend(context, {
      //@property {Boolean} showRating
      showRating: false,
      //@property {Boolean} showPriceAsFree
      showPriceAsFree: true,
      //@property {Boolean} cheaperOptionsAvailable
      cheaperOptionsAvailable: false,
      //@property {String} actionButtonText
      actionButtonText: _('Add Freebie!').translate()
    });
    //@class bb1.PetshopShopping.Promotions.FreeItems.Item.View
   }
   
  });
  
 }
);

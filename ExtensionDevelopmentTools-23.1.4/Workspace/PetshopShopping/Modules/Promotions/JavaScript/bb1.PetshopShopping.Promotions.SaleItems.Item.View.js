//@module bb1.PetshopShopping.Promotions.SaleItems.Item.View
define(
	'bb1.PetshopShopping.Promotions.SaleItems.Item.View',
 [
  'Facets.ItemCell.View',
  'Cart.Confirmation.Helpers',
  'bb1.PetshopShopping.Promotions.QuickView.View',
  
  'bb1_petshopshopping_promotions_saleitems_item.tpl',
  
  'Backbone.CompositeView',
  'Backbone',
  'underscore',
  'jQuery'
	],
 function
 (
  FacetsItemCellView,
  CartConfirmationHelpers,
  ProductDetailsQuickView,
  
  bb1_petshopshopping_promotions_saleitems_item_tpl,
  
  BackboneCompositeView,
  Backbone,
  _,
  jQuery
	)
 {
  'use strict';
  
  //@class bb1.PetshopShopping.Promotions.SaleItems.Item.View @extends Facets.ItemCell.View
  return FacetsItemCellView.extend({

   //@property {Function} template
   template: bb1_petshopshopping_promotions_saleitems_item_tpl,
   
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
        $target = jQuery(event.target),
        itemId = this.model.get('internalid'),
        layout = this.application.getLayout(),
        url = this.model.get('_url'),
        productView = new ProductDetailsQuickView({
         application: this.application,
         displaySalePriceLevel: true,
         routerArguments: [url]
        });
        
    productView.productDetails({id: itemId}).done(function(model) {
     
     var item = productView.model.get('item');
     var priceLevel3 = item.get('pricelevel3');
     
     if (priceLevel3) {
      var onlineCustomerPriceDetail = item.get('onlinecustomerprice_detail');
      onlineCustomerPriceDetail.onlinecustomerprice = priceLevel3;
      onlineCustomerPriceDetail.onlinecustomerprice_formatted = item.get('pricelevel3_formatted');
      item.set('onlinecustomerprice_detail', onlineCustomerPriceDetail);
     }
      
     self.cart.on('change:lines', function() {
      console.log('add lines');
      self.application.getLayout().currentView.$('[data-action="submit-step"]').text(_('Continue').translate());
     });
     productView.showInModal({className: 'test', silence: true});
    });
    
    return false;
   },
   
   childViews: _.extend(FacetsItemCellView.prototype.childViews, {
    
    'StockDescription': function() {},
    
    'ItemViews.Promotions': function() {}
    
   }),

   //@method getContext
   //@returns {bb1.PetshopShopping.Promotions.SaleItems.Item.View.Context}
  	getContext: function getContext ()
   {
    var context = FacetsItemCellView.prototype.getContext.apply(this, arguments);

    //@class bb1.PetshopShopping.Promotions.SaleItems.Item.View.Context
    return _.extend(context, {
      //@property {Boolean} showRating
      showRating: false,
      //@property {Boolean} showPriceAsFree
      showPriceAsFree: true,
      //@property {Boolean} cheaperOptionsAvailable
      cheaperOptionsAvailable: false,
      //@property {String} actionButtonText
      actionButtonText: this.options.actionButtonLabel || _('Add to Cart +').translate()
    });
    //@class bb1.PetshopShopping.Promotions.SaleItems.Item.View
   }
   
  });
  
 }
);

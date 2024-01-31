//@module bb1.PetshopShopping.Promotions.SeasonalItems.Item.View
define(
	'bb1.PetshopShopping.Promotions.SeasonalItems.Item.View',
 [
  'Facets.ItemCell.View',
  'Cart.Confirmation.Helpers',
  'ProductDetails.QuickView.View',
  
  'bb1_petshopshopping_promotions_seasonalitems_item.tpl',
  
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
  
  bb1_petshopshopping_promotions_seasonalitems_item_tpl,
  
  BackboneCompositeView,
  Backbone,
  _,
  jQuery
	)
 {
  'use strict';
  
  //@class bb1.PetshopShopping.Promotions.SeasonalItems.Item.View @extends Facets.ItemCell.View
  return FacetsItemCellView.extend({

   //@property {Function} template
   template: bb1_petshopshopping_promotions_seasonalitems_item_tpl,
   
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
        url = this.model.get('_url');
    
    var productView = new ProductDetailsQuickView({application: this.application, routerArguments: [url]});
    productView.productDetails({id: itemId}).done(function() {
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
   //@returns {bb1.PetshopShopping.Promotions.SeasonalItems.Item.View.Context}
  	getContext: function getContext ()
   {
    var context = FacetsItemCellView.prototype.getContext.apply(this, arguments);

    //@class bb1.PetshopShopping.Promotions.SeasonalItems.Item.View.Context
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
    //@class bb1.PetshopShopping.Promotions.SeasonalItems.Item.View
   }
   
  });
  
 }
);

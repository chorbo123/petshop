//@module bb1.PetshopShopping.Promotions.UpsellItems.Item.View
define(
	'bb1.PetshopShopping.Promotions.UpsellItems.Item.View',
 [
  'Facets.ItemCell.View',
  'Cart.Confirmation.Helpers',
  'ProductDetails.QuickView.View',
  'NavigationHelper.Plugins.Modals',
  
  'bb1_petshopshopping_promotions_upsellitems_item.tpl',
  
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
  NavigationHelperPluginsModals,
  
  bb1_petshopshopping_promotions_upsellitems_item_tpl,
  
  BackboneCompositeView,
  Backbone,
  _,
  jQuery
	)
 {
  'use strict';
  
  //@class bb1.PetshopShopping.Promotions.UpsellItems.Item.View @extends Facets.ItemCell.View
  return FacetsItemCellView.extend({

   //@property {Function} template
   template: bb1_petshopshopping_promotions_upsellitems_item_tpl,
   
   //@property {Object} events
   events: {
   	'click [data-action="add-item-to-cart"]': 'addItemToCart'
   },
   
   //@method initialize
  	initialize: function (options)
   {
    this.application = options.application;
    this.cart = options.wizard.model; //LiveOrderModel.getInstance();
    BackboneCompositeView.add(this);
   },

   //@method addItemToCart
  	addItemToCart: function (event)
   {
    //console.log(event);
    event.preventDefault();
    event.stopPropagation();
    
    var self = this,
        $target = jQuery(event.target),
        itemId = this.model.get('internalid'), //$target.closest('[data-item-id]').data('item-id'),
        layout = this.application.getLayout(),
        url = this.model.get('_url'); //event.target.href.replace(/.*#/, '');
        
    //console.log('addItemToCart');
    //console.log(url);
    
    //NavigationHelperPluginsModals.showInternalLinkInModal(event, event.target.href, $target, layout)
    //var current_fragment = Backbone.history.fragment;
    //Backbone.history.navigate(event.target.href.hash , {trigger: true, replace: true});
    this.showProductModal(url, itemId);
			//Backbone.history.navigate(current_fragment, {trigger: false, replace: true});
    
    return false;
   },
   
   showProductModal: _.debounce(function(url, itemId) {
    var self = this;
    //console.log('jhafjjj');
    var productView = new ProductDetailsQuickView({application: this.application, routerArguments: [url]});
    productView.productDetails({id: itemId}).done(function() {
     self.cart.on('change:lines', function() {
      //console.log('add lines');
      self.application.getLayout().currentView.$('[data-action="submit-step"]').text(_('Continue').translate());
     });
     productView.showInModal({className: 'test', silence: true});
    });
    
   }, 50),
   
   childViews: _.extend(FacetsItemCellView.prototype.childViews, {
    
    'StockDescription': function() {},
    
    'ItemViews.Promotions': function() {}
    
   }),

   //@method getContext
   //@returns {bb1.PetshopShopping.Promotions.UpsellItems.Item.View.Context}
  	getContext: function getContext ()
   {
    var context = FacetsItemCellView.prototype.getContext.apply(this, arguments);

    //@class bb1.PetshopShopping.Promotions.UpsellItems.Item.View.Context
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
    //@class bb1.PetshopShopping.Promotions.UpsellItems.Item.View
   }
   
  });
  
 }
);

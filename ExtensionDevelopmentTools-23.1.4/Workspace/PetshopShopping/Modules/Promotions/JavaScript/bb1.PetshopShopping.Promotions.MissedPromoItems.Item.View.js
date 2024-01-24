//@module bb1.PetshopShopping.Promotions.MissedPromoItems.Item.View
define(
	'bb1.PetshopShopping.Promotions.MissedPromoItems.Item.View',
 [
  'Facets.ItemCell.View',
  'Cart.Confirmation.Helpers',
  'ProductDetails.QuickView.View',
  'bb1.PetshopShopping.ProductDetails.Promotions.View',
  
  'bb1_petshopshopping_promotions_missedpromoitems_item.tpl',
  
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
  PromotionsView,
  
  bb1_petshopshopping_promotions_missedpromoitems_item_tpl,
  
  BackboneCompositeView,
  Backbone,
  _,
  jQuery
	)
 {
  'use strict';
  
  //@class bb1.PetshopShopping.Promotions.MissedPromoItems.Item.View @extends Facets.ItemCell.View
  return FacetsItemCellView.extend({

   //@property {Function} template
   template: bb1_petshopshopping_promotions_missedpromoitems_item_tpl,
   
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
        //productView = new ProductDetailsQuickView({application: this.application, routerArguments: [url]});
      
    this.showProductModal(url, itemId);
    /*productView.productDetails({id: itemId}).done(function() {
     self.cart.on('change:lines', function() {
      console.log('add lines');
      self.application.getLayout().currentView.$('[data-action="submit-step"]').text(_('Continue').translate());
     });
     productView.showInModal({className: 'test', silence: true});
    });*/
    
    return false;
   },
   
   showProductModal: _.debounce(function(url, itemId) {
    var self = this;
    console.log('jhafjjj');
    var productView = new ProductDetailsQuickView({application: this.application, routerArguments: [url]});
    productView.productDetails({id: itemId}).done(function() {
     self.cart.on('change:lines', function() {
      console.log('add lines');
      self._render();
      //console.log(self.$el);
      //console.log(self.$('.promotions-freeitems-item'));
      //self.$el.parent().append(self.$('.promotions-freeitems-item'));
      //self._renderChildViewInstances();
      self.application.getLayout().currentView.$('[data-action="submit-step"]').text(_('Continue').translate());
     });
     productView.showInModal({className: 'test', silence: true});
    });
    
   }, 50),
   
   isPromotionApplied: function(item, promotion)
   {
    if (!item || !promotion)
     return false;
    
    console.log('222lines');
    var itemId = item.get('internalid');
    
    if (!this.isItemInCart(itemId))
     return false;
    
    var lines = this.getCartLinesWithCheckoutPromotions(promotion.internalid);
        
    console.log('22lines');
    console.log(lines);
    if (!lines.length)
     return false;
    
    switch (promotion.promoType) {
     case '1':
     case '2':
      if (!(promotion.qtyRequiredForDiscount > 0) || !(promotion.qtyDiscountFixed || promotion.qtyDiscountPercentage))
       return false;
      
      var lineWithPromotionApplied = _.find(lines, function(line) {
           return line.get('quantity') >= promotion.qtyRequiredForDiscount;
          });
      
      // check for actual discount on rate also
      return !!lineWithPromotionApplied;
     case '3':
      var freeItemId = promotion.freeItemId,
          hasLineWithPromotionApplied = _.find(lines, function(line) {
           return line.get('quantity') > 0;
          }),
          hasFreeItem = !!_.find(lines, function(line) {
           return line.get('item').get('internalid') == freeItemId && line.get('quantity') > 0 && line.get('rate') == 0;
          });
      
      return hasLineWithPromotionApplied && hasFreeItem;
     case '4':
     case '5':
      if (!(promotion.qtyRequiredForDiscount > 0) || !(promotion.qtyDiscountFixed || promotion.qtyDiscountPercentage))
       return false;
      
      var promoItemIds = promotion.promoItemIds || [],
          promoItemCartQuantity = _.reduce(lines, function(total, line) {
           console.log('promoItemCartQuantity loop');
           console.log(line.get('item').get('internalid'));
           console.log(promoItemIds);
           console.log(promoItemIds.indexOf(line.get('item').get('internalid').toString()));
           console.log('tetssssssssssss');
           console.log((promoItemIds.indexOf(line.get('item').get('internalid').toString()) != -1 ? line.get('quantity') : 0));
           return total + (promoItemIds.indexOf(line.get('item').get('internalid').toString()) != -1 ? line.get('quantity') : 0);
          }, 0);
          
      console.log('promo 4');
      console.log(qtyRequiredForDiscount);
      console.log(promoItemIds);
      console.log(promoItemCartQuantity);
      // check for actual discount on rate also
      return promoItemCartQuantity >= promotion.qtyRequiredForDiscount;
     case '6':
      var freeItemId = promotion.freeItemId,
          hasLineWithPromotionApplied = _.find(lines, function(line) {
           return line.get('quantity') > 0;
          }),
          hasFreeItem = !!_.find(lines, function(line) {
           return line.get('item').get('internalid') == freeItemId && line.get('quantity') > 0 && line.get('rate') == 0;
          });
      
      return hasLineWithPromotionApplied && hasFreeItem;
     case '7':
     case '8':
      var qtyRequiredForDiscount = promotion.qtyRequiredForDiscount || 1,
          promoItemIds = promotion.promoItemIds || [],
          discountedItemIds = promotion.discountedItemIds || [],
          promoItemCartQuantity = _.reduce(lines, function(total, line) {
           return total + (promoItemIds.indexOf(line.get('item').get('internalid')) != -1 ? line.get('quantity') : 0);
          }, 0),
          hasDiscountedItems = !!_.find(lines, function(line) {
           return discountedItemIds.indexOf(line.get('item').get('internalid')) != -1 && line.get('quantity') > 0/* && line.get('rate') == line.get('item').getPrice().onlinecustomerprice */;
          });
          
      // check for actual discount on rate also
      return promoItemCartQuantity > qtyRequiredForDiscount && hasDiscountedItems;
     case '9':
     case '10':
      return false;
    }
    
    return false;
   },
   
  	getCartLinesWithCheckoutPromotions: function (promotionId)
   {
    var cartLinesWithCheckoutPromotions = this.cart.get('lines').filter(function(line) {
     var currentPromotions = line.get('item').get('_currentPromotions') || [],
         currentPromotions = _.each(currentPromotions, function(currentPromotion) {
          return currentPromotion.website && currentPromotion.website.indexOf('1') && currentPromotion.internalid == (promotionId || currentPromotion.internalid);
         });
     return currentPromotions.length > 0;
    });
    console.log('cartLinesWithCheckoutPromotions');
    console.log(cartLinesWithCheckoutPromotions);
    
    return cartLinesWithCheckoutPromotions || new Backbone.Collection();
   },
   
  	isItemInCart: function (itemId)
   {
    return !!_.find(this.getCartItemIds(), function(id) {
     return itemId == id;
    });
   },
   
  	getCartItemIds: function ()
   {
    var cartItemIds = _.unique(this.cart.get('lines').map(function(line) {
     return line.get('item').get('internalid');
    }));
    console.log('cartItemIds');
    console.log(cartItemIds);
    
    return cartItemIds;
   },
   
   childViews: _.extend({}, FacetsItemCellView.prototype.childViews, {
    
    'StockDescription': function() {},
    
    'ItemViews.Promotions': function() {
     console.log('ItemViews.Promotions zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
     var cartCheckoutPromotion = this.options.cartCheckoutPromotion || {},
         isPromoApplied = this.isPromotionApplied(this.model, cartCheckoutPromotion),
         actionButtonLabel = isPromoApplied ? _('Promotion applied!').translate() : undefined; //cartCheckoutPromotion.buttonText;
         console.log('isPromoApplied');
         console.log(isPromoApplied);
         console.log(cartCheckoutPromotion);
         console.log(actionButtonLabel);
     return new PromotionsView({
      application: this.application,
      model: this.model,
      actionButtonLabel: actionButtonLabel
     });
    }
    
   }),

   //@method getContext
   //@returns {bb1.PetshopShopping.Promotions.MissedPromoItems.Item.View.Context}
  	getContext: function getContext ()
   {
    var context = FacetsItemCellView.prototype.getContext.apply(this, arguments),
        item = this.model,
        cartCheckoutPromotion = this.options.cartCheckoutPromotion || {},
        isPromoApplied = this.isPromotionApplied(item, cartCheckoutPromotion);
        
    //@class bb1.PetshopShopping.Promotions.MissedPromoItems.Item.View.Context
    return _.extend(context, {
      //@property {Boolean} showRating
      showRating: false,
      //@property {Boolean} showPriceAsFree
      showPriceAsFree: true,
      //@property {Boolean} cheaperOptionsAvailable
      cheaperOptionsAvailable: false,
      //@property {String} actionButtonText
      actionButtonText: this.options.actionButtonLabel || _('Add to Cart +').translate(),
      //@property {Boolean} isPromoApplied
      isPromoApplied: isPromoApplied
    });
    //@class bb1.PetshopShopping.Promotions.MissedPromoItems.Item.View
   }
   
  });
  
 }
);

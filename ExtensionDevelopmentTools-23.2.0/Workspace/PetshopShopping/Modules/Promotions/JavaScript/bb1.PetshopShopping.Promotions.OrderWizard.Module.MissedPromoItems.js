//@module bb1.PetshopShopping.Promotions.OrderWizard.Module.MissedPromoItems
define(
	'bb1.PetshopShopping.Promotions.OrderWizard.Module.MissedPromoItems',
 [
  'Wizard.Module',
  'Profile.Model',
  'GlobalViews.Message.View',
  'bb1.PetshopShopping.Promotions.MissedPromoItems.Item.View',
  'bb1.PetshopShopping.Promotions.MissedPromoItems.Collection',
  'bb1.PetshopShopping.Promotions.Utils',
  'SC.Configuration',
  
  'bb1_petshopshopping_order_wizard_missedpromoitems_module.tpl',
  'backbone_collection_view_row.tpl',
  'backbone_collection_view_cell.tpl',
  
  'Backbone.CollectionView',
  'Backbone.CompositeView',
  'underscore',
  'jQuery'
	],
 function
 (
		WizardModule,
  ProfileModel,
  GlobalViewsMessageView,
  MissedPromoItemsItemView,
  MissedPromoItemsCollection,
  PromotionsUtils,
  Configuration,
  
  bb1_petshopshopping_order_wizard_missedpromoitems_module_tpl,
  backbone_collection_view_row_tpl,
  backbone_collection_view_cell_tpl,
  
  BackboneCollectionView,
  BackboneCompositeView,
  _,
  jQuery
	)
 {
  'use strict';
  
  //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.MissedPromoItems @extends Wizard.Module
  return WizardModule.extend({

   //@property {Function} template
   template: bb1_petshopshopping_order_wizard_missedpromoitems_module_tpl,
   
   //@method initialize
  	initialize: function (options)
   {
    var self = this;
    
    this.wizard = options.wizard;
    this.application = options.wizard.application;
    this.cart = options.wizard.model;
    
    //if (!this.collection) {
    
    WizardModule.prototype.initialize.apply(this, arguments);
    
    BackboneCompositeView.add(this);
   },
   
  	isActive: function ()
   {
    //return this.cartContainsCheckoutPromotions();
    return this.cartContainsMissedPromoItems();
   },
   
   //@method present
  	present: function ()
   {
    this.eventHandlersOn();
   },
   
   //@method future
  	future: function()
   {
    this.eventHandlersOff();
   },
   
   //@method past
  	past: function()
   {
    this.eventHandlersOff();
   },
   
   //@method eventHandlersOn
  	eventHandlersOn: function ()
   {
    this.eventHandlersOff();
    
    this.application.on('CartConfirmationView.AfterRender', this.hideShowCartButton);
   },
   
   //@method eventHandlersOff
  	eventHandlersOff: function ()
   {
    //if (this.slider)
     //this.slider.destroySlider();
   
    this.application.off('CartConfirmationView.AfterRender', this.hideShowCartButton);
   },
   
   hideShowCartButton: function(view) {
    //console.log('CartConfirmationView.AfterRender MissedPromotions');
    view = view || this.application.getLayout();
    view.$('.cart-confirmation-modal-view-cart').hide();
   },
   
   //@method render
  	render: function ()
   {
    var self = this;
    
    if (this.state === 'present')
    {
     this.reloadingItems = false;
    //if (!this.cartContainsMissedPromoItems()) {
     var cartAnimalTypes = this.getAnimalTypeFacetUrls();
     
     //self.application.getLayout().once('afterAppendView', function(view) {
     //this.on('afterViewRender', function(view) {
     // console.log('afterAppendView');
     // if (!self.reloadingItems)
       //self.initProductSlider();
     //});
     
     var missedPromoItemsStepConfig = Configuration.get('promotions.checkout.missedPromoItemsStep', {}),
         cartItemIds = this.getCartItemIds(),
         cartCheckoutPromotions = this.getCartCheckoutPromotions(),
         forceView = (_.parseUrlOptions(Backbone.history.fragment) || {}).force == 'true';
     
       //console.log('cartCheckoutPromotions');
       //console.log(cartCheckoutPromotions);
     
     this.collections = [];
     
     if (cartCheckoutPromotions.length) {
      this.reloadingItems = true;
      
      var fetchPromises = _.map(cartCheckoutPromotions, function(cartCheckoutPromotion) {
       var collection = new MissedPromoItemsCollection();
       collection.cartCheckoutPromotion = cartCheckoutPromotion;
       collection.title = cartCheckoutPromotion.buttonText || '';
       collection.description = cartCheckoutPromotion.pageDescription || '';
       collection.cartItemIds = cartItemIds;
       // filter cart items from list
       var cartCheckoutPromotionItemIds = cartCheckoutPromotion.promoItemIds && cartCheckoutPromotion.promoItemIds.join(',') || [],
           cartCheckoutDiscountedItemIds = cartCheckoutPromotion.discountedItemIds && cartCheckoutPromotion.discountedItemIds.join(',') || [],
           cartCheckoutAllPromotionItemIds = cartCheckoutPromotionItemIds.concat(cartCheckoutDiscountedItemIds);
       //console.log('cartCheckoutPromotionItemIds');
       //console.log(cartCheckoutPromotionItemIds);
       //console.log('cartCheckoutDiscountedItemIds');
       //console.log(cartCheckoutDiscountedItemIds);
       //console.log('cartCheckoutAllPromotionItemIds');
       //console.log(cartCheckoutAllPromotionItemIds);
       self.collections.push(collection);
       return collection.fetchItems({
        //excludedItems: cartItemIds,
        //items: cartCheckoutAllPromotionItemIds
        promotion: cartCheckoutPromotion.internalid
        //animalTypes: cartAnimalTypes
       });
      });
      
      jQuery.when.apply(jQuery, fetchPromises).done(function() {
       self.collections = _.filter(self.collections, function(collection) {
        return collection.models.length > 0;
       });
       self.reloadingItems = false;
       self.trigger('ready', true);
       self._render();
       self.initProductSlider();
      });
     }
     else if (!forceView) {
      this.wizard.goToNextStep();
     }
     
     this._render();
    }
   },
   
   initProductSlider: function()
   {
    var self = this,
        application = self.application,
        $carousel = this.$('[data-view="MissedPromoItems.List"]');
        
    /*if (!$carousel.is(':empty'))
     $carousel.bxSlider(Configuration.bxSliderDefaults);
    // this.slider.redrawSlider();
    else
     var timer = setInterval(function() {
      console.log('thht');
      var $carousel = self.$('[data-view="MissedPromoItems.List"]');
      
      if (!$carousel.is(':empty')) {
       self.slider = $carousel.bxSlider(Configuration.bxSliderDefaults);
       clearInterval(timer);
      }
     }, 10);*/
    // _.initBxSlider(carousel, Configuration.bxSliderDefaults);
    this.sliders = [];
    
    setTimeout(function() {
     self.$('[data-view^="MissedPromoItems.List"]').each(function() {
      self.sliders.push(jQuery(this).bxSlider(_.extend(Configuration.bxSliderDefaults, {
       //maxSlides: 6,
       //slideWidth: '141px',
       slideWidth: '211px',
       touchEnabled: PromotionsUtils.isMobileOrTablet() || !PromotionsUtils.isChrome()
      })));
     });
    }, 10);
    
   },
   
  	cartContainsMissedPromoItems: function ()
   {
    var self = this,
        lines = this.getCartLinesWithCheckoutPromotions();
        
    //console.log('22lines');
    //console.log(lines);
    if (!lines.length)
     return false;
    
    var missedPromotionLines = _.filter(lines, function(line) {
     return self.cartLineHasMissedCheckoutPromotion(line);
    }) || [];
    
    return missedPromotionLines.length > 0;
   },
   
  	//cartLineHasCheckoutPromotionApplied: function ()
  	cartLineHasMissedCheckoutPromotion: function (line)
   {
    var self = this,
        checkoutPromotions = line.get('item').get('_currentPromotions');
    
    var missedPromotions = _.filter(checkoutPromotions, function(checkoutPromotion) {
     return !self.isPromotionApplied(line, checkoutPromotion);
    }) || [];
    
    return missedPromotions.length > 0;
   },
   
   isPromotionApplied: function(line, promotion)
   {
    if (!line || !promotion)
     return false;
    
    switch (promotion.promoType) {
     case '1':
     case '2':
      if (!(promotion.qtyRequiredForDiscount > 0) || !(promotion.qtyDiscountFixed || promotion.qtyDiscountPercentage))
       return false;
      
      var lineWithPromotionApplied = line.get('quantity') >= promotion.qtyRequiredForDiscount;
      
      // check for actual discount on rate also
      return !!lineWithPromotionApplied;
     case '3':
      var cartLines = this.getCartLinesWithCheckoutPromotions(promotion.internalid);
      var freeItemId = promotion.freeItemId,
          hasLineWithPromotionApplied = _.find(cartLines, function(line) {
           return line.get('quantity') > 0;
          }),
          hasFreeItem = !!_.find(cartLines, function(line) {
           return line.get('item').get('internalid') == freeItemId && line.get('quantity') > 0 && line.get('rate') == 0;
          });
      
      return hasLineWithPromotionApplied && hasFreeItem;
     case '4':
     case '5':
      if (!(promotion.qtyRequiredForDiscount > 0) || !(promotion.qtyDiscountFixed || promotion.qtyDiscountPercentage))
       return false;
      
      var cartLines = this.getCartLinesWithCheckoutPromotions(promotion.internalid);
      var promoItemIds = promotion.promoItemIds || [],
          promoItemCartQuantity = _.reduce(cartLines, function(total, line) {
           //console.log('promoItemCartQuantity loop');
           //console.log(line.get('item').get('internalid'));
           //console.log(promoItemIds);
           //console.log(promoItemIds.indexOf(line.get('item').get('internalid').toString()));
           //console.log('tetssssssssssss');
           //console.log((promoItemIds.indexOf(line.get('item').get('internalid').toString()) != -1 ? line.get('quantity') : 0));
           return total + (promoItemIds.indexOf(line.get('item').get('internalid').toString()) != -1 ? line.get('quantity') : 0);
          }, 0);
          
      //console.log('promo 4');
      //console.log(qtyRequiredForDiscount);
      //console.log(promoItemIds);
      //console.log(promoItemCartQuantity);
      // check for actual discount on rate also
      return promoItemCartQuantity >= promotion.qtyRequiredForDiscount;
     case '6':
      var cartLines = this.getCartLinesWithCheckoutPromotions(promotion.internalid);
      var freeItemId = promotion.freeItemId,
          hasLineWithPromotionApplied = _.find(cartLines, function(line) {
           return line.get('quantity') > 0;
          }),
          hasFreeItem = !!_.find(cartLines, function(line) {
           return line.get('item').get('internalid') == freeItemId && line.get('quantity') > 0 && line.get('rate') == 0;
          });
      
      return hasLineWithPromotionApplied && hasFreeItem;
     case '7':
     case '8':
      var cartLines = this.getCartLinesWithCheckoutPromotions(promotion.internalid);
      var qtyRequiredForDiscount = promotion.qtyRequiredForDiscount || 1,
          promoItemIds = promotion.promoItemIds || [],
          discountedItemIds = promotion.discountedItemIds || [],
          promoItemCartQuantity = _.reduce(cartLines, function(total, line) {
           return total + (promoItemIds.indexOf(line.get('item').get('internalid')) != -1 ? line.get('quantity') : 0);
          }, 0),
          hasDiscountedItems = !!_.find(cartLines, function(line) {
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
   
  	cartContainsCheckoutPromotions: function ()
   {
    return !!this.getCartCheckoutPromotions().length;
   },
   
  	getCartCheckoutPromotions: function ()
   {
    var cartCheckoutPromotions = _.uniq(_.flatten(this.getCartLinesWithCheckoutPromotions().map(function(line) {
     return line.get('item').get('_currentPromotions');
    })), function(currentPromotion) {
     return currentPromotion.internalid;
    });
    //console.log('cartCheckoutPromotions');
    //console.log(cartCheckoutPromotions);
    
    return cartCheckoutPromotions || [];
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
    //console.log('cartLinesWithCheckoutPromotions');
    //console.log(cartLinesWithCheckoutPromotions);
    
    return cartLinesWithCheckoutPromotions || new Backbone.Collection();
   },
   
  	getCartItemIds: function ()
   {
    var cartItemIds = _.unique(this.cart.get('lines').map(function(line) {
     return line.get('item').get('internalid');
    }));
    //console.log('cartItemIds');
    //console.log(cartItemIds);
    
    return cartItemIds;
   },
   
  	getCartCategoryUrls: function ()
   {
    var cartCategoryUrls = _.unique(_.flatten(this.cart.get('lines').map(function(line) {
     var commerceCategory = line.get('item').get('commercecategory');
     return commerceCategory && commerceCategory.categories && _.map(commerceCategory.categories, function(category) {
      return category.urls[0];
     }) || [];
    })));
    //console.log('cartCategoryUrls');
    //console.log(cartCategoryUrls);
    
    return cartCategoryUrls;
   },
   
  	getAnimalTypeFacetUrls: function ()
   {
    var cartAnimalTypes = this.getCartAnimalTypes();
    //var urlFacetValues = (_.findWhere(this.collection.facets, {id: 'custitem_bb1_web_animaltype'}) || {}).values || [];
    
    return (_.map(cartAnimalTypes, function(cartAnimalType) {
     //return _.findWhere(urlFacetValues, {label: cartAnimalType}) || ''; // actual facet lookup requires preloading item api response
     return (cartAnimalType || '').replace(/&nbsp;/g, '').replace(/\W+/g, '-'); // assume hypenation instead of facet lookup for performance
    }) || []).join(',');
   },
   
  	getCartAnimalTypes: function ()
   {
    var cartAnimalTypes = [];
    this.cart.get('lines').each(function(line) {
     cartAnimalTypes = cartAnimalTypes.concat(line.get('item').get('custitem_bb1_web_animaltype').split(/\s*,\s*/));
    });
    cartAnimalTypes = _.unique(cartAnimalTypes);
    
    return cartAnimalTypes;
   },
   
   //@method submit
  	submit: function ()
   {
    return this.isValid();
   },

   //@method isValid
  	isValid: function isValid ()
   {
    var model = this.model,
       	valid_promise = jQuery.Deferred();

    valid_promise.resolve();
    
    return valid_promise;
   },

   //@method showError render the error message
  	showError: function ()
   {

    var global_view_message = new GlobalViewsMessageView({
      message: this.error.errorMessage,
     	type: 'error',
     	closable: true
    });

    this.$('[data-type="alert-placeholder-module"]:first').html(
     global_view_message.render().$el.html()
    );

    this.error = null;

   },
   
   childViews: {
    
    'MissedPromoItems.List0': function() {
     if (this.collections.length >= 1)
      return new BackboneCollectionView({
       collection: this.collections[0],
       //viewsPerRow: _.isDesktopDevice() ? 4 : _.isTabletDevice() ? 2 : 1,
       //rowTemplate: backbone_collection_view_row_tpl,
       //cellTemplate: backbone_collection_view_cell_tpl,
       childView: MissedPromoItemsItemView,
       childViewOptions: {
        application: this.application,
        wizard: this.wizard,
        cartCheckoutPromotion: this.collections[0].cartCheckoutPromotion,
        title: this.collections[0].title,
        description: this.collections[0].description,
        actionButtonLabel: this.options.actionButtonLabel
       }
      });
    },
    
    'MissedPromoItems.List1': function() {
     if (this.collections.length >= 2)
      return new BackboneCollectionView({
       collection: this.collections[1],
       //viewsPerRow: _.isDesktopDevice() ? 4 : _.isTabletDevice() ? 2 : 1,
       //rowTemplate: backbone_collection_view_row_tpl,
       //cellTemplate: backbone_collection_view_cell_tpl,
       childView: MissedPromoItemsItemView,
       childViewOptions: {
        application: this.application,
        wizard: this.wizard,
        cartCheckoutPromotion: this.collections[1].cartCheckoutPromotion,
        title: this.collections[1].title,
        description: this.collections[1].description,
        actionButtonLabel: this.options.actionButtonLabel
       }
      });
    },
    
    'MissedPromoItems.List2': function() {
     if (this.collections.length >= 3)
      return new BackboneCollectionView({
       collection: this.collections[2],
       //viewsPerRow: _.isDesktopDevice() ? 4 : _.isTabletDevice() ? 2 : 1,
       //rowTemplate: backbone_collection_view_row_tpl,
       //cellTemplate: backbone_collection_view_cell_tpl,
       childView: MissedPromoItemsItemView,
       childViewOptions: {
        application: this.application,
        wizard: this.wizard,
        cartCheckoutPromotion: this.collections[2].cartCheckoutPromotion,
        title: this.collections[2].title,
        description: this.collections[2].description,
        actionButtonLabel: this.options.actionButtonLabel
       }
      });
    },
    
    'MissedPromoItems.List3': function() {
     if (this.collections.length >= 4)
      return new BackboneCollectionView({
       collection: this.collections[3],
       //viewsPerRow: _.isDesktopDevice() ? 4 : _.isTabletDevice() ? 2 : 1,
       //rowTemplate: backbone_collection_view_row_tpl,
       //cellTemplate: backbone_collection_view_cell_tpl,
       childView: MissedPromoItemsItemView,
       childViewOptions: {
        application: this.application,
        wizard: this.wizard,
        cartCheckoutPromotion: this.collections[3].cartCheckoutPromotion,
        title: this.collections[3].title,
        description: this.collections[3].description,
        actionButtonLabel: this.options.actionButtonLabel
       }
      });
    }
    
   },

   //@method getContext
   //@returns {bb1.PetshopShopping.Promotions.OrderWizard.Module.MissedPromoItems.Context}
  	getContext: function ()
   {
    var self = this;

    //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.MissedPromoItems.Context
    return {
      //@property {LiveOrder.Model} collections
      collections: this.collections,
      //@property {Boolean} noItems
     	noItems: this.collections.length == 0,
      //@property {Boolean} showTitle
     	showTitle: !this.options.hide_title,
      //@property {String} title
     	title: this.options.title || _('Incomplete offers in your cart').translate(),
      //@property {Boolean} showLoadingItems
     	showLoadingItems: this.reloadingItems
    };
    //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.MissedPromoItems
   }
   
  });
  
 }
);

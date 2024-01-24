//@module bb1.PetshopShopping.Promotions.OrderWizard.Module.UpsellItems
define(
	'bb1.PetshopShopping.Promotions.OrderWizard.Module.UpsellItems',
 [
  'Wizard.Module',
  'Profile.Model',
  'GlobalViews.Message.View',
  'bb1.PetshopShopping.Promotions.UpsellItems.Item.View',
  'bb1.PetshopShopping.Promotions.UpsellItems.Collection',
  'bb1.PetshopShopping.Promotions.Utils',
  'SC.Configuration',
  
  'bb1_petshopshopping_order_wizard_upsellitems_module.tpl',
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
  UpsellItemsItemView,
  UpsellItemsCollection,
  PromotionsUtils,
  Configuration,
  
  bb1_petshopshopping_order_wizard_upsellitems_module_tpl,
  backbone_collection_view_row_tpl,
  backbone_collection_view_cell_tpl,
  
  BackboneCollectionView,
  BackboneCompositeView,
  _,
  jQuery
	)
 {
  'use strict';
  
  //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.UpsellItems @extends Wizard.Module
  return WizardModule.extend({

   //@property {Function} template
   template: bb1_petshopshopping_order_wizard_upsellitems_module_tpl,
   
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
    return true; //!this.cartContainsUpsellItems();
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
    
    //console.log('eventHandlersOn');
    this.application.on('CartConfirmationView.AfterRender', this.hideShowCartButton);
   },
   
   //@method eventHandlersOff
  	eventHandlersOff: function ()
   {
    //if (this.slider)
     //this.slider.destroySlider();
    //console.log('eventHandlersOff');
    this.application.off('CartConfirmationView.AfterRender', this.hideShowCartButton);
   },
   
   hideShowCartButton: function(view) {
    //console.log('CartConfirmationView.AfterRender Upsell');
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
    //if (!this.cartContainsUpsellItems()) {
     var cartAnimalTypes = this.getAnimalTypeFacetUrls();
     
     //self.application.getLayout().once('afterAppendView', function(view) {
     //this.on('afterViewRender', function(view) {
     // console.log('afterAppendView');
     // if (!self.reloadingItems)
       //self.initProductSlider();
     //});
     
     var upsellItemsStepConfig = Configuration.get('promotions.checkout.upsellItemsStep', {}),
         cartItemIds = this.getCartItemIds(),
         cartCategoryUrls = this.getCartCategoryUrls(),
         relatedCategoryUrls = [],
         uniqueCategoryUrls = [];
         
     var activeRelatedCategories = _.where(upsellItemsStepConfig.relatedCategories, {inactive: false});
     
     var mappedRelatedCategories = _.map(cartCategoryUrls, function(cartCategoryUrl) {
      var relatedCategories = cartCategoryUrl && _.where(activeRelatedCategories, {url: cartCategoryUrl}) || [];
      /*if (relatedCategories.length) {
       //relatedCategories = _.filter(relatedCategories, function(relatedCategory) { return relatedCategoryUrls.indexOf(relatedCategory.relatedUrl) == -1
       relatedCategoryUrls = relatedCategoryUrls.concat(_.map(relatedCategories, function(relatedCategory) { return relatedCategory.relatedUrl; }));
       relatedCategoryUrls = _.compact(_.unique(relatedCategoryUrls));
      }*/
      return relatedCategories;
     });
     var filteredRelatedCategories = _.filter(_.flatten(mappedRelatedCategories), function(relatedCategory) {
      return relatedCategory && relatedCategory.relatedUrl && cartCategoryUrls.indexOf(relatedCategory.relatedUrl) == -1;
     });
     //console.log('filteredRelatedCategories');
     //console.log(_.flatten(filteredRelatedCategories));
     var relatedCategories = _.filter(_.sortBy(filteredRelatedCategories, function(relatedCategory) {
      return relatedCategory.priority;
     }), function(relatedCategory) {
      if (uniqueCategoryUrls.indexOf(relatedCategory.relatedUrl) == -1) {
       uniqueCategoryUrls.push(relatedCategory.relatedUrl);
       return true;
      }
      return true;
     });
     
     //console.log('relatedCategories');
     //console.log(relatedCategories);
     this.collections = [];
     
     //relatedCategories = [];
     
     var forceView = (_.parseUrlOptions(Backbone.history.fragment) || {}).force == 'true';
     
     if (relatedCategories.length) {
      this.reloadingItems = true;
      
      var maxItemListsDisplayed = upsellItemsStepConfig.maxItemListsDisplayed || 4;
      var fetchPromises = _.map(_.first(relatedCategories, maxItemListsDisplayed), function(relatedCategory) {
       var collection = new UpsellItemsCollection();
       collection.title = relatedCategory.title || '';
       self.collections.push(collection);
       return collection.fetchItems({
        excludedItems: cartItemIds,
        animalTypes: cartAnimalTypes,
        categories: relatedCategory.relatedUrl
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
      //this.once('afterRenderView', function(view) {
       // workaround render events causing errors on force to next step
       setTimeout(function() {
        self.wizard.goToNextStep();
       }, 500);
      //});
     }
     
     this._render();
    }
   },
   
   initProductSlider: function()
   {
    var self = this,
        application = self.application,
        $carousel = this.$('[data-view="UpsellItems.List"]');
        
    /*if (!$carousel.is(':empty'))
     $carousel.bxSlider(Configuration.bxSliderDefaults);
    // this.slider.redrawSlider();
    else
     var timer = setInterval(function() {
      console.log('thht');
      var $carousel = self.$('[data-view="UpsellItems.List"]');
      
      if (!$carousel.is(':empty')) {
       self.slider = $carousel.bxSlider(Configuration.bxSliderDefaults);
       clearInterval(timer);
      }
     }, 10);*/
    // _.initBxSlider(carousel, Configuration.bxSliderDefaults);
    this.sliders = [];
    
    setTimeout(function() {
     self.$('[data-view^="UpsellItems.List"]').each(function() {
      self.sliders.push(jQuery(this).bxSlider(_.extend(Configuration.bxSliderDefaults, {
       //maxSlides: 10,
       //slideWidth: '141px',
       slideWidth: '211px',
       touchEnabled: PromotionsUtils.isMobileOrTablet() || !PromotionsUtils.isChrome()
      })));
     });
    }, 10);
    
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
    
    'UpsellItems.List0': function() {
     if (this.collections.length >= 1)
      return new BackboneCollectionView({
       collection: this.collections[0],
       //viewsPerRow: _.isDesktopDevice() ? 4 : _.isTabletDevice() ? 2 : 1,
       //rowTemplate: backbone_collection_view_row_tpl,
       //cellTemplate: backbone_collection_view_cell_tpl,
       childView: UpsellItemsItemView,
       childViewOptions: {
        application: this.application,
        wizard: this.wizard,
        title: this.collections[0].title,
        actionButtonLabel: this.options.actionButtonLabel
       }
      });
    },
    
    'UpsellItems.List1': function() {
     if (this.collections.length >= 2)
      return new BackboneCollectionView({
       collection: this.collections[1],
       //viewsPerRow: _.isDesktopDevice() ? 4 : _.isTabletDevice() ? 2 : 1,
       //rowTemplate: backbone_collection_view_row_tpl,
       //cellTemplate: backbone_collection_view_cell_tpl,
       childView: UpsellItemsItemView,
       childViewOptions: {
        application: this.application,
        wizard: this.wizard,
        title: this.collections[1].title,
        actionButtonLabel: this.options.actionButtonLabel
       }
      });
    },
    
    'UpsellItems.List2': function() {
     if (this.collections.length >= 3)
      return new BackboneCollectionView({
       collection: this.collections[2],
       //viewsPerRow: _.isDesktopDevice() ? 4 : _.isTabletDevice() ? 2 : 1,
       //rowTemplate: backbone_collection_view_row_tpl,
       //cellTemplate: backbone_collection_view_cell_tpl,
       childView: UpsellItemsItemView,
       childViewOptions: {
        application: this.application,
        wizard: this.wizard,
        title: this.collections[2].title,
        actionButtonLabel: this.options.actionButtonLabel
       }
      });
    },
    
    'UpsellItems.List3': function() {
     if (this.collections.length >= 4)
      return new BackboneCollectionView({
       collection: this.collections[3],
       //viewsPerRow: _.isDesktopDevice() ? 4 : _.isTabletDevice() ? 2 : 1,
       //rowTemplate: backbone_collection_view_row_tpl,
       //cellTemplate: backbone_collection_view_cell_tpl,
       childView: UpsellItemsItemView,
       childViewOptions: {
        application: this.application,
        wizard: this.wizard,
        title: this.collections[3].title,
        actionButtonLabel: this.options.actionButtonLabel
       }
      });
    }
    
   },

   //@method getContext
   //@returns {bb1.PetshopShopping.Promotions.OrderWizard.Module.UpsellItems.Context}
  	getContext: function ()
   {
    var self = this;

    //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.UpsellItems.Context
    return {
      //@property {LiveOrder.Model} collections
      collections: this.collections,
      //@property {Boolean} noItems
     	noItems: this.collections.length == 0,
      //@property {Boolean} showTitle
     	showTitle: !this.options.hide_title,
      //@property {String} title
     	title: this.options.title || _('Before you go...').translate(),
      //@property {Boolean} showLoadingItems
     	showLoadingItems: this.reloadingItems
    };
    //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.UpsellItems
   }
   
  });
  
 }
);

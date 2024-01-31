//@module bb1.PetshopShopping.Promotions.OrderWizard.Module.SeasonalItems
define(
	'bb1.PetshopShopping.Promotions.OrderWizard.Module.SeasonalItems',
 [
  'Wizard.Module',
  'Profile.Model',
  'GlobalViews.Message.View',
  'bb1.PetshopShopping.Promotions.SeasonalItems.Item.View',
  'bb1.PetshopShopping.Promotions.SeasonalItems.Collection',
  'bb1.PetshopShopping.Promotions.Utils',
  'SC.Configuration',
  
  'bb1_petshopshopping_order_wizard_seasonalitems_module.tpl',
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
  SeasonalItemsItemView,
  SeasonalItemsCollection,
  PromotionsUtils,
  Configuration,
  
  bb1_petshopshopping_order_wizard_seasonalitems_module_tpl,
  backbone_collection_view_row_tpl,
  backbone_collection_view_cell_tpl,
  
  BackboneCollectionView,
  BackboneCompositeView,
  _,
  jQuery
	)
 {
  'use strict';
  
  //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.SeasonalItems @extends Wizard.Module
  return WizardModule.extend({

   //@property {Function} template
   template: bb1_petshopshopping_order_wizard_seasonalitems_module_tpl,
   
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
    return true; //!this.cartContainsSeasonalItems();
   },
   
   //@method present
  	present: function ()
   {
    this.eventHandlersOn();
   },
   
   //@method future
  	future: function()
   {
    this.eventHandlersOn();
   },
   
   //@method past
  	past: function()
   {
    this.eventHandlersOn();
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
     this.loadingItems = false;
    //if (!this.cartContainsSeasonalItems()) {
     var cartAnimalTypes = this.getAnimalTypeFacetUrls();
     
     //self.application.getLayout().once('afterAppendView', function(view) {
     //this.on('afterViewRender', function(view) {
     // console.log('afterAppendView');
     // if (!self.loadingItems)
       //self.initProductSlider();
     //});
     
     var seasonalItemsStepConfig = Configuration.get('promotions.checkout.seasonalItemsStep', {}),
         facetFilterId = seasonalItemsStepConfig.facetFilterId,
         facetFilterValue = seasonalItemsStepConfig.facetFilterValue,
         cartItemIds = this.getCartItemIds(),
         forceView = (_.parseUrlOptions(Backbone.history.fragment) || {}).force == 'true';
     
     this.collection = new SeasonalItemsCollection();
     
     if (facetFilterId && facetFilterValue && !this.hasCartItemsWithFacet(facetFilterId, facetFilterValue)) {
      this.loadingItems = true;
      
      this.collection.fetchItems({
       //excludedItems: cartItemIds,
       facetFilterId: seasonalItemsStepConfig.facetFilterId,
       facetFilterValue: seasonalItemsStepConfig.facetFilterValue
       //animalTypes: cartAnimalTypes
      }).done(function() {
       self.loadingItems = false;
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
        $carousel = this.$('[data-view="SeasonalItems.List"]');
        
    /*if (!$carousel.is(':empty'))
     $carousel.bxSlider(Configuration.bxSliderDefaults);
    // this.slider.redrawSlider();
    else
     var timer = setInterval(function() {
      console.log('thht');
      var $carousel = self.$('[data-view="SeasonalItems.List"]');
      
      if (!$carousel.is(':empty')) {
       self.slider = $carousel.bxSlider(Configuration.bxSliderDefaults);
       clearInterval(timer);
      }
     }, 10);*/
    // _.initBxSlider(carousel, Configuration.bxSliderDefaults);
    this.sliders = [];
    
    setTimeout(function() {
     self.$('[data-view="SeasonalItems.List"]').each(function() {
      self.sliders.push(jQuery(this).bxSlider(_.extend(Configuration.bxSliderDefaults, {
       slideWidth: '211px',
       touchEnabled: PromotionsUtils.isMobileOrTablet() || !PromotionsUtils.isChrome()
      })));
     });
    }, 10);
    
   },
   
  	hasCartItemsWithFacet: function (facetId, facetValue)
   {
    //console.log('this.getCartItemsWithFacet(facetId, facetValue)');
    //console.log(this.getCartItemsWithFacet(facetId, facetValue));
    return !!this.getCartItemsWithFacet(facetId, facetValue).length;
   },
   
  	getCartItemsWithFacet: function (facetId, facetValue)
   {
    var self = this,
        cartItemsWithFacet = [];
        
        //console.log('getCartItemsWithFacet');
        //console.log(facetId);
    this.cart.get('lines').each(function(line) {
     var facetValues = self.parseMultiSelectFacetValue(line.get('item').get(facetId));
     //console.log("facetValue.replace(/-/g, ' ')");
     //console.log(facetValue.replace(/-/g, ' '));
     if (facetValues.indexOf(facetValue.replace(/-/g, ' ')) != -1) // use a facet value lookup, where to source?
      cartItemsWithFacet.push(line.get('item').get('internalid'));
    });
    
    return cartItemsWithFacet;
   },
   
  	parseMultiSelectFacetValue: function (facetValue)
   {
    //console.log('parseMultiSelectFacetValue');
    //console.log(facetValue);
    var facetValues = (facetValue || '').split(/\s*,\s*/);
     
    facetValues = _.map(facetValues, function(facetValue) {
     return facetValue != '&nbsp;' ? facetValue : ''; 
    });
    
    //console.log('facetValues');
    //console.log(facetValues);
    return facetValues.length ? facetValues : null;
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
    
    'SeasonalItems.List': function() {
     return new BackboneCollectionView({
      collection: this.collection,
      childView: SeasonalItemsItemView,
      childViewOptions: {
       application: this.application,
       wizard: this.wizard,
       actionButtonLabel: this.options.actionButtonLabel
      }
     });
    }
    
   },

   //@method getContext
   //@returns {bb1.PetshopShopping.Promotions.OrderWizard.Module.SeasonalItems.Context}
  	getContext: function ()
   {
    var self = this;

    //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.SeasonalItems.Context
    return {
      //@property {Item.Collection} collection
      collection: this.collection,
      //@property {Boolean} noItems
     	noItems: this.collection.length == 0,
      //@property {Boolean} showTitle
     	showTitle: !this.options.hide_title,
      //@property {String} title
     	title: this.options.title || _("It's Christmas! Don't forget your pets presents...").translate(),
      //@property {Boolean} showLoadingItems
     	showLoadingItems: this.loadingItems
    };
    //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.SeasonalItems
   }
   
  });
  
 }
);

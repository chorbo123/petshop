//@module bb1.PetshopShopping.Promotions.OrderWizard.Module.TreatmentItems
define(
	'bb1.PetshopShopping.Promotions.OrderWizard.Module.TreatmentItems',
 [
  'Wizard.Module',
  'Profile.Model',
  'GlobalViews.Message.View',
  'bb1.PetshopShopping.Promotions.TreatmentItems.Item.View',
  'bb1.PetshopShopping.Promotions.TreatmentItems.Collection',
  'bb1.PetshopShopping.Promotions.Utils',
  'SC.Configuration',
  
  'bb1_petshopshopping_order_wizard_treatmentitems_module.tpl',
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
  TreatmentItemsItemView,
  TreatmentItemsCollection,
  PromotionsUtils,
  Configuration,
  
  bb1_petshopshopping_order_wizard_treatmentitems_module_tpl,
  backbone_collection_view_row_tpl,
  backbone_collection_view_cell_tpl,
  
  BackboneCollectionView,
  BackboneCompositeView,
  _,
  jQuery
	)
 {
  'use strict';
  
  //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.TreatmentItems @extends Wizard.Module
  return WizardModule.extend({

   //@property {Function} template
   template: bb1_petshopshopping_order_wizard_treatmentitems_module_tpl,
   
   //@method initialize
  	initialize: function (options)
   {
    var self = this;
    
    this.wizard = options.wizard;
    this.application = options.wizard.application;
    this.cart = options.wizard.model;
    
    WizardModule.prototype.initialize.apply(this, arguments);
    
    BackboneCompositeView.add(this);
   },
   
  	isActive: function ()
   {
    return true; //!this.cartContainsTreatmentItems();
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
    //console.log('CartConfirmationView.AfterRender Treatment');
    view = view || this.application.getLayout();
    view.$('.cart-confirmation-modal-view-cart').hide();
   },
   
   //@method render
  	render: function ()
   {
    var self = this;
    
    if (this.state === 'present')
    {
     var forceView = (_.parseUrlOptions(Backbone.history.fragment) || {}).force == 'true';
     
     this.reloadingItems = false;
     
     var cartAnimalTypes = this.getCartAnimalTypeFacetUrls(),
         hasDogOrCatItemsInCart = !!_.find(this.getCartAnimalTypes(), function(cartAnimalType) { return ['Dog', 'Cat'].indexOf(cartAnimalType) != -1; });
     
     //console.log('this.getCartAnimalTypes()');
     //console.log(this.getCartAnimalTypes());
     
     //console.log('hasDogOrCatItemsInCart');
     //console.log(hasDogOrCatItemsInCart);
     
     var treatmentItemsStepConfig = Configuration.get('promotions.checkout.treatmentItemsStep', {}),
         cartItemIds = this.getCartItemIds(),
         cartCategoryUrls = this.getCartCategoryUrls();
         
     var activeTreatmentCategories = _.where(treatmentItemsStepConfig.treatmentCategories, {inactive: false});
     
     var mappedTreatmentCategories = _.flatten(_.map(cartCategoryUrls, function(cartCategoryUrl) {
      var treatmentCategories = cartCategoryUrl && _.where(activeTreatmentCategories, {/*treatmentType: '',*/ url: cartCategoryUrl}) || [];
      return treatmentCategories;
     }));
     
     //console.log('mappedTreatmentCategories');
     //console.log(mappedTreatmentCategories);
     
     var containsFleaTreatments = !!_.findWhere(mappedTreatmentCategories, {treatmentType: 'Flea'});
     var containsWormingTreatments = !!_.findWhere(mappedTreatmentCategories, {treatmentType: 'Worming'});
     
     //console.log('containsFleaTreatments');
     //console.log(containsFleaTreatments);
     
     //console.log('containsWormingTreatments');
     //console.log(containsWormingTreatments);
     
     //relatedCategories = [];
     
     self.fleaTreatmentCollection = new TreatmentItemsCollection();
     self.wormingTreatmentCollection = new TreatmentItemsCollection();
     
     if (hasDogOrCatItemsInCart && (!containsFleaTreatments || !containsWormingTreatments)) {
      var promises = [];
      
      self.reloadingItems = true;
      
      if (!containsFleaTreatments)
       promises.push(
        self.fleaTreatmentCollection.fetchItems({
         excludedItems: cartItemIds,
         animalTypes: cartAnimalTypes,
         category: '/Flea-Treatments'
        })
       );
       
      if (!containsWormingTreatments)
       promises.push(
        self.wormingTreatmentCollection.fetchItems({
         excludedItems: cartItemIds,
         animalTypes: cartAnimalTypes,
         category: '/Worming-Treatments'
        })
       );
       
      jQuery.when.apply(jQuery, promises).done(function() {
       self.reloadingItems = false;
       self.trigger('ready', true);
       self._render();
       self.initProductSliders();
      });
     }
     else if (!forceView) {
      self.wizard.goToNextStep();
     }
     
     this._render();
    }
   },
   
   initProductSliders: function()
   {
    var self = this,
        application = self.application,
        $carousel = this.$('[data-view="TreatmentItems.List"]');
        
    this.sliders = [];
    
    setTimeout(function() {
     self.$('[data-view$="Treatment.ItemList"]').each(function() {
      self.sliders.push(jQuery(this).bxSlider(_.extend(Configuration.bxSliderDefaults, {
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
   
  	getCartAnimalTypeFacetUrls: function ()
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
    
    'FleaTreatment.ItemList': function() {
     return new BackboneCollectionView({
      collection: this.fleaTreatmentCollection,
      childView: TreatmentItemsItemView,
      childViewOptions: {
       application: this.application,
       wizard: this.wizard,
       actionButtonLabel: this.options.actionButtonLabel
      }
     });
    },
    
    'WormingTreatment.ItemList': function() {
     return new BackboneCollectionView({
      collection: this.wormingTreatmentCollection,
      childView: TreatmentItemsItemView,
      childViewOptions: {
       application: this.application,
       wizard: this.wizard,
       actionButtonLabel: this.options.actionButtonLabel
      }
     });
    }
    
   },

   //@method getContext
   //@returns {bb1.PetshopShopping.Promotions.OrderWizard.Module.TreatmentItems.Context}
  	getContext: function ()
   {
    var self = this,
        hasFleaTreatmentItems = this.fleaTreatmentCollection.models.length > 0,
        hasWormingTreatmentItems = this.wormingTreatmentCollection.models.length > 0;

    //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.TreatmentItems.Context
    return {
      //@property {Item.Collection} fleaTreatmentCollection
      fleaTreatmentCollection: this.fleaTreatmentCollection,
      //@property {Item.Collection} wormingTreatmentCollection
      wormingTreatmentCollection: this.wormingTreatmentCollection,
      //@property {Boolean} hasFleaTreatmentItems
     	hasFleaTreatmentItems: hasFleaTreatmentItems,
      //@property {Boolean} hasWormingTreatmentItems
     	hasWormingTreatmentItems: hasWormingTreatmentItems,
      //@property {Boolean} noItems
     	noItems: !hasFleaTreatmentItems && !hasWormingTreatmentItems,
      //@property {Boolean} showTitle
     	showTitle: !this.options.hide_title,
      //@property {String} title
     	title: this.options.title || _('Add Flea and Wormer').translate(),
      //@property {String} fleaTreatmentItemsTitle
     	fleaTreatmentItemsTitle: !hasWormingTreatmentItems ? _('Remember to protect your pets from fleas every month.').translate() : _('Remember to protect your pets from fleas every month...').translate(),
      //@property {String} wormingTreatmentItemsTitle
     	wormingTreatmentItemsTitle: !hasFleaTreatmentItems ? _('Remember to protect your pets from worms every 3 months!').translate() : _('And from worms every 3 months!').translate(),
      //@property {Boolean} showLoadingItems
     	showLoadingItems: this.reloadingItems
    };
    //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.TreatmentItems
   }
   
  });
  
 }
);

//@module bb1.PetshopShopping.Promotions.OrderWizard.Module.FreeItems
define(
	'bb1.PetshopShopping.Promotions.OrderWizard.Module.FreeItems',
 [
  'Wizard.Module',
  'Profile.Model',
  'GlobalViews.Message.View',
  'ItemRelations.RelatedItem.View',
  'bb1.PetshopShopping.Promotions.FreeItems.Item.View',
  'bb1.PetshopShopping.Promotions.FreeItems.Collection',
  
  'bb1_petshopshopping_order_wizard_freeitems_module.tpl',
  'backbone_collection_view_row.tpl',
  'backbone_collection_view_cell.tpl',
  
  'Backbone.CollectionView',
  'Backbone.CompositeView',
  'underscore',
  'jQuery',
  'Utils'
	],
 function
 (
		WizardModule,
  ProfileModel,
  GlobalViewsMessageView,
  ItemRelationsRelatedItemView,
  FreeItemsItemView,
  FreeItemsCollection,
  
  bb1_petshopshopping_order_wizard_freeitems_module_tpl,
  backbone_collection_view_row_tpl,
  backbone_collection_view_cell_tpl,
  
  BackboneCollectionView,
  BackboneCompositeView,
  _,
  jQuery,
  Utils
	)
 {
  'use strict';
  
  //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.FreeItems @extends Wizard.Module
  return WizardModule.extend({

   //@property {Function} template
   template: bb1_petshopshopping_order_wizard_freeitems_module_tpl,
   
   //@property {Object} events
   events: {
    'change [data-action="select-delivery-option"]': 'changeDeliveryOptions',
   	'click [data-action="select-delivery-option-radio"]': 'changeDeliveryOptions'
   },
   
   //@method initialize
  	initialize: function (options)
   {
    var self = this;
    
    this.wizard = options.wizard;
    this.application = options.wizard.application;
    this.cart = options.wizard.model;
    this.collection = new FreeItemsCollection();
    this.reloadingItems = true;
    
    WizardModule.prototype.initialize.apply(this, arguments);
    
    BackboneCompositeView.add(this);
   },

  	cartContainsFreeItems: function ()
   {
    var cartContainsFreeItems = !!this.cart.get('lines').find(function(line) {
     return line.get('item').get('custitem_bb1_web_freeitem') === true;
    });
    
    return cartContainsFreeItems;
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
   
  	isActive: function ()
   {
    return !this.cartContainsFreeItems();
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
   },
   
   //@method eventHandlersOff
  	eventHandlersOff: function ()
   {
   },
   
   //@method render
  	render: function ()
   {
    var self = this;
    
    if (this.state === 'present')
    {
     var forceView = (_.parseUrlOptions(Backbone.history.fragment) || {}).force == 'true';
     
     if (!this.cartContainsFreeItems()) {
      var cartAnimalTypes = this.getAnimalTypeFacetUrls();
      
      this.collection.fetchItems({animalTypes: cartAnimalTypes}).done(function() {
       if (self.collection.models.length) {
        self.reloadingItems = false;
        self.trigger('ready', true);
        self._render();
       }
       else {
        self.wizard.goToNextStep();
       }
      });
     }
     else if (!forceView) {
      this.wizard.goToNextStep();
     }
     
     this._render();
    }
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
    
    'FreeItems.List': function() {
     return new BackboneCollectionView({
      collection: this.collection,
     	viewsPerRow: _.isDesktopDevice() ? 4 : _.isTabletDevice() ? 2 : 1,
     	rowTemplate: backbone_collection_view_row_tpl,
     	cellTemplate: backbone_collection_view_cell_tpl,
     	childView: FreeItemsItemView,
     	childViewOptions: {
       application: this.application,
       wizard: this.wizard
      }
     });
    }
    
   },

   //@method getContext
   //@returns {bb1.PetshopShopping.Promotions.OrderWizard.Module.FreeItems.Context}
  	getContext: function ()
   {
    var self = this;

    //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.FreeItems.Context
    return {
      //@property {LiveOrder.Model} model
      model: this.model,
      //@property {Boolean} showTitle
     	showTitle: !this.options.hide_title,
      //@property {String} title
     	title: this.options.title,
      //@property {Boolean} cartContainsFreeItems
     	cartContainsFreeItems: this.cartContainsFreeItems(),
      //@property {Boolean} showLoadingItems
     	showLoadingItems: this.reloadingItems
    };
    //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.FreeItems
   }
   
  });
  
 }
);

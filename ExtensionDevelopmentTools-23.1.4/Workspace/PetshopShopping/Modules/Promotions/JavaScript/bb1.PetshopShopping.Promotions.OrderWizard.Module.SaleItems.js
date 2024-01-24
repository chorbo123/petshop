//@module bb1.PetshopShopping.Promotions.OrderWizard.Module.SaleItems
define(
	'bb1.PetshopShopping.Promotions.OrderWizard.Module.SaleItems',
 [
  'Wizard.Module',
  'Profile.Model',
  'GlobalViews.Message.View',
  'ItemRelations.RelatedItem.View',
  'bb1.PetshopShopping.Promotions.SaleItems.Item.View',
  'bb1.PetshopShopping.Promotions.SaleItems.Collection',
  'SC.Configuration',
  
  'bb1_petshopshopping_order_wizard_saleitems_module.tpl',
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
  ItemRelationsRelatedItemView,
  SaleItemsItemView,
  SaleItemsCollection,
  Configuration,
  
  bb1_petshopshopping_order_wizard_saleitems_module_tpl,
  backbone_collection_view_row_tpl,
  backbone_collection_view_cell_tpl,
  
  BackboneCollectionView,
  BackboneCompositeView,
  _,
  jQuery
	)
 {
  'use strict';
  
  //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.SaleItems @extends Wizard.Module
  return WizardModule.extend({

   //@property {Function} template
   template: bb1_petshopshopping_order_wizard_saleitems_module_tpl,
   
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
    this.collection = new SaleItemsCollection();
    
    WizardModule.prototype.initialize.apply(this, arguments);
    
    BackboneCompositeView.add(this);
   },

  	isActive: function ()
   {
    return this.getUnboughtSaleItemFacetUrls();
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
     var saleItemIds = this.getUnboughtSaleItemFacetUrls(),
         forceView = (_.parseUrlOptions(Backbone.history.fragment) || {}).force == 'true';
     
     this.reloadingItems = false;
     
      //console.log('saleItemIds');
      //console.log(saleItemIds);
      //console.log('this.cartContainsSaleItems()');
      //console.log(this.cartContainsSaleItems());
     if (saleItemIds) {
      this.reloadingItems = true;
      
      var cartAnimalTypes = this.getAnimalTypeFacetUrls();
      
      //console.log('cartAnimalTypes');
      //console.log(cartAnimalTypes);
      
      this.collection.fetchItems({
       items: saleItemIds,
       animalTypes: cartAnimalTypes
      }).done(function() {
       self.reloadingItems = false;
       self.trigger('ready', true);
       self._render();
      });
     }
     else if (!forceView) {
      this.wizard.goToNextStep();
     }
     
     this._render();
    }
   },
   
  	cartContainsSaleItems: function ()
   {
    var saleItemIds = this.getSaleItemIds(),
        cartItemIds = this.getCartItemIds();
    
    //console.log('cartContainsSaleItems saleItemIds');
    //console.log(saleItemIds);
    return !!_.find(cartItemIds, function(cartItemId) {
     return saleItemIds.indexOf(cartItemId.toString()) != -1;
    });
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
   
  	getUnboughtSaleItemFacetUrls: function ()
   {
    return this.getUnboughtSaleItemIds().join(',');
   },
   
  	getUnboughtSaleItemIds: function ()
   {
    var cartItemIds = this.getCartItemIds(),
        saleItemIds = this.getSaleItemIds();
        
        //console.log('saleItemIds 22');
        //console.log(cartItemIds);
        //console.log(saleItemIds);
    return _.filter(saleItemIds, function(saleItemId) {
     return cartItemIds.indexOf(saleItemId) == -1;
    });
   },
   
  	getSaleItemIds: function ()
   {
    var saleItemsStepConfig = Configuration.get('promotions.checkout.saleItemsStep', {});
        
    return _.pluck(_.where(saleItemsStepConfig.saleItems, {inactive: false}), 'id') || [];
   },
   
  	getCartItemIds: function ()
   {
    var cartItemIds = _.unique(this.cart.get('lines').map(function(line) {
     return line.get('item').get('internalid').toString();
    }));
    //console.log('cartItemIds');
    //console.log(cartItemIds);
    
    return cartItemIds;
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
    
    'SaleItems.List': function() {
     return new BackboneCollectionView({
      collection: this.collection,
     	viewsPerRow: _.isDesktopDevice() ? 4 : _.isTabletDevice() ? 2 : 1,
     	rowTemplate: backbone_collection_view_row_tpl,
     	cellTemplate: backbone_collection_view_cell_tpl,
     	childView: SaleItemsItemView,
     	childViewOptions: {
       application: this.application,
       wizard: this.wizard,
       actionButtonLabel: this.options.actionButtonLabel
      }
     });
    }
    
   },

   //@method getContext
   //@returns {bb1.PetshopShopping.Promotions.OrderWizard.Module.SaleItems.Context}
  	getContext: function ()
   {
    var self = this;

    //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.SaleItems.Context
    return {
      //@property {LiveOrder.Model} model
      model: this.model,
      //@property {Boolean} showTitle
     	showTitle: !this.options.hide_title,
      //@property {String} title
     	title: this.options.title || _('Flash sale! Dentastix only 99p whilst stocks last...').translate(),
      //@property {Boolean} cartContainsSaleItems
     	//cartContainsSaleItems: this.cartContainsSaleItems(),
      //@property {Boolean} noItems
     	noItems: this.collection.models.length == 0,
      //@property {Boolean} showLoadingItems
     	showLoadingItems: this.reloadingItems
    };
    //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.SaleItems
   }
   
  });
  
 }
);

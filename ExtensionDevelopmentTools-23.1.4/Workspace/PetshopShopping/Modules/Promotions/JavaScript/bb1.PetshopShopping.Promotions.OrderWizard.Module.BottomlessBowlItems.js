//@module bb1.PetshopShopping.Promotions.OrderWizard.Module.BottomlessBowlItems
define(
	'bb1.PetshopShopping.Promotions.OrderWizard.Module.BottomlessBowlItems',
 [
  'Wizard.Module',
  'Profile.Model',
  'GlobalViews.Message.View',
  'bb1.PetshopShopping.Promotions.BottomlessBowlItems.Item.View',
  'bb1.PetshopShopping.Promotions.BottomlessBowlItems.Collection',
  'SC.Configuration',
  
  'bb1_petshopshopping_order_wizard_bottomlessbowlitems_module.tpl',
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
  BottomlessBowlItemsItemView,
  BottomlessBowlItemsCollection,
  Configuration,
  
  bb1_petshopshopping_order_wizard_bottomlessbowlitems_module_tpl,
  backbone_collection_view_row_tpl,
  backbone_collection_view_cell_tpl,
  
  BackboneCollectionView,
  BackboneCompositeView,
  _,
  jQuery
	)
 {
  'use strict';
  
  _.formatPercentage = function(value) {
   if (!value) return '';
   
   value = parseFloat(value, 10) || 0;
   
   value = Math.round(value);
   
   return value.toFixed(0) + '%';
  };
  
  //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.BottomlessBowlItems @extends Wizard.Module
  return WizardModule.extend({

   //@property {Function} template
   template: bb1_petshopshopping_order_wizard_bottomlessbowlitems_module_tpl,
   
   events: {
    'click [data-action="hide-module"]': 'hideModule'
   },
   
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
    var bottomlessBowlItemsStepConfig = Configuration.get('promotions.checkout.bottomlessBowlItemsStep', {}),
        userId = ProfileModel.getInstance().get('internalid'),
        currentStep = this.wizard.currentStep;
    
    return bottomlessBowlItemsStepConfig.enabled && (currentStep == 'confirmation' || userId == '80423');
   },
   
  	hideModule: function (e)
   {
    this.$el.empty();
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
    
    console.log('eventHandlersOn');
    this.application.on('CartConfirmationView.AfterRender', this.hideShowCartButton);
   },
   
   //@method eventHandlersOff
  	eventHandlersOff: function ()
   {
    console.log('eventHandlersOff');
    this.application.off('CartConfirmationView.AfterRender', this.hideShowCartButton);
   },
   
   hideShowCartButton: function(view) {
    console.log('CartConfirmationView.AfterRender Bottomless Bowl');
    view = view || this.application.getLayout();
    view.$('.cart-confirmation-modal-view-cart').hide();
   },
   
   //@method render
  	render: function ()
   {
    var self = this;
    
    if (this.isActive() && this.state === 'present')
    {
     this.reloadingItems = true;
     this.collection = new BottomlessBowlItemsCollection();
     
     var salesOrderId = this.cart.get('confirmation').get('internalid');
     
     var userId = ProfileModel.getInstance().get('internalid'),
         currentStep = this.wizard.currentStep;
     
     if (currentStep != 'confirmation' && userId == '80423')
      salesOrderId = '12658530';
     
     this.collection.fetch({
      data: {
       orderid: salesOrderId
      }
     }).done(function() {
      self.reloadingItems = false;
      self.trigger('ready', true);
      self._render();
     });
    
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
    return jQuery.Deferred().resolve();
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
    
    'BottomlessBowlItems.List': function() {
     return new BackboneCollectionView({
      collection: this.collection,
      //viewsPerRow: _.isDesktopDevice() ? 4 : _.isTabletDevice() ? 2 : 1,
      //rowTemplate: backbone_collection_view_row_tpl,
      //cellTemplate: backbone_collection_view_cell_tpl,
      childView: BottomlessBowlItemsItemView,
      childViewOptions: {
       application: this.application,
       wizard: this.wizard,
       actionButtonLabel: this.options.actionButtonLabel
      }
     });
    }
    
   },

   //@method getContext
   //@returns {bb1.PetshopShopping.Promotions.OrderWizard.Module.BottomlessBowlItems.Context}
  	getContext: function ()
   {
    var self = this,
        collection = this.collection,
        //linesSortedByMaxDiscount = collection.sortBy(function(line) { return line.get('item').get('_bottomlessBowlDiscount'); }) || [],
        //maxDiscountPercentage = linesSortedByMaxDiscount.length ? linesSortedByMaxDiscount[0].get('_bottomlessBowlDiscountFormatted') : '',
        maxDiscountPercentage = collection.length && Math.abs(collection.at(0).get('discountRate')) || 0,
        maxDiscountSavings = collection.reduce(function(maxDiscountSavings, line) { return Math.max(line.get('totalDiscountSavings'), maxDiscountSavings); }, 0),
        subscriptionOrderSettings = SC.ENVIRONMENT.subscriptionOrderSettings && SC.ENVIRONMENT.subscriptionOrderSettings || {},
        petNames = subscriptionOrderSettings.petNames ? subscriptionOrderSettings.petNames + '\'s' : 'your',
        itemName = collection.length == 1 ? collection.at(0).get('item').get('_name') : 'items';
    
    _
    //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.BottomlessBowlItems.Context
    return {
      //@property {LiveOrder.Model} collection
      collection: this.collection,
      //@property {Boolean} hasItems
     	hasItems: this.collection.length > 0,
      //@property {Boolean} showLoadingItems
     	showLoadingItems: this.reloadingItems,
      //@property {String} maxDiscountSavings
     	maxDiscountSavings: _.formatCurrency(maxDiscountSavings),
      //@property {String} maxDiscountPercentage
     	maxDiscountPercentage: _.formatPercentage(maxDiscountPercentage),
      //@property {String} petNames
     	petNames: petNames,
      //@property {String} itemName
     	itemName: itemName
    };
    //@class bb1.PetshopShopping.Promotions.OrderWizard.Module.BottomlessBowlItems
   }
   
  });
  
 }
);

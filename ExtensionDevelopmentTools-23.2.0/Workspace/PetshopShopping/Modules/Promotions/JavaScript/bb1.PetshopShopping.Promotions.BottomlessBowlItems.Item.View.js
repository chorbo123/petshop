//@module bb1.PetshopShopping.Promotions.BottomlessBowlItems.Item.View
define(
	'bb1.PetshopShopping.Promotions.BottomlessBowlItems.Item.View',
 [
  'bb1.PetshopShopping.ProductDetails.BottomlessBowl.AddToCart.View',
  'OrderWizard.Module.CartSummary',
  'ProductViews.Option.View',
  'GlobalViews.Message.View',
  'Product.Model',
  'SC.Configuration',
  
  'bb1_petshopshopping_promotions_bottomlessbowlitems_item.tpl',
  
  'Backbone.CompositeView',
  'Backbone.CollectionView',
  'Backbone',
  'underscore',
  'jQuery'
	],
 function
 (
  BottomlessBowlAddToCartView,
  OrderWizardModuleCartSummary,
  ProductViewsOptionView,
  GlobalViewsMessageView,
  ProductModel,
  Configuration,
  
  bb1_petshopshopping_promotions_bottomlessbowlitems_item_tpl,
  
  BackboneCompositeView,
  BackboneCollectionView,
  Backbone,
  _,
  jQuery
	)
 {
  'use strict';
  
  //@class bb1.PetshopShopping.Promotions.BottomlessBowlItems.Item.View @extends Backbone.View
  return Backbone.View.extend({

   //@property {Function} template
   template: bb1_petshopshopping_promotions_bottomlessbowlitems_item_tpl,
   
   //@property {Object} events
   events: {
    'submit form': 'saveForm'
   },
   
   //@method initialize
  	initialize: function (options)
   {
    this.application = options.application;
    this.wizard = options.wizard;
    this.cart = options.wizard.model;
    BackboneCompositeView.add(this);
    Backbone.Validation.bind(this);
    console.log('this.wizard');
    console.log(this.wizard);
   },
   
   
   saveForm: function (e, model, props)
   {
    e.preventDefault();

    var self = this;
    
    console.log('props');
    console.log(props);
    console.log(model);
    //this.model.set('orderschedule', props.orderschedule);
    
    var promise = Backbone.View.prototype.saveForm.apply(this, arguments);
   
     console.log('promise');
     console.log(promise);
     
    if (!promise) self.$('form').find('input, select, button').attr('disabled', null);
    
    promise && promise.done(function(data) {
     self.$('form').find('input, select, button').attr('disabled', 'disabled');
     self.$('form button[type="submit"]').hide();
     
     var orderScheduleLabel = data.orderSchedule.label.replace(/Weeks/i, 'week').replace(/\s*(Most Popular)\s*/i, '') || '';
     var global_view_message = new GlobalViewsMessageView({
      message: _('<div class="promotions-bottomlessbowlitems-item-success-message"><i /> $(0) subscription confirmed and $(1) savings applied to order.</div>').translate(orderScheduleLabel, data.totalDiscountSavingsFormatted),
      type: 'success',
      closable: false
     });

     //self.$('[data-type="alert-placeholder"]:first').html(
     global_view_message.render();
     global_view_message.$el.children().wrapAll('<div></div>').parent().addClass('promotions-bottomlessbowlitems-item-success');
     self.$el.empty().append(
      //jQuery('<div></div>').addClass('promotions-bottomlessbowlitems-item-success').append(global_view_message.render().$el).html()
      global_view_message.$el.html()
     );
     
     // update cart summary
     console.log('data');
     console.log(data);
     var cart = self.wizard.currentStep == 'confirmation' ? self.cart.get('confirmation') : self.cart;
     var summary = cart.get('summary');
     console.log(summary);
     _.extend(summary, {
      subtotal: data.orderTotal || summary.subtotal,
      subtotal_formatted: data.orderTotalFormatted || summary.subtotal_formatted,
      total: data.orderTotal || summary.total,
      total_formatted: data.orderTotalFormatted || summary.subtotal
     });
     cart.set('summary', summary);
     
     var currentStep = self.wizard.steps[self.wizard.currentStep];
     var cartSummaryChildView = _.find(currentStep.moduleInstances, function (instance) {
      return instance instanceof OrderWizardModuleCartSummary;
     });
     
     cartSummaryChildView && cartSummaryChildView.render();
    }).fail(function(error) {
     self.showError(error.responseJSON);
    });
   },
   
   showError: function(error) {
    console.log(error);
    var errorMessage = error && error.errorMessage || error || '';
    
    if (typeof errorMessage == 'object')
     errorMessage = _.values(error.errorMessage).join(", ");
    
    var global_view_message = new GlobalViewsMessageView({
     message: errorMessage,
     type: 'error',
     closable: true
    });

    this.$('[data-type="alert-placeholder"]:first').html(
     global_view_message.render().$el.html()
    );
     
   },
   
   childViews: {
    
    'BottomlessBowl.AddToCart': function ()
    {
     var item = this.model.get('item'),
         product = new ProductModel({item: item});
         
     return new BottomlessBowlAddToCartView({
      application: this.application,
      model: product,
      itemOptions: product.getVisibleOptions(),
      forceUserToSelectDeliveryOption: true,
      heading: _('Subscribe & save an extra $(0)').translate(item.get('_bottomlessBowlDiscountFormatted'))
     });
    },
 
    'ItemDetails.Options': function() {
     var options_configuration = Configuration.get('ItemOptions.optionsConfiguration', []),
         item = this.model.get('item');
         //product = new ProductModel({item: item});
         
     return new BackboneCollectionView({
      collection: _.filter(item.get('options').sortBy('index'), function (option)
      {
       var option_configuration = _.findWhere(options_configuration, {cartOptionId: option.get('cartOptionId')});
       return option_configuration && option_configuration.showSelectorInList;
      })
     ,	childView: ProductViewsOptionView
     ,	viewsPerRow: 1
     ,	childViewOptions: {
       item: item
      ,	templateName: 'facetCell'
      ,	showLink: true
      ,	hideLabel: true
      ,	showSmall: true
      }
     });
    }
    
   },

   //@method getContext
   //@returns {bb1.PetshopShopping.Promotions.BottomlessBowlItems.Item.View.Context}
  	getContext: function getContext ()
   {
    var model = this.model,
        item = model.get('item');

console.log('getCPntext');
console.log(this.model.attributes);
console.log(item.getPrice());
console.log(model.getPrice());
    //@class bb1.PetshopShopping.Promotions.BottomlessBowlItems.Item.View.Context
    return {
      //@property {Backbone.Model} model
      model: model,
      //@property {Backbone.Model} item
      item: item,
      //@property {Object} price
      price: model.getPrice() || item.getPrice(),
      //@property {ImageContainer} thumbnail
      thumbnail: item.getThumbnail(),
      //@property {String} actionButtonText
      actionButtonText: this.options.actionButtonLabel || _('Update Order').translate()
    };
    //@class bb1.PetshopShopping.Promotions.BottomlessBowlItems.Item.View
   }
   
  });
  
 }
);

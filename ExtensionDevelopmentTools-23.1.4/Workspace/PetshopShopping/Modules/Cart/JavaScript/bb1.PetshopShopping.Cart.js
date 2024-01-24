// @module bb1.PetshopShopping.Cart
define(
	'bb1.PetshopShopping.Cart',
	[
		//'bb1.PetshopShopping.Cart.Confirmation.UpsellItems.View',
		'Cart.Confirmation.View',
  'Cart.Item.Summary.View',
		'SC.Configuration',
  
		'underscore',
		'Backbone'
	],
	function (
		//CartConfirmationUpsellItemsView,
		CartConfirmationView,
		CartItemSummaryView,
		Configuration,
  
		_,
		Backbone
	)
 {
  'use strict';

  /*_.extend(CartConfirmationView.prototype.childViews, {
  
   'Item.UpsellItems': function()
   {
    console.log('Item.UpsellItems');
    var item = this.line.get('item'),
        matrixParent = item.get('_matrixParent'),
        itemId = matrixParent.get('internalid') || item.get('internalid');
        
    return new CartConfirmationUpsellItemsView({
     application: this.options.application,
     itemsIds: itemId,
     optimistic: this.model.optimistic
    });
   }
   
  });*/
  
  _.extend(CartItemSummaryView.prototype, {
  
   getContext: _.wrap(CartItemSummaryView.prototype.getContext, function(originalGetContext)
   {
    var context = originalGetContext.apply(this, _.rest(arguments)),
        maximumQuantity = this.model.get('item').get('maximumquantity', true);
    
    _.extend(context, {
     //@property {Boolean} showMaximumQuantity
     showMaximumQuantity: !!maximumQuantity
    });
    
    return context;
   })
   
  });
  
  return {
   mountToApp: function(application) {
    application.getLayout().once('afterAppendView', function(view) {
     if (/Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent))
      jQuery('body').addClass('safari');
    });
   }
  };
  
 }
);

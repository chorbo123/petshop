// @module bb1.PetshopShopping.Promotions.BottomlessBowlItems.Model
define(
 'bb1.PetshopShopping.Promotions.BottomlessBowlItems.Model',
	[
  'Item.Model',
  'SC.Configuration',
	 
  'Backbone',
 	'underscore',
		'Utils'
	],
	function
 (
  ItemModel,
		Configuration,
		
  Backbone,
		_
	)
 {
  'use strict';

  //@class bb1.PetshopShopping.Promotions.BottomlessBowlItems.Model @extends Item.Model
  return Backbone.Model.extend(
  {
   
   url: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/PromotionsBottomlessBowlItems.Service.ss'),
   
   validation: {
    salesorder: { required: true, msg: _('Sales Order is required').translate() },
    custcol_bb1_blbi_orderschedule: { required: true, msg: _('Order Schedule is required').translate() }
   },
   
   initialize: function(options) {
    this.on('change:item', function(model, item) {
     console.log('change"item');
     
     model.set('item', item instanceof ItemModel ? item : new ItemModel(item), {silent: true});
    });
    
				this.trigger('change:item', this, options && options.item || {});
   },

   //@method getPrice
  	getPrice: function ()
   {
    var item = this.get('item'),
        price = item.getPrice() || {};
        
    return {
     price: this.get('discountedTotal'),
     price_formatted: this.get('discountedTotalFormatted'),
     compare_price: this.get('grossAmount'),
     compare_price_formatted: this.get('grossAmountFormatted')
    }; 
    /*return {
     price: this.get('discountedRate') || price.price,
     price_formatted: this.get('discountedRateFormatted') || price.price_formatted,
     compare_price: this.get('rate') || price.compare_price,
     compare_price_formatted: this.get('rateFormatted') || price.compare_price_formatted
    };*/
   }
   
  });
  
 }
);

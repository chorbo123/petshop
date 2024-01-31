// @module bb1.PetshopShopping.ProductDetails
define(
	'bb1.PetshopShopping.ProductDetails.BottomlessBowl.AddToCart.View',
 [
  'bb1_petshopshopping_productdetails_bottomlessbowl_addtocart.tpl',
	
	 'Backbone',
		'underscore'
	],
	function (
  bb1_petshopshopping_productdetails_bottomlessbowl_addtocart_tpl,

		Backbone,
		_
	)
{
	'use strict';

	// @class bb1.PetshopShopping.ProductDetails.BottomlessBowl.AddToCart.View @extends Backbone.View
	return Backbone.View.extend({
  
  template: bb1_petshopshopping_productdetails_bottomlessbowl_addtocart_tpl,
  
  events: {
   'change [data-action="updateOrderSchedule"]': 'setOrderSchedule'
  },
  
  setOrderSchedule: function(e)
  {
   e.preventDefault();

   /*var value = parseInt(this.$(e.currentTarget).data('value'), 10)
   ,	$input_quantity = this.$('[name="quantity"]')
   ,	old_value = parseInt($input_quantity.val(), 10)
   ,	new_quantity = old_value + value;

   //$input_quantity.val(new_quantity).trigger('blur');
   console.log('value');
   console.log(parseInt(this.$(e.currentTarget).val(), 10));*/
   
   var $target = jQuery(e.currentTarget)
			,	value = $target.val() || $target.data('value') || null
			,	cart_option_id = $target.closest('[data-type="option"]').data('cart-option-id');

			// if option is selected, remove the value
			if ($target.data('active'))
			{
				value = null;
			}

			this.model.setOption(cart_option_id, value);

			//this.storeFocus(e);
			//this.render();
   
   this.syncPriceTableOption(e);
  },
  
  syncPriceTableOption: function (e)
  {
   var $target = jQuery(e.target),
       quantity = this.model.get('quantity'), //.$('[name="quantity"]').val() || 1,
       orderScheduleId = $target.val(), //this.$('select[name="option-custcol_bb1_blbi_orderschedule"]').val(),
       orderScheduleLabel = $target.find('option[value=""]').text(), //this.$('select[name="option-custcol_bb1_blbi_orderschedule"]').find('option[value=""]').text(),
       priceTableOption = this.model.get('priceTableOption') || {};
   
   //console.log('orderScheduleId');
   //console.log(orderScheduleId);
   //console.log('orderScheduleLabel');
   //console.log(orderScheduleLabel);
   //console.log('quantity');
   //console.log(quantity);
   
   priceTableOption.quantity = quantity; //this.model.get('quantity');
   priceTableOption.deliveryOption = !orderScheduleId && orderScheduleLabel == "Delivery Frequency" ? '?' : orderScheduleId; //this.model.getOption('custcol_bb1_blbi_orderschedule');
   
   //console.log('priceTableOption');
   //console.log(priceTableOption);
   
   this.model.set('priceTableOption', priceTableOption);
  },
  
  render: function()
  {
   var self = this;
   
   this._render();
   //return Backbone.View.prototype.showContent.apply(this, arguments).done(function ()
   //{
    this.$('.bottomless-bowl-option-learn-more a').click(function (e)
    {
     var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
     
     if (screenWidth < 768) {
      Backbone.history.navigate(this.hash, {trigger: true});
     }
     else {
      jQuery(this).popover('show');
     }
      
     var bodyClickHandler = function(e) {
      var $target = jQuery(e.target);
      
      if ($target.data('toggle') !== 'popover'
        && $target.parents('[data-toggle="popover"]').length === 0
        && $target.parents('.popover.in').length === 0) { 
       self.$('.bottomless-bowl-option-learn-more a').popover('hide');
       jQuery(document).off("click", "body", bodyClickHandler);
       jQuery(document).off("click", ".popover .close", closePopoverClickHandler);
      }
     };
     
     var closePopoverClickHandler = function(e) {
      self.$('.bottomless-bowl-option-learn-more a').popover('hide');
      jQuery(document).off("click", "body", bodyClickHandler);
      jQuery(document).off("click", ".popover .close", closePopoverClickHandler);
     };
    
     jQuery(document).on("click", "body", bodyClickHandler);
     
     jQuery(document).on("click", ".popover .close", closePopoverClickHandler);
     
     return false;
    }).popover({html: true, trigger: 'manual'});
   //});
  },
  
		// @method getContext @returns {bb1.PetshopShopping.ProductDetails.BottomlessBowl.AddToCart.View.Context}
		getContext: function ()
		{
   var product = this.model,
       item = product.get('item'),
       orderScheduleOptionId = 'custcol_bb1_blbi_orderschedule',
       orderScheduleOption = product.getOption(orderScheduleOptionId), //_.find(this.options.itemOptions, function (option) { return option.get('cartOptionId') == orderScheduleOptionId; }), //product.getOption(orderScheduleOptionId), //product.getPosibleOptions().findWhere({cartOptionId: orderScheduleOptionId}),
       selectedOrderSchedule = orderScheduleOption.get('value') || {}, //product.getOption(orderScheduleOptionId),
       htmlId = orderScheduleOptionId,
       bottomlessBowlDiscount = item.get('_bottomlessBowlDiscount'),
       itemPricing = item.getPrice() || {},
       bottomlessBowlDiscountPrice = bottomlessBowlDiscount ? itemPricing.price - (bottomlessBowlDiscount * itemPricing.price) : itemPricing.price,
       selectedPriceTableOption = product.get('priceTableOption') || {},
       forceUserToSelectDeliveryOption = this.options.forceUserToSelectDeliveryOption || !!(orderScheduleOption && !selectedOrderSchedule.internalid && selectedPriceTableOption.deliveryOption == '?');
       
       //console.log('testt');
   var orderScheduleOptionValues = _.map(orderScheduleOption.get('values'), function(optionValue) {
    return {
     // @property {String} internalId
     internalId: optionValue.internalid,
     // @property {Boolean} isAvailable
    	isAvailable: optionValue.isAvailable,
     // @property {String} url
    	url: optionValue.url,
     // @property {String} label
    	label: optionValue.label + (optionValue.internalid == 3 ? ' (Most Popular)' : ''),
     // @property {Boolean} isActive
    	isActive: optionValue.internalid === selectedOrderSchedule.internalid
    };
   });
   
   orderScheduleOptionValues.sort(function (a, b) {
    return (Number(((a.label || '').match(/(\d+)/g) || [Infinity])[0]) - Number((((b.label || '').match(/(\d+)/g) || [Infinity])[0])));
   });
    
   //console.log('orderScheduleOptionValues');
   //console.log(orderScheduleOptionValues);
   //console.log(selectedOrderSchedule);
   //console.log(orderScheduleOption);
   //console.log(product.getVisibleOptions());
   //console.log(this.options.itemOptions);
   
			//@class bb1.PetshopShopping.ProductDetails.BottomlessBowl.AddToCart.View.Context
			return {
				// @property {Boolean} canSubscribe
				canSubscribe: !!orderScheduleOption,
				// @property {String} cartOptionId
				cartOptionId: orderScheduleOptionId,
				// @property {String} cartOptionId
				itemOptionId: orderScheduleOption.get('itemOptionId'),
				// @property {Object} orderScheduleOptionValues
				orderScheduleOptionValues: orderScheduleOptionValues,
				// @property {Number} bottomlessBowlDiscount
				bottomlessBowlDiscount: bottomlessBowlDiscount,
				// @property {String} bottomlessBowlDiscountFormatted
				bottomlessBowlDiscountFormatted: item.get('_bottomlessBowlDiscountFormatted'),
				// @property {Boolean} forceUserToSelectDeliveryOption
				forceUserToSelectDeliveryOption: forceUserToSelectDeliveryOption, //this.options.forceUserToSelectDeliveryOption
				// @property {String} heading
				heading: this.options.heading 
			};
		}
	});
});


//@class bb1.PetshopShopping.ProductDetails.BottomlessBowl.AddToCart.View.Initialize.Options
//@property {Item.Model} model

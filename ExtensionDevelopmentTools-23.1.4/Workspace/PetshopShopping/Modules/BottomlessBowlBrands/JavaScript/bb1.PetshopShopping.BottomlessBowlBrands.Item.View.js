// @module bb1.PetshopShopping.BottomlessBowlBrands
define(
 'bb1.PetshopShopping.BottomlessBowlBrands.Item.View',
	[
		'SC.Configuration',

		'bb1_petshopshopping_bottomless_bowl_brands_item.tpl',

		'jQuery',
		'Backbone',
		'underscore',
		'Utils'
	],
	function (
		Configuration,
		
		bottomless_bowl_brands_item_tpl,
  
		jQuery,
		Backbone,
		_
	)
 {
  'use strict';

  return Backbone.View.extend({
   
   template: bottomless_bowl_brands_item_tpl,
   
   getContext: function() {
    var model = this.model;
    
    return {
     model: model,
     brandTitle: model.get('name'),
     brandUrl: model.get('url'),
     brandThumbnailUrl: model.get('thumbnailUrl')
    };
   }

  });
  
 }
);

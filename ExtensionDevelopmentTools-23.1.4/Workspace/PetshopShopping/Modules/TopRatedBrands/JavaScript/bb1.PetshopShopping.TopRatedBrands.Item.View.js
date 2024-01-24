// @module bb1.PetshopShopping.TopRatedBrands
define(
 'bb1.PetshopShopping.TopRatedBrands.Item.View',
	[
		'SC.Configuration',

		'bb1_petshopshopping_top_rated_brands_item.tpl',

		'jQuery',
		'Backbone',
		'underscore',
		'Utils'
	],
	function (
		Configuration,
		
		top_rated_brands_item_tpl,
  
		jQuery,
		Backbone,
		_
	)
 {
  'use strict';

  return Backbone.View.extend({
   
   template: top_rated_brands_item_tpl,
   
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

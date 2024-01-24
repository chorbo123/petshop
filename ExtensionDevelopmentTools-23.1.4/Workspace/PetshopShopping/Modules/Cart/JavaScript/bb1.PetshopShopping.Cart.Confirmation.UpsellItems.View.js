// @module bb1.PetshopShopping.Cart
define(
 'bb1.PetshopShopping.Cart.Confirmation.UpsellItems.View',
	[
  'Backbone.CollectionView',
		'ItemViews.RelatedItem.View',
		'ItemRelations.Related.Collection',
		'Tracker',

		'cart_confirmation_upsell_items.tpl',
		'item_relations_row.tpl',
		'item_relations_cell.tpl',

		'SC.Configuration',
		'jQuery',
		'Backbone',
		'underscore',
		'Utils'
	],
	function (
		BackboneCollectionView,
		ItemViewsRelatedItemView,
		ItemRelationsRelatedCollection,
		Tracker,

		cart_confirmation_upsell_items_tpl,
		item_relations_row_tpl,
		item_relations_cell_tpl,

		Configuration,
		jQuery,
		Backbone,
		_
	)
 {
  'use strict';

  // @class bb1.PetshopShopping.Cart.Confirmation.UpsellItems.View @extends Backbone.CollectionView
  return BackboneCollectionView.extend({

   initialize: function ()
   {
    var application = this.options.application,
        is_sca_advance = application.getConfig('siteSettings.sitetype') === 'ADVANCED',
        collection = is_sca_advance ? new ItemRelationsRelatedCollection({itemsIds: this.options.itemsIds}) : new Backbone.Collection(),
        self = this;

    BackboneCollectionView.prototype.initialize.call(this, {
     collection: collection,
     viewsPerRow: 4,
     cellTemplate: item_relations_cell_tpl,
     rowTemplate: item_relations_row_tpl,
     childView: ItemViewsRelatedItemView,
     template: cart_confirmation_upsell_items_tpl
    });

    if (is_sca_advance)
    {
     this.options.optimistic && this.options.optimistic.promise && this.options.optimistic.promise.done(function (arg)
     {
      self.afterRenderView();
     });
     
     self.collection.fetchItems().done(function()
     {
      Tracker.getInstance().trackProductList(self.collection, 'Cart Confirmation Upsell Items');
      self.render();

      self.options.application.getLayout().once('afterAppendView', function ()
      {
       self.afterRenderView();
      });
     });
    }
   },
   
   afterRenderView: function() {
    var application = this.options.application;
    var carousel = this.$el.find('[data-type="carousel-items"]');
    
    if(_.isPhoneDevice() === false && application.getConfig('siteSettings.imagesizes'))
    {
     var img_min_height = _.where(application.getConfig('siteSettings.imagesizes'), {name: application.getConfig('imageSizeMapping.thumbnail')})[0].maxheight;

     carousel.find('.item-views-related-item-thumbnail').css('minHeight', img_min_height);
    }

    _.initBxSlider(carousel, Configuration.bxSliderDefaults);
   }
   
  });
  
 }
);

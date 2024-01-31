// @module bb1.PetshopShopping.RecentlyPurchasedItems
define(
  'bb1.PetshopShopping.RecentlyPurchasedItems.View',
  [
    'Facets.ItemCell.View',
    'RecentlyViewedItems.View',
    'RecentlyViewedItems.Collection',
    'Backbone.CollectionView',
    'ItemRelations.RelatedItem.View',
    'bb1.PetshopShopping.RecentlyPurchasedItems.Collection',
    'SC.Configuration',
    'Tracker',

    'bb1_petshopshopping_recently_purchased_items.tpl',
    'bb1_petshopshopping_recently_purchased_row.tpl',
    'bb1_petshopshopping_recently_purchased_cell.tpl',
    'recently_viewed_items.tpl',
    'recently_viewed_row.tpl',
    'recently_viewed_cell.tpl',
    'facets_item_cell_grid.tpl',

    'jQuery',
    'Backbone',
    'underscore',
    'Utils'
  ],
  function (
    FacetsItemCellView,
    RecentlyViewedItemsView,
    RecentlyViewedItemsCollection,
    BackboneCollectionView,
    ItemRelationsRelatedItemView,
    RecentlyPurchasedItemsCollection,
    Configuration,
    Tracker,

    recently_purchased_items_tpl,
    recently_purchased_row_tpl,
    recently_purchased_cell_tpl,
    recently_viewed_items_tpl,
    recently_viewed_row_tpl,
    recently_viewed_cell_tpl,
    facets_item_cell_grid_tpl,

    jQuery,
    Backbone,
    _
  ) {
    'use strict';

    return BackboneCollectionView.extend({

      initialize: function () {
        var application = this.options.application;
        //var	collection = new RecentlyPurchasedItemsCollection();
        var number_of_items_displayed = application.getConfig('recentlyPurchasedItems.numberOfItemsDisplayed');
        var self = this;

        this.collection = new RecentlyPurchasedItemsCollection();

        console.log('init');
        this.collection.fetch({
          //data: data_filters
          //,	reset: true
          //,	killerId: options.killerId
        }).done(function (data) {
          console.log('collection.fetched');
          console.log(self.collection);
          console.log(data);
          //console.log(self);
          if (self.collection && self.collection.models.length) {
            BackboneCollectionView.prototype.initialize.call(self, {
              collection: self.collection, //.first(number_of_items_displayed),
              viewsPerRow: Infinity,
              cellTemplate: recently_purchased_cell_tpl,
              rowTemplate: recently_purchased_row_tpl,
              childView: ItemRelationsRelatedItemView, //FacetsItemCellView.extend({template: facets_item_cell_grid_tpl}), //ItemRelationsRelatedItemView,
              template: recently_purchased_items_tpl,
              childViewOptions: { showStarRating: false }
            });
            //console.log('collection.inited');
            //console.log(self);
            //self.collection = collection.first(number_of_items_displayed);
            //Tracker.getInstance().trackProductList(collection, 'Recently Purchased Items');
            self.render();
            //console.log('rendered');
            var carousel = self.$el.find('[data-type="carousel-items"]');

            if (_.isPhoneDevice() === false && application.getConfig('siteSettings.imagesizes')) {
              var img_min_height = _.where(application.getConfig('siteSettings.imagesizes'), { name: application.getConfig('imageSizeMapping.thumbnail') })[0].maxheight;

              carousel.find('.item-views-related-item-thumbnail').css('minHeight', img_min_height);
            }

            _.initBxSlider(carousel, _.extend({}, Configuration.bxSliderDefaults, { slideMargin: 0 }));

            //console.log('afterAppendView done');
          }
          /*else {
           console.log('RecentlyViewedItemsView');
           //var view = new RecentlyViewedItemsView({application: self.options.application});
           //view.el = self.el;
           //view.render();
           //view.on('afterRender', function() {
           // console.log('RecentlyViewedItemsView afterRender');
           //});
           
           var layout = application.getLayout(),
             collection =
               application.getConfig('siteSettings.sitetype') === 'ADVANCED'
                 ? RecentlyViewedItemsCollection.getInstance()
                 : new Backbone.Collection();
             //self = this;
             
           console.log('collection');
           console.log(collection);
           console.log(RecentlyViewedItemsCollection.getInstance());
           BackboneCollectionView.prototype.initialize.call(this, {
             collection: collection,
             viewsPerRow: Infinity,
             cellTemplate: recently_viewed_cell_tpl,
             rowTemplate: recently_viewed_row_tpl,
             childView: FacetsItemCellView.extend({template: facets_item_cell_grid_tpl}), //ItemRelationsRelatedItemView,
             template: recently_viewed_items_tpl
           });
     
           layout.once('afterAppendView', self.loadRecentlyViewedItem, self);
          }*/
        });

        application.getLayout().once('afterAppendView', function () {
          //console.log('afterAppendView');

        });

      },

      loadRecentlyViewedItem: function loadRecentlyViewedItem() {

        var self = this;
        console.log('test11');
        RecentlyViewedItemsCollection.getInstance().turnOnTracking();

        this.collection.promise &&
          this.collection.promise.done(function () {
            var application = self.options.application,
              number_of_items_displayed = application.getConfig('recentlyViewedItems.numberOfItemsDisplayed');
            console.log('self.collection');
            console.log(self.collection);
            self.collection = self.collection.first(parseInt(number_of_items_displayed));
            self.render();

            var carousel = self.$el.find('[data-type="carousel-items"]');

            if (_.isPhoneDevice() === false && application.getConfig('siteSettings.imagesizes')) {
              var img_min_height = _.where(application.getConfig('siteSettings.imagesizes'), {
                name: application.getConfig('imageSizeMapping.thumbnail')
              })[0].maxheight;

              carousel
                .find('.item-relations-related-item-thumbnail')
                .css('minHeight', img_min_height);
            }

            _.initBxSlider(carousel, Configuration.bxSliderDefaults);
          });
      }

    });

  }
);

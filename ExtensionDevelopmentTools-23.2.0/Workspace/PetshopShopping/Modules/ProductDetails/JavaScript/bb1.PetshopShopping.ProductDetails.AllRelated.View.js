// @module bb1.PetshopShopping.ProductDetails
define(
 'bb1.PetshopShopping.ProductDetails.AllRelated.View',
 [
  'ItemRelations.Related.View',
  'Backbone.CollectionView',
  'ItemRelations.RelatedItem.View',
  'ItemRelations.Related.Collection',
  'ItemRelations.Correlated.Collection',
  'SC.Configuration',
  'Tracker',

  'item_relations_related.tpl',
  'item_relations_row.tpl',
  'item_relations_cell.tpl',

  'jQuery',
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  ItemRelationsRelatedView,
  BackboneCollectionView,
  ItemRelationsRelatedItemView,
  ItemRelationsRelatedCollection,
  ItemRelationsCorrelatedCollection,
  Configuration,
  Tracker,
  item_relations_allrelated_tpl,
  item_relations_row_tpl,
  item_relations_cell_tpl,
  jQuery,
  Backbone,
  _
 )
 {
  // @class ItemRelations.Related.View @extends Backbone.CollectionView
  return ItemRelationsRelatedView.extend({
    initialize: function () {
      var is_sca_advance =
          this.options.application.getConfig('siteSettings.sitetype') === 'ADVANCED',
        collection = is_sca_advance
          ? new ItemRelationsRelatedCollection({ itemsIds: this.options.itemsIds })
          : new Backbone.Collection(),
        relatedCollection = is_sca_advance
          ? new ItemRelationsRelatedCollection({ itemsIds: this.options.itemsIds })
          : new Backbone.Collection(),
        correlatedCollection = is_sca_advance
          ? new ItemRelationsCorrelatedCollection({ itemsIds: this.options.itemsIds })
          : new Backbone.Collection(),
        layout = this.options.application.getLayout(),
        self = this;
      
      BackboneCollectionView.prototype.initialize.call(this, {
        collection: collection,
        viewsPerRow: Infinity,
        cellTemplate: item_relations_cell_tpl,
        rowTemplate: item_relations_row_tpl,
        childView: ItemRelationsRelatedItemView,
        template: item_relations_allrelated_tpl
      });

      this.view_tracked = false;

      if (is_sca_advance) {
        layout.once('afterAppendView', self.loadRelatedItem, self);
        layout.currentView &&
          layout.currentView.once('afterCompositeViewRender', self.loadRelatedItem, self);
      }
      
      this.relatedCollection = relatedCollection;
      this.correlatedCollection = correlatedCollection;
    },

    loadRelatedItem: function loadRelatedItem() {
      var self = this;
      
      this.relatedCollection.fetchItems = this.correlatedCollection.fetchItems = function ()
      {
       return this.fetch({
        data: {
         id: this.itemsIds.join(','),
         'quantityavailable.from=': '1',
         'quantityavailable.to=': '',
         'custitem_bb1_supplier_stock.from': '1',
         'custitem_bb1_supplier_stock.to': ''
        }
       });
      };

      jQuery.when(self.relatedCollection.fetchItems(), self.correlatedCollection.fetchItems()).done(function (relatedCollectionResponse, correlatedCollectionResponse) {
        //console.log('self.relatedCollection');
        //console.log(self.relatedCollection.clone());
        //console.log('self.correlatedCollection');
        //console.log(self.correlatedCollection.clone());
        //console.log(relatedCollectionResponse);
        //console.log(correlatedCollectionResponse);
        
        self.collection.reset();
        
        if (relatedCollectionResponse[0].items.length)
         self.collection.add(self.relatedCollection.models);
        
        if (correlatedCollectionResponse[0].items.length)
         self.collection.add(self.correlatedCollection.models);
        
        //console.log('self.collection');
        //console.log(self.collection);
        
        if (self.collection.length) {
          if (!self.view_tracked) {
            Tracker.getInstance().trackProductListEvent(self.collection, 'Related Items');
            self.view_tracked = true;
          }
        }

        self.render();

        var carousel = self.$el.find('[data-type="carousel-items"]');

        if (
          _.isPhoneDevice() === false &&
          self.options.application.getConfig('siteSettings.imagesizes', false)
        ) {
          var img_min_height = _.where(
            self.options.application.getConfig('siteSettings.imagesizes', []),
            { name: self.options.application.getConfig('imageSizeMapping.thumbnail', '') }
          )[0].maxheight;

          carousel.find('.item-relations-related-item-thumbnail').css('minHeight', img_min_height);
        }
        
        var bxSliderOptions = Configuration.get('bxSliderDefaults', {});
        
        //bxSliderOptions.controls = false;
        bxSliderOptions.pager = true;
        bxSliderOptions.pagerType = 'short';
        //bxSliderOptions.buildPager = function (slideIndex) { return 'Page ${1} of '.replace(/${1}/g, slideIndex); };
        
        _.initBxSlider(carousel, bxSliderOptions);
      });
    }
  });
});

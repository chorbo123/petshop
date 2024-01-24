define(
	'bb1.PetshopShopping.ProductReviews',
	[
  'ProductReviews.Collection',
  'ProductReviews.Center.View',
  'Backbone.CompositeView',
  'SC.Configuration',
  
  'underscore',
  'Utils'
	],
	function(
  ProductReviewsCollection,
  ProductReviewsCenterView,
  BackboneCompositeView,
  Configuration,
  
  _,
  Utils
	)
 {
  'use strict';

  _.extend(ProductReviewsCollection.prototype, {
   
   parseOptions: function (options)
   {
    if (options)
    {
     if (options.filter)
     {
      options.filter = options.filter.id;
     }

     if (options.sort)
     {
      options.sort = options.sort.id;
     }

     options.itemid = this.itemid;
    }

    return options;
   }
   
  });

  _.extend(ProductReviewsCenterView.prototype, {
   
   initialize: function (options)
   {
    BackboneCompositeView.add(this);

    this.item = options.item;
    this.baseUrl = 'product/' + options.item.get('internalid');

    this.queryOptions = Utils.parseUrlOptions(location.href);
    this.application = options.application;

    var itemIds = this.item.get('internalid'),
        includedProductReviewIds = this.item.get('custitem_bb1_incproductreviewids') || '';
    
    if (includedProductReviewIds)
     itemIds += ',' + includedProductReviewIds;
    
    this.collection = new ProductReviewsCollection();
    this.collection.itemid = itemIds;

    var self = this
    ,	reviews_params = this.collection.getReviewParams(this.queryOptions);

    reviews_params.itemid = itemIds; 

    // return the fetch 'promise'
    this.collection.fetch(
    {
     data: reviews_params
    ,	killerId: this.killerId
    }).done(function ()
    {
     self.updateCannonicalLinks();

     // append and render the view
     // $placeholder.empty().append(this.$el);
     self.render();

     self.collection.on('reset', function ()
     {
      self.render();
     });
    });
   }
   
  });

 }
);

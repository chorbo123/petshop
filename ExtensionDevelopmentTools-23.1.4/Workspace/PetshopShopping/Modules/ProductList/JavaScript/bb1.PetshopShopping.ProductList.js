//@module bb1.PetshopShopping.ProductList
define(
 'bb1.PetshopShopping.ProductList',
 [
  'Facets.Browse.View',
  'Facets.ItemCell.View',
  'Facets.ItemListSortSelector.View',
  'Facets.FacetedNavigation.View',
  'Facets.FacetedNavigationItem.View',
  'Facets.Translator',
  'bb1.PetshopShopping.ProductDetails.Promotions.View',
  'ProductViews.Price.View',
  'Cart.QuickAddToCart.View',
  'Item.KeyMapping',
  'Product.Model',
  'Profile.Model',
  'SC.Configuration',
  'Backbone.CollectionView',
  
  'Utils',
  'underscore'
 ],
 function (
  FacetsBrowseView,
  FacetsItemCellView,
  FacetsItemListSortSelectorView,
  FacetsFacetedNavigationView,
  FacetsFacetedNavigationItemView,
  FacetsTranslator,
  PromotionsView,
  ProductViewsPriceView,
  CartQuickAddToCartView,
  ItemKeyMapping,
  ProductModel,
  ProfileModel,
  Configuration,
  BackboneCollectionView,
  
  Utils,
  _
 )
 {
  'use strict';
  
  _.extend(FacetsItemCellView.prototype.childViews, {
   
   'ItemViews.Promotions': function() {
    return new PromotionsView({
     application: this.application,
     model: this.model
    });
   },
   
   'Cart.QuickAddToCart': function ()
   {
    var product = new ProductModel({
     item: this.model
    , quantity: this.model.get('_minimumQuantity', true)
    });

    return new CartQuickAddToCartView({
     model: product,
     application: this.options.application,
     showMinPricing: true
    });
   }
   
  });
  
  _.extend(CartQuickAddToCartView.prototype.childViews, {
  
  'ProductViewsPrice.Price': function ()
   {
    return new ProductViewsPriceView({
     application: this.options.application,
     model: this.model,
     origin: 'ITEMCELL',
     showMinPricing: !!this.options.showMinPricing
    });
   }
   
  });
  
  FacetsItemListSortSelectorView.prototype.getContext = _.wrap(FacetsItemListSortSelectorView.prototype.getContext, function(originalGetContext) {
   
   var option_items = this.options.options
   , translator = this.options.translator
   , processed_option_items = [];

   //if price display is disabled, left aside the filters about price
   if (ProfileModel.getInstance().hidePrices())
   {
    option_items = _.filter(option_items, function (item)
    {
     return item.id.search('price') === -1;
    });
   }
   
   //var defaultSortOption = _.find(option_items, function(result) { return result.isDefault; }).id;
   
   _.each(option_items, function(option_item) {
    var optionUrl = translator.cloneForOptions({order: option_item.id, page: 1}).getUrl();
    
    //if (option_item.id == defaultSortOption)
    if (option_item.isDefault)
     optionUrl += (optionUrl.indexOf('?') != -1 ? '&' : '?') + 'order=' + option_item.id; //Utils.addParamsToUrl(optionUrl, {order: option_item.id});
    
    var processed_option_item = {
     configOptionUrl: optionUrl
    , isSelected: translator.getOptionValue('order') === option_item.id ? 'selected' : ''
    , name: option_item.name
    , className: option_item.id.replace(':','-')
    };

    processed_option_items.push(processed_option_item);
   });

   // @class Facets.ItemListSortSelector.View.Context
   return { 
    // @property {Array<Object>} options
    options: processed_option_items
   };
   
  });
  
  /*FacetsBrowseView.prototype._gotoOrder = _.wrap(FacetsBrowseView.prototype._gotoOrder, function(originalGotoOrder, e) {
   
   var results = originalGotoOrder.apply(this, _.rest(arguments));
   var defaultSortOption = _.find(this.sortOptions, function(result) { return result.isDefault; }).id;
   
   window.userSelectedSortOption = Utils.getParameterByName(e.currentTarget.value, 'order') || defaultSortOption;
   
   console.log(e);
   console.log('e.currentTarget.value: ' + e.currentTarget.value);
   console.log('window.userSelectedSortOption: ' + window.userSelectedSortOption);
   
   return results;
   
  });*/
  
  FacetsFacetedNavigationView.prototype.initialize = _.wrap(FacetsFacetedNavigationView.prototype.initialize, function(originalInitialize) {
   var results = originalInitialize.apply(this, _.rest(arguments));
   
   return results;
  });
  
  FacetsFacetedNavigationItemView.prototype.getContext = _.wrap(FacetsFacetedNavigationItemView.prototype.getContext, function(originalGetContext) {
   var context = originalGetContext.apply(this, _.rest(arguments));
   
   var self = this,
       translator = this.options.translator,
       rangeBuckets = this.facet_config.rangeBuckets || [],
       selectedValues = translator.getFacetValue(this.facetId) || {};
   
   if (!rangeBuckets.length) {
    if (this.facetId == 'weight')
     rangeBuckets = [
      {label: _('10kg to 15kg+').translate(), from: 10, to: ''},
      {label: _('5kg to 10kg').translate(), from: 5, to: 10},
      {label: _('1kg to 5kg').translate(), from: 1, to: 5},
      {label: _('0kg to 1kg').translate(), from: 0, to: 1}
     ];
    else if (this.facetId == 'pricelevel5')
     rangeBuckets = [
      {label: _('£0 to £10').translate(), from: 0, to: 10},
      {label: _('£10 to £20').translate(), from: 10, to: 20},
      {label: _('£20 to £30').translate(), from: 20, to: 30},
      {label: _('£30 to £40').translate(), from: 30, to: 40},
      {label: _('£50+').translate(), from: 50, to: ''}
     ];
   }
   
   rangeBuckets = _.map(rangeBuckets, function(rangeBucket) {
    var isActive = rangeBucket.from == selectedValues.from && rangeBucket.to == selectedValues.to,
        facetUrl = translator.cloneForFacetId(self.facetId, rangeBucket).getUrl();
    
    return _.extend({}, rangeBucket, {
     isActive: isActive,
     url: facetUrl
    });
   });
   
   _.extend(context, {
    rangeBuckets: rangeBuckets
   });
   
   return context;
  });
  
  FacetsBrowseView.prototype.render = _.wrap(FacetsBrowseView.prototype.render, function(originalRender) {
   
   var results = originalRender.apply(this, _.rest(arguments));
   
   
   return results;
   
  });
  
  FacetsBrowseView.prototype.initialize = _.wrap(FacetsBrowseView.prototype.initialize, function(originalInitialize) {
   
   var results = originalInitialize.apply(this, _.rest(arguments));
   var isSearch = !!this.translator.getOptionValue('keywords');
   var selectedSortOption = this.translator.getOptionValue('order');
   var urlOptions = _.parseUrlOptions(Backbone.history.fragment);
   var isSortOptionInUrl = !!urlOptions.order;
   
   /*if (isSearch && !isSortOptionInUrl && selectedSortOption != 'relevance:desc') {
    //this.translator.setOptionValue('order', 'relevance:desc');
    this.translator.options.order = 'relevance:desc';
    this.model.options.data = this.translator.getApiParams();
    //console.log('set to relevance');
   }*/
   
   //window.userSelectedSortOption = null;
   
   return results;
   
  });
  
  FacetsItemCellView.prototype.getContext = _.wrap(FacetsItemCellView.prototype.getContext, function(originalGetContext) {
   
   var results = originalGetContext.apply(this, _.rest(arguments));
   
   var item = this.model,
       price = item.getPrice(),
       priceSchedule = (item.get('_priceDetails') || {}).priceschedule || [],
       blbDiscountRate = item.get('custitem_bb1_bb_discountrate') || 0,
       cheaperOptionsAvailable = false;
       
   if (priceSchedule.length > 1) {
    //price.price = priceSchedule[1].price;
    cheaperOptionsAvailable = true;
   }
   if (blbDiscountRate) {
    //price.price *= (100 + blbDiscountRate) / 100;
    cheaperOptionsAvailable = true;
   }
   price.price_formatted = _.formatCurrency(price.price);
   
   _.extend(results, {
    // @property {Boolean} isFreeDelivery
    isFreeDelivery: this.model.get('_isFreeDelivery'),
    // @property {Boolean} isOnSale
    isOnSale: this.model.get('_isOnSale'),
    // @property {String} productTypeImageUrl
    productTypeImageUrl: this.model.get('_productTypeListImageUrl'),
    // @property {Boolean} cheaperOptionsAvailable
    cheaperOptionsAvailable: cheaperOptionsAvailable
   });
   
   return results;
   
  });
   
  BackboneCollectionView.prototype.calculateSpanSize = _.wrap(BackboneCollectionView.prototype.calculateSpanSize, function(originalCalculateSpanSize) {
   
   var results = originalCalculateSpanSize.apply(this, _.rest(arguments));
   
   return results.toString().replace(/[^\d\w-_]+/g, '-');
   
  });
  
});

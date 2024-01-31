//@module bb1.PetshopShopping.EstimatedDelivery
define(
 'bb1.PetshopShopping.EstimatedDelivery.ProductList',
 [
  'bb1.PetshopShopping.EstimatedDelivery.Utils',
  'Facets.Browse.View',
  'Facets.ItemCell.View',
  'Facets.ItemListSortSelector.View',
  'Facets.FacetedNavigation.View',
  'Facets.Translator',
  'bb1.PetshopShopping.ProductDetails.Promotions.View',
  'Item.KeyMapping',
  'Product.Model',
  'Profile.Model',
  'SC.Configuration',
  'Backbone.CollectionView',
  
  'Utils',
  'underscore'
 ],
 function (
  EstimatedDeliveryUtils,
  FacetsBrowseView,
  FacetsItemCellView,
  FacetsItemListSortSelectorView,
  FacetsFacetedNavigationView,
  FacetsTranslator,
  PromotionsView,
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
  
  var estimatedDeliveryConfig = Configuration.get('estimatedDelivery');
   
  if (estimatedDeliveryConfig.enabled) {
     
   FacetsTranslator.prototype.getApiParams = _.wrap(FacetsTranslator.prototype.getApiParams, function(originalGetApiParams) {
    
    var params = originalGetApiParams.apply(this, _.rest(arguments));
    
    var expressDeliveryFacetValues = (params['Express-Delivery'] || '').split(/\s*,\s*/);
    
    if (expressDeliveryFacetValues.length) {
     var beforeDeliveryCutoff = EstimatedDeliveryUtils.isBeforeDeliveryCutoff();
     
     if (beforeDeliveryCutoff && expressDeliveryFacetValues.indexOf('Next-Day') != -1) { // should this not check for 3pm ?
      params['quantityavailable.from'] = estimatedDeliveryConfig.warehouseMinStockLevel;
      params['quantityavailable.to'] = '';
     }
     
     if (expressDeliveryFacetValues.indexOf('2-Day') != -1) {
      var facetId = beforeDeliveryCutoff ? 'custitem_bb1_supplier_stock' : 'quantityavailable';
     
      params[facetId + '.from'] = estimatedDeliveryConfig.supplierWarehouseMinStockLevel;
      params[facetId + '.to'] = '';
     }
     
     delete params['Express-Delivery'];
     
    }
    
    return params;
     
   });
    
   FacetsTranslator.prototype.parseUrlFacet1 = _.wrap(FacetsTranslator.prototype.parseUrlFacet, function(originalParseUrlFacet, name, value) {
    
    //console.log('FacetsTranslator.prototype.parseUrlFacet');
    //console.log(this.facets);
    //console.log(name);
    //console.log(value);
    
    var estimatedDeliveryConfig = Configuration.get('estimatedDelivery');
    
    
    if (name == 'Express-Delivery') {
     if (EstimatedDeliveryUtils.isBeforeDeliveryCutoff()) {
      if (value == 'Next-Day') {
       this.facets.push({
        config: null,
        id: 'quantityavailable',
        url:'quantityavailable',
        value: {
         from: estimatedDeliveryConfig.warehouseMinStockLevel,
         to: ''
        },
        isParameter: false
       });
      }
      else if (value == '2-Day') {
       this.facets.push({
        config: null,
        id: 'custitem_bb1_supplier_stock',
        url:'custitem_bb1_supplier_stock',
        value: {
         from: estimatedDeliveryConfig.supplierWarehouseMinStockLevel,
         to: ''
        },
        isParameter: false
       });
      }
     }
     else {
      if (value == '2-Day') {
       this.facets.push({
        config: null, /*{
         behavior: "range"
         collapsed: false,
         colors: {},
         id: "Express-Delivery",
         isParameter: false,
         max: "",
         name: "Express Delivery",
         //parser: function() {},
         priority: '1',
         showHeading: true,
         template: "facets_faceted_navigation_item_range.tpl",
         titleSeparator: ", ",
         titleToken: "Price $(1) - $(0)",
         uncollapsible: false
        },*/
        id: 'quantityavailable',
        url:'quantityavailable',
        value: {
         from: estimatedDeliveryConfig.warehouseMinStockLevel,
         to: ''
        },
        isParameter: false
       });
      }
     }
    }
    //else {
    
     originalParseUrlFacet.apply(this, _.rest(arguments));
     
     //console.log('FacetsTranslator.prototype.parseUrlFacet');
     //console.log(this.facets);
     
    //}
   
   });
    
   FacetsBrowseView.prototype.initialize = _.wrap(FacetsBrowseView.prototype.initialize, function(originalInitialize) {
    
    var results = originalInitialize.apply(this, _.rest(arguments));
    
    this.model.on('change:facets', function (model, facets)
    {
     var estimatedDeliveryConfig = Configuration.get('estimatedDelivery');
    //console.log('FacetsBrowseView.prototype.initialize');
    //console.log(facets);
    //var facets = this.model.get('facets');
    var quantityAvailableFacet = _.findWhere(facets, {id: 'quantityavailable'}) || {};
    var supplierStockFacet = _.findWhere(facets, {id: 'custitem_bb1_supplier_stock'}) || {};
    //console.log(quantityAvailableFacet);
    //console.log(supplierStockFacet);
    var expressDeliveryFacet = {
     id: 'expressdelivery',
     url: 'Express-Delivery',
     values: []
    };
    
    //console.log('isBeforeDeliveryCutoff() == ' + isBeforeDeliveryCutoff());
    if (EstimatedDeliveryUtils.isBeforeDeliveryCutoff() && quantityAvailableFacet.max >= estimatedDeliveryConfig.warehouseMinStockLevel)
     expressDeliveryFacet.values.push({
       label: 'Next Day Delivery',
       url: 'Next-Day'
      });
      
    if (supplierStockFacet.max >= estimatedDeliveryConfig.supplierWarehouseMinStockLevel)
     expressDeliveryFacet.values.push({
       label: '2-Day Delivery',
       url: '2-Day'
      });
    facets.unshift(expressDeliveryFacet);
    //console.log(facets);
    model.set('facets', facets);
    });
    
    return results;
    
   });
    
   FacetsItemCellView.prototype.getContext = _.wrap(FacetsItemCellView.prototype.getContext, function(originalGetContext) {
    
    var results = originalGetContext.apply(this, _.rest(arguments));
    
    _.extend(results, {
     // @property {Object} expressDelivery
     expressDelivery: this.model.get('_expressDelivery', true)
    });
    
    return results;
    
   });
    
  }
  
});

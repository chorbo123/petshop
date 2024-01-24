//@module bb1.PetshopShopping.Promotions
define(
 'bb1.PetshopShopping.Promotions',
 [
  'Facets.Browse.View',
  'Facets.FacetedNavigation.View',
  'Facets.FacetsDisplay.View',
  'Facets.Translator',
  'bb1.PetshopShopping.Promotions.ItemKeyMapping',
 
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  FacetsBrowseView,
  FacetsFacetedNavigationView,
  FacetsFacetsDisplayView,
  FacetsTranslator,
  ItemKeyMapping,
  
  Backbone,
  _,
  Utils
 )
 {
  'use strict';
  
  /*var CustomUtils = {
   formatCurrency: _.wrap(Utils.formatCurrency, function(originalFormatCurrency, value, symbol, noDecimalPosition) {
    console.log('tisijsij');
    if (value == 0)
     return 'FREE!';
    
    return originalFormatCurrency.apply(this, _.rest(arguments));
   })
  };
  
  _.extend(SC.Utils, Utils, CustomUtils);
  
  _.mixin(CustomUtils);*/
  
  _.extend(FacetsBrowseView.prototype, {
   
   childViews: _.extend(FacetsBrowseView.prototype.childViews, {
    
    'Facets.FacetsDisplay': function()
    {
     var facets = this.translator.cloneWithoutFacetId('category').cloneWithoutFacetId('custitem_bb1_cop_currentpromotions').getAllFacets().sort(function (a, b) {
      return b.config.priority - a.config.priority;
     });

     return new FacetsFacetsDisplayView({
      facets: facets
     ,	translator: this.translator
     });
    }
    
    /*'Facets.FacetedNavigation': function (options)
    {
     var exclude = _.map((options.excludeFacets || '').split(','), function (facet_id_to_exclude)
      {
       return jQuery.trim( facet_id_to_exclude );
      })
     ,	has_categories = !!(this.category && this.category.categories)
     ,	has_items = this.model.get('items').length
     ,	has_facets = has_items && this.model.get('facets').length
     ,	applied_facets = this.translator.cloneWithoutFacetId('category').cloneWithoutFacetId('custitem_bb1_cop_currentpromotions').facets
     ,	has_applied_facets = applied_facets.length;

     return new FacetsFacetedNavigationView({
      categoryItemId: this.category && this.category.itemid
     ,	clearAllFacetsLink: this.translator.cloneWithoutFacets().getUrl()
     ,	hasCategories: has_categories
     ,	hasItems: has_items

      // facets box is removed if don't find items
     ,	hasFacets: has_facets

     ,	hasCategoriesAndFacets: has_categories && has_facets

      // Categories are not a real facet, so lets remove those
     ,	appliedFacets: applied_facets

     ,	hasFacetsOrAppliedFacets: has_facets || has_applied_facets

     //,	translatorUrl: this.translator.getUrl()
     ,	translator: this.translator

     //,	translatorConfig: this.options.translatorConfig
     ,	facets: _.filter(this.model.get('facets'), function (facet)
      {
       return !_.contains(exclude, facet.id);
      })

     ,	totalProducts: this.model.get('total')
     ,	keywords: this.translator.getOptionValue('keywords')
     });
    }*/
    
   }),
   
   getPromotDetails: function() {
    
    var promoDetails = null;
    var selectedPromotionFacet = this.translator.getFacetValue('Promotions');
    
    if (selectedPromotionFacet) {
     
     var items = this.model.get('items');
     var item = items && items.find(function (item) {
      var promotions = item.get('_currentPromotions');
      var promoWithDescription = _.find(promotions, function(promo) {
       return selectedPromotionFacet.indexOf(promo.internalid) != -1 && (!_.isEmpty(promo.buttonText) || !_.isEmpty(promo.pageDescription));
      });
          
      return !!promoWithDescription;
     });
     var promotions = item && item.get('_currentPromotions');
     var promoDetails = promotions && _.find(promotions, function(promo) { return selectedPromotionFacet.indexOf(promo.internalid) != -1; }) || {};
     
    }
    
    return promoDetails;
    
   },
   
   getTitle:  _.wrap(FacetsBrowseView.prototype.getTitle, function(originalGetTitle) {
   
    var title = originalGetTitle.apply(this, _.rest(arguments));
    var promoDetails = this.getPromotDetails();
    
    if (promoDetails) {
     title = promoDetails.buttonText ? promoDetails.buttonText + ' ' + title : title;
    }
      
    return title;
    
   }),
   
   getContext: _.wrap(FacetsBrowseView.prototype.getContext, function(originalGetContext) {
   
    var context = originalGetContext.apply(this, _.rest(arguments));
    var promoDetails = this.getPromotDetails();
    
    if (promoDetails) {
     _.extend(context, {
      // @property {String} promoTitle
      promoTitle: promoDetails.buttonText || '',
      // @property {String} promoDescription
      promoDescription: promoDetails.pageDescription || ''
     });
    }
      
    return context;
    
   })
   
  });
  
 }
);

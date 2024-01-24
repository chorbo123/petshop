// @module bb1.PetshopShopping.LoyaltyRewards
define(
 'bb1.PetshopShopping.LoyaltyRewards.QualifyingItems.View',
 [
  'Facets.Browse.View',
  'Facets.FacetsDisplay.View',
  
  'Backbone',
  'underscore'
 ],
 function (
  FacetsBrowseView,
  FacetsFacetsDisplayView,
  
  Backbone,
  _
 )
 {
  'use strict';

  return FacetsBrowseView.extend({
 
   page_header: _('Loyalty Reward Items').translate(),
   
   //title: _('Loyalty Reward Items').translate(),
   
   //attributes: {'class': 'LoyaltyRewardsListView'},

   childViews: _.extend(FacetsBrowseView.prototype.childViews, {
    
    'Facets.FacetsDisplay': function()
    {
     var facets = this.translator.cloneWithoutFacetId('category').cloneWithoutFacetId('Loyalty-Items').getAllFacets().sort(function (a, b) {
      return b.config.priority - a.config.priority;
     });

     return new FacetsFacetsDisplayView({
      facets: facets,
     	translator: this.translator
     });
    }
    
   }),
   
   getTitle: _.wrap(FacetsBrowseView.prototype.getTitle, function(originalGetTitle) {
   
    var title = _('Loyalty Reward Items').translate(); //originalGetTitle.apply(this, _.rest(arguments));
    var selectedBrandFacet = this.translator.getFacetValue('Brand');
    
    console.log('getTitle');
    console.log(this.options.brandUrlValue);
    console.log(selectedBrandFacet);
    
    if (selectedBrandFacet)
     title = selectedBrandFacet + ' ' + title;
      
    return title;
    
   }),
   
   getContext: _.wrap(FacetsBrowseView.prototype.getContext, function(originalGetContext) {
   
    var context = originalGetContext.apply(this, _.rest(arguments));
    var selectedBrandFacet = this.translator.getFacetValue('Brand');
    var selectedBrandFacetLabel = this.translator.getLabelForValue('Brand', selectedBrandFacet);
    
    if (selectedBrandFacet) {
     _.extend(context, {
      // @property {String} promoTitle
      promoTitle: this.getTitle(),
      // @property {String} promoDescription
      promoDescription: _('Below are all the items which qualify for the $(0) loyalty reward scheme. Each item purchased in this range will count as a stamp on your $(0) loyalty reward card. Orders placed with an existing loyalty reward card coupon code will not be counted.').translate(selectedBrandFacetLabel),
      // @property {String} loyalRewardsBrand
      loyalRewardsBrand: selectedBrandFacet
     });
    }
      
    return context;
    
   })
   
  });

 }
);

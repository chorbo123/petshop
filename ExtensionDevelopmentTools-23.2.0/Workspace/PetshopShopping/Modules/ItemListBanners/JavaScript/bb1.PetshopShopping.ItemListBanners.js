// @module bb1.PetshopShopping.ItemListBanners
define(
 'bb1.PetshopShopping.ItemListBanners',
 [
  'Facets.Browse.View',
  'SC.Configuration'
 ],
 function (
  FacetsBrowseView,
  Configuration
 )
{
 'use strict';

 FacetsBrowseView.prototype.showContent = _.wrap(FacetsBrowseView.prototype.showContent, function(originalShowContent) {
  
  var promise = originalShowContent.apply(this, _.rest(arguments));
  
  promise.done(function(view) {
   
   var itemListBannersConfig = Configuration.get('itemListBanners') || {};
   
   if (!itemListBannersConfig.enabled) return;
   
   view = view && view.currentView || view;
   
   var keywords = view && view.translator && view.translator.getOptionValue('keywords') || '';
     
   if (!view || !keywords) return;
   
   var parentElement = $('<div />').addClass('facets-facet-browse-search-banners').insertAfter(view.$('.facets-facet-browse-header'));
   
   keywords = keywords.toLowerCase();
   
   _.each(_.sortBy(_.filter(itemListBannersConfig.banners, function(banner) {
     return !banner.inactive;
    }), function(banner) {
     return banner.priority || 0;
    }), function(banner) {
    var searchPhrase = banner.searchPhrase || '';
    
    if (searchPhrase.toLowerCase() == keywords)
     parentElement.append(banner.bannerHtml);
   });
   
   parentElement.find('[data-type="merchandising-zone"]').merchandisingZone({
				application: view.application
			});
  });
  
  return promise;
  
 });
 
  function removeUnmatchedSections(layout)
  {
   var view = layout && layout.currentView,
       keywords = view && view.translator && view.translator.getOptionValue('keywords') || '';
     
   if (!view) return;
   
   var itemListBannersConfig = Configuration.get('itemListBanners') || {};
   
   if (itemListBannersConfig.enabled) {
    view.$('[data-cms-area] [data-search-keyword-banners]').remove();
    return;
   }
   
   if (!keywords) return;
   
   view.$('[data-cms-area]').each(function() {
    var $banners = jQuery(this).find('[data-search-keyword-banners]');
    
    var $matchedBanners = $banners.filter(function() {
     var banner = jQuery(this).data('search-keyword-banners');
     
     return banner.toLowerCase() == keywords.toLowerCase();
    });
    
    $banners.not($matchedBanners.eq(0)).remove();
   });
  }
  
  return {
   mountToApp: function(application) {
    
    var layout = application.getLayout();
    
    layout.on('afterAppendView', function(view) {
     removeUnmatchedSections(this);
    }).on('renderEnhancedPageContent', function(view) {
     removeUnmatchedSections(this);
    });
    
    var cmsSettings = Configuration.get('cms');
    
    if (cmsSettings.useCMS) {
     var eventName = cmsSettings.adapterVersion == '3' ? 'page:content:set' : 'cms:rendered';
     
     if (typeof window.CMS === 'undefined' || !window.CMS.on)
     {
      Backbone.Events.on('cms:load', function ()
      {
       window.CMS && window.CMS.on(eventName, jQuery.proxy(removeUnmatchedSections, layout, layout));
      });
     }
     else
     {
      window.CMS && window.CMS.on(eventName, jQuery.proxy(removeUnmatchedSections, layout, layout));
     }
    }
    
   }
  }

});

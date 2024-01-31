//@module bb1.PetshopShopping.Header
define(
 'bb1.PetshopShopping.Header',
 [
  'Header.View',
  'ItemsSearcher.View',
  'SC.Configuration',
  
  'underscore',
  'jQuery'
 ],
 function (
  HeaderView,
  ItemsSearcherView,
  Configuration,
  
  _,
  jQuery
 )
 {
  'use strict';
  
  ItemsSearcherView.prototype.defaultOptions.placeholderLabel = _('Find the best for your pet...').translate();
  
  _.extend(HeaderView.prototype, {
   
   getContext: _.wrap(HeaderView.prototype.getContext, function(originalGetContext) {
    var context = originalGetContext.apply(this, _.rest(arguments));
    var headerBannersConfig = Configuration.get('header.rotatingBanners', {});
    var headerBanners = headerBannersConfig.enabled && _.where(headerBannersConfig.banners, {inactive: false});
    
    _.extend(context, {
     showBanners: headerBannersConfig.enabled,
     banners: headerBanners
    });
    
    return context;
   })
   
  });
  
  return {
   
   setupBrandsDowndownEvents: function()
   {
    //application.getLayout().on('afterAppendView', function(view) {
    // jQuery('.header-menu-nav [data-toggle="view-header-brand-list"]').attr('data-navigation', "ignore-click");
    //});
    
    jQuery(document).on('click', '.header-menu-nav [data-toggle="view-header-brand-list"]', function(event) {
     event.preventDefault();
     jQuery(this).closest('[data-toggle="categories-menu"]').addClass('open');
     
     var brandList = jQuery(this).data("view-header-brand-list");
     var $brandList = jQuery('.header-menu-nav [data-header-brand-list="' + brandList + '"]');
     
     jQuery('.header-menu-nav #header-dropdown-content-brands-list').animate({
      scrollTop: $brandList.get(0).offsetTop - 10
     }, 500);
    });
    
    document.addEventListener('scroll', function (event) {
    //jQuery(document).on('scroll', '#header-dropdown-content-brands-list', function(event) {
     if (event.target.id === 'header-dropdown-content-brands-list') {
      var $scrollingContainer = jQuery(event.target);
      var brandListTop = $scrollingContainer.scrollTop();
      var brandListBottom = brandListTop + $scrollingContainer.height();
      
      var $topMostVisibleElement = $scrollingContainer.find('[data-header-brand-list]').parent().children().filter(function() {
       var elementTop = jQuery(this).get(0).offsetTop; //jQuery(this).offset().top;
       var elementBottom = elementTop + jQuery(this).outerHeight();
       return (elementBottom > brandListTop && elementTop < brandListBottom);
      }).first();
      
      var brandList = $topMostVisibleElement.data("header-brand-list") || $topMostVisibleElement.prev().data("header-brand-list");
      
      var $brandCategoryIndexLinks = $scrollingContainer.closest(".header-menu-level-container").find('[data-view-header-brand-list]').removeClass("active");
      
      if (brandList)
       $brandCategoryIndexLinks.filter('[data-view-header-brand-list="' + brandList + '"]').addClass("active");
     }
    //});
    }, true);
   },
   
   setupBrandsPageEvents: function()
   {
    jQuery(document).on('click', '[data-toggle="view-brand-list"]', function(e) {
     e.preventDefault();
     
     var brandList = jQuery(this).data("view-brand-list");
     //console.log('click [data-toggle="view-brand-list"]');
     //console.log(brandList);
     jQuery('html, body').animate({
      scrollTop: (jQuery('[data-brand-list="' + brandList + '"]').offset().top)
     }, 500);
    });
   },
   
   setupBannerSlider: function(application)
   {
    var self = this;
    
    jQuery(window).on("resize", function (e) {
     self.checkScreenSize();
    });

    application.getLayout().once('afterAppendView', function(view) {
     self.checkScreenSize();
    });
   },
   
   applyFixForCmsHeaderDropdowns: function(application)
   {
    var self = this;
    
    application.getLayout().on('afterAppendView', function() {
     if (typeof window.CMS === 'undefined' || !window.CMS.on)
     {
      Backbone.Events.on('cms:load', function ()
      {
       window.CMS && window.CMS.once('page:content:set app:page:rendered', jQuery.proxy(self.applyFixForCmsHeaderDropdownsHandler, self));
       //window.CMS && window.CMS.on('all', function(name) { console.log(name); });
      });
     }
     else
     {
      window.CMS && window.CMS.once('page:content:set app:page:rendered', jQuery.proxy(self.applyFixForCmsHeaderDropdownsHandler, self));
      //window.CMS && window.CMS.on('all', function(name) { console.log(name); });
     }
    });
   },
   
   applyFixForCmsHeaderDropdownsHandler: function(application)
   {
    //window.CMS && window.CMS.on('page:content:set', function(name) {
     setTimeout(function() {
      jQuery(".header-menu-secondary-nav [data-cms-area]").children(":not(:first-child)").remove();
      //console.log('removed extra content sections from dropdown');
     }, 200);
    //});
   },
   
   removeHeaderBannerBxSlider: function()
   {
    if (window.$headerBannerBxSlider) {
     window.$headerBannerBxSlider.stopAuto();
     window.$headerBannerBxSlider.destroySlider();
    }

    var $banners = jQuery('.header-2019-bottom-banners').removeAttr('style').children().removeAttr('style').parent();
    //var $bxslider = $banners.parent().parent();
    //$bxslider.parent().append($banners);
    //$bxslider.remove()
   },

   checkScreenSize: function()
   {
    var currentWindowWidth = jQuery(window).width();
    var sliderOptions = {
     minSlides: 1,
     maxSlides: 1,
     moveSlides: 1,
     mode: 'horizontal',
     startSlide: 0,
     slideMargin: 0,
     auto: true,
     pager: false,
     controls: false
    };

    if (currentWindowWidth < 768 && window.$headerBannerBxSliderMode != 'mobile')
    {
     this.removeHeaderBannerBxSlider();
     window.$headerBannerBxSlider = jQuery(".header-2019-bottom-banners").bxSlider(sliderOptions);
     window.$headerBannerBxSliderMode = 'mobile';
     //console.log('changed to mobile mode');
    }
    else if (currentWindowWidth >= 768 && currentWindowWidth < 992 && window.$headerBannerBxSliderMode != 'tablet')
    {
     this.removeHeaderBannerBxSlider();
     sliderOptions.minSlides = 2;
     sliderOptions.maxSlides = 2;
     sliderOptions.moveSlides = 2;
     sliderOptions.slideWidth = '362';
     window.$headerBannerBxSlider = jQuery(".header-2019-bottom-banners").bxSlider(sliderOptions);
     window.$headerBannerBxSliderMode = 'tablet';
     //console.log('changed to tablet mode');
    }
    else if (currentWindowWidth >= 992 && window.$headerBannerBxSliderMode != 'desktop')
    {
     this.removeHeaderBannerBxSlider();
     setTimeout(function() { jQuery('.header-2019-bottom-banners').removeAttr('style').children().removeAttr('style'); }, 200);
     window.$headerBannerBxSliderMode = 'desktop';
     //console.log('changed to desktop mode');
    }
   },
   
   mountToApp: function(application)
   {
    this.setupBrandsDowndownEvents(application);
    this.setupBrandsPageEvents(application);
    this.setupBannerSlider(application);
    this.applyFixForCmsHeaderDropdowns(application);
   }
   
  };
  
 }
);

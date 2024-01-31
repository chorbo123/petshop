//@module bb1.PetshopShopping.ProductDetails
define(
 'bb1.PetshopShopping.ProductDetails',
 [
  'bb1.PetshopShopping.ProductDetails.Promotions.View',
  'bb1.PetshopShopping.ProductDetails.BottomlessBowl.AddToCart.View',
  'bb1.PetshopShopping.ProductDetails.EstimatedDelivery.View',
  'bb1.PetshopShopping.ProductDetails.EstimatedDelivery.Model',
  'bb1.PetshopShopping.ProductDetails.AllRelated.View',
  'ProductDetails.QuickView.View',
  'ProductDetails.Full.View',
  'ProductDetails.Base.View',
  'ProductViews.Price.View',
  'ProductDetails.ImageGallery.View',
  'ProductDetails.Options.Selector.View',
  'ProductDetails.Information.View',
  'ProductViews.Option.View',
  'ProductLine.Stock.View',
  'ProductLine.Common',
  'LiveOrder.Model',
  'Product.Model',
  'Item.Model',
  'Transaction.Line.Views.Price.View',
  'Cart.Item.Summary.View',
  'GlobalViews.StarRating.View',
  'SC.Configuration',
  //'SocialSharing',
  
  'Backbone.Validation.callbacks',
  'Backbone.CollectionView',
  'Backbone',
  'underscore',
  'Utils',
  'jQuery'
 ],
 function (
  PromotionsView,
  BottomlessBowlAddToCartView,
  EstimatedDeliveryView,
  EstimatedDeliveryModel,
  AllRelatedView,
  ProductDetailsQuickView,
  ProductDetailsFullView,
  ProductDetailsBaseView,
  ProductViewsPriceView,
  ProductDetailsImageGalleryView,
  ProductDetailsOptionsSelectorView,
  ProductDetailsInformationView,
  ProductViewsOptionView,
  ProductLineStockView,
  ProductLineCommon,
  LiveOrderModel,
  ProductModel,
  ItemModel,
  TransactionLineViewsPriceView,
  CartItemSummaryView,
  GlobalViewsStarRatingView,
  Configuration,
  //SocialSharing,
  
  BackboneValidationCallbacks,
  BackboneCollectionView,
  Backbone,
  _,
  Utils,
  jQuery
 )
 {
  'use strict';

  var seoImage = function (layout, number)
  {
   var $image = layout.$('[data-type="social-image"], [itemprop="image"]')
   , my_number = typeof number === 'undefined' ? 0 : number
   , resized_image = $image.get(my_number) ?
     $image.get(my_number).src :
     Utils.getThemeAbsoluteUrlOfNonManagedResources('img/no_image_available.jpeg', Configuration.get.apply(Configuration, ['imageNotAvailable']));

   var patt = new RegExp('https?://')
   , image_url = resized_image;

   if(!patt.exec(image_url)) {
    image_url = window.location.origin + resized_image;
   }

   return image_url;
  };
  
  _.extend(SC.CONFIGURATION, {
   metaTagMappingOg: {},
   metaTagMappingTwitterProductCard: {},
   metaTagMappingTwitterGalleryCard: {}
  });
  
  /*SocialSharing.setMetaTags = _.wrap(SocialSharing.setMetaTags, function(originalSetMetaTags)
  {
   console.log('SocialSharing.setMetaTags wrapped');
   //var results = originalSetMetaTags.apply(this, _.rest(arguments));
   
   //return results;
      
  });
  
  SocialSharing.setMetaTagsByConfiguration = _.wrap(SocialSharing.setMetaTagsByConfiguration, function(originalSetMetaTags)
  {
   console.log('SocialSharing.setMetaTagsByConfiguration wrapped');
   //var results = originalSetMetaTags.apply(this, _.rest(arguments));
   
   //return results;
      
  });*/
  
  /*var metaTagMappingOg = Configuration.get('metaTagMappingOg');
  
  if (metaTagMappingOg) {
   metaTagMappingOg['og:image'] = seoImage;
   
   for (var key in metaTagMappingOg) {
    delete metaTagMappingOg[key];
   }
  }
  
   var metaTagMappingTwitterProductCard = Configuration.get('metaTagMappingTwitterProductCard');
   
  if (metaTagMappingTwitterProductCard) {
   metaTagMappingTwitterProductCard['twitter:image:src'] = seoImage;
    
   for (var key in metaTagMappingTwitterProductCard) {
    delete metaTagMappingTwitterProductCard[key];
   }
  }
  
  var metaTagMappingTwitterGalleryCard = Configuration.get('metaTagMappingTwitterGalleryCard');
   
  if (metaTagMappingTwitterGalleryCard) {
   metaTagMappingTwitterGalleryCard['twitter:image0:src'] = function (layout) {
    return seoImage(layout, 0);
   };
   metaTagMappingTwitterGalleryCard['twitter:image1:src'] = function (layout) {
    return seoImage(layout, 1);
   };
   metaTagMappingTwitterGalleryCard['twitter:image2:src'] = function (layout) {
    return seoImage(layout, 2);
   };
   metaTagMappingTwitterGalleryCard['twitter:image3:src'] = function (layout) {
    return seoImage(layout, 3);
   };
  
   for (var key in metaTagMappingTwitterGalleryCard) {
    delete metaTagMappingTwitterGalleryCard[key];
   }
  }*/
  
  ProductDetailsFullView.prototype.childViews['Product.Price'] = ProductDetailsBaseView.prototype.childViews['Product.Price'] = ProductDetailsQuickView.prototype.childViews['Product.Price'] = function ()
  {
   return new ProductViewsPriceView({
    application: this.application,
    model: this.model,
    origin: this.inModal ? 'PDPQUICK' : 'PDPFULL',
    showDetailedPricing: true
   });
  };
  
  ProductDetailsFullView.prototype.childViews['Product.Stock.Info'] = ProductDetailsBaseView.prototype.childViews['Product.Stock.Info'] = ProductDetailsQuickView.prototype.childViews['Product.Stock.Info'] = function ()
  {
   return new ProductLineStockView({
    application: this.application,
    model: this.model,
    showFullStockMessage: true
   });
  };
  
  ProductDetailsFullView.prototype.childViews['Product.Promotions'] = ProductDetailsBaseView.prototype.childViews['Product.Promotions'] = ProductDetailsQuickView.prototype.childViews['Product.Promotions'] = function ()
  {
   return new PromotionsView({
    application: this.application,
    model: this.model
   });
  };
  
  ProductDetailsFullView.prototype.childViews['BottomlessBowl.AddToCart'] = ProductDetailsBaseView.prototype.childViews['BottomlessBowl.AddToCart'] = ProductDetailsQuickView.prototype.childViews['BottomlessBowl.AddToCart'] = function ()
  {
   return new BottomlessBowlAddToCartView({
    application: this.application,
    model: this.model,
    itemOptions: this.model.getVisibleOptions()
    //forceUserToSelectDeliveryOption: this.forceUserToSelectDeliveryOption
   });
  };
 
  /*ProductDetailsFullView.prototype.childViews['Product.Options'] = ProductDetailsBaseView.prototype.childViews['Product.Options'] = function ()
  {
   console.log('Product.Options');
   console.log(this.model);
   console.log(this.model.getVisibleOptions());
   return new ProductDetailsOptionsSelectorView({
    model: this.model
   , application: this.application
   , show_pusher: this.showOptionsPusher()
   , show_required_label: this.model.get('item').get('itemtype') === 'GiftCert'
   });

  };*/

  ProductDetailsFullView.prototype.childViews['AllRelated.Items'] = ProductDetailsBaseView.prototype.childViews['AllRelated.Items'] = ProductDetailsQuickView.prototype.childViews['AllRelated.Items'] = function ()
  {
   //console.log('AllRelatedView');
    
   return new AllRelatedView({
    itemsIds: this.model.get('item').get('internalid'),
    application: this.application
   });
  };
  
  delete ProductDetailsQuickView.prototype.events['click [data-action="go-to-fullview"]']; /*= function goToFullView (e)
  {
   var $target = this.$(e.target),
       productUrl = this.model.get('item').get('_url') || ''; //this.model.generateURL();
   
   //if (productUrl.indexOf('?') != -1)
   // productUrl = productUrl.substr(0, productUrl.indexOf('?'));
  
   //$target.attr('href', '#');
   //$target.data('hashtag', '#' + productUrl);
   $target.attr('data-hashtag', '#' + productUrl);
  };*/
 
  _.roundNumber = function (val, decimalPlaces) {

   if (isNaN(val)) return 0;

   val = parseFloat(val);
   
   if (isNaN(decimalPlaces) || decimalPlaces < 0)
    decimalPlaces = 2;
    
   var multiplier = Math.pow(10, decimalPlaces);
   
   return Math.round(val * multiplier) / multiplier;
   
  };

  return  {
   
   mountToApp: function (application)
   {
    
    application.getLayout().setMetaTags = function() {};
    
    /*var productDetailsShowContent = function(originalShowContent)
    {
     var self = this,
         promise = originalShowContent.apply(this, _.rest(arguments));
      
     return promise;
    };
    
    ProductDetailsFullView.prototype.showContent = _.wrap(ProductDetailsFullView.prototype.showContent, productDetailsShowContent);
    ProductDetailsQuickView.prototype.showContent = _.wrap(ProductDetailsQuickView.prototype.showContent, productDetailsShowContent);*/
    
    var productDetailsInitialize = function(originalInitialize)
    {
     var results = originalInitialize.apply(this, _.rest(arguments));
     
     var view = this,
         product = this.model,
         layout = this.application.getLayout();
         
     product.on('change:quantity', function(model, response, options) {
      view.updateURL();
      
      var priceTableOption = product.get('priceTableOption');
      
      priceTableOption.quantity = product.get('quantity');
      product.set('priceTableOption', priceTableOption);
     });
     
     //product.on('change:custcol_bb1_blbi_orderschedule', function(model, response, options) {
     // console.log('productDetailsInitialize change:custcol_bb1_blbi_orderschedule');
     // console.log(model);
     //});
     
     product.get('item').on('sync', function(model, response, options) {
      //view.modelUpdated = true;
      //console.log('model');
      //console.log(model);
      //console.log(product);
      //var product = model,
      var item = product.get('item'),
          orderScheduleOption = product.getOption('custcol_bb1_blbi_orderschedule'),
          selectedQuantity = product.get('quantity') || 1,
          quantitySetInUrl = _.getParameterByName(Backbone.history.fragment, 'quantity') || '',
          priceSchedules = (item.get('_priceDetails') || {}).priceschedule || [],
          selectedPriceTableQuantity = priceSchedules.length ? priceSchedules[priceSchedules.length - 1].minimumquantity : 1,
          selectedOrderSchedule = orderScheduleOption.get('value') || {},
          selectedPriceTableOption = product.get('priceTableOption') || {},
          isMinPriceSelectedByDefault = item.get('_isMinPriceSelectedByDefault');
      
      if (!selectedPriceTableOption.quantity) {
       if (isMinPriceSelectedByDefault) {
        selectedPriceTableOption = {quantity: quantitySetInUrl || selectedPriceTableQuantity, deliveryOption: quantitySetInUrl ? selectedOrderSchedule.internalid || '' : selectedOrderSchedule.internalid || '?'};
       }
       else {
        selectedPriceTableOption = {quantity: 1, deliveryOption: ''};
       }
       product.set('priceTableOption', selectedPriceTableOption);
      }
      
      //console.log('tetetete');
      if (isMinPriceSelectedByDefault && /*this.modelUpdated && */orderScheduleOption /*&& discountRate*/ && !selectedOrderSchedule.internalid && !(selectedQuantity > 1) && selectedPriceTableQuantity > 1 && !quantitySetInUrl) { // && !layout.isRewrited) {
       product.set('quantity', selectedPriceTableQuantity);
      }
       
     });
      
     return results;
    };
    
    ProductDetailsBaseView.prototype.initialize = _.wrap(ProductDetailsBaseView.prototype.initialize, productDetailsInitialize);
    //ProductDetailsFullView.prototype.initialize = _.wrap(ProductDetailsFullView.prototype.initialize, productDetailsInitialize);
    //ProductDetailsQuickView.prototype.initialize = _.wrap(ProductDetailsQuickView.prototype.initialize, productDetailsInitialize);
    
    _.extend(ProductDetailsBaseView.prototype.events, {
     
     'click [data-action="show-reviews"]': 'showReviews'
     
    });
    
    _.extend(ProductDetailsFullView.prototype.events, {
     
     'click [data-action="show-reviews"]': 'showReviews'
     
    });
    
    GlobalViewsStarRatingView.prototype.events = GlobalViewsStarRatingView.prototype.events || {};
    
    _.extend(GlobalViewsStarRatingView.prototype.events, {
     
     'click [data-action="show-reviews"]': 'showReviews'
     
    });
    
    var ProductDetailsCustomView = {
     
     showReviews: function (e) {
      var offset = jQuery(".product-reviews-center").offset().top - 10;
      jQuery("html,body").animate({scrollTop: offset}, "slow");
     }
     
    };
    
    _.extend(ProductDetailsBaseView.prototype, ProductDetailsCustomView);
    _.extend(ProductDetailsFullView.prototype, ProductDetailsCustomView);
    _.extend(GlobalViewsStarRatingView.prototype, ProductDetailsCustomView);
   
    ProductDetailsOptionsSelectorView.prototype.render = _.wrap(ProductDetailsOptionsSelectorView.prototype.getVisibleOptions, function(originalRender) 
    {
     if (!this.model.getVisibleOptions().length)
     {
      return;
     }

     this._render();

    });
    
    ProductModel.prototype.getPrice = _.wrap(ProductModel.prototype.getPrice, function(originalGetPrice) 
    {
     var result = originalGetPrice.apply(this, _.rest(arguments));
     
     var scheduledDeliveryOption = '';//(this.getOption('custcol_bb1_blbi_orderschedule').get('value') || {}).internalid;
     var priceTableDeliveryOption = (this.get('priceTableOption') || {}).deliveryOption;
     var bottomlessBowlDiscount = this.get('item').get('_bottomlessBowlDiscount');
     
     if ((scheduledDeliveryOption || priceTableDeliveryOption) && bottomlessBowlDiscount > 0) {
      result.discounted_price = Math.round(result.price * (1 - bottomlessBowlDiscount) * 100) / 100;
      result.discounted_price_formatted = _.formatCurrency(result.discounted_price);
     }
     
     return result;

    });
    
    ProductModel.prototype.getVisibleOptions = ProductLineCommon.getVisibleOptions = _.wrap(ProductLineCommon.getVisibleOptions, function(originalGetVisibleOptions) 
    {
     var options = originalGetVisibleOptions.apply(this, _.rest(arguments));
     var hiddenProductOptions = ['custcol_bb1_blbi_orderschedule', 'custcol_bb1_blbi_discount', 'custcol_bb1_cop_promotext', 'custcol_bb1_cop_freeitem', 'custcol_bb1_cop_brand', 'custcol_bb1_psi_petisnotpregnant', 'custcol_bb1_psi_petsusingprescription', 'custcol_bb1_psi_petsusingrxjson'];
     
     return _.filter(options, function(option){
      return hiddenProductOptions.indexOf(option.get('cartOptionId')) == -1;
     });

    });
    
    _.extend(ProductDetailsOptionsSelectorView.prototype.childViews, {
     
     'Options.Collection': function ()
     {
      var hiddenProductOptions = ['custcol_bb1_blbi_orderschedule', 'custcol_bb1_blbi_discount', 'custcol_bb1_cop_promotext', 'custcol_bb1_cop_freeitem', 'custcol_bb1_cop_brand', 'custcol_bb1_psi_petisnotpregnant', 'custcol_bb1_psi_petsusingprescription', 'custcol_bb1_psi_petsusingrxjson'];
      
      var options = _.filter(this.model.getVisibleOptions(), function(option) {
       return hiddenProductOptions.indexOf(option.get('cartOptionId')) == -1;
      });
      
      return new BackboneCollectionView({
       collection: options,
       childView: ProductViewsOptionView,
       viewsPerRow: 1,
       childViewOptions: {
        line: this.model,
        item: this.model.get('item'),
        templateName: 'selector',
        show_required_label: this.options.show_required_label
       }
      });
     }
     
    });
    
    var productDetailsGetContext = function(originalGetContext) {
     var results = originalGetContext.apply(this, _.rest(arguments));
     
     var product = this.model,
         item = product.get('item');
     _.extend(results, {
      brandFacetUrl: item.get('_brandUrl'),
      multipleImages: (item.get('_images') || []).length > 1,
      hasSubscriptionDiscount: item.get('_hasSubscriptionDiscount'),
      isInStock: item.getStockInfo().isInStock,
      itemUrl: document.location.origin + results.itemUrl,
      isFoodItem: item.get('_isFoodItem')
     });
     
     return results;
    }
    
    ProductDetailsFullView.prototype.getContext = _.wrap(ProductDetailsFullView.prototype.getContext, productDetailsGetContext);
    ProductDetailsQuickView.prototype.getContext = _.wrap(ProductDetailsQuickView.prototype.getContext, productDetailsGetContext);
    
    Backbone.Validation.callbacks.invalid = _.wrap(Backbone.Validation.callbacks.invalid, function(originalGetContext) {
     return originalGetContext.apply(this, _.rest(arguments));
    });
    
    ProductDetailsInformationView.prototype.getContext = _.wrap(ProductDetailsInformationView.prototype.getContext, function(originalGetContext) {
     var results = originalGetContext.apply(this, _.rest(arguments));
     
     var product = this.model,
         item = product.get('item');
     
     var itemName = item.get('_name') || '';
     
     _.each(results.details, function(detail) {
      if (detail && detail.name)
       detail.name = detail.name.replace(/{{item_name}}/g, itemName);
      if (detail && detail.name == 'Details')
       detail.name = itemName + ' Description & Review';
     });
     
     return results;
    });
    
    _.extend(ProductDetailsImageGalleryView.prototype, {
     
     afterSlide: function($slideElement, oldIndex, newIndex) {
      this.$(".bx-pager .bx-pager-item a").removeClass('active');
      this.$(".bx-pager .bx-pager-item a[data-slide-index='" + newIndex + "']").addClass('active');
      //this.sliderObject.stopAuto();
      //this.pagerSliderObject.goToSlide(newIndex);
     },
     
     getContext: _.wrap(ProductDetailsImageGalleryView.prototype.getContext, function(originalGetContext) {
      var results = originalGetContext.apply(this, _.rest(arguments)),
          model = this.model.get('item') || this.model,
          isFreeDelivery = model.get('_isFreeDelivery'),
          isSale = model.get('_isOnSale'),
          productTypeImageUrl = model.get('_productTypeDetailImageUrl'),
          expressDelivery = model.get('_expressDelivery');
      
      _.extend(results, {
       isFreeDelivery: isFreeDelivery,
       isSale: isSale,
       productTypeImageUrl: productTypeImageUrl,
       expressDelivery: expressDelivery
      });
      
      return results;
     })
     
     /*initSlider: _.wrap(ProductDetailsImageGalleryView.prototype.initSlider, function(originalInitSlider) {
      
      if (this.options.images.length > 1)
      {
       this.$slider = this.$('[data-slider]');
       _//.initBxSlider(this.$slider, {
       this.sliderObject = this.$slider.bxSlider({
        //buildPager: jQuery.proxy(this.buildSliderPager, this)
        pager: false
       , startSlide: this.hasSameImages() ? previous_position : 0
       , adaptiveHeight: true
       , touchEnabled: true
       , nextText: '<a class="item-details-gallery-next-icon"></a>'
       , prevText: '<a class="item-details-gallery-prev-icon"></a>'
       ,  controls: true
       , onSlideAfter: jQuery.proxy(this.afterSlide, this)
       });
      }
      
      var self = this;
          //results = originalInitSlider.apply(this, _.rest(arguments));
     
      //SC.Application("Shopping").getLayout().once('afterAppendView', function(e) {
       console.log('self.$(".bx-pager")');
       console.log(self.$(".bx-pager"));
       console.log(self.$(".bx-pager .bx-pager-item"));
       //if (self.$(".bx-pager .bx-pager-item").length > 4) {
        this.pagerSliderObject = self.$(".bx-pager").bxSlider({
          minSlides: 4,
          slideMargin: 0,
          moveSlides: 1,
          auto: false,
          pager: false,
          mode: 'vertical',
          useCSS: true,
          controls: self.$(".bx-pager .bx-pager-item").length > 4,
          infiniteLoop: false,
          nextText: '<a class="item-details-gallery-pager-next-icon"></a>',
          prevText: '<a class="item-details-gallery-pager-prev-icon"></a>'
        });
       //}
      //});
     
      this.$(".bx-pager .bx-pager-item").on('click', 'a', function(e){
        e.preventDefault();
        var $this = jQuery(this);       
        $this.closest(".bx-pager").find(".bx-pager-item a").removeClass('active');
        self.sliderObject.stopAuto();
        self.sliderObject.goToSlide($this.addClass('active').data('slide-index'));
      });
      
      //return results;
     })*/
     
    });
    
    _.extend(ProductModel.prototype.validation, {
     
     'options': {
      fn: function ()
      {
       var option = this.getOption('custcol_bb1_blbi_orderschedule') || {},
           pricingTableOption = this.get('priceTableOption') || {}; //jQuery('[name="select-delivery-option"]:checked').val(); // replace with model settting

       var layout = application.getLayout();
       var view = layout.modalCurrentView || layout.currentView;
       var optionValue = option.get('value') || {};
       
       view.hideError();
       
       if (pricingTableOption.deliveryOption && !optionValue.internalid) {
        var errorMessage = _('Please select Delivery Frequency For Subscribe & Save').translate();
        //application.getLayout().currentView.showError(errorMessage);
        BackboneValidationCallbacks.invalid(view, 'custcol_bb1_blbi_orderschedule', errorMessage, 'name');
        setTimeout(function() { view.showError(errorMessage); }, 500);
        return errorMessage;
       }
       
       var are_options_with_error = false;

       this.get('options').each(function (option)
       {
        are_options_with_error = are_options_with_error || !!option.validate();
       });
       return are_options_with_error && _.translate('Invalid options values');
      
      }
     }
     
    });
    
    
    _.extend(ProductViewsPriceView.prototype, {
     
     events: _.extend(ProductViewsPriceView.prototype.events || {}, {
      'click input[data-action="select-delivery-option"]': 'selectDeliveryOption'
     }),
     
     /*selectDeliveryOption: function (e) {
      var $target = jQuery(e.target),
          deliveryOptionId = $target.data("delivery-option") || $target.val() || '',
          $orderSchedule = jQuery('select[name="custcol_bb1_blbi_orderschedule"]'),
          fake_event = jQuery.Event('change', {
           currentTarget: $orderSchedule.get(0)
          });
          
      if (!deliveryOptionId || !$orderSchedule.val()) {
       $orderSchedule.val(deliveryOptionId);
       var layout = this.model.application.getLayout(),
           currentView = layout.modalCurrentView || layout.currentView;
           
       currentView.setOption(fake_event);
      }
     },*/
     
     selectDeliveryOption: function (e) {
      var $target = jQuery(e.target),
          deliveryOptionId = $target.data("delivery-option") || $target.val() || '',
          currentQuantity = this.model.get('quantity') || 1,
          quantity = $target.data("quantity") || 1;
          //$orderSchedule = jQuery('select[name="option-custcol_bb1_blbi_orderschedule"]'),
          //fake_event = jQuery.Event('change', {
          // currentTarget: $orderSchedule.get(0)
          //});
      
      this.userSelectedPriceTableOption = $target;
      
      this.model.set('priceTableOption', {quantity: quantity, deliveryOption: deliveryOptionId});
      this.model.set('quantity', quantity);
      this.model.setOption('custcol_bb1_blbi_orderschedule', deliveryOptionId);// == '?' ? '' : deliveryOptionId || '');
      //console.log('trigg');
      //console.log($target.closest('tbody'));
      //$target.closest('tbody').children('tr').removeClass('selected');
      //$target.closest('tr').addClass('selected');
      
      var layout = this.options.application.getLayout(),
          currentView = layout.modalCurrentView || layout.currentView;
          
      //currentView.setOption(fake_event);
      
      //this.refreshInterface(e);
      //currentView.render();
      currentView.childViewInstances['BottomlessBowl.AddToCart']['BottomlessBowl.AddToCart'].childViewInstance.render(); // TODO

      // need to trigger an afterAppendView event here because, like in the PDP, we are really appending a new view for the new selected matrix child
      if (this.$containerModal)
      {
       this.application.getLayout().trigger('afterAppendView', this);
      }
     },
     
     getContext: _.wrap(ProductViewsPriceView.prototype.getContext, function (originalGetContext)
     {
      var result = originalGetContext.apply(this, _.rest(arguments)),
          item = this.model.get('item') || this.model,
          price = result.isPriceRange ? result.maxPrice : result.price,
          minPriceAvailable = item.get('_minPriceAvailable'),
          savings = item.get('_savings'),
          savingsPercentage = item.get('_savingsPercentage'),
          pricePerKg = item.get('_pricePerKg'),
          priceDiscountOptions = item.get('_priceDiscountOptions'),
          priceTableOption = this.model.get('priceTableOption') || {},
          selectedOrderSchedule = priceTableOption.deliveryOption || '',
          isSubscriptionItem = item.get('_isSubscriptionItem'),
          hasSubscriptionDiscount = item.get('_hasSubscriptionDiscount'),
          subscriptionDiscountedPrice = item.get('_subscriptionDiscountedPrice'),
          subscriptionDiscountedSavings = item.get('_subscriptionDiscountedSavings'),
          subscriptionDiscountedSavingsPercentage = item.get('_subscriptionDiscountedSavingsPercentage'),
          showMinPricing = !!this.options.showMinPricing && item.get('_displayMinPriceAvailable'),
          priceRounded = _.roundNumber(result.price),
          priceFormatted = result.price == 0 ? 'FREE!' : _.formatCurrency(result.price),
          lastSchedulePriceMinQuantity;
          
      priceDiscountOptions = _.map(priceDiscountOptions, function(priceDiscountOption) {
       var selectedMinQuantity = priceTableOption.quantity >= priceDiscountOption.schedulePriceMinQuantity && !(priceTableOption.quantity >= lastSchedulePriceMinQuantity);
       
       priceDiscountOption.selectedMinQuantity = selectedMinQuantity;
       lastSchedulePriceMinQuantity = priceDiscountOption.schedulePriceMinQuantity;
       
       return priceDiscountOption;
      });
      
      //@class ItemViews.Price.View.Context
      return _.extend(result, {
       // @property {Boolean} showDetailedPricing
       showDetailedPricing: !!this.options.showDetailedPricing,
       // @property {Boolean} showMinPricing
       showMinPricing: showMinPricing,
       // @property {Number} minPriceAvailable
       minPriceAvailable: item.get('_displayMinPriceAvailable') ? minPriceAvailable : priceRounded,
       // @property {Number} minPriceAvailableFormatted
       minPriceAvailableFormatted: item.get('_displayMinPriceAvailable') ? _.formatCurrency(minPriceAvailable) : priceFormatted,
       // @property {Boolean} showSavings
       showSavings: savings > 0,
       // @property {Number} savings
       savings: savings,
       // @property {String} savingsFormatted
       savingsFormatted: _.formatCurrency(savings),
       // @property {Number} savingsPercentage
       savingsPercentage: savingsPercentage,
       // @property {Boolean} showComparePrice
       showComparePrice: savings > 0,
       // @property {Number} pricePerKg
       pricePerKg: pricePerKg,
       // @property {Number} pricePerKgFormatted
       pricePerKgFormatted: _.formatCurrency(pricePerKg),
       // @property {Boolean} hasSubscriptionDiscount
       hasSubscriptionDiscount: hasSubscriptionDiscount,
       // @property {Number} subscriptionDiscountRate
       subscriptionDiscountRate: item.get('_bottomlessBowlDiscount') * 100,
       // @property {Number} subscriptionDiscountedPrice
       subscriptionDiscountedPrice: subscriptionDiscountedPrice,
       // @property {String} subscriptionDiscountedPriceFormatted
       subscriptionDiscountedPriceFormatted: _.formatCurrency(subscriptionDiscountedPrice),
       // @property {Number} subscriptionDiscountedSavings
       subscriptionDiscountedSavings: subscriptionDiscountedSavings,
       // @property {String} subscriptionDiscountedSavingsFormatted
       subscriptionDiscountedSavingsFormatted: _.formatCurrency(subscriptionDiscountedSavings),
       // @property {Number} subscriptionDiscountedSavingsPercentage
       subscriptionDiscountedSavingsPercentage: subscriptionDiscountedSavingsPercentage,
       // @property {Number} selectedOrderSchedule
       selectedOrderSchedule: selectedOrderSchedule,
       // @property {Boolean} showSavingsPercentage
       showSavingsPercentage: hasSubscriptionDiscount ? (subscriptionDiscountedSavings < 0.3) : (savings < 0.3),
       // @property {String} priceFormatted
       priceFormatted: item.getPrice().price_formatted, //priceFormatted,
       // @property {String} comparePriceFormatted
       comparePriceFormatted: _.formatCurrency(result.comparePrice),
       // @property {Boolean} showSubscriptionPricing
       showSubscriptionPricing: !!this.options.showDetailedPricing && isSubscriptionItem,
       // @property {String} saleUnit
       saleUnit: item.get('_saleUnit'),
       // @property {String} priceSchedules
       priceSchedules: priceDiscountOptions,
       // @property {String} pricingMessage
       pricingMessage: item.get('custitem_bb1_web_pricingmessage'),
       // @property {Number} price
       price: _.roundNumber(item.getPrice().price), //priceRounded,
       // @property {Number} discountedPrice
       discountedPrice: this.model.getPrice().discounted_price || priceRounded,
       // @property {Number} hasFirstOrderSubscriptionDiscount
       hasFirstOrderSubscriptionDiscount: item.get('_hasFirstOrderSubscriptionDiscount'),
       // @property {Number} firstOrderSubscriptionDiscountRate
       firstOrderSubscriptionDiscountRate: item.get('_firstOrderBottomlessBowlDiscount') * 100,
       // @property {Number} firstBottomlessBowlOrderPrice
       firstOrderSubscriptionDiscountedPriceFormatted: item.get('_firstOrderSubscriptionDiscountedPriceFormatted'),
       // @property {Number} firstBottomlessBowlOrderSavingsPercentage
       firstOrderSubscriptionDiscountedSavingsPercentage: item.get('_firstOrderSubscriptionDiscountedSavingsPercentage'),
       // @property {Number} bottomlessBowlOrderPrice
       bottomlessBowlOrderPrice: _.formatCurrency(subscriptionDiscountedPrice),
       // @property {Number} bottomlessBowlOrderSavingsPercentage
       bottomlessBowlOrderSavingsPercentage: _.roundNumber(result.comparePrice / item.get('_firstOrderSubscriptionDiscountedPrice') * 100, 0)
      });
      //@class ItemViews.Price.View
     })
     
    });
    
    _.extend(TransactionLineViewsPriceView.prototype, {
     
     getContext: _.wrap(TransactionLineViewsPriceView.prototype.getContext, function (originalGetContext)
     {
      var result = originalGetContext.apply(this, _.rest(arguments));
      
      //@class Transaction.Line.Views.Price.View.Context
      return _.extend(result, {
       // @property {String} rateFormatted
       rateFormatted: this.model.get('rate') == 0 ? 'FREE!' : result.rateFormatted
      //@class Transaction.Line.Views.Price.View
      });
     })
     
    });
    
    _.extend(CartItemSummaryView.prototype, {
     
     getContext: _.wrap(CartItemSummaryView.prototype.getContext, function (originalGetContext)
     {
      var result = originalGetContext.apply(this, _.rest(arguments));
      
      //@class Transaction.Line.Views.Price.View.Context
      return _.extend(result, {
       // @property {String} totalFormatted
       totalFormatted: this.model.get('total') == 0 ? 'FREE!' : result.totalFormatted,
      //@class Transaction.Line.Views.Price.View
      });
     })
     
    });
    
   }
  };
 
 }
);

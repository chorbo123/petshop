define(
  'bb1.PetshopShopping.Home',
  [
    'bb1.PetshopShopping.RecentlyPurchasedItems.View',
    'bb1.PetshopShopping.BottomlessBowlBrands.View',
    'bb1.PetshopShopping.TopRatedBrands.View',
    'bb1.PetshopShopping.GoogleCustomerReviews.Slider.View',
    'RecentlyViewedItems.View',
    'RecentlyViewedItems.Collection',
    'Home.View',
    'Facets.ItemCell.View',
    'Newsletter.View',
    'Newsletter.Model',
    'Profile.Model',
    'Backbone.CompositeView',
    'Backbone.CollectionView',
    'CookieWarningBanner.View',
    'SC.Configuration',

    'recently_viewed_items.tpl',
    'recently_viewed_row.tpl',
    'recently_viewed_cell.tpl',
    'facets_item_cell_grid.tpl',

    'Backbone',
    'underscore'
  ],
  function (
    RecentlyPurchasedItemsView,
    BottomlessBowlBrandsView,
    TopRatedBrandsView,
    GoogleCustomerReviewsSlider,
    RecentlyViewedItemsView,
    RecentlyViewedItemsCollection,
    HomeView,
    FacetsItemCellView,
    NewsletterView,
    NewsletterModel,
    ProfileModel,
    BackboneCompositeView,
    BackboneCollectionView,
    CookieWarningBannerView,
    Configuration,

    recently_viewed_items_tpl,
    recently_viewed_row_tpl,
    recently_viewed_cell_tpl,
    facets_item_cell_grid_tpl,

    Backbone,
    _
  ) {
    'use strict';

    _.extend(CookieWarningBannerView.prototype, {

      getContext: _.wrap(CookieWarningBannerView.prototype.getContext, function (originalGetContext) {
        var context = originalGetContext.apply(this, _.rest(arguments));

        _.extend(context, {
          linkHref: 'https://www.petshop.co.uk/cookiepolicypetshop.html'
        });

        return context;
      })

    });

    return {
      mountToApp: function (application) {
        function isMobile() {
          return jQuery(window).width() < 768;
        }

        RecentlyViewedItemsView.prototype.initialize = _.wrap(RecentlyViewedItemsView.prototype.initialize, function () {
          var application = this.options.application,
            layout = application.getLayout(),
            collection =
              application.getConfig('siteSettings.sitetype') === 'ADVANCED'
                ? RecentlyViewedItemsCollection.getInstance()
                : new Backbone.Collection(),
            self = this;

          BackboneCollectionView.prototype.initialize.call(this, {
            collection: collection,
            viewsPerRow: Infinity,
            cellTemplate: recently_viewed_cell_tpl,
            rowTemplate: recently_viewed_row_tpl,
            childView: FacetsItemCellView.extend({ template: facets_item_cell_grid_tpl }), //ItemRelationsRelatedItemView,
            template: recently_viewed_items_tpl
          });

          layout.once('afterAppendView', self.loadRecentlyViewedItem, self);

        });

        _.extend(HomeView.prototype, {

          title: _('Welcome to PetShop.co.uk | Online Pet Shop').translate(),

          page_header: _('Welcome to PetShop.co.uk | Online Pet Shop').translate(),

          metaDescription: _('Buy pet foods and pet supplies online from the UK\'s friendliest online pet store. Excellent customer service and free delivery over £54.99').translate(),

          metaKeyWords: _('pet store, pet foods online, online pet shop, cheap pet supplies,  grain free dog food').translate(),

          initialize: function (options) {
            var self = this;
            this.application = options.application;
            this.windowWidth = jQuery(window).width();
            this.user = ProfileModel.getInstance();

            var windowResizeHandler = _.throttle(function () {
              if (_.getDeviceType(this.windowWidth) === _.getDeviceType(jQuery(window).width())) {
                return;
              }
              this.showContent();

              _.resetViewportWidth();

              this.windowWidth = jQuery(window).width();

            }, 1000);

            this._windowResizeHandler = _.bind(windowResizeHandler, this);

            jQuery(window).on('resize', this._windowResizeHandler);

            this.on('afterViewRender', function () {
              this.initHomeSlider();

              _.delay(function () {
                window.dispatchEvent(new Event('resize'));
              }, 1000);

              this.initProductSlider();
              if (typeof window.CMS === 'undefined' || !window.CMS.on) {
                Backbone.Events.on('cms:load', function () {
                  window.CMS && window.CMS.once('page:content:set', jQuery.proxy(self.initHomeSlider, self));
                });
              }
              else {
                window.CMS && window.CMS.once('page:content:set', jQuery.proxy(self.initHomeSlider, self));
              }
            });
            //window.CMS && window.CMS.on('all', function(name) { console.log(name); });
          },

          showContent: function () {
            var self = this;
            var promise = jQuery.Deferred();
            this.application.getUser().done(function (user) {
              self.application.getLayout().showContent(self).done(function () {
                promise.resolveWith(self, [self]);
              });
            });
            return promise;
          },

          initHomeSlider: function () {
            var self = this,
              $sliders = self.$('.home-image-slider [data-slider]');

            if (!$sliders.length) return;

            var slideshowOpts = {
              auto: !isMobile(),
              //mode: 'fade',
              controls: !isMobile(),
              pager: isMobile(),
              pause: 7000,
              adaptiveHeight: true,
              nextText: '<a class="home-gallery-next-icon"></a>',
              prevText: '<a class="home-gallery-prev-icon"></a>'
            };

            _.initBxSlider($sliders, slideshowOpts);
          },

          initProductSlider: function () {
            var self = this,
              application = self.options.application,
              carousel = jQuery('[data-type="carousel-items"]');

            if (_.isPhoneDevice() === false && application.getConfig('siteSettings.imagesizes')) {
              var img_min_height = _.where(application.getConfig('siteSettings.imagesizes'), { name: application.getConfig('imageSizeMapping.thumbnail') })[0].maxheight;

              carousel.find('.bottomless-bowl-brands-item-thumbnail,.top-rated-brands-item-thumbnail').css('minHeight', img_min_height);
            }

            _.initBxSlider(carousel, Configuration.bxSliderDefaults);
          },

          childViews: _.extend(HomeView.prototype.childViews || {}, {

            'ItemList.RecentlyPurchased': function () {
              return new RecentlyPurchasedItemsView({
                application: this.options.application
              });
            },

            'ItemList.RecentlyViewed': function () {
              return new RecentlyViewedItemsView({
                application: this.options.application
              });
            },

            'Brands.BottomlessBowl': function () {
              return new BottomlessBowlBrandsView({
                application: this.options.application
              });
            },

            'Brands.TopRated': function () {
              return new TopRatedBrandsView({
                application: this.options.application
              });
            },

            'GoogleCustomerReviews.Slider': function () {
              return new GoogleCustomerReviewsSlider({
                application: this.options.application
              });
            },

            'Newsletter.Signup': function () {
              return new NewsletterView({
                application: this.options.application,
                model: new NewsletterModel()
              });
            }

          }),

          getContext: _.wrap(HomeView.prototype.getContext, function (originalGetContext) {
            var result = originalGetContext.apply(this, _.rest(arguments)),
              profile = this.user,
              homeSlidingBannersConfig = Configuration.get('homeSlidingBanners') || {},
              slidingBanners = [];

            console.log('homeSlidingBannersConfig');
            console.log(homeSlidingBannersConfig);

            if (homeSlidingBannersConfig.enabled) {

              slidingBanners = _.sortBy(_.filter(homeSlidingBannersConfig.banners || [], function (banner) {
                return !banner.inactive;
              }), function (banner) {
                return banner.priority || 0;
              });
              // onclick="ga('send', 'event', 'banner', 'click', 'HomepageBanner Birthday');>
            }

            //@class bb1.PetshopShopping.Home.View.Context
            return _.extend(result, {
              // @property {Boolean} isLoggedIn
              isLoggedIn: profile.get('isRecognized') === 'T',
              // @property {Boolean} hasSlidingBanners
              hasSlidingBanners: !!homeSlidingBannersConfig.enabled && slidingBanners.length > 0,
              // @property {Array} slidingBanners
              slidingBanners: slidingBanners
            });
            //@class bb1.PetshopShopping.Home.View
          })

        });

      }
    };

  }
);

// @module bb1.PetshopShopping.GoogleCustomerReviews
define(
	'bb1.PetshopShopping.GoogleCustomerReviews.Slider.View',
	[
  'SC.Configuration',
  
  'bb1_petshopshopping_googlecustomerreviews_slider.tpl',
  
  'Backbone',
  'underscore',
		'Utils'
	],
	function (
  Configuration,
  
  bb1_petshopshopping_googlecustomerreviews_slider_tpl,
  
		Backbone,
		_
	)
 {
  'use strict';
  
  return Backbone.View.extend({
   
   template: bb1_petshopshopping_googlecustomerreviews_slider_tpl,
   
   initialize: function(options)
   {
    Backbone.View.prototype.initialize.apply(this, arguments);
    this.application = options.application;
   },
   
   render: function()
   {
    var self = this;
    
    this.application.getLayout().once('afterAppendView', function ()
    {
     self.initProductSlider();
    });
    
    this._render();
   },
   
   formatdateReviewed: function(dateText)
   {
    var date = _.stringToDate(dateText, {format: 'dd-mm-yyyy', dateSplitCharacter: '/'}),
        today = new Date(),
        daysAgo = parseInt((today.getTime() - date.getTime()) / (60 * 60 * 24 * 1000));
    
    if (daysAgo < 7)
     return daysAgo + ' days ago';
    else if (daysAgo < 30)
     return parseInt(daysAgo / 7) + (parseInt(daysAgo / 7) > 1 ? ' weeks ago' : ' week ago');
    else if (daysAgo < 365)
     return parseInt(daysAgo / 30) + (parseInt(daysAgo / 30) > 1 ? ' months ago' : ' month ago');
    else
     return parseInt(daysAgo / 365) + (parseInt(daysAgo / 365) > 1 ? ' years ago' : ' year ago');
   },
   
   initProductSlider: function()
   {
    var self = this,
        application = self.application,
        $carousel = this.$('[data-view="UpsellItems.List"]');
        
    /*if (!$carousel.is(':empty'))
     $carousel.bxSlider(Configuration.bxSliderDefaults);
    // this.slider.redrawSlider();
    else
     var timer = setInterval(function() {
      console.log('thht');
      var $carousel = self.$('[data-view="UpsellItems.List"]');
      
      if (!$carousel.is(':empty')) {
       self.slider = $carousel.bxSlider(Configuration.bxSliderDefaults);
       clearInterval(timer);
      }
     }, 10);*/
    // _.initBxSlider(carousel, Configuration.bxSliderDefaults);
    this.sliders = [];
    
    setTimeout(function() {
     self.$('.google-customer-review-slider').each(function() {
      self.sliders.push(jQuery(this).bxSlider(_.extend({}, Configuration.bxSliderDefaults, {
       slideWidth: '347px',
       slideMargin: 50,
       minSlides: 1,
       maxSlides: 3
       //touchEnabled: self.isMobileOrTablet() || !self.isChrome()
      })));
     });
    }, 10);
    
   },
   
   getContext: function()
   {
    var self = this;
    var reviews = _.map(_.where(Configuration.get('googleCustomerReviews.reviews', []), {inactive: false}), function(review) {
     return _.extend({}, review, {
      reviewRating: new Array(review.reviewRating),
      dateReviewed: self.formatdateReviewed(review.dateReviewed)
     });
    });
    
    // @class bb1.PetshopShopping.GoogleCustomerReviews.Slider.View.Context
    return {
     // @property {Array} reviews
     reviews: reviews
    };
   }

  });
   
 }
);

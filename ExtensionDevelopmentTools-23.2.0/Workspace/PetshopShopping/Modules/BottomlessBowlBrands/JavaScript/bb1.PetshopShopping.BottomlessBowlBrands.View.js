// @module bb1.PetshopShopping.BottomlessBowlBrands
define(
 'bb1.PetshopShopping.BottomlessBowlBrands.View',
	[
		'bb1.PetshopShopping.BottomlessBowlBrands.Item.View',
  'Backbone.CollectionView',
  'Profile.Model',
		'SC.Configuration',
		'Tracker',

		'bb1_petshopshopping_bottomless_bowl_brands_items.tpl',
		'bb1_petshopshopping_bottomless_bowl_brands_row.tpl',
		'bb1_petshopshopping_bottomless_bowl_brands_cell.tpl',

		'jQuery',
		'Backbone',
		'underscore',
		'Utils'
	],
	function (
  BottomlessBowlBrandsItemView,
		BackboneCollectionView,
  ProfileModel,
		Configuration,
		Tracker,

		bottomless_bowl_brands_items_tpl,
		bottomless_bowl_brands_row_tpl,
		bottomless_bowl_brands_cell_tpl,

		jQuery,
		Backbone,
		_
	)
 {
  'use strict';

  return BackboneCollectionView.extend({
   
   configDefaults: [
       {
           "name": "Arden Grange",
           "url": "/Brand/Arden-Grange",
           "thumbnailUrl": "http://staging.petshop.co.uk/SCA%20Product%20Images/Arden-Grange-Adult-Light-Chicken-Potato-Dry-Cat-Food-4kg_1.JPG?resizeid=3&resizeh=300&resizew=300",
           "inactive": true
       },
       {
           "name": "Beta",
           "url": "/Brand/Beta",
           "thumbnailUrl": "http://staging.petshop.co.uk/SCA%20Product%20Images/Beta-Grain-Free-Adult-Chicken-Dry-Dog-Food-1.5kg_1.png?resizeid=3&resizeh=300&resizew=300"
       },
       {
           "name": "Canagan",
           "url": "/Brand/Canagan",
           "thumbnailUrl": "http://staging.petshop.co.uk/SCA%20Product%20Images/Canagan-Dental-for-Small-Breed-Dog-6kg_1.jpg?resizeid=3&resizeh=300&resizew=300"
       },
       {
           "name": "Huntland",
           "url": "/Brand/Huntland",
           "thumbnailUrl": "http://staging.petshop.co.uk/SCA%20Product%20Images/Huntland-Adult-Salmon-Trout-Grain-Free-Working-Dog-Food-12kg_1.png?resizeid=3&resizeh=300&resizew=300"
       },
       {
           "name": "Hills",
           "url": "/Brand/Hills",
           "thumbnailUrl": "http://staging.petshop.co.uk/SCA%20Product%20Images/Hills-Prescription-Diet-Gastrointestinal-Biome-Chicken-Dry-Cat-Food-1-5kg_1.jpg?resizeid=3&resizeh=300&resizew=300"
       },
       {
           "name": "Iams",
           "url": "/Brand/Iams",
           "thumbnailUrl": "http://staging.petshop.co.uk/SCA%20Product%20Images/Iams-Delights-and-Sea-Collection-Cat-Food-48-x-85g_1.png?resizeid=3&resizeh=300&resizew=300"
       },
       {
           "name": "James Wellbeloved",
           "url": "/Brand/James-Wellbeloved",
           "thumbnailUrl": "http://staging.petshop.co.uk/SCA%20Product%20Images/James-Wellbeloved-Fish-Senior-Dry-Dog-Food-10kg_1.jpg?resizeid=3&resizeh=300&resizew=300"
       }
   ],
   
   initialize: function ()
   {
    var profile = ProfileModel.getInstance();
    
    console.log('profile');
    console.log(profile);
    if (profile.get('isLoggedIn') == 'T')
     return;
    
    var application = this.options.application;
    var	brandsConfig = application.getConfig('bottomlessBowlBrands') || {};
    var	brands = _.filter(brandsConfig.brands || this.configDefaults, function(brand) { return !brand.inactive; });
    var	collection = new Backbone.Collection(brands);
    var	numberOfItemsDisplayed = brandsConfig.numberOfItemsDisplayed || 50;
    var	self = this;

     console.log('collection from config');
     console.log(collection);
     //console.log(self);
     
      BackboneCollectionView.prototype.initialize.call(self, {
       collection: collection, //.first(numberOfItemsDisplayed),
       viewsPerRow: Infinity,
       cellTemplate: bottomless_bowl_brands_cell_tpl,
       rowTemplate: bottomless_bowl_brands_row_tpl,
       childView: BottomlessBowlBrandsItemView,
       template: bottomless_bowl_brands_items_tpl
      });
       //Tracker.getInstance().trackProductList(collection, 'Recently Purchased Items');
       self.render();
       //console.log('rendered');
       
    application.getLayout().once('afterAppendView', function ()
    {
 //console.log('afterAppendView');
      
       var carousel = self.$el.find('[data-type="carousel-items"]');

       //if(_.isPhoneDevice() === false && application.getConfig('siteSettings.imagesizes'))
       if(application.getConfig('siteSettings.imagesizes'))
       {
        var img_min_height = _.where(application.getConfig('siteSettings.imagesizes'), {name: application.getConfig('imageSizeMapping.thumbnail')})[0].maxheight;

        carousel.find('.bottomless-bowl-brands-item-thumbnail').css('height', img_min_height);
       }

       _.initBxSlider(carousel, Configuration.bxSliderDefaults);
    });
       
   }

  });
  
 }
);

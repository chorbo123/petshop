// @module bb1.PetshopShopping.Promotions.BottomlessBowlItems.Collection
define(
 'bb1.PetshopShopping.Promotions.BottomlessBowlItems.Collection',
	[
  'bb1.PetshopShopping.Promotions.BottomlessBowlItems.Model',
  'SC.Configuration',
  
	 'Backbone',
 	'underscore',
		'Utils'
	],
	function
 (
  BottomlessBowlItemsModel,
		Configuration,
  
		Backbone,
		_
	)
 {
  'use strict';

  //@class bb1.PetshopShopping.Promotions.BottomlessBowlItems.Collection @extends Backbone.Collection
  return Backbone.Collection.extend(
  {
   
   model: BottomlessBowlItemsModel,
   
   url: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/PromotionsBottomlessBowlItems.Service.ss'),
   
  	parse: function (response)
   {
    this.totalRecordsFound = response.totalRecordsFound;
    this.recordsPerPage = response.recordsPerPage;

    return response.items;
   }

  });
  
 }
);

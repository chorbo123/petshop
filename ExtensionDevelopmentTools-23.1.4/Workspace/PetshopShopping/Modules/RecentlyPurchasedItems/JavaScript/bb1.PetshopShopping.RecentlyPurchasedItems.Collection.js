//@module bb1.PetshopShopping.RecentlyPurchasedItems
define(
 'bb1.PetshopShopping.RecentlyPurchasedItems.Collection',
	[
  'bb1.PetshopShopping.RecentlyPurchasedItems.Model',
		'underscore',
		'Backbone',
		'Utils'
	],
	function (
		RecentlyPurchasedItemsModel,
		_,
		Backbone
	)
 {
  'use strict';

  return Backbone.Collection.extend({

   url: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/RecentlyPurchasedItems.Service.ss'),

   model: RecentlyPurchasedItemsModel,

   parse: function (response)
   {
    this.totalRecordsFound = response.totalRecordsFound;
    this.recordsPerPage = response.recordsPerPage;

    return response.records;
   }

  });
  
 }
);

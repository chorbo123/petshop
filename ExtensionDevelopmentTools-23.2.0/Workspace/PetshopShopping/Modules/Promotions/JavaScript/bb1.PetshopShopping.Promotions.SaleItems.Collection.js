// @module bb1.PetshopShopping.Promotions.SaleItems.Collection
define(
 'bb1.PetshopShopping.Promotions.SaleItems.Collection',
	[
  'SC.Configuration',
	 'Item.Collection',

 	'underscore',
		'Utils'
	],
	function
 (
		Configuration,
		ItemCollection,

		_
	)
 {
  'use strict';

  //@class ItemRelations.Related.Collection @extends Item.Collection
  return ItemCollection.extend(
  {

   initialize: function (options)
   {
    this.searchApiMasterOptions = Configuration.searchApiMasterOptions.Facets;
   },

   //@method fetchItems @return {jQuery.Deferred}
   fetchItems: function (options)
   {
    options = options || {};
    
    var promise = jQuery.Deferred();

    return this.fetch(
    {
     data: {
      'quantityavailable.from': 1,
      'quantityavailable.to': '',
      'id': options.items,
      'custitem_bb1_web_animaltype': options.animalTypes || undefined,
      'limit': 16,
      'sort': 'custitem_bb1_web_skupriority:asc,custitem_bb1_qtysold:desc'
     }
    }).done(function() {
     
    });
   },

   parse: function (response)
   {
    this.facets = response.facets;
    
    var original_items = _.compact(response.items);

    if (original_items.length === 0)
    {
     return []; // No items. Return an empty array, nothing else to do here.
    }
    
    _.each(original_items, function(item) {
     if (item.pricelevel3) {
      item.onlinecustomerprice_detail.onlinecustomerprice = item.pricelevel3;
      item.onlinecustomerprice_detail.onlinecustomerprice_formatted = item.pricelevel3_formatted;
     }
    });

    return _.toArray(original_items);
   }
   
  });
  
 }
);

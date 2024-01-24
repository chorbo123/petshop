// @module bb1.PetshopShopping.Promotions.TreatmentItems.Collection
define(
 'bb1.PetshopShopping.Promotions.TreatmentItems.Collection',
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
    
    this.excludedItems = options.excludedItems || [];
    
    var promise = jQuery.Deferred();

    return this.fetch(
    {
     data: {
      'quantityavailable.from': 1,
      'quantityavailable.to': '',
      //'exclude': options.excludedItems || undefined,
      'custitem_bb1_web_animaltype': options.animalTypes || undefined,
      'commercecategoryurl': options.category || undefined,
      'sort': 'custitem_bb1_web_skupriority:asc,custitem_bb1_qtysold:desc',
      'limit': 100
     }
    }).done(function() {
     
    });
   },

   parse: function (response)
   {
    var self = this,
        original_items = _.compact(response.items);
    
    if (this.excludedItems.length) {
     original_items = _.filter(original_items, function(item) {
      return self.excludedItems.indexOf(item.internalid) == -1;
     });
    }
    
    if (original_items.length === 0)
    {
     return []; // No items. Return an empty array, nothing else to do here.
    }

    return _.toArray(original_items);
   }
  });
  
 }
);

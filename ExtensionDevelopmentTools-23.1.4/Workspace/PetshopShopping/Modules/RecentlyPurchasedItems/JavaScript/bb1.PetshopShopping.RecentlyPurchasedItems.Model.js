//@module bb1.PetshopShopping.RecentlyPurchasedItems
define(
 'bb1.PetshopShopping.RecentlyPurchasedItems.Model',
	[
  'Item.Model',
		'Backbone',
		'underscore'
	],
	function (
		ItemDetailsModel,
		Backbone,
		_
	)
 {
  'use strict';

  //@class bb1.PetshopShopping.RecentlyPurchasedItems.Model @extend Backbone.Model
  return ItemDetailsModel.extend({

   //@property {String} urlRoot
   urlRoot: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/RecentlyPurchasedItems.Service.ss')

   //@property {Object} validation
  	//validation: {},

   //@method parse
   //@param {Object} record
   //@return {Object}
  	/*initialize: function (options)
   {
    ItemDetailsModel.prototype.initialize.apply(this, arguments);
    this.set('options', this.getPosibleOptions(), {silent:true});
    console.log(this.getPosibleOptions());
   },*/
   
   //@method parse
   //@param {Object} record
   //@return {Object}
  	/*parse: function (record)
   {
    //this.set('options', this.getPosibleOptions(), {silent:true});
    
    if (record.item)
    {
     //record.id = record.internalid;
     
     var item_options = _.filter(record.options, function (option)
     {
      return option.value !== '';
     });

     //record = new ItemDetailsModel(record);

     //record.internalid = record.item.get('internalid') +'|'+ JSON.stringify(item_options).replace(/"/g, '\'');
     record.setOptionsArray(item_options, true);

     //record.options = item_options;
     
    }

    return record;
   }*/
   
  });

 }
);

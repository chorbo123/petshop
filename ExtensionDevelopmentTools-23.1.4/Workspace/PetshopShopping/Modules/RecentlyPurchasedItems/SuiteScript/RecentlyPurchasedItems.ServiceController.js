// @module bb1.PetshopShopping.RecentlyPurchasedItems
define(
	'bb1.PetshopShopping.RecentlyPurchasedItems.ServiceController',
	[
		'ServiceController',
		'bb1.PetshopShopping.RecentlyPurchasedItems.Model',
		'SiteSettings.Model',
  'Application'
	],
	function(
		ServiceController,
		RecentlyPurchasedItemsModel,
		SiteSettingsModel,
  Application
	)
	{
		'use strict';

  try {
 		var enabled = SiteSettingsModel.get().isSCISIntegrationEnabled;

   // @class RecentlyPurchasedItems.ServiceController Manage reorder items requests
   // @extend ServiceController
   return ServiceController.extend({

    // @property {String} name Mandatory for all ssp-libraries model
    name: 'bb1.PetshopShopping.RecentlyPurchasedItems.ServiceController',

    // @method get The call to RecentlyPurchasedItems.Service.ss with http method 'get' is managed by this function
    // @return {Array<bb1.PetshopShopping.RecentlyPurchasedItems.Model.Attributes>}
    get: function()
    {
     // Call the search function defined on ssp_libraries/models/bb1.PetshopShopping.RecentlyPurchasedItems.js and send the response
     var results = RecentlyPurchasedItemsModel.search(
      this.request.getParameter('order_id'),
      {
       date : {
        from: this.request.getParameter('from'),
        to: this.request.getParameter('to')
       },
       page: this.request.getParameter('page') || 1,
       sort : this.request.getParameter('sort'),
       order: this.request.getParameter('order')
      }
     );
     
     results.user = nlapiGetUser();
     return results;
    }
   });
  }
		catch (e)
		{
			console.warn('bb1.PetshopShopping.SubscriptionOrders.Service.ss' + e.name, e);
			this.sendError(e);
		}
   
	}
);

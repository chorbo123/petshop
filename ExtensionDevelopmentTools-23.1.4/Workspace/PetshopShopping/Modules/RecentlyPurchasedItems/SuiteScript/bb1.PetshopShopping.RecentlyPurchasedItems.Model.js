// @module bb1.PetshopShopping.RecentlyPurchasedItems
define(
	'bb1.PetshopShopping.RecentlyPurchasedItems.Model',
	[
		'SC.Model',
		'Models.Init',
		'Application',
		'StoreItem.Model',
		'SiteSettings.Model',
		'Utils',
		'underscore'
	],
	function (
		SCModel,
		ModelsInit,
		Application,
		StoreItem,
		SiteSettings,
		Utils,
		_
	)
 {
  'use strict';
  
  addParamsToUrl = function (baseUrl, params)
  {
   // We get the search options from the config file
   if (params && _.keys(params).length)
   {
    var paramString = Object.keys(params).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&')		
    ,	join_string = ~baseUrl.indexOf('?') ? '&' : '?';

    return baseUrl + join_string + paramString;
   }
   else
   {
    return baseUrl;
   }
  };

  // @class bb1.PetshopShopping.RecentlyPurchasedItems.Model Defines the model used by the ReorderItems.Service.ss service
  // @extends SCModel
  return SCModel.extend({

   //@property {String} name
   name: 'bb1.PetshopShopping.RecentlyPurchasedItems',

   //@property {String} webServicesUrl
   webServicesUrl: nlapiResolveURL('SUITELET', 'customscript_bb1_wsc_webservices', 'customdeploy_bb1_wsc_webservices', true),

   //@property {Boolean} isMultiSite
   isMultiSite: ModelsInit.context.getFeature('MULTISITE'),

   //@method search
   //@param {String} order_id
   //@param {Object} query_filters
   //@return {Array<bb1.PetshopShopping.RecentlyPurchasedItems.Model.Attributes>}
   search: function (order_id, query_filters)
   {
    order_id = order_id || '';
    
    query_filters.user = nlapiGetUser();

    var site_settings = SiteSettings.get();

    /*if (site_settings.isSCISIntegrationEnabled)
    {
     query_filters.isSCISIntegrationEnabled = site_settings.isSCISIntegrationEnabled;
     query_filters.locationTypeMapping = {store: {internalid: SC.Configuration.locationTypeMapping.store.internalid}};
    }*/

    if (this.isMultiSite)
    {
     query_filters.site_id = ModelsInit.session.getSiteSettings(['siteid']).siteid;
     query_filters.filter_site = 'all'; //'current'; //Configuration.get('filterSite.ids'); //SC.Configuration.filter_site;
    }

    //console.log('bb1.PetshopShopping.RecentlyPurchasedItems.Model.search query_filters', JSON.stringify(query_filters));
    
    //console.log('bb1.PetshopShopping.RecentlyPurchasedItems.Model.search this.webServicesUrl', this.webServicesUrl);
    // fetch items
    var webServicesParms = {'action': 'recently-purchased-items', 'order_id': order_id},
        webServicesUrl = addParamsToUrl(this.webServicesUrl, webServicesParms);
        
    //console.log('bb1.PetshopShopping.RecentlyPurchasedItems.Model.search webServicesUrl', webServicesUrl);
    var response = nlapiRequestURL(webServicesUrl, JSON.stringify(query_filters), {'Content-Type': 'application/json'}, 'POST');
    
    var result = JSON.parse(response.getBody() || '{}');
   
    //console.log('bb1.PetshopShopping.RecentlyPurchasedItems.Model.search result', JSON.stringify(result));
    // prepare an item collection, this will be used to preload item's details
    var items_info = _.map(result.records, function (line)
     {
      return {
       id: line.id,
       type: line.type
      };
     });

    //console.log('bb1.PetshopShopping.RecentlyPurchasedItems.Model.search items_info', JSON.stringify(items_info));
    if (items_info.length)
    {
     // preload order's items information
     StoreItem.preloadItems(items_info);

     result.records = _.map(result.records, function (line)
     {
      // prepare the collection for the frontend
      //@class bb1.PetshopShopping.RecentlyPurchasedItems.Model.Attributes

      //console.log('bb1.PetshopShopping.RecentlyPurchasedItems.Model.search Utils.getItemOptionsObject(line.options)', JSON.stringify(Utils.getItemOptionsObject(line.options)));
      return _.extend(StoreItem.get( line.id, line.type ), {
        //@property {String} tranid
        tranid: line.tranid,
        //@property {Array<Utils.ItemOptionsObject>} options
        options: Utils.getItemOptionsObject(line.options),
        //@property {String} trandate
        trandate: line.trandate
      });
      //@class bb1.PetshopShopping.RecentlyPurchasedItems.Model
     });
    }

    //console.log('bb1.PetshopShopping.RecentlyPurchasedItems.Model.search result', JSON.stringify(result));
    return result;
   }
  });
 
 }
);

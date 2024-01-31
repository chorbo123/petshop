// @module bb1.PetshopShopping.PersonalisedCustomerViews
define(
	'bb1.PetshopShopping.PersonalisedCustomerViews',
	[
  'DateEffectiveCategory.ServiceController',
  'Categories.ServiceController',
  'Categories.Model',
  'SiteSettings.Model',
  'SC.Models.Init',
  
  'Configuration',
  'Utils',
		'underscore'
	],
	function (
  DateEffectiveCategoryServiceController,
  CategoriesServiceController,
  CategoriesModel,
  SiteSettingsModel,
  ModelsInit,
  
		Configuration,
		Utils,
		_
	)
 {
  'use strict';

  if (Configuration.get('personalisedCustomerViews.enabled')) {
     
   Utils.replaceNewLineByASpace = function(line) {
    return line ? line.replace(/[\r\n]+/g, ' ') : line;
   };

   SiteSettingsModel.isPersonalizedCatalogViewsEnabled = function() {
    return ModelsInit.context.getSetting('FEATURE', 'PERSONALIZED_CATALOG_VIEWS') === 'T';
   };
   
   SiteSettingsModel.get = _.wrap(SiteSettingsModel.get, function(originalGet) {
    
    var settings = originalGet.apply(this, _.rest(arguments));
    
    settings.isPersonalizedCatalogViewsEnabled = this.isPersonalizedCatalogViewsEnabled();
    
    return settings;
    
   });
   
   CategoriesModel.isPersonalizedCatalogViewsEnabled = SiteSettingsModel.isPersonalizedCatalogViewsEnabled();
   
   CategoriesModel.get = _.wrap(CategoriesModel.get, function(originalGet, fullurl, effectiveDate, pcv_groups, pcv_all_items, runAsAdmin) {
    
    //var settings = originalGet.apply(this, _.rest(arguments));
    
    const NAVIGATION_ITEM_ENDPOINT = '/api/navigation/v1/categorynavitems?';

    var category = {};
    
    var baseUrl = runAsAdmin ? request.getURL().match(/(^https?:\/\/[^\/]+)/i)[0] : Utils.trim(Configuration.get().cms.baseUrl || '') || 'http://' + Utils.getShoppingDomain();

    var params = this.getSMTEndpointParameters('full_url', fullurl, effectiveDate, this.getNavigationItemOptionalFields(), pcv_groups, pcv_all_items);
    
    var endpointURL = baseUrl + NAVIGATION_ITEM_ENDPOINT + params;
    
 //console.log('endpointURL1', endpointURL);

    var requestHeader = {
     Accept: 'application/json',
     Cookie: Utils.replaceNewLineByASpace(request.getHeader('cookie'))
    };

    var enpointResponse = nlapiRequestURL(endpointURL, null, requestHeader);

 //console.log('CategoriesModel.get.getBody', enpointResponse.getBody());

    if (enpointResponse.getCode() === 200) {
     var response = JSON.parse(enpointResponse.getBody()).data;
     if (response) {
      category = response[0];
     } else {
      throw notFoundError;
     }
    } else {
     throw notFoundError;
    }

    this.sortBy(category.siblings, this.getSortBy('sideMenu'));
    this.sortBy(category.categories, this.getSortBy('subCategories'));

    return category;
   });
   
   CategoriesModel.getSMTEndpointParameters = _.wrap(CategoriesModel.getSMTEndpointParameters, function(originalGetSMTEndpointParameters, field, value, as_of_date, optional_fields, pcv_groups, pcv_all_items) {

    var Environment = Application.getEnvironment(request);
    var locale = (
        (Environment && Environment.currentLanguage).locale ||
        ModelsInit.session.getShopperLanguageLocale()
    ).split('_');

    var parameters =
        'currency=' +
        ModelsInit.session.getShopperCurrency().code +
        '&site_id=' +
        ModelsInit.session.getSiteSettings(['siteid']).siteid;
    var use_pcv = this.isPersonalizedCatalogViewsEnabled ? 'T' : 'F';

    parameters +=
        '&c=' +
        nlapiGetContext().getCompany() +
        '&exclude_empty=' +
        Configuration.get('categories.excludeEmptyCategories') +
        '&use_pcv=' +
        use_pcv +
        '&pcv_all_items=' +
        pcv_all_items +
        '&language=' +
        locale[0] +
        '&country=' +
        (locale[1] || '') +
        '&' +
        field +
        '=' +
        value +
        optional_fields;

    // Only in case of SMT call
    if (as_of_date) {
        parameters += '&as_of_date=' + as_of_date;
    }
    if (pcv_groups) {
        parameters += '&pcv_groups=' + pcv_groups;
    }

    return parameters;
   });
   
   CategoriesModel.getCategoryTreeOptionalFields = function() {
    var config = Configuration.get().categories;

    return '&menu_fields=' + this.getColumns('menu');
   }
         
   CategoriesModel.getNavigationItemOptionalFields = function() {
    return (
     '&bread_crumb_fields=' +
     this.getColumns('breadcrumb') +
     '&category_fields=' +
     this.getColumns('category') +
     '&side_menu_fields=' +
     this.getColumns('sideMenu') +
     '&subcategory_fields=' +
     this.getColumns('subCategories')
    );
   };
         
   CategoriesModel.getCategoryTree = _.wrap(CategoriesModel.getCategoryTree, function(originalGetCategoryTree, level, effectiveDate, pcv_groups, pcv_all_items, runAsAdmin, is_annonymous) {

    var CATEGORY_TREE_ENDPOINT = '/api/navigation/v1/categorynavitems/tree?';

    var categoryTree = [];
    var baseUrl = runAsAdmin ? request.getURL().match(/(^https?:\/\/[^\/]+)/i)[0] : Utils.trim(Configuration.get().cms.baseUrl || '') || 'http://' + Utils.getShoppingDomain();

    var params = this.getSMTEndpointParameters('max_level', level, effectiveDate, this.getCategoryTreeOptionalFields(), pcv_groups, pcv_all_items);
    var endpointURL = baseUrl + CATEGORY_TREE_ENDPOINT + params;
    var requestHeader = {Accept: 'application/json'};

 //console.log('endpointURL', endpointURL);

    if (!is_annonymous) {
     requestHeader.Cookie = Utils.replaceNewLineByASpace(request.getHeader('cookie'));
    }

    var enpointResponse = nlapiRequestURL(endpointURL, null, requestHeader);

 //console.log('getBody', enpointResponse.getBody());

    if (enpointResponse.getCode() === 200) {
     categoryTree = JSON.parse(enpointResponse.getBody()).data;
    } else {
     return [];
    }

    this.sortBy(categoryTree, this.getSortBy('menu'));

    return categoryTree;
   });


   DateEffectiveCategoryServiceController.get = function()
   {
    var menuLevel = this.request.getParameter('menuLevel');
    var pcv_groups = this.request.getParameter('pcv_groups');
    var pcv_all_items = this.request.getParameter('pcv_all_items');
    var date = this.request.getParameter('date');
    var fullurl = this.request.getParameter('fullurl');

    //console.log('fullurl/pcv_groups/pcv_all_items', fullurl + '/' + pcv_groups + '/' + pcv_all_items);
    
    this.controlAccess();

    if (!date && !pcv_groups && !pcv_all_items) {
     throw invalidParameter;
    }

    Configuration.setConfig({
     domain: this.request.getParameter('domain')
    });

    if (fullurl) {
     return CategoriesModel.get(fullurl, date, pcv_groups, pcv_all_items, true);
    }
    
    if (menuLevel) {
     return CategoriesModel.getCategoryTree(menuLevel, date, pcv_groups, pcv_all_items, true);
    }
   }
   
   CategoriesServiceController.get = function()
   {
    var fullurl = this.request.getParameter('fullurl');
    var pcv_all_items = this.request.getParameter('pcv_all_items');
    
    //console.log('fullurl/pcv_all_items', fullurl + '/' + pcv_all_items);
    
    if (fullurl) {
     return CategoriesModel.get(fullurl, null, null, pcv_all_items, false);
    }
    
    var menuLevel = this.request.getParameter('menuLevel');

    if (menuLevel) {
     return CategoriesModel.getCategoryTree(menuLevel, null, null, pcv_all_items, false);
    }
   };
  
  }  
 }
);

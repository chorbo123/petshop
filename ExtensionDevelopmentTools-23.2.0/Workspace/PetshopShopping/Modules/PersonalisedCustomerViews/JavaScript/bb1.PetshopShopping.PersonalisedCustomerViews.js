// @module bb1.PetshopShopping.PersonalisedCustomerViews
define(
 'bb1.PetshopShopping.PersonalisedCustomerViews',
 [
  'CMSadapter.Impl.Categories.v3',
  'Categories',
  'Categories.Collection',
  'Categories.Model',
  'Profile.Model',
  'Session',
  'SC.Configuration',
  
  'Backbone.CollectionView'
 ],
 function (
  CMSadapterImplCategories3,
  Categories,
  CategoriesCollection,
  CategoriesModel,
  ProfileModel,
  Session,
  Configuration,
  
  BackboneCollectionView
 )
 {
  'use strict';
  
  if (Configuration.get('personalisedCustomerViews.enabled')) {
    
   Categories.categoriesPromise = new jQuery.Deferred();
   
   ProfileModel.prototype.isAnnonymous = function() {
    return this.get('isLoggedIn') === 'F' && this.get('isRecognized') === 'F';
   };

   CMSadapterImplCategories3.prototype.changeServices = _.wrap(CMSadapterImplCategories3.prototype.changeServices, function(originalChangeServices) {
    
    console.log('CMSadapterImplCategories3.prototype.changeServices');
    
    var self = this;
    
    CategoriesModel.prototype.url = function (){
     var url = _.addParamsToUrl(
      self.deEffectiveEndpointUrl
     ,	{
       'date': self.currentDate,
       'domain': self.domain,
       'n': SC.ENVIRONMENT.siteSettings.siteid,
       'c': SC.ENVIRONMENT.companyId,
       'pcv_groups': self.pcv_groups ? self.pcv_groups.join() : '',
       'pcv_all_items': self.pcv_all_items ? 'T' : 'F'
      }
     );
     console.log('CMSadapterImplCategories3.prototype.changeServices CategoriesModel.prototype.url ' + url);
     return url;
    };
    
    CategoriesModel.prototype.fetch = _.wrap(CategoriesModel.prototype.fetch, function (fn, options){
     options = _.extend(options || {}, {
      dataType: 'jsonp',
      jsonp: 'jsonp_callback'
     });
     console.log('CMSadapterImplCategories3.prototype.changeServices CategoriesModel.prototype.fetch ');
     console.log(options);
     return fn.call(this, options);
    });

    CategoriesCollection.prototype.url = function() {
     var url = _.addParamsToUrl(
      self.deEffectiveEndpointUrl
     ,	{
      'menuLevel': Configuration.get('categories.menuLevel'),
      'date': self.currentDate,
      'domain': self.domain,
      'n': SC.ENVIRONMENT.siteSettings.siteid,
      'c': SC.ENVIRONMENT.companyId,
      'pcv_groups': self.pcv_groups ? self.pcv_groups.join() : '',
      'pcv_all_items': self.pcv_all_items ? 'T' : 'F'
      }
     );
     console.log('CMSadapterImplCategories3.prototype.changeServices CategoriesCollection.prototype.url ' + url);
     return url;
    };
    
    ProfileModel.prototype.getSearchApiUrl = function(){
     console.log('CMSadapterImplCategories3.prototype.changeServices getSearchApiUrl ');
     return self.itemEndpointUrl;
    };
    
    function wrapItemsApiFetch(modelOrCollection) {
     console.log('CMSadapterImplCategories3.prototype.changeServices wrapItemsApiFetch');
     console.log(modelOrCollection);
     modelOrCollection.prototype.fetch = _.wrap(modelOrCollection.prototype.fetch, function (fn, options) {
      options = Utils.deepExtend(options || {}, {
       cache: false,
       data: {
        as_of_date: self.currentDate,
        force_avoid_redirect: true
       },
       xhrFields: {
        withCredentials: true
       },
       crossDomain: true
      });
      //The 'true' value prevents jQuery ajax from sending the 'X-SC-Touchpoint' header, it's not supported
      //by CORS request to the items API
      SC.dontSetRequestHeaderTouchpoint = true;
      var fethReturn = fn.call(this, options);
      SC.dontSetRequestHeaderTouchpoint = false;
      console.log('CMSadapterImplCategories3.prototype.changeServices wrapItemsApiFetch fetch ');
      console.log(fethReturn);
      return fethReturn;
     });
    }
    
    wrapItemsApiFetch(ItemModel);
    wrapItemsApiFetch(ItemCollection);
    wrapItemsApiFetch(FacetsModel);
   console.log('CMSadapterImplCategories3.prototype.changeServices end ');
   });
   
   CMSadapterImplCategories3.prototype.listenForCMS = _.wrap(CMSadapterImplCategories3.prototype.listenForCMS, function(originalListenForCMS) {
     
     console.log('CMSadapterImplCategories3.prototype.listenForCMS');
     
    var self = this;

    self.CMS.on('preview:segment:apply', function(promise, data) {
     console.log('CMSadapterImplCategories3.prototype.listenForCMS preview:segment:apply data');
     console.log(data);
     self.setUpEndPoints()
      .then(function() {
       console.log('CMSadapterImplCategories3.prototype.listenForCMS setUpEndPoints');
       self.pcv_all_items = data.pcv_all_items;
       self.pcv_groups = data.pcv_groups;

       SC.ENVIRONMENT.pcvGroups = self.pcv_groups ? self.pcv_groups.join() : '';
       SC.ENVIRONMENT.pcvAllItems = self.pcv_all_items ? 'T' : 'F';

       self.changeServices();
       // reload the categories
       self.reloadCategories()
       
       .then(function() {
        console.log('CMSadapterImplCategories3.prototype.listenForCMS setUpEndPoints reloadCategories success');
        promise.resolve();
       })
       .fail(function() {
        console.log('CMSadapterImplCategories3.prototype.listenForCMS setUpEndPoints reloadCategories fail');
        promise.reject();
       });
      })
      .fail(function() {
       console.log('CMSadapterImplCategories3.prototype.listenForCMS setUpEndPoints fail ');
       promise.reject();
      });
    });
    
   });
    
   CMSadapterImplCategories3.prototype.categoriesRefresh = function(menu) {
    console.log('CMSadapterImplCategories3.prototype.categoriesRefresh menu ' + menu);
    Categories.setTopLevelCategoriesUrlComponents(menu);
    // update the router with new urls
    var router = new FacetsRouter(this.application);
    router.addUrl(Categories.getTopLevelCategoriesUrlComponent(), 'categoryLoading');
    Categories.addToNavigationTabs(menu);

    this.refreshPLP();
   };

   Session.getSearchApiParams = _.wrap(Session.getSearchApiParams, function(originalGetSearchApiParams) {
    
    console.log('Session.getSearchApiParams');
    
    var search_api_params = originalGetSearchApiParams.apply(this, _.rest(arguments));

    // Use PCV
    search_api_params.use_pcv = SC && SC.ENVIRONMENT && SC.ENVIRONMENT.siteSettings && SC.ENVIRONMENT.siteSettings.isPersonalizedCatalogViewsEnabled ? 'T' : 'F';

    if (SC && SC.ENVIRONMENT && SC.ENVIRONMENT.pcvGroups) 
     search_api_params.pcv_groups = SC.ENVIRONMENT.pcvGroups;

    if (SC && SC.ENVIRONMENT && SC.ENVIRONMENT.pcvAllItems) 
     search_api_params.pcv_all_items = SC.ENVIRONMENT.pcvAllItems;
    
    return search_api_params;
    
   });

   Categories.mountToApp = _.wrap(Categories.mountToApp, function(originalMountToApp, application) {
   
    console.log('Categories.mountToApp');
    
    var self = this;
    
    if (Configuration.get('categories'))
    {
     var categories = SC.CATEGORIES;
     this.application = application;

     originalMountToApp.apply(this, _.rest(arguments));
     
     this.application.waitForPromise(this.categoriesPromise);

     if (SC.ENVIRONMENT.siteSettings.isPersonalizedCatalogViewsEnabled && !ProfileModel.getInstance().isAnnonymous()) {
      var categoriesFetch = new CategoriesModel().fetch({
       data: {
        menuLevel: Configuration.get('categories.menuLevel')
       },
       preventDefault: true
      });

      return categoriesFetch.then(function(model) {
       console.log('Categories.mountToApp categoriesFetch.then ');
       console.log(model);
        SC.CATEGORIES = model;
        self.setTopLevelCategoriesUrlComponents(model);
        self.addToNavigationTabs(model);
       }
      ).catch(function() {
        console.log('Failed to get Dynamic Categories for logged in user');
       }
      )
       .always(function() {
        self.categoriesPromise.resolve();
       }
      );
     }

     this.setTopLevelCategoriesUrlComponents(categories);
     this.addToNavigationTabs(categories);
     this.categoriesPromise.resolve();
    }
   });
    
  }
 }
);

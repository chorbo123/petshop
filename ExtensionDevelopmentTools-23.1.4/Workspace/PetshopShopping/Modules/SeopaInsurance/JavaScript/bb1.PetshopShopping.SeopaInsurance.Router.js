// @module bb1.PetshopShopping.SeopaInsurance
define(
 'bb1.PetshopShopping.SeopaInsurance.Router',
 [
  'bb1.PetshopShopping.SeopaInsurance.Form.View',
  //'bb1.PetshopShopping.SeopaInsurance.FormSubmitted.View',
  'GlobalViews.Message.View',
  'SC.Configuration',
  
  'Backbone',
  'underscore'
 ],
 function (
  SeopaInsuranceFormView,
  //SeopaInsuranceFormSubmittedView,
  GlobalViewsMessageView,
  Configuration,
  
  Backbone,
  _
 )
 {
  'use strict';
  
  // Adds routes to the application
  return Backbone.Router.extend({
   
   routes: {
    'insurance/:page': 'insuranceFormPage',
    'insurance/:page?*params': 'insuranceFormPage',
    'insurance/:page/submitted': 'insuranceFormSubmittedPage'
   },
   
   initialize: function (application)
   {
    this.application = application;
    this.config = Configuration.get('seopaInsurance', {});
   },

   getPageConfig: function (page) {
    if (!page)
     return;
    
    return _.findWhere(this.config.forms || [], {urlComponent: page});
   },
   
   insuranceFormPage: function (page)
   {
    var pageConfig = this.getPageConfig(page);
    
    if (!pageConfig)
     return this.application.getLayout().notFound();
    
    var view = new SeopaInsuranceFormView({
     application: this.application,
     formType: pageConfig.formType,
     formHeight: pageConfig.formHeight,
     pageTitle: pageConfig.pageTitle,
     pageHeader: pageConfig.pageHeader
    });

    view.showContent();
   },
   
   insuranceFormSubmittedPage: function (page)
   {
    var pageConfig = this.getPageConfig(page);
    
    if (!pageConfig)
     return this.application.getLayout().notFound();
    
    var view = new SeopaInsuranceFormSubmittedView({
     application: this.application,
     formType: pageConfig.formType,
     formHeight: pageConfig.formHeight,
     pageTitle: pageConfig.pageTitle,
     pageHeader: pageConfig.pageHeader
    });

    view.showContent();
   }
   
  });
  
 }
);

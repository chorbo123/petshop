// @module bb1.PetshopShopping.SeopaInsurance
define(
 'bb1.PetshopShopping.SeopaInsurance.Form.View',
 [
  'bb1.PetshopShopping.SeopaInsurance.QzForm',
  'bb1_petshopshopping_seopa_insurance_form.tpl',
  'SC.Configuration',
  
  'Backbone',
  'underscore',
  'jQuery'
 ],
 function (
  QzForm,
  bb1_petshopshopping_seopa_insurance_form_tpl,
  Configuration,
  
  Backbone,
  _,
  jQuery
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_seopa_insurance_form_tpl,

   title: _('Insurance').translate(),

   page_header: _('Insurance').translate(),

   attributes: {
    'id': 'seopa-insurance-form-view',
   	'class': 'seopa-insurance-form-view'
   },
   
   seopaIntegrationUrl: 'https://ws.quotezone.co.uk/js/v1.min.js',
   
   seopaPartnerId: 'e9bf34c0d9bd2cb93bf4b92b7115eed9',
   
   initialize: function (options)
   {
    var self = this;
    var seopaPartnerId = Configuration.get('seopaPartnerId') || this.seopaPartnerId;
    
    this.application = options.application;
    this.title = options.pageTitle && _(options.pageTitle).translate() || this.title;
    this.page_header = options.pageHeader && _(options.pageHeader).translate() || this.page_header;
    
    if (!seopaPartnerId || !this.options.formType)
     return this.application.getLayout().notFound();
    
    //this.loadScript();
    
    this.application.getLayout().once('afterAppendView', function() {
     if (self.options.formHeight)
      self.$('.seopa-insurance-form-iframe').css('padding-bottom', self.options.formHeight);
     
     //self.scriptPromise.done(function() {
      try {
       new window.QZ({
        product: self.options.formType, 
        id: seopaPartnerId,
        dynamicHeight: false,
        //mobileRedirect: false,
        tagWidth: '100%',
        tagHeight: '100%',
        //container: 'customDivName'
        formType: 'responsive'
       });
      }
      catch (error) {
       console.error(error);
      }
     //});
    });
   },
   
   loadScript: function() {
    var self = this;
    
    jQuery.getScript(this.seopaIntegrationUrl).done(function() {
     var scriptCheckTimer = setInterval(function() {
      if (window.QZ) {
       clearInterval(scriptCheckTimer);
       console.log(window.QZ);
       self.scriptPromise.resolve();
      };
     }, 300);
    });
   },
   
   getBreadcrumbPages: function ()
   {
    return [
     {
      text: this.page_header,
      href: '/insurance'
     }
    ];
   },
   
   getContext: function ()
   {
    var options = this.options || {};
        
    //@class bb1.PetshopShopping.SeopaInsurance.Form.View.Context
    return {
     //@property {String} pageHeader
     pageHeader: this.page_header,
     //@property {Boolean} inModal
     isInModal: false
    };
   }
   
  });

 }
);

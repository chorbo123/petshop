// @module bb1.PetshopShopping.Breeders
define(
 'bb1.PetshopShopping.Breeders.ApplicationFormSubmitted.View',
 [
  'bb1.PetshopShopping.Breeders.Programme.Collection',
  'Header.View',
  
  'bb1_petshopshopping_breeders_application_form_submitted.tpl',
  
  'Backbone',
  'underscore'
 ],
 function (
  BreederProgrammesCollection,
  HeaderView,
  
  bb1_petshopshopping_breeders_application_form_submitted_tpl,
  
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_breeders_application_form_submitted_tpl,
   
   page_header: _('Breeders Application Sent').translate(),
   
   title: _('Breeders Application Sent').translate(),
   
   attributes: {
    'id': 'breeders-form-submitted-view',
    'class': 'breeders-form-submitted-view'
   },

   initialize: function (options)
   {
    this.application = options.application;
   },

   getHeaderView: function() {
    return HeaderView;
   },
   
   getBreadcrumbPages: function ()
   {
    var model = this.model,
        //programmeName = model.get('breederprogrammename'),
        programmes = (model.get('programmes') || new BreederProgrammesCollection([{}])).at(0),
        programmeName = programmes.get('name'),
        urlComponent = programmes.get('urlComponent');
        
    return [
     {
      text: _('$(0) Breeders Programme').translate(programmeName),
      href: '/breeders/' + urlComponent //model.get('breederprogramme')
     },
     {
      text: programmeName ? programmeName + ' ' + this.page_header : this.page_header,
      href: '/breeders-application-submitted'
     }
    ];
   },
   
   /*showContent: function(dont_scroll) {
    var application = this.options.application || this.options.container;
    var layout = application && application.getLayout();
    
			 return layout&& layout.showContent(this, dont_scroll); //.done(jQuery.proxy(this, 'afterShowContent'));
   },*/
   
   getContext: function ()
   {
    var model = this.model,
        //programmeName = model.get('breederprogrammename'),
        //programmeName = (model.get('programmes') || [{}])[0].name;
        programmeName = (model.get('programmes') || new BreederProgrammesCollection([{}])).at(0).get('name');
        
    //@class bb1.PetshopShopping.Breeders.FormSubmitted.View.Context
    return {
     //@property {String} pageHeader
     pageHeader: programmeName ? programmeName + ' ' + this.page_header : this.page_header
    };
   }
   
  });

 }
);

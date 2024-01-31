// @module bb1.PetshopShopping.Contact
define(
 'bb1.PetshopShopping.Contact.FormSubmitted.View',
 [
  'bb1_petshopshopping_contact_form_submitted.tpl',
  
  'Backbone',
  'underscore'
 ],
 function (
  bb1_petshopshopping_contact_form_submitted_tpl,
  
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_contact_form_submitted_tpl,
   
   page_header: _('Message Sent').translate(),
   
   title: _('Message Sent').translate(),
   
   attributes: {
    'id': 'contact-form-submitted-view',
    'class': 'contact-form-submitted-view'
   },

   initialize: function (options)
   {
    this.application = options.application;
   },

   getBreadcrumbPages: function ()
   {
    return [
     {
      text: _('Contact Us').translate(),
      href: '/Contact-Us'
     },
     {
      text: this.page_header,
      href: '/Contact-Submitted'
     }
    ];
   },
   
   getContext: function ()
   {
    //@class bb1.PetshopShopping.Contact.FormSubmitted.View.Context
    return {
     //@property {String} pageHeader
     pageHeader: this.page_header
    };
   }
   
  });

 }
);

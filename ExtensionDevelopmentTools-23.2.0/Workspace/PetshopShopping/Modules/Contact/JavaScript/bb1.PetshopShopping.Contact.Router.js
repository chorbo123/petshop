// @module bb1.PetshopShopping.Contact
define(
 'bb1.PetshopShopping.Contact.Router',
 [
  'bb1.PetshopShopping.Contact.Form.View',
  'bb1.PetshopShopping.Contact.FormSubmitted.View',
  'bb1.PetshopShopping.Contact.Model',
  'GlobalViews.Message.View',
  
  'Backbone',
  'underscore'
 ],
 function (
  ContactFormView,
  ContactFormSubmittedView,
  ContactModel,
  GlobalViewsMessageView,
  
  Backbone,
  _
 )
 {
  'use strict';
  
  // Adds routes to the application
  return Backbone.Router.extend({
   
   routes: {
    'Contact-Us': 'contactPage',
    'Contact-Us?*params': 'contactPage',
    'Contact-Submitted': 'contactSubmittedPage'
   },

   initialize: function (application)
   {
    this.application = application;
   },

   contactPage: function ()
   {
    var model = new ContactModel(),
        view = new ContactFormView({
         application: this.application,
         model: model
        });

    view.showContent();
   },
   
   contactSubmittedPage: function ()
   {
    var view = new ContactFormSubmittedView({
     application: this.application
    });

    view.showContent();
   }
   
  });
  
 }
);

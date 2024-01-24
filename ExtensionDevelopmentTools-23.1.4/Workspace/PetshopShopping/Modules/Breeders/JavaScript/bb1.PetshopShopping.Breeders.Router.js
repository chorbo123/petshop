// @module bb1.PetshopShopping.Breeders
define(
 'bb1.PetshopShopping.Breeders.Router',
 [
  'bb1.PetshopShopping.Breeders.Form.View',
  'bb1.PetshopShopping.Breeders.FormSubmitted.View',
  'bb1.PetshopShopping.Breeders.Model',
  'GlobalViews.Message.View',
  
  'Backbone',
  'underscore'
 ],
 function (
  BreedersFormView,
  BreedersFormSubmittedView,
  BreedersModel,
  GlobalViewsMessageView,
  
  Backbone,
  _
 )
 {
  'use strict';
  
  // Adds routes to the application
  return Backbone.Router.extend({
   
   routes: {
    'Breeders': 'breedersPage',
    'Breeders?*params': 'breedersPage',
    'Breeders-Application-Submitted': 'breedersSubmittedPage'
   },

   initialize: function (application)
   {
    this.application = application;
   },

   breedersPage: function ()
   {
    var model = new BreedersModel(),
        view = new BreedersFormView({
         application: this.application,
         model: model
        });

    model.fetch().done(function() {
     view.showContent();
    });
   },
   
   breedersSubmittedPage: function ()
   {
    var view = new BreedersFormSubmittedView({
     application: this.application
    });

    view.showContent();
   }
   
  });
  
 }
);

// @module bb1.PetshopShopping.Pets
define(
 'bb1.PetshopShopping.Pets.FormSubmitted.View',
 [
  'GlobalViews.Message.View',
  
  'bb1_petshopshopping_pets_form_submitted.tpl',
  
  'Backbone',
  'underscore'
 ],
 function (
  GlobalViewsMessageView,
  
  bb1_petshopshopping_pets_form_submitted_tpl,
  
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_pets_form_submitted_tpl,
   
   page_header: _('Added Your Pet').translate(),
   
   title: _('Added Your Pet').translate(),
   
   attributes: { 'class': 'PetFormSubmittedView' },

   initialize: function (options)
   {
    this.application = options.application;
   },

   showContent: function ()
   {
    var paths = [
                 {
                  text: Views.List.page_header,
                  href: '/pets'
                 },
                 {
                  text: this.page_header,
                  href: '/pets/added'
                 }
                ];

    return showContent.call(this, 'new_pet_added', paths);
   },
   
   getContext: function ()
   {
    //@class bb1.PetshopShopping.Pets.FormSubmitted.View.Context
    return {
     //@property {String} pageHeader
     pageHeader: this.page_header
    };
   }
   
  });

 }
);

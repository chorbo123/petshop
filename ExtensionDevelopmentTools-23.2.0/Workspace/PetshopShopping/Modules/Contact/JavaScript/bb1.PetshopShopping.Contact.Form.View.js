// @module bb1.PetshopShopping.Contact
define(
 'bb1.PetshopShopping.Contact.Form.View',
 [
  'bb1_petshopshopping_contact_form.tpl',
  
  'Backbone',
  'underscore',
  'jQuery'
 ],
 function (
  bb1_petshopshopping_contact_form_tpl,
  
  Backbone,
  _,
  jQuery
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_contact_form_tpl,

   title: _('Contact Us').translate(),

   page_header: _('Contact Us').translate(),

   attributes: {
    'id': 'contact-form-view',
   	'class': 'contact-form-view'
   },

   events:
   {
    'submit form': 'saveForm',
    'click [data-action="reset"]': 'resetForm'
   },
   
   bindings: {
    '[name="fullname"]': 'fullname',
   	'[name="email"]': 'email',
   	'[name="message"]': 'message'
   },
   
   initialize: function (options)
   {
    this.application = options.application;
    this.model.on('sync', jQuery.proxy(this, 'showSuccess'));
    Backbone.Validation.bind(this);
   },
   
   getBreadcrumbPages: function ()
   {
    return [
     {
      text: this.page_header,
      href: '/Contact-Us'
     }
    ];
   },
   
   showSuccess: function()
   {	
    Backbone.history.navigate('Contact-Submitted', {trigger: true});
   },
   
   resetForm: function (e)
   {
    e.preventDefault();
    this.showContent();
   },
   
   getContext: function ()
   {
    var options = this.options || {},
        model = this.model;
        
    //@class bb1.PetshopShopping.Contact.Form.View.Context
    return {
     //@property {String} pageHeader
     pageHeader: this.page_header,
     //@property {Backbone.Model} model
     model: model,
     //@property {Boolean} inModal
     isInModal: false
    };
   }
   
  });

 }
);

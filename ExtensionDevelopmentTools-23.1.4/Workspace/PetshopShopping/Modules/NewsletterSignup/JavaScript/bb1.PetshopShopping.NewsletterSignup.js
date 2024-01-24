// @module bb1.PetshopShopping.NewsletterSignup
define(
 'bb1.PetshopShopping.NewsletterSignup',
 [
  'Newsletter.Model',
  
		'Backbone',
  'underscore',
		'Utils'
 ],
 function (
  NewsletterModel,
  
  Backbone,
  _
 )
 {
  'use strict';
  
  _.extend(NewsletterModel.prototype.validation, {
   
   firstname: {
    required: true,
    msg: 'Enter a first name to subscribe'
   }
   
  });
  
 }
);

// @module bb1.PetshopShopping.BrandReferral
define(
 'bb1.PetshopShopping.BrandReferral.ShareCode.Model',
 [
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.Model.extend(
  {
   urlRoot: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/BrandReferral.ShareCode.Service.ss'),
   
   validation: {
    sharecode: { required: true, msg: _('Share Code is required').translate() },
    firstname: { required: true, msg: _('First Name is required').translate() },
    email: { required: true, msg: _('A valid email address is required').translate(), pattern: 'email' }
   }
  });
  
 }
);

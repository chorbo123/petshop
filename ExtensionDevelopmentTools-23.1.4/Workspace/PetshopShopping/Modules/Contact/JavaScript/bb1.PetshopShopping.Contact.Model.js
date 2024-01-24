// @module bb1.PetshopShopping.Contact
define(
 'bb1.PetshopShopping.Contact.Model',
 [
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  Backbone,
  _,
  Utils
 )
 {
  'use strict';

  function validateEmail (value, name, form)
  {
   if (!value)
   {
    return _('Email Address is required').translate();
   }
  }

  function validateLength (value, name)
  {
   var max_length = 4000;

   if (value && value.length > max_length)
   {
    return _('$(0) must be at most $(1) characters').translate(name, max_length);
   }
  }

  function validateMessage (value, name)
  {
   if (!value)
   {
    return _('Message is required').translate(name);
   }

   return validateLength(value, name);
  }

  return Backbone.Model.extend(
  {
   
   urlRoot: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/Contact.Service.ss'),
    
   validation: {
    fullname: { required: true, msg: _('Full Name is required').translate() },
    email: { fn: validateEmail },
    message: { fn: validateMessage }
   }

  });
  
 }
);

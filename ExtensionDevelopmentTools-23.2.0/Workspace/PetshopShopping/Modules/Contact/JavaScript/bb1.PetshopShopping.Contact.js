// @module bb1.PetshopShopping.Contact
define(
 'bb1.PetshopShopping.Contact',
 [
  'bb1.PetshopShopping.Contact.Router'
 ],
 function (
  ContactRouter
 )
 {
  'use strict';
  
  return {
   
   mountToApp: function (application)
   {
    return new ContactRouter(application);
   }
   
  };
  
 }
);

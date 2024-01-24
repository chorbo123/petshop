// @module bb1.PetshopShopping.SeopaInsurance
define(
 'bb1.PetshopShopping.SeopaInsurance',
 [
  'bb1.PetshopShopping.SeopaInsurance.Router'
 ],
 function (
  SeopaInsuranceRouter
 )
 {
  'use strict';
  
  return {
   
   mountToApp: function (application)
   {
    return new SeopaInsuranceRouter(application);
   }
   
  };
  
 }
);

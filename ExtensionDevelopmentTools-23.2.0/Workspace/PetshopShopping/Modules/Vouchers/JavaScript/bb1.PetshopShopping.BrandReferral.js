// @module bb1.PetshopShopping.BrandReferral
define(
 'bb1.PetshopShopping.BrandReferral',
 [
  'SC.Configuration',
  
  'underscore'
 ],
 function (
  Configuration,
  
  _
 )
 {
  'use strict';
  
  return {
   
   mountToApp: function (application)
   {
    var referralShareCode = _.getParameterByName(document.location.href, 'referral-share-code');
    
    console.log('referralShareCode');
    console.log(referralShareCode);
    
    if (referralShareCode) {
     jQuery.cookie('referral-share-code', referralShareCode, {path: '/', expires: 30});
    }
   }
   
  };
 }
);

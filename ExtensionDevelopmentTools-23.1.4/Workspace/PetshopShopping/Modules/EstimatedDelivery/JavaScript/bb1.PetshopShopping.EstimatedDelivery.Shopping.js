//@module bb1.PetshopShopping.EstimatedDelivery
define(
 'bb1.PetshopShopping.EstimatedDelivery.Shopping',
 [
  'bb1.PetshopShopping.EstimatedDelivery.Cart',
  'bb1.PetshopShopping.EstimatedDelivery.ProductList',
  'bb1.PetshopShopping.EstimatedDelivery.ProductDetails',
  'bb1.PetshopShopping.EstimatedDelivery.ItemKeyMapping',
  'SC.Configuration',
  
  'Backbone',
  'underscore'
 ],
 function (
  Cart,
  ProductList,
  ProductDetails,
  ItemKeyMapping,
  Configuration,
  
  Backbone,
  _
 )
 {
  'use strict';
  
  return  {
   
   mountToApp: function (application)
   {
   }
  };
 
 }
);

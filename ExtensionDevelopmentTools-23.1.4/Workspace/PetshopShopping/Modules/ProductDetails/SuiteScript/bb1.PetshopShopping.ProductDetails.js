//@module bb1.PetshopShopping.ProductDetails
define(
 'bb1.PetshopShopping.ProductDetails',
 [
  'bb1.PetshopShopping.ProductDetails.ProductTypeImages.Model',
  'Configuration',
  'Utils',
  'SC.Model',
  'Models.Init',

  'underscore'
 ],
 function (
  ProductTypeImages,
  Configuration,
  Utils,
  SCModel,
  ModelsInit,

  _
 )
{
 'use strict';
 
 var Application = require("Application"); // workaround for Extension Manager obfuscating Application module properties
 
 Application.getEnvironment = _.wrap(Application.getEnvironment, function(originalGetEnvironment) {
  
  var environment = originalGetEnvironment.apply(this, _.rest(arguments));
  
  _.extend(environment, {
   
   productTypeImages: ProductTypeImages.get()
   
  });
  
  return environment;
  
 });
 
});

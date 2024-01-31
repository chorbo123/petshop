//@module bb1.PetshopShopping.ProductDetails
define(
 'bb1.PetshopShopping.ProductDetails.ProductTypeImages.Model',
 [
  'Application',
  'SC.Model',

  'underscore'
 ],
 function (
  Application,
  SCModel,

  _
 )
{
 'use strict';
 
 return SCModel.extend({

		name: 'bb1.PetshopShopping.ProductDetails.ProductTypeImages',
  
  get: function ()
  {
   var result = [],
       productTypeFilters = [new nlobjSearchFilter("isinactive", null, "is", "F")],
       productTypeColumns = [new nlobjSearchColumn("name").setSort(),
                             new nlobjSearchColumn("custrecord_bb1_producttype_list_image"),
                             new nlobjSearchColumn("custrecord_bb1_producttype_detail_image")],
       productTypeResults = Application.getAllSearchResults('customrecord_bb1_producttype', productTypeFilters, productTypeColumns);

   _.each(productTypeResults, function (productType) {
    var productTypeResult = {
     id: productType.getId(),
     name: productType.getValue("name"),
     listImage: productType.getText("custrecord_bb1_producttype_list_image"),
     detailImage: productType.getText("custrecord_bb1_producttype_detail_image")
    };
    
    result.push(productTypeResult);
   });
   
   return result;
  }

 });
 
});

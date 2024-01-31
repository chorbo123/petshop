// @module bb1.PetshopShopping.Prescriptions
define(
	'bb1.PetshopShopping.Prescriptions',
	[
		'SC.Model',
		'Application',
		'Models.Init',
		'SiteSettings.Model',
		'Utils',
		'underscore'
	],
	function (
		SCModel,
		Application,
		ModelsInit,
		SiteSettings,
		Utils,
		_
	)
{
	'use strict';
 
 Application.on('after:LiveOrder.submit', function(model, confirmation, threedsecure) {
  
  //console.log('after:LiveOrder.submit confirmation', JSON.stringify(confirmation));
  
  try {
   
   if (confirmation && confirmation.internalid) {
   
    var salesorder = nlapiLoadRecord("salesorder", confirmation.internalid),
        petsUsingPrescriptionJson = salesorder.getLineItemValue("item", "custcol_bb1_psi_petsusingrxjson", data.line) || '[]',
        petsUsingPrescription = JSON.parse(petsUsingPrescriptionJson) || [],
        orderUpdated = false;
    
    for (var lineIndex=1, lineCount=salesorder.getLineItemCount('item'); lineIndex <= lineCount; lineIndex++) {
     var petsUsingPrescriptionsJson = salesorder.getLineItemValue('item', 'custcol_bb1_psi_petsusingrxjson', lineIndex),
         petsUsingPrescriptions;
     
     //console.log('petsUsingPrescriptionsJson', petsUsingPrescriptionsJson);
     
     try {
      petsUsingPrescriptions = JSON.parse(petsUsingPrescriptionsJson);
     }
     catch (e) {
      console.log('Error occurred parsing Pets using Prescription JSON', e.toString());
     }
     
     var petId = petsUsingPrescriptions && petsUsingPrescriptions.length && petsUsingPrescriptions[0].pet;
     
     //console.log('petId', petId);
     
     if (petId) {
      salesorder.setLineItemValue("item", "custcol_bb1_psi_petsusingprescription", lineIndex, petsUsingPrescriptions[0].pet);
      orderUpdated = true;
     }
     
    }
    
    if (orderUpdated) {
     nlapiSubmitRecord(salesorder, false, true);
     //console.log("order submitted");
    }
    
   }
   
  }
  catch (e) {
   console.error("Error occurred while updating sales order lines for order id: " + (confirmation && confirmation.internalid || ''), e && e.getDetails ? e.getDetails() : e);
  }
  
 });
 
});

// @module bb1.PetshopShopping.Prescriptions
define(
	'bb1.PetshopShopping.Prescriptions.Item.Model',
	[
		'SC.Model',
		'Application',
		'Models.Init',
  'LiveOrder.Model',
		'SiteSettings.Model',
		'Utils',
		'underscore'
	],
	function (
		SCModel,
		Application,
		ModelsInit,
  LiveOrderModel,
		SiteSettings,
		Utils,
		_
	)
{
	'use strict';
 
 var validateNextOrderDate = function (value, valName, form) {
		var newDate = value && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value) && nlapiStringToDate(value, 'date'),
						today = new Date();
						
		if (!newDate || newDate.getTime() <= today.getTime())
			return 'Valid Next Order Date is required';
	};
 
 var validateFields = function (value, attr, computedState)
 {
  switch (attr) {
   case 'petweight':
    return computedState.treatmenttype === '1' && !(parseFloat(value) > 0) ? 'Please enter a valid weight' : null;
   case 'petage':
    return computedState.treatmenttype === '1' && !(parseFloat(value) > 0) ? 'Please enter a valid age' : null;
   case 'treatmentstartdate':
    if (computedState.treatmentstartdateautocalc == 'T') return;
   
    var today = new Date,
        startdate = nlapiStringToDate(value);
    return !startdate || (startdate.getTime() < today.getTime()) ? 'Please enter a valid date' : null;
   case 'isnotpregnant':
    return computedState.treatmenttype === '1' && value != 'T' ? 'Tick the box to confirm that you pet is not pregnant' : null;
  }
 };
 
	// @extends SCModel
	return SCModel.extend({

		name: 'bb1.PetshopShopping.Prescriptions.Item',

		validation: {
			treatmenttype: {required: true, msg: 'Treatment Type is required. Contact support for help.'},
			pet: {required: true, msg: 'Please enter a pet'},
			//petage: { fn: validateFields },
			//petweight: { fn: validateFields },
			//treatmentstartdate: { fn: validateFields },
			isnotpregnant: { fn: validateFields }
		},

		update: function (data)
		{
			'use strict';

			if (!ModelsInit.session.isLoggedIn2())
				throw unauthorizedError;

			//if (!data.internalid)
			//	throw notFoundError;
			
			nlapiLogExecution("DEBUG", "data", JSON.stringify(data));
			
			this.validate(data);

			var customerId = nlapiGetUser(),
							contactid = ModelsInit.context.getContact(),
       treatmentStartDate = data.treatmentstartdate && nlapiStringToDate(data.treatmentstartdate) || '',
       treatmentEndDate;
			
   data.treatmentsallocated = !isNaN(data.treatmentsallocated) ? parseFloat(data.treatmentsallocated, 10) : data.treatmentsallocated;
  
			var pet = nlapiLoadRecord("customrecord_bb1_pet", data.pet);
			
			if (pet.getFieldValue("custrecord_bb1_pet_customer") != customerId)
				throw unauthorizedError;
				
			if (data.petweight)
				pet.setFieldValue("custrecord_bb1_pet_weight_kg", data.petweight);
    
   switch (data.treatmenttype) {
    case '1':
     if (data.petweight && data.dosageperitem) {
      data.dosageperitem = parseFloat(data.dosageperitem) || 1; // custitem_bb1_psi_weightpertablet
      data.petweight = parseFloat(data.petweight) || data.petweight;
      data.dosageRequired = Math.ceil((data.petweight / data.dosageperitem) * 2) / 2;
      data.treatmentsDelivered = data.treatmentsallocated && Math.floor(data.treatmentsallocated / data.dosageRequired);
      data.monthsPerTreatment = 3;
      data.monthsTreated = data.treatmentsDelivered && (data.treatmentsDelivered * data.monthsPerTreatment);
     
      if (treatmentStartDate && data.monthsTreated) {
       treatmentEndDate = nlapiAddMonths(treatmentStartDate, data.monthsTreated);
      }
      
      /*if (!data.treatmentsDelivered)
       throw {
              status: 500,
             	code: 'NOT_ENOUGH_ALLOCATED',
             	message: 'You have not allocated enough of this item for a single treatment. Please allocate more of the item or choose a pet with lower weight.'
             };
       */
       
      data.wormtreatmentenddate = data.nextwormingreminder = treatmentEndDate && nlapiDateToString(treatmentEndDate) || '';
     }
     data.treatmentstartdate && pet.setFieldValue("custrecord_bb1_pet_wormtreatmentstart", data.treatmentstartdate);
     data.wormtreatmentenddate && pet.setFieldValue("custrecord_bb1_pet_wormtreatmentend", data.wormtreatmentenddate);
     break;
    case '2':
     var nextFleaReminderDate = treatmentStartDate && data.treatmentsallocated && nlapiAddMonths(treatmentStartDate, data.treatmentsallocated);
     data.fleatreatmentenddate = data.nextfleareminder = nextFleaReminderDate && nlapiDateToString(nextFleaReminderDate) || '';
     data.treatmentstartdate && pet.setFieldValue("custrecord_bb1_pet_fleatreatmentstart", data.treatmentstartdate);
     data.fleatreatmentenddate && pet.setFieldValue("custrecord_bb1_pet_fleatreatmentend", data.fleatreatmentenddate);
     break;
   }
   
			nlapiSubmitRecord(pet, false, true);
			
   if (data.salesorder) {
     
    try {
      
     var salesorder = nlapiLoadRecord("salesorder", data.salesorder),
         petsUsingPrescriptionJson = salesorder.getLineItemValue("item", "custcol_bb1_psi_petsusingrxjson", data.line) || '[]',
         petsUsingPrescription = JSON.parse(petsUsingPrescriptionJson) || [];
    
     nlapiLogExecution("DEBUG", "petsUsingPrescription", JSON.stringify(petsUsingPrescription));
     
     if (customerId == salesorder.getFieldValue("entity")) {
       
      salesorder.setLineItemValue("item", "custcol_bb1_psi_petsusingprescription", data.line, data.pet);
      nlapiLogExecution("DEBUG", "data.line/data.pet", data.line + "/" + data.pet);
      
      if (data.isnotpregnant === 'T') {
       salesorder.setLineItemValue("item", "custcol_bb1_psi_petisnotpregnant", data.line, "T");
       nlapiLogExecution("DEBUG", "pet is not pregnant");
      }
      
      petsUsingPrescription.push(data);
      salesorder.setLineItemValue("item", "custcol_bb1_psi_petsusingrxjson", data.line, JSON.stringify(petsUsingPrescription));
      
      nlapiSubmitRecord(salesorder, false, true);
      nlapiLogExecution("DEBUG", "order submitted");
     }
     
    }
    catch (e) {
     nlapiLogExecution("ERROR", "Error occurred while updating sales order lines for order id: " + data.salesorder, e && e.getDetails ? e.getDetails() : e);
    }
    
   }
   else if (data.line) {
    //console.log('data.line/data.pet', data.line + '/' + data.pet);
    var originalLineId = data.line,
        lines = LiveOrderModel.getLinesOnly(),
        line = _.findWhere(lines, {internalid: data.line}) || {},
        lineOptions = line.options && LiveOrderModel.parseLineOptionsToCommerceAPI(line.options) || {};
        
    if (data.isnew) {
     delete lineOptions.custcol_bb1_psi_petsusingprescription;
     delete lineOptions.custcol_bb1_psi_petisnotpregnant;
     delete lineOptions.custcol_bb1_psi_petsusingrxjson;
    }
    
    //console.log('lines', JSON.stringify(lines));
    //console.log('line', JSON.stringify(_.extend({}, line, {item: undefined})));
    //console.log('lineOptions', JSON.stringify(lineOptions));
    var petsUsingPrescriptionDetails;
    try {
     petsUsingPrescriptionDetails = lineOptions.custcol_bb1_psi_petsusingrxjson && JSON.parse(lineOptions.custcol_bb1_psi_petsusingrxjson || '[]') || [];
    }
    catch (e) {
     petsUsingPrescriptionDetails = [];
     console.error('Error occurred trying to parse item line prescription JSON', e && e.getDetails ? e.getDetails() : e);
    }
   
    //_.each(petsUsingPrescriptionDetails, function(petsUsingPrescriptionDetail) {
    // delete petsUsingPrescriptionDetail.internalid;
    // delete petsUsingPrescriptionDetail.line;
    //});
    
    delete data.line;
    delete data.internalid;
    delete data.itemname;
    
        
    //console.log('line.options', JSON.stringify(line.options));
    //console.log('LiveOrderModel.parseLineOptionsToCommerceAPI(line.options)', JSON.stringify(LiveOrderModel.parseLineOptionsToCommerceAPI(line.options)));
    //console.log('lineOptions', JSON.stringify(lineOptions));
    //console.log('petsUsingPrescriptionDetails', JSON.stringify(petsUsingPrescriptionDetails));
    petsUsingPrescriptionDetails.push(data);
    //console.log('petsUsingPrescription', JSON.stringify(petsUsingPrescriptionDetails));
    
    _.extend(lineOptions, {
     custcol_bb1_psi_petsusingprescription: (data.isnew ? data.pet : lineOptions.custcol_bb1_psi_petsusingprescription || data.pet),
     custcol_bb1_psi_petisnotpregnant: data.isnotpregnant === 'T' ? 'T' : 'F',
     custcol_bb1_psi_petsusingrxjson: JSON.stringify(petsUsingPrescriptionDetails) // RESET THESE FIELDS ON INIT PAGE
    });
    
    //console.log('lineOptions after', JSON.stringify(lineOptions));
    
    //line.options = LiveOrderModel.parseLineOptionsFromCommerceAPI(lineOptions);
    
    line.options = _.map(lineOptions, function (value, internalid)
    {
     //@class LiveOrder.Model.Line.Option
     return {
      //@class LiveOrder.Model.Line.Option
      //@property {String} cartOptionId
     	cartOptionId: internalid,
      //@property {String} label
      //label: option_label,
      //@property {LiveOrder.Model.Line.Option.Value} value
      //@class LiveOrder.Model.Line.Option.Value
      value: {
       //@property {String} label Name of the value selected in case of select or the entered string
       label: value,
       //@property {String} internalid
      	internalid: value
      }
     };
    });
    
    //console.log('line.options after2', JSON.stringify(line.options));
    
    var currentPosition = _.indexOf(LiveOrderModel.getLinesSort(), originalLineId);
    
    LiveOrderModel.updateLine(originalLineId, line);
    
    //console.log('LiveOrderModel.updateLine() done', 'done');
    
    var newLineId = LiveOrderModel.getLinesSort()[currentPosition];
    
    data.internalid = data.line = newLineId;
    
    //console.log('newLineId', newLineId);
    //console.log('ModelsInit.order.getItemOption(data.line)', ModelsInit.order.getItemOption(data.line));
   }
			
			return data;
		}

 });

});

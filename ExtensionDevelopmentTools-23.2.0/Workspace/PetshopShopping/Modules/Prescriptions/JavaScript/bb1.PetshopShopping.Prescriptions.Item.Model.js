// @module bb1.PetshopShopping.Prescriptions
define(
 'bb1.PetshopShopping.Prescriptions.Item.Model',
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

  function validate (value, valName, form)
  {
   switch (valName) {
    case 'treatmentsallocated':
     var treatmentsAllocated = parseFloat(form.treatmentsallocated),
         totalTreatments = parseFloat(form.totaltreatments);
         
     if (isNaN(treatmentsAllocated))
      return; //return _('You must allocate the number of treatments for this pet. Leave it as the default amount of $(0) to continue.').translate(totalTreatments);
     
     if (form.treatmenttype == '1') {
      var dosagePerItem = parseFloat(form.dosageperitem) || 1,
          petWeight = parseFloat(form.petweight),
          dosageRequired = Math.ceil((petWeight / dosagePerItem) * 2) / 2,
          treatmentsDelivered = Math.floor(treatmentsAllocated / dosageRequired);
      return treatmentsDelivered < 1 ? _('You have not allocated enough of this item for a single treatment. Please allocate at least $(0) tablets to this pet or choose a pet with lower weight to treat.').translate(Math.ceil(dosageRequired)) : null;
     }
     else if (form.treatmenttype == '2') {
      if (treatmentsAllocated < 1) 
       return _('You have not allocated enough of this item for a single treatment. Please allocate at least 1 treatment to this pet.').translate();
      else if (treatmentsAllocated > totalTreatments)
       return _('You have allocated more treatments of this item than there are available. Please allocate $(0) treatments or less to this pet.').translate(Math.ceil(totalTreatments));
      else
       return;
     }
    case 'petweight':
     return form.treatmenttype === '1' && !(parseFloat(value) > 0) ? _('Please enter a valid weight').translate() : null;
    case 'petage':
     return form.treatmenttype === '1' && !(parseFloat(value) > 0) ? _('Please enter a valid age').translate() : null;
    case 'treatmentstartdate':
     if (form.treatmentstartdateautocalc == 'T') return;
     
     var today = (new Date),
         startdate = _.stringToDate(value, {format: 'dd/MM/YYYY', dateSplitCharacter: '/'});
     return !_.isDateValid(startdate) || (startdate.getTime() < today.getTime()) ? _('Please enter a valid date').translate() : null;
    case 'isnotpregnant':
     return form.treatmenttype === '1' && value != 'T' ? _('Please read the above statements and tick the box to confirm they are correct').translate() : null;
   }
  }

  return Backbone.Model.extend(
  {
   urlRoot: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/PrescriptionsItem.Service.ss'),
   
   validation: {
    treatmenttype: { required: true, msg: _('Treatment type is required').translate() },
    treatmentsallocated: { fn: validate },
    pet: { required: true, msg: _('Pet is required').translate() },
    //petage: { fn: validate },
    //petweight: { fn: validate },
    //treatmentstartdate: { fn: validate },
    isnotpregnant: { fn: validate }
   }
  });
  
 }
);

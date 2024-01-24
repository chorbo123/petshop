// @module bb1.PetshopShopping.Pets
define(
 'bb1.PetshopShopping.Pets.Model',
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

  function validateBreed (value, valName, form)
  {
   var petSettings = SC.ENVIRONMENT.petSettings && SC.ENVIRONMENT.petSettings || {},
       petTypes = petSettings.petTypesAndBreeds || [];
   if (petTypes[form.type] && petTypes[form.type].breeds && value === '')
   {
    return _('Pet Breed is required').translate();
   }
  }

  return Backbone.Model.extend(
  {
   urlRoot: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/Pets.Service.ss'),
   
   validation: {
    name: { required: true, msg: _('Pet Name is required').translate() },
    type: { required: true, msg: _('Pet Type is required').translate() },
    breed: { fn: validateBreed },
    //dob: { required: true, msg: _('Pet Date Of Birth is required').translate() },
    yearsold: { required: true, msg: _('Pet Age is required').translate() },
    //gender: { required: true, msg: _('Pet Gender is required').translate() },
    weight: { required: true, msg: _('Pet Weight is required').translate() }
   }
  });
  
 }
);

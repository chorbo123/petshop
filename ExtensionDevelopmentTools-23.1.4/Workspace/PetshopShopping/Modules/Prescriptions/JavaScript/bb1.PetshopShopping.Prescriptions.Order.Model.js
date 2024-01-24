// @module bb1.PetshopShopping.Prescriptions
define(
 'bb1.PetshopShopping.Prescriptions.Order.Model',
 [
  'bb1.PetshopShopping.Prescriptions.Item.Collection',
  'bb1.PetshopShopping.Pets.Collection',
  
  'Backbone',
  'underscore'
 ],
 function (
  PrescriptionItemCollection,
  PetsCollection,
  
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.Model.extend(
  {
   urlRoot: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/PrescriptionsOrder.Service.ss'),
   
   initialize: function ()
   {
    this.on('change:prescriptionItems', function (model, items)
    {
     if (!(items instanceof PrescriptionItemCollection))
     {
      model.set('prescriptionItems', new PrescriptionItemCollection(_.compact(items)));
     }
    });
    this.on('change:pets', function (model, pets)
    {
     if (!(pets instanceof PetsCollection))
     {
      model.set('pets', new PetsCollection(_.compact(pets)));
     }
    });
   }
  });
  
 }
);

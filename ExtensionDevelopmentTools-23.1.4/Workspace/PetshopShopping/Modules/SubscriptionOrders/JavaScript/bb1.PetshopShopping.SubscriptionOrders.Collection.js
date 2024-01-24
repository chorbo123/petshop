// @module bb1.PetshopShopping.SubscriptionOrders
define(
 'bb1.PetshopShopping.SubscriptionOrders.Collection',
 [
  'bb1.PetshopShopping.SubscriptionOrders.Model',
  
  'Backbone',
  'underscore'
 ],
 function (
  SubscriptionOrdersModel,
  
  Backbone,
  _
 )
 {
  'use strict';
  
  return Backbone.Collection.extend(
  {
   model: SubscriptionOrdersModel,
   
   url: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/SubscriptionOrders.Service.ss'),
   
   initialize: function(options) 
   {
    this.options = options; 
   },
   
   parse: function(response) {
    this.totalRecordsFound = response.totalRecordsFound;
			 this.recordsPerPage = response.recordsPerPage;
    this.petNames = response.petNames;
    
    return response.records;
   }
   
  });
  
 }
);

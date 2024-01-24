// @module bb1.PetshopShopping.Breeders
define(
 'bb1.PetshopShopping.Breeders.Model',
 [
  'bb1.PetshopShopping.Breeders.Programme.Collection',
  
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  BreedersProgrammeCollection,
  
  Backbone,
  _,
  Utils
 )
 {
  'use strict';

  return Backbone.Model.extend(
  {
   
   urlRoot: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/Breeders.Service.ss'),
   
   initialize: function() {
    
    this.on('sync', function() {
     var programmes = this.get('programmes');
     
     if (!(programmes instanceof BreedersProgrammeCollection))
      this.set('programmes', new BreedersProgrammeCollection(programmes));
     
     var applications = this.get('applications');
     
     if (!(applications instanceof Backbone.Collection))
      this.set('applications', new Backbone.Collection(applications));
    });
   }
    
  });
  
 }
);

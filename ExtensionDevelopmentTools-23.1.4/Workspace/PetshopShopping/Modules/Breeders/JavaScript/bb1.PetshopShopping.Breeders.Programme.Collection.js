// @module bb1.PetshopShopping.Breeders
define(
 'bb1.PetshopShopping.Breeders.Programme.Collection',
 [
  'bb1.PetshopShopping.Breeders.Programme.Model',
  
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  BreedersProgrammeModel,
  
  Backbone,
  _,
  Utils
 )
 {
  'use strict';

  return Backbone.Collection.extend(
  {
   
   model: BreedersProgrammeModel,
   
   urlRoot: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/Breeders.Programme.Service.ss'),
   
   initialize: function() {
    
    this.on('sync', function() {
     var programmes = this.get('programmes');
     
     if (!(programmes instanceof BreedersProgrammeCollection))
      this.set('programmes', new BreedersProgrammeCollection(programmes));
     
     var applications = this.get('applications');
     
     if (!(applications instanceof Backbone.Collection))
      this.set('applications', new Backbone.Collection(applications));
     
     var litters = this.get('litters');
     
     if (!(litters instanceof Backbone.Collection))
      this.set('litters', new Backbone.Collection(litters));
    });
   }
   
  });
  
 }
);

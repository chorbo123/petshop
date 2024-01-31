// @module bb1.PetshopShopping.Breeders
define(
 'bb1.PetshopShopping.Breeders.PetParent.Model',
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

  return Backbone.Model.extend(
  {
   
   validation: {
    email: { required: true, pattern: 'email', msg: _('Pet Parent Email must be a valid email').translate() },
    firstname: { required: true, msg: _('Pet Parent First Name is required').translate() }
   },
   
   initialize: function(attributes, options) {
    console.log('petparentmodel');
    console.log(arguments);
    console.log(this.collection);
    console.log(this);
    console.log(options);
    console.log(attributes);
    console.log(this.idAttribute);
    console.log(this.cid);
    console.log(options.collection.indexOf(this));
    
    options = options || {};
    
    //if (options.collection)
    // this.set('id', options.collection.indexOf(this));
    
    this.on('add', function(model, collection, options) {
     console.log('add petparentmodel');
     console.log(arguments);
     console.log(this);
     
     if (collection)
      model.set('internalid', collection.indexOf(model) + 1);
    });
   }
   
  });
  
 }
);

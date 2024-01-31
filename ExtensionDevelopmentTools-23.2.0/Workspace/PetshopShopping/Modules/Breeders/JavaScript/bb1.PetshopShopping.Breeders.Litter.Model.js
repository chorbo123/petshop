// @module bb1.PetshopShopping.Breeders
define(
 'bb1.PetshopShopping.Breeders.Litter.Model',
 [
  'bb1.PetshopShopping.Breeders.PetParent.Collection',
  
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  PetParentCollection,
  
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

  function validatePetParentConsent (value, valName, form)
  {
   return value != 'T' ? _('Consent of the Pet Parents is required').translate() : null;
  }

  return Backbone.Model.extend(
  {
   
   urlRoot: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/Breeders.Litter.Service.ss'),
   
   validation: {
    numberofanimals: { required: true, msg: _('Number of Animals is required').translate() },
    litterdob: { required: true, msg: _('Litter Date of Birth is required').translate() },
    //petparentconsent: { acceptance: true, msg: _('Consent of the Pet Parents is required').translate() }
    petparentconsent: { fn: validatePetParentConsent }
    //breed: { fn: validateBreed },
    //dob: { required: true, msg: _('Pet Date Of Birth is required').translate() }
   },
   
   initialize: function(options) {
    var petParents = new PetParentCollection();
    this.set('petparents', petParents);
    
    this.on('change:numberofanimals', function(model) {
     var numberOfAnimals = this.get('numberofanimals');
     var previousNumberOfAnimals = this.previous('numberofanimals') || 0;
     var petParents = this.get('petparents');
     console.log('change:numberofanimals');
     console.log(arguments);
     console.log(this);
     console.log(model);
     console.log(numberOfAnimals);
     console.log(previousNumberOfAnimals);
     console.log(petParents);
     
     if (numberOfAnimals > previousNumberOfAnimals) {
      var modelsToAdd = new Array(numberOfAnimals - petParents.length);
      
      _.each(modelsToAdd, function(model) {
       model = {};
      });
      
      petParents.add(modelsToAdd);
     }
     else if (numberOfAnimals >= 0) {
      petParents.remove(petParents.last(petParents.length - numberOfAnimals));
     }
    });
   },
   
   parse: function(response) {
    
    console.log('parse');
    console.log(response);
     this.clear();
     this.set('applicationid', response.applicationid)
     
    var petParents = new PetParentCollection(response.petparents);
    this.set('petparents', petParents);
   
   }
   
  });
  
 }
);

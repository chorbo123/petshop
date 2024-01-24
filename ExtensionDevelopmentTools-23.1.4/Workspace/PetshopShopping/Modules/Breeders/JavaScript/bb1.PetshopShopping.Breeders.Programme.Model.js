// @module bb1.PetshopShopping.Breeders
define(
 'bb1.PetshopShopping.Breeders.Programme.Model',
 [
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  Backbone,
  _,
  Utils
 )
 {
  'use strict';

  function validateBreederFields (value, name, form)
  {
   if (value) return;
   
   if (name == 'breeds')
    return _('Breeds is required').translate();
   
   switch(form.breedertype) {
    case '1':
     if (name == 'breederregistrationnumber')
      return _('Breeder Registration Number is required').translate();
     if (name == 'numberoflittersperyear')
      return _('Number of Litters Per Year is required').translate();
     if (name == 'animaltype')
      return _('Animal Type is required').translate();
     break;
    case '2':
     if (name == 'breedername')
      return _('Breeder Registration Number is required').translate();
     if (name == 'numberoflittersperyear')
      return _('Number of Litters Per Year is required').translate();
     if (name == 'animaltype')
      return _('Animal Type is required').translate();
     break;
    case '3':
     if (name == 'rescuecentrename')
      return _('Rescue Centre Name is required').translate();
     if (name == 'numberofanimalsrehomedperyear')
      return _('Number of Animals Rehomed Per Year is required').translate();
     if (name == 'breederwebsite')
      return _('Breeder Website is required').translate();
     break;
   }
  }

  function validateAnimalFields (value, name, form)
  {
   if (value) return;
   
   switch(form.animaltype) {
    case '1':
     if (name == 'numberofmaledogs')
      return _('Number of Male Dogs is required').translate();
     if (name == 'numberoffemaledogs')
      return _('Number of Female Dogs is required').translate();
     break;
    case '2':
     if (name == 'numberofcats')
      return _('Number of Cats is required').translate();
     break;
   }
  }

  function validateBreederTypeFields (value, name, form)
  {
   if (value) return;
   
   switch(form.breedertype) {
    case '1':
    case '2':
     if (name == 'numberoflittersperyear')
      return _('Number of Litters Per Year is required').translate();
     break;
    case '3':
     if (name == 'numberofanimalsrehomedperyear')
      return _('Number of Animals Rehomed Per Year is required').translate();
     break;
   }
  }

  function validateBreedsFields (value, name, form)
  {
   console.log('validateBreedsFields');
   console.log(name);
   console.log(value);
   console.log(form);
   if (value) return;
   
   if (name == 'breeds') {
     console.log('check 12');
    return _('Breeds is required').translate();
   }
   
   if (name == 'breedsother' && form.breeds && form.breeds.length && form.breeds.indexOf('other') != -1)
    return _('Breeds (Other) is required').translate();
   
   console.log('validateBreedsFields end');
  }

  function validateAdvertisingFields (value, name, form)
  {
   console.log('validateAdvertisingFields');
   console.log(name);
   console.log(value);
   console.log(form);
   if (value) return;
   
   if (name == 'advertisingchannels') {
    console.log('check 123');
    return _('Where do you advertise your puppies/kittens is required').translate();
   }
   
   if (name == 'advertisingchannelsother' && form.advertisingchannels && form.advertisingchannels.length && form.advertisingchannels.indexOf('other') != -1)
    return _('Where do you advertise (Other) is required').translate();
   
   console.log('validateAdvertisingFields end');
  }

  function validateLength (value, name)
  {
   var max_length = 4000;

   if (value && value.length > max_length)
   {
    return _('$(0) must be at most $(1) characters').translate(name, max_length);
   }
  }

  function validateWebsiteUrl (value, name)
  {
   if (value && !/^https?:\/\//i.test(value))
   {
    return _('The URL must start with http:// or https://.').translate(name);
   }
  }

  function validateTerms (value, valName, form)
  {
   return value != 'T' ? _('You must agree to the terms & conditions').translate() : null;
  }

  function validateAgreement (value, valName, form)
  {
   return value != 'T' ? _('You must agree to refer new owners').translate() : null;
  }

  function validateCommunications (value, valName, form)
  {
   return value != 'T' ? _('You must agree to the communications').translate() : null;
  }

  return Backbone.Model.extend(
  {
   
   urlRoot: _.getAbsoluteUrl('extensions/bb1/PetshopShopping/1.0.0/services/Breeders.Programme.Service.ss'),
   
   validation: {
    breederprogramme: { required: true, msg: _('Breeder Programme is required').translate() },
    breedertype: { required: true, msg: _('Breeder Type is required').translate() },
    salutation: { required: true, msg: _('Salutation is required').translate() },
    firstname: { required: true, msg: _('First Name is required').translate() },
    lastname: { required: true, msg: _('Last Name is required').translate() },
    email: { required: true, pattern: 'email' },
    breederregistrationnumber: { fn: validateBreederFields },
    kennelname: { fn: validateBreederFields },
    breedername: { fn: validateBreederFields },
    rescuecentrename: { fn: validateBreederFields },
    regcharitynumber: { fn: validateBreederFields },
    breeds: { fn: validateBreedsFields },
    breedsother: { fn: validateBreedsFields },
    advertisingchannels: { fn: validateAdvertisingFields },
    advertisingchannelsother: { fn: validateAdvertisingFields },
    breederwebsite: { fn: validateWebsiteUrl },
    animaltype: { fn: validateBreederFields },
    numberoflittersperyear: { fn: validateBreederTypeFields },
    numberofanimalsrehomedperyear: { fn: validateBreederTypeFields },
    numberofcats: { fn: validateAnimalFields },
    numberofmaledogs: { fn: validateAnimalFields },
    numberoffemaledogs: { fn: validateAnimalFields },
    agreedtorefernewowners: { fn: validateAgreement },
    agreedtoterms: { fn: validateTerms },
    agreedtocommunications: { fn: validateCommunications },
    leadsource: { required: true, msg: _('Where did you hear about us is required').translate() },
    feedbrand: { required: true, msg: _('What brand do you feed is required').translate() },
   },
   
   initialize: function() {
    this.on('sync', function() {
     var programmes = this.get('programmes');
     
     if (!(programmes instanceof Backbone.Collection))
      this.set('programmes', new Backbone.Collection(programmes));
     
     var applications = this.get('applications');
     
     if (!(applications instanceof Backbone.Collection))
      this.set('applications', new Backbone.Collection(applications));
     
     var litters = this.get('applications');
     
     if (!(litters instanceof Backbone.Collection))
      this.set('litters', new Backbone.Collection(litters));
    });
   }

  });
  
 }
);

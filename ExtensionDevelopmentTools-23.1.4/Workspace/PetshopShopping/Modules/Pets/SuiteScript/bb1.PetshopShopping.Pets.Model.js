// @module bb1.PetshopShopping.Pets
define(
	'bb1.PetshopShopping.Pets.Model',
	[
		'SC.Model',
		'Application',
		'Profile.Model',
		'StoreItem.Model',
		'Models.Init',
		'SiteSettings.Model',
		'Utils',
		'underscore'
	],
	function (
		SCModel,
		Application,
		Profile,
		StoreItem,
		ModelsInit,
		SiteSettings,
		Utils,
		_
	)
 {
  'use strict';

  _.validateBreed = function (value, attr, computedState)
  {
   'use strict';

   if (computedState.type) {
    var petBreedFilters = [new nlobjSearchFilter("isinactive", null, "is", "F"),
                          new nlobjSearchFilter("custrecord_bb1_pet_breedof", null, "anyof", computedState.type)],
        petBreedResults = Application.getAllSearchResults('customrecord_bb1_pet_type_breed', petBreedFilters);
    if (petBreedResults && petBreedResults.length && !value)
    {
     return 'Pet Breed is required';
    }
   }
  };
  
  _.validatePetAge = function (value, attr, computedState)
  {
   'use strict';

   if (computedState.type) {
    var petBreedFilters = [new nlobjSearchFilter("isinactive", null, "is", "F"),
                          new nlobjSearchFilter("custrecord_bb1_pet_breedof", null, "anyof", computedState.type)],
        petBreedResults = Application.getAllSearchResults('customrecord_bb1_pet_type_breed', petBreedFilters);
    if (petBreedResults && petBreedResults.length && !value)
    {
     return 'Pet Breed is required';
    }
   }
  };

  // @extends SCModel
  return SCModel.extend({

   name: 'bb1.PetshopShopping.Pets',
   
   validation: {
    name: { required: true, msg: 'Pet Name is required' },
    type: { required: true, msg: 'Pet Type is required' },
    breed: { fn: _.validateBreed },
    //dob: { required: true, msg: 'Pet Date Of Birth is required' },
    yearsold: { required: true, msg: 'Pet Age is required' },
    //gender: { required: true, msg: 'Pet Gender is required' },
    weight: { required: true, msg: 'Pet Weight is required' }
   },

   // @method get
   // @returns {Pets.Model.Data}
   get: function (id)
   {
    'use strict';

    if (!ModelsInit.session.isLoggedIn())
     throw unauthorizedError;

    var customerId = nlapiGetUser(),
        contactid = ModelsInit.context.getContact(),
        filters = [new nlobjSearchFilter("isinactive", null, "is", "F"),
                   new nlobjSearchFilter("custrecord_bb1_pet_deceased", null, "is", "F"),
                   new nlobjSearchFilter("custrecord_bb1_pet_customer", null, "anyof", customerId)],
        columns = this.getColumnsArray();
        
    if (id)
     filters.push(new nlobjSearchFilter("internalid", null, "anyof", id));
     
    var result = this.searchHelper(filters, columns, "all");
    
    if (id) {
     if (result.pets.length)
      result = result.pets[0];
     else
      throw notFoundError;
    }
    
    //result.pet_types = this.getPetTypesAndBreeds();

    return result;
   },
   
   getColumnsArray: function ()
   {
    'use strict';

    return [
     new nlobjSearchColumn("custrecord_bb1_pet_customer"),
     new nlobjSearchColumn("created").setSort(true),
     new nlobjSearchColumn("custrecord_bb1_pet_mainpet"),
     new nlobjSearchColumn("custrecord_bb1_pet_name").setSort(),
     new nlobjSearchColumn("custrecord_bb1_pet_type"),
     new nlobjSearchColumn("custrecord_bb1_pet_breed"),
     new nlobjSearchColumn("custrecord_bb1_pet_dob"),
     new nlobjSearchColumn("custrecord_bb1_pet_gender"),
     new nlobjSearchColumn("custrecord_bb1_pet_weight"),
     new nlobjSearchColumn("custrecord_bb1_pet_weight_kg"),
     new nlobjSearchColumn("custrecord_bb1_pet_currentdryfood"),
     new nlobjSearchColumn("custrecord_bb1_pet_currentcannedfood"),
     new nlobjSearchColumn("custrecord_bb1_pet_wormtreatmentend"),
     new nlobjSearchColumn("custrecord_bb1_pet_fleatreatmentend"),
     new nlobjSearchColumn("lastmodified")
    ];
   },
   
   searchHelper: function (filters, columns, page)
   {
    'use strict';
    
    var self = this,
        result = page == "all" ? {records: Application.getAllSearchResults('customrecord_bb1_pet', filters, columns)} : Application.getPaginatedSearchResults({
         record_type: 'customrecord_bb1_pet',
         filters: filters,
         columns: columns,
         page: page
        });

    result.pets = _.map(result.records, function (pet)
    {
     var current_record_id = pet.getId(),
         dateOfBirth = nlapiStringToDate(pet.getValue('custrecord_bb1_pet_dob')),
         nextWormingReminder = nlapiStringToDate(pet.getValue('custrecord_bb1_pet_wormtreatmentend')),
         nextFleaReminder = nlapiStringToDate(pet.getValue('custrecord_bb1_pet_fleatreatmentend')),
         lastModified = nlapiStringToDate(pet.getValue('lastmodified')),
         pet = {
          internalid: current_record_id,
          name: pet.getValue('custrecord_bb1_pet_name'),
          type: pet.getValue('custrecord_bb1_pet_type'),
          type_text: pet.getText('custrecord_bb1_pet_type'),
          breed: pet.getValue('custrecord_bb1_pet_breed'),
          breed_text: pet.getText('custrecord_bb1_pet_breed'),
          dob: dateOfBirth ? nlapiDateToString(dateOfBirth, 'date') : '',
          gender: pet.getValue('custrecord_bb1_pet_gender'),
          gender_text: pet.getText('custrecord_bb1_pet_gender'),
          weight_kg: pet.getValue('custrecord_bb1_pet_weight_kg'),
          weight: pet.getValue('custrecord_bb1_pet_weight'),
          weight_text: pet.getText('custrecord_bb1_pet_weight'),
          mainpet: pet.getValue('custrecord_bb1_pet_mainpet') == 'T',
          currentdryfood: pet.getValue('custrecord_bb1_pet_currentdryfood'),
          currentcannedfood: pet.getValue('custrecord_bb1_pet_currentcannedfood'),
          nextwormingreminder: nextWormingReminder ? nlapiDateToString(nextWormingReminder, 'date') : '',
          nextfleareminder: nextFleaReminder ? nlapiDateToString(nextFleaReminder, 'date') : '',
          lastmodified: lastModified ? nlapiDateToString(lastModified, 'datetime') : ''
         };
     
     self.setPetAgeFromDob(pet);
     
     return pet;
    });

    delete result.records;
    
    return result;
   },
   
   getPetTypesAndBreeds: function ()
   {
    var data = {},
        petBreedLookup = {},
        petTypeFilters = [new nlobjSearchFilter("isinactive", null, "is", "F")],
        petTypeColumns = [new nlobjSearchColumn("name").setSort()],
        petTypeResults = Application.getAllSearchResults('customrecord_bb1_pet_typeanimals', petTypeFilters, petTypeColumns);

    var petBreedFilters = [new nlobjSearchFilter("isinactive", null, "is", "F")],
        petBreedColumns = [new nlobjSearchColumn("name").setSort(),
                           new nlobjSearchColumn("custrecord_bb1_pet_breedof")],
        petBreedResults = Application.getAllSearchResults('customrecord_bb1_pet_type_breed', petBreedFilters, petBreedColumns);
    
    _.each(petBreedResults, function (petBreed) {
     var petType = petBreed.getValue("custrecord_bb1_pet_breedof"),
         petBreedClean = {id: petBreed.getId(),
                          name: petBreed.getValue("name")};
     if (typeof petBreedLookup[petType] == 'undefined')
      petBreedLookup[petType] = [];
     petBreedLookup[petType].push(petBreedClean);
    });
    
    _.each(petTypeResults, function (petType) {
     var petTypeAndBreed = {id: petType.getId(),
                            name: petType.getValue("name")};
     if (typeof petBreedLookup[petTypeAndBreed.id] != 'undefined')
      petTypeAndBreed.breeds = petBreedLookup[petTypeAndBreed.id];
     data[petTypeAndBreed.id] = petTypeAndBreed;
    });
    
    return data;
   },

   setMainPet: function (petId)
   {
    var alreadySet = false,
        customerId = nlapiGetUser(),
        petFilters = [new nlobjSearchFilter("isinactive", null, "is", "F"),
                      new nlobjSearchFilter("custrecord_bb1_pet_mainpet", null, "is", "T"),
                      new nlobjSearchFilter("custrecord_bb1_pet_customer", null, "anyof", customerId)],
        petResults = Application.getAllSearchResults('customrecord_bb1_pet', petFilters) || [];

    _.each(petResults, function (pet) {
     var currentPetId = pet.getId();
     if (currentPetId == petId)
      alreadySet = true;
     else
      nlapiSubmitField("customrecord_bb1_pet", currentPetId, "custrecord_bb1_pet_mainpet", "F");
    });
    
    if (!alreadySet)
     nlapiSubmitField("customrecord_bb1_pet", petId, "custrecord_bb1_pet_mainpet", "T");
   },

   setPetAgeFromDob: function (data)
   {
    'use strict';

    if (data.dob) {
     var today = new Date(),
         dob = nlapiStringToDate(data.dob),
         dateDiff = today.getTime() - dob.getTime(),
         yearsOld = today.getFullYear() - dob.getFullYear(),
         monthsOld = today.getMonth() - dob.getMonth()
     
     if (monthsOld < 0) {
      yearsOld--;
      monthsOld += 12;
     }
     
     
     data.yearsold = yearsOld;
     data.monthsold = monthsOld;
    }
    
   },
   
   setDobFromPetAge: function (data)
   {
    'use strict';

    if (data.yearsold || data.monthsold) {
     var today = new Date(),
         totalMonthsOld = -(((parseFloat(data.yearsold, 10) || 0) * 12) + (parseFloat(data.monthsold, 10) || 0)),
         dob = nlapiAddMonths(today, totalMonthsOld);
     
     dob.setDate(1);
     
     data.dob = nlapiDateToString(dob, 'date');
    }
    
   },
   
   create: function (data)
   {
    'use strict';

    if (!ModelsInit.session.isLoggedIn())
     throw unauthorizedError;

    this.validate(data);

    var customerId = nlapiGetUser(),
        contactid = ModelsInit.context.getContact();
    
    this.setDobFromPetAge(data);
    
    var pet = nlapiCreateRecord("customrecord_bb1_pet");
    pet.setFieldValue("custrecord_bb1_pet_customer", customerId);
    data.name && pet.setFieldValue("custrecord_bb1_pet_name", data.name);
    data.type && pet.setFieldValue("custrecord_bb1_pet_type", data.type);
    data.breed && pet.setFieldValue("custrecord_bb1_pet_breed", data.breed);
    data.dob && pet.setFieldValue("custrecord_bb1_pet_dob", data.dob);
    data.gender && pet.setFieldValue("custrecord_bb1_pet_gender", data.gender);
    data.weight && pet.setFieldValue("custrecord_bb1_pet_weight", data.weight);
    //data.mainpet && pet.setFieldValue("custrecord_bb1_pet_mainpet", data.mainpet == "T" ? "T" : "F");
    //data.currentdryfood && pet.setFieldValue("custrecord_bb1_pet_currentdryfood", data.currentdryfood);
    //data.currentcannedfood && pet.setFieldValue("custrecord_bb1_pet_currentcannedfood", data.currentcannedfood);
    data.internalid = nlapiSubmitRecord(pet, true, true);
    
    //if (data.mainpet == "T")
     //this.setMainPet(data.internalid);
    
    return data;
   },

   update: function (data)
   {
    'use strict';

    if (!ModelsInit.session.isLoggedIn())
     throw unauthorizedError;

    if (!data.internalid)
     throw notFoundError;
    
    this.validate(data);

    var customerId = nlapiGetUser(),
        contactid = ModelsInit.context.getContact();
    
    this.setDobFromPetAge(data);
    
    var pet = nlapiLoadRecord("customrecord_bb1_pet", data.internalid);
    //pet.setFieldValue("custrecord_bb1_pet_customer", customerId);
    data.name && pet.setFieldValue("custrecord_bb1_pet_name", data.name);
    data.type && pet.setFieldValue("custrecord_bb1_pet_type", data.type);
    data.breed && pet.setFieldValue("custrecord_bb1_pet_breed", data.breed);
    data.dob && pet.setFieldValue("custrecord_bb1_pet_dob", data.dob);
    data.gender && pet.setFieldValue("custrecord_bb1_pet_gender", data.gender);
    data.weight && pet.setFieldValue("custrecord_bb1_pet_weight", data.weight);
    //data.mainpet && pet.setFieldValue("custrecord_bb1_pet_mainpet", data.mainpet == "T" ? "T" : "F");
    //data.currentdryfood && pet.setFieldValue("custrecord_bb1_pet_currentdryfood", data.currentdryfood);
    //data.currentcannedfood && pet.setFieldValue("custrecord_bb1_pet_currentcannedfood", data.currentcannedfood);
    data.deceased && pet.setFieldValue("custrecord_bb1_pet_deceased", data.deceased ? "T" : "F");
    data.internalid = nlapiSubmitRecord(pet, true, true);
    
    //if (data.mainpet == "T")
     //this.setMainPet(data.internalid);
    
    /*if (data.deceased) {
     var customerFields = nlapiLookupField('customer', customerId, ['custentity20', 'custentity21']);
     var nameRegex = new RegExp(data.name + ',?\s*', 'gi');
     
     var petNames = customerFields.custentity20.replace(nameRegex, '').trim();
     var petNames2 = customerFields.custentity21.replace(nameRegex, '').trim();
     
     nlapiSubmitField('customer', customerId, ['custentity20', 'custentity21'], [petNames, petNames2]);
    }*/
    
    return data;
   },

   delete: function (id)
   {
    'use strict';

    if (!ModelsInit.session.isLoggedIn())
     throw unauthorizedError;

    if (!id)
     throw notFoundError;
    
    var customerId = nlapiGetUser(),
        pet = nlapiLoadRecord("customrecord_bb1_pet", id);
    
    if (pet.getFieldValue("custrecord_bb1_pet_customer") != customerId)
     throw notFoundError;
    
    nlapiDeleteRecord("customrecord_bb1_pet", id);
    
    return true;
   }

  });

 }
);

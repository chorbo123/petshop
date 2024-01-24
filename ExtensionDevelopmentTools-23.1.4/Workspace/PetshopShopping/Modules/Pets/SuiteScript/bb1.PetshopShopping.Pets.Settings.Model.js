// @module bb1.PetshopShopping.Pets
define(
	'bb1.PetshopShopping.Pets.Settings.Model',
	[
		'SC.Model',
		'Application',
		'Models.Init',
		'SiteSettings.Model',
		'Utils',
		'underscore'
	],
	function (
		SCModel,
		Application,
		ModelsInit,
		SiteSettings,
		Utils,
		_
	)
 {
  'use strict';

  // @extends SCModel
  return SCModel.extend({

   name: 'bb1.PetshopShopping.Pets.Settings',

   get: function ()
   {
    'use strict';

    var result = {};
    
    result.petGenders = [
     {id: 1, name: 'Male'},
     {id: 2, name: 'Female'}
    ];
    
    result.petWeights = [
     {id: 1, name: '0-4 kg (Rabbit, Small Cat, Small Dog)'},
     {id: 2, name: '4-10 kg (Medium Cat, Large Cat, Medium Dog eg. Jack Russel)'},
     {id: 3, name: '10-25 kg (Large Dog eg. Spaniel, Labrador)'},
     {id: 4, name: '25-45 kg (XLarge Dog eg. German Shepard)'},
     //{id: 5, name: '40-45 kg'},
     {id: 6, name: '45+ kg (XXL eg. Great Dane)'}
    ];
    
    result.petTypesAndBreeds = this.getPetTypesAndBreeds();
    
    return result;
   },
   
   getPetTypesAndBreeds: function ()
   {
    var data = [],
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
     //data[petTypeAndBreed.id] = petTypeAndBreed; // return as lookup
     data.push(petTypeAndBreed); // return as ordered array
    });
    
    data = _.sortBy(data, function (petType) {
     var typePriority = ['Dog', 'Cat', 'Rabbit'];
     var priorityIndex = typePriority.indexOf(petType.name);
     
     return priorityIndex == -1 ? Infinity : priorityIndex;
    });
    
    return data;
   }

  });

 }
);

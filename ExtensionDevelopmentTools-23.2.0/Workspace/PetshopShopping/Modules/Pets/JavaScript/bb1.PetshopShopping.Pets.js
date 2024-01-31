// @module bb1.PetshopShopping.Pets
define(
 'bb1.PetshopShopping.Pets',
 [
  'bb1.PetshopShopping.Pets.Model',
  'bb1.PetshopShopping.Pets.Router',
  'bb1.PetshopShopping.Pets.Collection'
 ],
 function (
  PetsModel,
  PetsRouter,
  PetsCollection
 )
 {
  'use strict';
  
  return {
   
   Model: PetsModel,
   
   Router: PetsRouter,
   
   Collection: PetsCollection,
   
   MenuItems: {
    id: 'pets',
    name: _('Your Pets').translate(),
    index: 3,
    children: [
     {
      parent: 'pets',
      id: 'pet_list',
      name: _('My Pets').translate(),
      url: 'pets',
      index: 1
     },
     {
      parent: 'pets',
      id: 'new_pet',
      name: _('Add a New Pet').translate(),
      url: 'pets/new',
      index: 2
     }
    ]
   },
   
   mountToApp: function (application)
   {
    var myAccountMenu = application.getComponent('MyAccountMenu');
    
    if (myAccountMenu) {
     myAccountMenu.addGroup({
      id: 'pets',
      name: _('Your Pets').translate(),
      index: 3
     });
     myAccountMenu.addGroupEntry({
      groupid: 'pets',
      id: 'pet_list',
      name: _('My Pets').translate(),
      url: 'pets',
      index: 1
     });
     myAccountMenu.addGroupEntry({
      groupid: 'pets',
      id: 'new_pet',
      name: _('Add a New Pet').translate(),
      url: 'pets/new',
      index: 2
     });
    }
    
    // Initializes the router');
    return new PetsRouter(application);
   }
   
  };
 }
);

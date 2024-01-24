// @module bb1.PetshopShopping.Pets
define(
    'bb1.PetshopShopping.Pets',
    [
        'bb1.PetshopShopping.Pets.Model',
        'bb1.PetshopShopping.Pets.Router',
        'bb1.PetshopShopping.Pets.Collection',

        'Utils'
    ],
    function (
        PetsModel,
        PetsRouter,
        PetsCollection,

        Utils
    ) {
        'use strict';

        return {

            Model: PetsModel,

            Router: PetsRouter,

            Collection: PetsCollection,

            MenuItems: {
                id: 'pets',
                name: 'Your Pets',
                index: 3,
                children: [
                    {
                        parent: 'pets',
                        id: 'pet_list',
                        name: Utils.translate('My Pets'),
                        url: 'pets',
                        index: 1
                    },
                    {
                        parent: 'pets',
                        id: 'new_pet',
                        name: Utils.translate('Add a New Pet'),
                        url: 'pets/new',
                        index: 2
                    }
                ]
            },

            mountToApp: function (application) {
                var myAccountMenu = application.getComponent('MyAccountMenu');

                if (myAccountMenu) {
                    myAccountMenu.addGroup({
                        id: 'pets',
                        name: Utils.translate('Your Pets'),
                        index: 3
                    });
                    myAccountMenu.addGroupEntry({
                        groupid: 'pets',
                        id: 'pet_list',
                        name: Utils.translate('My Pets'),
                        url: 'pets',
                        index: 1
                    });
                    myAccountMenu.addGroupEntry({
                        groupid: 'pets',
                        id: 'new_pet',
                        name: Utils.translate('Add a New Pet'),
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

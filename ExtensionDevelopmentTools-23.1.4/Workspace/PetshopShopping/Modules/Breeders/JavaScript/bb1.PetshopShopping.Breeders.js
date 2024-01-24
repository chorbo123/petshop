// @module bb1.PetshopShopping.Breeders
define(
	'bb1.PetshopShopping.Breeders',
	[
		'bb1.PetshopShopping.Breeders.ApplicationForm.View',
		'bb1.PetshopShopping.Breeders.LitterForm.View',
		'bb1.PetshopShopping.Breeders.LitterList.View',
		'bb1.PetshopShopping.Breeders.Collection',
		'bb1.PetshopShopping.Breeders.Model',
		'MenuTree.View',

		'underscore',
		'Utils'
	],
	function (
		BreedersApplicationFormView,
		BreedersLitterFormView,
		BreedersLitterListView,
		BreedersCollection,
		BreedersModel,
		MenuTreeView,

		_,
		Utils
	) {
		'use strict';

		var breedersInstancePromise;
		var breedersInstance;

		return {

			Model: BreedersModel,

			Collection: BreedersCollection,

			mountToApp: function (application) {
				var pageType = application.getComponent('PageType');

				// Application.ProductListModule - reference to this module
				//application.ProductListModule = ProductListModule;
				//application.ProductListModule.Utils = new ProductListUtils(application);

				//ProfileModel.getPromise().done(application.ProductListModule.Utils.profileModelPromiseDone);
				this.getBreedersPromise(application).done(jQuery.proxy(this.getBreedersPromiseDone, this));

				pageType.registerPageType({
					'name': 'BreedersApplicationForm',
					'routes': ['breeders/:id', 'breeders/:id?*options'],
					'view': BreedersApplicationFormView
				});

				pageType.registerPageType({
					'name': 'BreedersLitterList',
					'routes': ['breeder-programmes/:id', 'breeder-programmes/:id/?*options'],
					'view': BreedersLitterListView
				});

				pageType.registerPageType({
					'name': 'BreedersLitterForm',
					'routes': ['breeder-programmes/:id/new', 'breeder-programmes/:id/new?*options'],
					'view': BreedersLitterFormView
				});

				this.MenuItems(application);
			},

			MenuItems: function (application) {
				/*if (!application.ProductListModule.Utils.isProductListEnabled())
				{
					return undefined;
				}*/
				/*return {
								id: 'wtf_list_dummy'
							,	name: 'WTF'
							,	url: ''
							,	index: 2
							};*/

				var myAccountMenu = application.getComponent('MyAccountMenu');

				if (myAccountMenu) {
					myAccountMenu.addGroupEntry({
						id: 'breeders_dummy',
						name: _('Loading Breeder Programmes...').translate(),
						url: '',
						index: 3
					});
					return;
					myAccountMenu.addGroup({
						id: 'breeders',
						name: _('Breeder Programmes').translate(),
						index: 3
					});
					myAccountMenu.addGroupEntry({
						groupid: 'breeders',
						id: 'rwwe',
						name: _('My Breeders').translate(),
						url: 'pets',
						index: 1
					});
					myAccountMenu.addGroupEntry({
						groupid: 'breeders',
						id: 'new_22',
						name: _('Add a New Breeder').translate(),
						url: 'pets/new',
						index: 2
					});
				}
			},

			getBreedersPromise: function (application) {
				if (!breedersInstancePromise) {
					breedersInstancePromise = jQuery.Deferred();
					breedersInstance = new BreedersModel();
					breedersInstance.application = application;

					breedersInstance.fetch({ cache: false }).done(function (jsonModel) {
						//breedersInstance.reset(jsonModel);
						breedersInstancePromise.resolve(breedersInstance);
					});
				}

				return breedersInstancePromise;
			},

			getBreedersPromiseDone: function () {
				var self = this,
					menuTree = MenuTreeView.getInstance();

				console.log('menu', menuTree)

				//IMPORANT UPDATE

				// menuTree.replaceMenuItem(function (menuItem) { return menuItem && menuItem.id === 'breeders_dummy'; }, function (application) {
				// 	var breedersModel = self.getBreeders(application),
				// 		applications = breedersModel.get('applications') || [];

				// 	if (!applications.length)
				// 		return;

				// 	return {

				// 		id: function () {
				// 			return 'breeders';
				// 		},
				// 		name: function () {
				// 			return _('Breeder Programmes').translate();
				// 		},
				// 		url: function () {
				// 			return '';
				// 		},
				// 		index: 3,
				// 		children: function () {
				// 			var items = [];

				// 			breedersModel.get('applications').each(function (programme, index) {
				// 				items.push({
				// 					id: 'breeder_' + programme.get('internalId'),
				// 					url: 'breeder-programmes/' + programme.get('urlComponent'),
				// 					name: programme.get('name'),
				// 					index: index + 1
				// 				});
				// 			});

				// 			return items;
				// 		}
				// 	};
				// });

				menuTree.updateMenuItemsUI();
			},

			getBreeders: function (application) {
				if (!breedersInstance) {
					breedersInstance = new BreedersModel();
					breedersInstance.application = application;
				}

				return breedersInstance;
			},

			getBreederProgramme: function (id) {
				var breedersModel = new BreedersModel();

				breedersModel.set('internalid', id);

				return breedersModel.fetch();
			}

		};
	}
);

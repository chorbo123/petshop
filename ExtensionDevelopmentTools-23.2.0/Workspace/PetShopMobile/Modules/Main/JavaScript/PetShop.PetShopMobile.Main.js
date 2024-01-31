
define(
	'PetShop.PetShopMobile.Main'
	, [
		'PetShop.PetShopBestSellers.BestSellers',
		'PetShop.PetShopMobile.Images'
	]
	, function (
		PetShopBestSellersBestSellers,
		PetShopMobileImages
	) {
		'use strict';

		var Modules = arguments;

		return {
			mountToApp: function (container) {
				for (var i in Modules) {
					var module = Modules[i];

					if (module && module.mountToApp)
						module.mountToApp(container);
				}
			}
		};
	});

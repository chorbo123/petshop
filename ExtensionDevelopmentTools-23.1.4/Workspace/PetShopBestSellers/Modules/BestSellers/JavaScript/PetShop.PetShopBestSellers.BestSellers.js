
define(
	'PetShop.PetShopBestSellers.BestSellers'
	, [
		'PetShop.PetShopBestSellers.BestSellers.View'
	]
	, function (
		BestSellersView
	) {
		'use strict';

		return {
			mountToApp: function mountToApp(container) {
				var layout = container.getComponent('Layout');

				if (layout) {
					layout.registerView('PetShop.BestSellers', function () {
						return new BestSellersView({ container: container });
					});
				}
			}
		};
	});

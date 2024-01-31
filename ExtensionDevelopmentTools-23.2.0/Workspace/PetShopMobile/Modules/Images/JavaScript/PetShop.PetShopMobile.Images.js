
define(
	'PetShop.PetShopMobile.Images'
	, [
	]
	, function (

	) {
		'use strict';

		return {
			mountToApp: function mountToApp(container) {
				var layoutComponent = container.getComponent('Layout');
				var environmentComponent = container.getComponent('Environment');

				var banners = {},
					mainBanners = environmentComponent.getConfig('mainBanners'),
					seasonalBanners = environmentComponent.getConfig('seasonalBanners');

				mainBanners = {
					bottomlessBowlBanner: mainBanners[0],
					clearanceBanner: mainBanners[1],
					huntlandBanner: mainBanners[2]
				}

				banners = {
					mainBanners: mainBanners,
					seasonalBanners: seasonalBanners
				}

				layoutComponent.addToViewContextDefinition('Home.View', 'banners', 'object', function (context) {
					return banners;
				});

			}
		};
	});

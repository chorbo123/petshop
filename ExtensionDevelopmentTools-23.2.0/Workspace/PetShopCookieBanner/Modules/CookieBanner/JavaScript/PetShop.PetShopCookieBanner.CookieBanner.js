
define(
	'PetShop.PetShopCookieBanner.CookieBanner'
	, [
		'CookieWarningBanner.View'
	]
	, function (
		CookieWarningBannerView
	) {
		'use strict';

		return {
			mountToApp: function mountToApp(container) {
				// /** @type {LayoutComponent} */
				var layoutComponent = container.getComponent('Layout');

				if (layoutComponent) {
					layoutComponent.removeChildView('Message.Placeholder');

					layoutComponent.addChildView('Footer', function () {
						return new CookieWarningBannerView({ container: container });
					});
				}

			}
		};
	});


define(
	'PetShop.GtmCustomVariables.Main'
	, [
	]
	, function (
	) {
		'use strict';

		return {
			mountToApp: function mountToApp(container) {
				var cartComponent = container.getComponent('Cart');
				var userProfileComponent = container.getComponent('UserProfile');

				if (cartComponent) {
					cartComponent.on('afterSubmit', function (res) {
						userProfileComponent.getUserProfile().then(function (profile) {
							if (window.dataLayer) {
								window.dataLayer.push({
									'email': profile.email,
									'phone': profile.phoneinfo.phone
								})
							}
						});
					});
				}

			}
		};
	});

// @module PetShop.EmailDetection.EmailDetection
define('PetShop.EmailDetection.EmailDetection.View'
	, [
		'petshop_emaildetection_emaildetection.tpl'

		, 'PetShop.EmailDetection.EmailDetection.Model'
		, 'LoginRegister.Register.View'

		, 'Backbone'
	]
	, function (
		petshop_emaildetection_emaildetection_tpl

		, EmailDetectionModel
		, LoginRegisterRegisterView

		, Backbone
	) {
		'use strict';

		_.extend(LoginRegisterRegisterView.prototype, {

			events: _.extend(LoginRegisterRegisterView.prototype.events, {
				'blur #register-email': 'checkIfExisting'
			}),

			initialize: _.wrap(LoginRegisterRegisterView.prototype.initialize, function (originalInitialize) {
				var temp = originalInitialize.apply(this, _.rest(arguments));
				var loginRegisterComponent = this.options.application.getComponent('LoginRegisterPage');
				var self = this;

				loginRegisterComponent.on('beforeRegister', function (formFields) {
					if (self.hasDuplicate) {
						self.showError(_.translate('This email address is already associated with an existing account. If you’ve forgotten your password click <a href="/forgot-password">here</a> to reset your password. If you’re still having issues logging in please get in contact with our customer service team by emailing bark@petshop.co.uk or calling 01789 205095.'))

						return jQuery.Deferred().reject();
					}
				});

				return temp;
			}),

			checkIfExisting: function (e) {
				var self = this,
					model = new EmailDetectionModel(),
					email = $(e.currentTarget).val();

				if (email) {
					model.fetch({ data: { email: email } })
						.done(function (result) {
							self.hasDuplicate = result != 0;
						});
				}
			}
		})
	});

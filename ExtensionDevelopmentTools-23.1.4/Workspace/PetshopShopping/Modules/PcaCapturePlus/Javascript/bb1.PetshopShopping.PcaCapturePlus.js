//@module bb1.PetshopShopping.PcaCapturePlus
define(
	'bb1.PetshopShopping.PcaCapturePlus'
,	[
  'OrderWizard.Module.Address',
		'Address.Edit.View',
		'Address.Edit.Fields.View',
		'Address.Model',
		'GlobalViews.States.View',
  'SC.Configuration',
  
  'underscore'
	]
,	function(
  OrderWizardModuleAddress,
		AddressEditView,
		AddressEditFieldsView,
		AddressModel,
		GlobalViewsStatesView,
  Configuration,
  
  _
	)
{
	'use strict';

	var pcaCapturePlusConfig = Configuration.get('pcaCapturePlus');
	
	if (pcaCapturePlusConfig && pcaCapturePlusConfig.enabled) {
			
		AddressModel.prototype.validation.state = {required: false};
		AddressModel.prototype.validation.phone = {required: false};
  
		GlobalViewsStatesView.prototype.getContext = _.wrap(GlobalViewsStatesView.prototype.getContext, function (originalGetContext) {
			
			var results = originalGetContext.apply(this, _.rest(arguments));
			
			results.isCountryAndStatePresent = false;
			
			return results;
			
		});

		OrderWizardModuleAddress.prototype.render = _.wrap(OrderWizardModuleAddress.prototype.render, function (render, not_trigger_ready) {
			
			if (this.addressView)
				this.addressView.trigger('beforeViewRender', this);
			
			render.call(this, not_trigger_ready);
			
			if (this.addressView)
				this.addressView.trigger('afterViewRender', this);
			
		});

		_.extend(AddressEditView.prototype, {
			
			initialize: _.wrap(AddressEditView.prototype.initialize, function (initialize, options)
			{
				var self = this;
				
    this.triggerFirstTime = true;
    
				initialize.apply(this, _.rest(arguments));
				
				this.appendStyleSheets().loadLibraries();
				
				this.on('beforeViewRender', function() {
					if (self.capturePlusControl)
						self.capturePlusControl.destroy();
				});
				
				this.on('afterViewRender', function() {
					self.loadLibraries().then(function() {
						var fields = [
										{ element: self.$('input[name="address-lookup"]').attr("id"), field: "Line1", mode: pca.fieldMode.SEARCH }, // Separate Mode
										{ element: self.$('input[name="addr1"]').attr("id"), field: "Line1", mode: pca.fieldMode.SEARCH }, // Bound Mode
										{ element: self.$('input[name="zip"]').attr("id"), field: "PostalCode", mode: pca.fieldMode.SEARCH }, // Bound Mode
										{ element: self.$('input[name="addr1"]').attr("id"), field: "Line1", mode: pca.fieldMode.POPULATE },
										{ element: self.$('input[name="addr2"]').attr("id"), field: "Line2", mode: pca.fieldMode.POPULATE },
										{ element: self.$('input[name="city"]').attr("id"), field: "City", mode: pca.fieldMode.POPULATE },
										{ element: self.$('select[name="country"]').attr("id"), field: "CountryIso2", mode: pca.fieldMode.POPULATE },
										{ element: self.$('[name="state"]').attr("id"), field: "Province", mode: pca.fieldMode.POPULATE },
										{ element: self.$('input[name="zip"]').attr("id"), field: "PostalCode", mode: pca.fieldMode.POPULATE }
						],
						options = {
							key: Configuration.get('pcaCapturePlus.apiKey'),
							setCursor: true,
							prompt: true,
							promptDelay: 0,
							setCountryByIP: true
						};
						try { 
							options.setCountryByIP = pca.capturePlus.bindings[0].options.CapturePlusCountryByIP === "1";
						}
						catch(e) {}
						self.capturePlusControl = new pca.Address(fields, options);
						self.capturePlusTooltip = new pca.Tooltip(self.$('input[name="addr1"]')[0], 'Start typing a postcode, street or address');

						self.capturePlusControl.listen("populate", function (address) {
							self.$('input[name="address-lookup"]').val("");
       if (self.triggerFirstTime && (!self.inModal || !self.$containerModal)) {
        console.log('not in modal and first time');
        self.$('[name="country"]').trigger('change');
        self.triggerFirstTime = false;
       }
							jQuery('#finder-error').slideUp('fast').css("display", "none");
							if (typeof dataLayer != 'undefined')
								dataLayer.push({'event': 'GAEvent', 'eventCategory': 'Checkout', 'eventAction': 'Complete', 'eventLabel': 'Address Lookup'});
						});
						
						self.capturePlusControl.listen("error", function(error) {
							var message = "";
							if (~error.indexOf("Postcode Required")) {
								message = "Please enter a valid postcode";
							}
							else if (~error.indexOf("Postcode Invalid")) {
								message = "Please ensure you enter a valid postcode";
							}
							else if (~error.indexOf("empty")) {
								message = "Sorry, we couldn't find any results, please try again";
							}
							else {
								message = 'Sorry, you have used today\'s free look-ups.';
								jQuery(".search").attr('disabled', 'true');
								jQuery(".recentFavourites").css('visibility', 'hidden');
							}
							self.capturePlusControl.hide();
							self.capturePlusTooltip.hide();
							self.$('#finder-error').html('<div class="col-xs-12"><div class="error"><span>'+message+'</span></div></div>').slideDown('fast').css('display', 'block');
							jQuery('html, body').animate({
											scrollTop: self.$("#finder-error").offset().top
							}, 400);
							self.$('input[name="address-lookup"]').attr("disabled", true).blur();
						});
						
						self.$('input[name="address-lookup"]').keydown(function (e) {
							if (e.keyCode == 13) {
								return false;
							}
						});
					});
				});
			}),

			appendStyleSheets: function ()
			{
				var $head = jQuery('head'),
								apiKey = Configuration.get('pcaCapturePlus.apiKey');

				if (!$head.find('link[href$="//services.postcodeanywhere.co.uk/css/captureplus-2.30.min.css?key=' + apiKey + '"]').length)
				{
					$head.prepend('<link rel="stylesheet" href="//services.postcodeanywhere.co.uk/css/captureplus-2.30.min.css?key=' + apiKey + '" />');
				}

				return this;
			},

			loadPostcodeAnywhereLibrary: function ()
			{
				return jQuery.getScript('//services.postcodeanywhere.co.uk/js/captureplus-2.30.min.js?key=' + Configuration.get('pcaCapturePlus.apiKey'));
			},
			
			loadLibraries: function ()
			{
				return this.librariesLoaded || (
					this.librariesLoaded = jQuery.when(
						this.loadPostcodeAnywhereLibrary()
					)
				);
			},
			
		});
			
		_.extend(AddressEditFieldsView.prototype, {
			
			eraseZip: function () {},
			
			updateStates: function () {}

		});
		
	}
	
 return  {
  mountToApp: function (application)
  {
   
  }
 };
 
}
);

// @module bb1.PetshopShopping.SmsSubscription
define(
	'bb1.PetshopShopping.SmsSubscription.MobilePhone.View',
	[
  'SC.Configuration',
  
  'bb1_petshopshopping_smssubscription_mobilephone.tpl',

		'Backbone.FormView',
		'Backbone',
  'Utils',
		'underscore',
  'jQuery'
	],
	function(
  Configuration,
  
  bb1_petshopshopping_smssubscription_mobilephone_tpl,
  
  BackboneFormView,
		Backbone,
  Utils,
		_,
  jQuery
	)
{
	'use strict';

 // @method validateMobilePhone @param {String} phone @return {String} an error message if the passed phone is invalid or falsy if it is valid
	function validateMobilePhone(phone) {

		var phoneNumberLength = 10;

		if (phone)
		{
   phone = String(phone);
			var value = phone.replace(/\D/g, '');
			
			if (value.length !== phoneNumberLength || value.substring(0, 1) !== '7')
			{
				return _('Mobile Number must be 10 digits starting with 7.').translate();
			}
		}

	}
 
 var newUtils = {
  validateMobilePhone: validateMobilePhone
 };
 
 _.extend(SC.Utils, newUtils);
 _.extend(Utils, newUtils);
 _.mixin(newUtils);
 
 return Backbone.View.extend({
 
  template: bb1_petshopshopping_smssubscription_mobilephone_tpl,
  
  events: {
   'click [data-action="update-calling-code"]': 'updateCallingCode',
   'change #register-mobilephone': 'updateMobilePhone'
  },
  
		bindings: {
			'[name="mobilephone"]': 'mobilephone',
			'[name="mobilephonecallingcode"]': 'mobilephonecallingcode'
		},

		//@method initialize
  initialize: function(options)
		{
			Backbone.View.prototype.initialize.apply(this, arguments);
			this.application = this.options.application;
   
   var callingCodes = Configuration.get('countryCallingCodes.callingCodes', []);
   var mobilePhoneCallingCode = this.options.mobilePhoneCallingCode;
   var defaultCallingCode = mobilePhoneCallingCode && _.findWhere(callingCodes, {callingCode: mobilePhoneCallingCode}) || _.findWhere(callingCodes, {default: true});
   
   if (!defaultCallingCode)
    defaultCallingCode = callingCodes.length && callingCodes[0] || {};
   
   //console.log(mobilePhoneCallingCode);
   //console.log(defaultCallingCode);
   
   var defaultModelValues = {
    mobilephonecallingcode: defaultCallingCode.callingCode || '',
    mobilephone: this.options.mobilePhone || ''
   };
   
   this.model = new (Backbone.Model.extend({validation: {mobilephonecallingcode: {required: true, msg: _('Mobile Phone Calling Code is required').translate()}, mobilephone: { fn: _.validateMobilePhone }}}))(defaultModelValues);
   BackboneFormView.add(this);
			//Backbone.Validation.bind(this);
		},
  
  updateCallingCode: function(e) {
   
   e.preventDefault();
   
   var $target = jQuery(e.target),
       callingCode = $target.data('calling-code'),
       $thumbnailImageUrl = $target.children('img'),
       thumbnailImageUrl = $thumbnailImageUrl.attr('src'),
       thumbnailImageAltTag = $thumbnailImageUrl.attr('alt'),
       $container = $target.closest('ul').parent(),
       $button = $container.find('[data-toggle="dropdown"]');
       
   $button.find('img').attr({src: thumbnailImageUrl, alt: thumbnailImageAltTag});
   $button.find('span[data-calling-code]').attr({'data-calling-code': callingCode}).text(callingCode);
   $button.find('input[name="mobilephonecallingcode"]').val(callingCode);
   
  },
  
  updateMobilePhone: function(e) {
   
   var $input = jQuery(e.target);
   var cleanedValue = $input.val().replace(/\D/g, '');
   
   $input.val(cleanedValue);
  
  },
  
  getContext: function(context) {
  
		var callingCodes = Configuration.get('countryCallingCodes.callingCodes', []);
  var mobilePhoneCallingCode = this.model.get('mobilephonecallingcode');
  var defaultCallingCode = mobilePhoneCallingCode && _.findWhere(callingCodes, {callingCode: mobilePhoneCallingCode}) || _.findWhere(callingCodes, {default: true});
  
  if (!defaultCallingCode)
   defaultCallingCode = callingCodes.length && callingCodes[0] || {};
  
  return {
   // @property {Array} callingCodes
			callingCodes: callingCodes,
   // @property {Object} defaultCallingCode
			defaultCallingCode: defaultCallingCode,
   // @property {Boolean} isRequired
			isRequired: !!this.options.isRequired
  };
 }
  
 
 });
 
});

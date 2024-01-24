//@module bb1.PetshopShopping.SmsSubscription
define(
	'bb1.PetshopShopping.SmsSubscription.OrderWizard.Module.MobilePhone',
	[
  'Wizard.Module',
		'Profile.Model',
  'bb1.PetshopShopping.SmsSubscription.MobilePhone.View',
		'GlobalViews.Message.View',

		'bb1_petshopshopping_smssubscription_orderwizard_mobilephone_module.tpl',

  'Backbone.CompositeView',
  'Backbone.FormView',
  'Backbone',
		'underscore',
		'jQuery'
	],
	function (
		WizardModule,
		ProfileModel,
  SmsSubscriptionMobilePhoneView,
		GlobalViewsMessageView,

		bb1_petshopshopping_smssubscription_orderwizard_mobilephone_module_tpl,

  BackboneCompositeView,
  BackboneFormView,
  Backbone,
		_,
		jQuery
	)
 {
  'use strict';
  
  //@class OrderWizard.Module.MobilePhone @extends Wizard.Module
  return WizardModule.extend({

   //@property {Function} template
   template: bb1_petshopshopping_smssubscription_orderwizard_mobilephone_module_tpl,
   
   /*bindings: {
    '[name="mobilephone"]': 'mobilephone',
    '[name="mobilephonecallingcode"]': 'mobilephonecallingcode',
    '[name="smssubscribe"]': 'smssubscribe'
   },*/

   //@method initialize
   initialize: function(options)
   {
    WizardModule.prototype.initialize.apply(this, arguments);
    this.application = this.wizard.application;
    //this.model = new (Backbone.Model.extend({validation: {mobilephone: { fn: _.validateMobilePhone }}}))();
    BackboneCompositeView.add(this);
    //BackboneFormView.add(this);
    //Backbone.Validation.bind(this);
   },
   
   isActive: function ()
   {
    return true;
   },
   
   isValid: function()
   {
    var promise = jQuery.Deferred(),
        mobilePhoneCallingCode = this.model.get('mobilephonecallingcode'),
        mobilePhone = this.model.get('mobilephone'),
        validationMessage = _.validateMobilePhone(mobilePhone);
    
    //if (!this.mobilePhoneView.clonedModel.isValid())
    if (mobilePhone && !mobilePhoneCallingCode)
    {
     return promise.reject({
      errorCode: 'ERR_CHK_INVALID_MOBILE_CALLING_CODE',
      errorMessage: _('Mobile Number Calling Code is required').translate()
     });
    }
    /*else if (!mobilePhone)
    {
     return promise.reject({
      errorCode: 'ERR_CHK_MOBILE_NUMBER_REQUIRED',
      errorMessage: _('Mobile Number is required').translate()
     });
    }*/
    else if (validationMessage)
    {
     return promise.reject({
      errorCode: 'ERR_CHK_INVALID_MOBILE_NUMBER',
      errorMessage: _(validationMessage).translate() //_('Mobile Number is incorrect').translate()
     });
    }
    else
    {
     return promise.resolve();
    }
   },
   
   submit: function ()
   {
   /*	var mobilePhone = this.$('input[name=mobilephone]').val();
    var mobilePhoneCallingCode = this.$('input[name=mobilephonecallingcode]').val();
    var smsSubscribe = this.$('input[name=smssubscribe]').is(':checked');
    
    this.model.set('mobilephonecallingcode', mobilePhoneCallingCode);
    this.model.set('mobilephone', mobilePhone);
    this.model.set('smssubscribe', smsSubscribe);*/
    
    var self = this;
    var submitPromise = jQuery.Deferred();
    //var mobilePhone = self.mobilePhoneView.clonedModel.get('mobilephone');
    //var mobilePhoneCallingCode = self.mobilePhoneView.clonedModel.get('mobilephonecallingcode');
    var mobilePhone = this.$('input[name=mobilephone]').val();
    var mobilePhoneCallingCode = this.$('input[name=mobilephonecallingcode]').val();
    var smsSubscribe = this.$('input[name=smssubscribe]').is(':checked');
    
    self.model.set('mobilephone', mobilePhone);
    self.model.set('mobilephonecallingcode', mobilePhoneCallingCode);
    self.model.set('smssubscribe', smsSubscribe);
    
    //if (this.mobilePhoneView)
    //{
     /*var dummyEvent = jQuery.Event('submit', {
      target: this.mobilePhoneView.$('input[name="mobilephone"]').get(0)
     });
     
     var saveFormResult = this.mobilePhoneView.saveForm(dummyEvent);
     
     if (saveFormResult && !saveFormResult.frontEndValidationError)
     {
      saveFormResult.done(function (model)
      {
       var mobilePhone = self.mobilePhoneView.model.get('mobilephone');
       var mobilePhoneCallingCode = self.mobilePhoneView.model.get('mobilephonecallingcode');
       
       self.model.set('mobilephonecallingcode', mobilePhoneCallingCode);
       self.model.set('mobilephone', mobilePhone);
       
       submitPromise.resolve();
      });
     }
     else
     {
      submitPromise.reject({
       errorCode: 'ERR_CHK_INVALID_MOBILE_PHONE',
       errorMessage: _('Mobile Phone is invalid').translate()
      });
     }*/
    //}

    return this.isValid();
   },
   
   //@method showError render the error message
   showError: function ()
   {

    var global_view_message = new GlobalViewsMessageView({
      message: this.error.errorMessage
     ,	type: 'error'
     ,	closable: true
    });

    // Note: in special situations (like in payment-selector), there are modules inside modules, so we have several place holders, so we only want to show the error in the first place holder.
    this.$('[data-type="alert-placeholder-module"]:first').html(
     global_view_message.render().$el.html()
    );

    this.error = null;

   },
   
   childViews: {
    
    'OrderWizard.MobilePhone': function() {
     
     var mobilePhone = this.model.get('mobilephone');
     var mobilePhoneCallingCode = this.model.get('mobilephonecallingcode');
     
     this.mobilePhoneView = new SmsSubscriptionMobilePhoneView({
      application: this.application,
      mobilePhone: mobilePhone,
      mobilePhoneCallingCode: mobilePhoneCallingCode
      //isRequired: true
     });
     
     return this.mobilePhoneView;
     
    }
    
   },
   
   //@method getContext @returns OrderWizard.Module.MobilePhone.Context
   getContext: function ()
   {
    //@class OrderWizard.Module.MobilePhone.Context
    return {
     // @property {String} siteName
     siteName: SC.ENVIRONMENT.siteSettings.displayname,
     // @property {Boolean} isSmsSubscribeChecked
     isSmsSubscribeChecked: this.model.get('smssubscribe') // || this.options.isSmsSubscribeChecked || false
    };
   }
   
  });
  
 }
);

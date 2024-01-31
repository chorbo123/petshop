// @module bb1.PetshopShopping.GoogleCustomerReviews
define(
	'bb1.PetshopShopping.GoogleCustomerReviews.OrderWizard.Module.OrderCompleted',
	[
  'Wizard.Module',
  'Profile.Model',
  'SC.Configuration',
  
  'bb1_petshopshopping_googlecustomerreviews.tpl',
  
  'Backbone',
  'underscore',
		'Utils'
	],
	function (
  WizardModule,
  ProfileModel,
  Configuration,
  
  bb1_petshopshopping_googlecustomerreviews_tpl,
  
		Backbone,
		_
	)
 {
  'use strict';
  
  return WizardModule.extend({
   
   template: bb1_petshopshopping_googlecustomerreviews_tpl,
   
   initialize: function(options)
   {
    WizardModule.prototype.initialize.apply(this, arguments);
    this.application = this.wizard.application;
   },
   
   render: function() {
    console.log('redner');
    console.log(this.wizard.model);
       this._render();
       //window.renderOptIn(this.wizard.model);
       
    var transaction = this.wizard.model;
    
    var googleCustomerReviewsConfig = Configuration.get('googleCustomerReviews') || {};
    
    window.renderOptIn = function() {
     window.gapi && window.gapi.load('surveyoptin', function() {
      var customerEmail = ProfileModel.getInstance().get('email'),
          shipcountry = transaction.get("addresses").get(transaction.get("shipaddress")).get("country"),
          today = new Date();
          
      today.setDate(today.getDate() + 4);
      
      window.gapi.surveyoptin.render(
      {
       "merchant_id": googleCustomerReviewsConfig.storeId,
       "order_id": transaction.get('confirmation').confirmationnumber, // || 'teetet3434',
       "email": customerEmail,
       "delivery_country": shipcountry,
       "estimated_delivery_date": today.toISOString().replace(/T.*/gi, "")
      });
     });
    };
       jQuery.getScript('https://apis.google.com/js/platform.js?onload=renderOptIn');
       console.log('testing 123')
   },
   
   getContext: function()
   {
    var model = this.wizard.model || new Backbone.Model(),
        confirmation = model.get('confirmation') || new Backbone.Model(),
        orderLines = confirmation.get('lines'),
        summary = confirmation.get('summary') || model.get('summary') || {},
        profile = ProfileModel.getInstance(),
        shippingAddress = profile.get('addresses').get(model.get('shipaddress')),
        shipDate = new Date(),
        deliveryDate = new Date(shipDate.getTime()),
        googleStoreId = Configuration.get('googleCustomerReviews.storeId');
    
    deliveryDate.setDate(deliveryDate.getDate()+7);
    
    // @class bb1.PetshopShopping.GoogleCustomerReviews.OrderWizard.Module.OrderCompleted.Context
    return {
     // @property {Backbone.Model} model
     model: model,
     // @property {String} googleStoreId
     googleStoreId: googleStoreId,
     // @property {String} confirmationNumber
     confirmationNumber: confirmation.confirmationnumber || '12122121',
     // @property {String} email
     email: profile.get('email'),
     // @property {String} country
     country: shippingAddress.get('country'),
     // @property {String} currencyCode
     currencyCode: SC.ENVIRONMENT.currentCurrency.code,
     // @property {Number} total
     total: summary.total,
     // @property {Number} discountTotal
     discountTotal: summary.discounttotal,
     // @property {Number} shippingCost
     shippingCost: summary.shippingcost,
     // @property {Number} taxTotal
     taxTotal: summary.taxtotal,
     // @property {String} shipDate
     shipDate: shipDate.toISOString().replace(/T.*/, ''),
     // @property {String} deliveryDate
     deliveryDate: deliveryDate.toISOString().replace(/T.*/, ''),
     // @property {Backbone.Collection} orderLines
     orderLines: orderLines
    };
   }

  });
   
 }
);

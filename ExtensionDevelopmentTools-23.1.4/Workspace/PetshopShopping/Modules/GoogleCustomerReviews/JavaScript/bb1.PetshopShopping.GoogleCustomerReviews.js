// @module bb1.PetshopShopping.GoogleCustomerReviews
define(
	'bb1.PetshopShopping.GoogleCustomerReviews',
	[
  'Profile.Model',
  'SC.Configuration',
  
  'underscore',
		'Utils'
	],
	function (
 ProfileModel,
 Configuration,

		_
	)
 {
  'use strict';
  
  var loadedScript = false;
  
  return {
   
   mountToApp: function (application)
   {
    
    var googleCustomerReviewsConfig = Configuration.get('googleCustomerReviews') || {};
    
    if (!googleCustomerReviewsConfig.enabled || SC.isPageGenerator()) return;
    
    window.___gcfg = {
     lang: SC.ENVIRONMENT.currentLanguage.locale
    };

    window.renderBadge = function() {
     var ratingBadgeContainer = document.createElement("div");
     document.body.appendChild(ratingBadgeContainer);
     window.gapi && window.gapi.load('ratingbadge', function() {
      window.gapi.ratingbadge.render(ratingBadgeContainer, {"merchant_id": googleCustomerReviewsConfig.storeId, "position": "BOTTOM_LEFT"});
     });
    }

    /*window.renderOptIn = function(transaction) {
     window.gapi && window.gapi.load('surveyoptin', function() {
      var customerEmail = ProfileModel.getInstance().get('email'),
          shipcountry = transaction.get("addresses").get(transaction.get("shipaddress")).get("country"),
          today = new Date();
          
      today.setDate(today.getDate() + 4);
      
      window.gapi.surveyoptin.render(
      {
       "merchant_id": googleCustomerReviewsConfig.storeId,
       "order_id": transaction.get('confirmation').confirmationnumber || 'teetet3434',
       "email": customerEmail,
       "delivery_country": shipcountry,*/
       //"estimated_delivery_date": today.toISOString().replace(/T.*/gi, "")
      /*});
     });
    }*/
    
    application.getLayout().once("afterAppendView", function() {
     var script = document.createElement("script");
     script.type = "text/javascript";
     script.async = true;
     script.src = "https://apis.google.com/js/platform.js?onload=renderBadge";
     var firstscript = document.getElementsByTagName("script")[0];
     firstscript.parentNode.insertBefore(script, firstscript);
    });
   }
   
  };
 }
);

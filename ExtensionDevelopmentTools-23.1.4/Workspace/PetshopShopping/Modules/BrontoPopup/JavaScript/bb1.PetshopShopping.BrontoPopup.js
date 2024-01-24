// @module bb1.PetshopShopping.BrontoPopup
define(
	'bb1.PetshopShopping.BrontoPopup',
	[
 'SC.Configuration'
	],
	function(
  Configuration
	)
 {
  'use strict';

  return  {
   
   url: 'https://cdn.bronto.com/popup/delivery.js',
   
   mountToApp: function (application)
   {
    if (SC.ENVIRONMENT.jsEnvironment === 'browser') {
     
     var self = this;
     var brontoPopupConfig = Configuration.get('brontoPopup', {});
         
     if (brontoPopupConfig && brontoPopupConfig.enabled && brontoPopupConfig.popupId) {
      application.getLayout().once('afterAppendView', function() {
       jQuery('<script />').attr({'bronto-popup-id': brontoPopupConfig.popupId, src: self.url}).appendTo('body');
      });
     }
     
    }

   }
  };
  
 }
);

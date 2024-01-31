// @module bb1.PetshopShopping.ZopimChat
define(
	'bb1.PetshopShopping.ZopimChat',
	[
	'Session',
 'SC.Configuration'
	],
	function(
  Session,
  Configuration
	)
 {
  'use strict';

  return  {
   mountToApp: function (application)
   {
    if (SC.ENVIRONMENT.jsEnvironment === 'browser') {
      
     var zopimChatConfig = Configuration.get('zopimChat');
         
     if (zopimChatConfig && zopimChatConfig.enabled && zopimChatConfig.accountId) {
      application.getLayout().once('afterAppendView', function() {
       jQuery.getScript('https://v2.zopim.com/?' + zopimChatConfig.accountId);
      });
     }
     
    }

   }
  };
  
 }
);

//@module BrontoScriptManager
//@module bb1.PetshopShopping.BrontoScriptManager
(function (win, name)
{
	'use strict';
 
 win[name] = function() {
  //console.log('window.bronto() arguments');
  //console.log(arguments);
  "string" == typeof arguments[0] && win.bronto.q.push(arguments);
  win[name].go && win[name].go();
 };
 
 win[name].q = win[name].q || [];
 
 //var scriptTag = document.createElement("script");
 //var lastScriptTag = document.getElementsByTagName("script")[0];
 
 //lastScriptTag.parentNode.insertBefore(scriptTag, lastScriptTag);
 //scriptTag.async = !0;
 //scriptTag.onload = win[name];
 //scriptTag.src = "https://snip.bronto.com/v2/sites/eyJ0eXBlIjoic2l0ZWhhc2giLCJpZCI6ImYxN2YxNzBlYTE1NWNhODY0ZWRmMzQ4MDM1ZWE1ZWMxYjk2MTQxMGNhNjA5YTg4YmI1NWUyYTE4M2E5ZDEyNjIifQ==/assets/bundle.js";
 
	//@class bb1.PetshopShopping.BrontoScriptManager @extends ApplicationModule
	// ------------------
	// Loads facebook analytics script and extends application with methods:
	// * trackPageview
	// * trackEvent
	// Also wraps layout's showInModal
	define(
  'bb1.PetshopShopping.BrontoScriptManager',
  [
   'Tracker',
   'SC.Configuration',
   
   'underscore',
   'jQuery',
   'Backbone',
   'Utils'
  ],
  function (
   Tracker,
   Configuration,
   
   _,
   jQuery,
   Backbone,
   Utils
  )
  {
   var BrontoScriptManager = {

    url: 'https://snip.bronto.com/v2/sites/{{siteId}}/assets/bundle.js',
    
    //@method trackPageview
    //@param {String} url
    //@return {BrontoScriptManager}
   	trackPageview: function (url)
    {
     //console.log('BrontoScriptManager trackPageview');
     //console.log(url);
     
     win[name]();
     
     return this;
    },
    
    //@method loadScript
    //@return {jQuery.Promise|Void}
   	loadScript: function ()
    {
     var tracking = BrontoScriptManager.application.getConfig('tracking.brontoScriptManager');
     
     return SC.ENVIRONMENT.jsEnvironment === 'browser' && jQuery.getScript(BrontoScriptManager.url.replace(/{{siteId}}/g, tracking.siteId));
    },

    //@method mountToApp
    //@param {ApplicationSkeleton} application
    //@return {Void}
   	mountToApp: function (application)
    {
     BrontoScriptManager.application = application;
     
     var tracking = application.getConfig('tracking.brontoScriptManager');

     if (tracking && tracking.enabled && tracking.siteId)
     {
      Tracker.getInstance().trackers.push(BrontoScriptManager);

      application.getLayout().once('afterAppendView', jQuery.proxy(BrontoScriptManager, 'loadScript'));
     }
    }
    
   };

   return BrontoScriptManager;
  }
 );
})(window, 'bronto');

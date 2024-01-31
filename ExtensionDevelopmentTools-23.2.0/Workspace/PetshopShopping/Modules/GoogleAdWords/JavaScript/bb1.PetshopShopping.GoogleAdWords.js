// @module bb1.PetshopShopping.GoogleAdWords
// Adds GoogleAdWords tracking pixel on the checkout confirmation page.
define(
 'bb1.PetshopShopping.GoogleAdWords',
 [
  'Tracker',
  'jQuery'
	],
 function
 (
		Tracker,
  jQuery
	)
 {
  'use strict';

  // @lass GoogleAdWords Adds GoogleAdWords tracking pixel on the checkout confirmation page. @extends ApplicationModule
  var GoogleAdWords = {

   // @method setAccount Saves the configuration to be later used on the track transaction. @param {Object} config
   setAccount: function (config)
   {
    this.config = config;

    window.gtag('js', new Date());

    window.gtag('config', config.id);
    
    return this;
   },

   // @method trackTransaction Appends the tracking pixel to the dom, so the request is done.
  	trackTransaction: function (order)
   {
    var config = GoogleAdWords.config,
        confirmationNumber = order && order.get('confirmationNumber') || '',
        value = order && order.get('total') || config.value,
        currencyCode = SC.ENVIRONMENT.currentCurrency && SC.ENVIRONMENT.currentCurrency.code || 'GBP';

    window.gtag('event', 'conversion', {'send_to': config.id + '/' + config.label,
                'value': value,
                'currency': currencyCode,
                'transaction_id': confirmationNumber
              });
              
    return this;
   },

   //@method loadScript
   //@return {jQuery.Promise|Void}
  	loadScript: function ()
   {
    return !SC.isPageGenerator() && jQuery.getScript('https://www.googletagmanager.com/gtag/js?id=' + this.config.id + '&l=' + this.config.dataLayerName);
   },

  	mountToApp: function (application)
   {
    GoogleAdWords.application = application;
    var tracking = application.getConfig('tracking.googleAdWordsConversion');
    
    // Required tracking attributes to generate the pixel url
    if (tracking && tracking.id && tracking.label)
    {
     tracking.dataLayerName = tracking.dataLayerName || 'gtagDataLayer';
     window[tracking.dataLayerName] = window[tracking.dataLayerName] || [];
     
     window.gtag = function gtag(){ window[tracking.dataLayerName].push(arguments); }
     
     GoogleAdWords.setAccount(tracking);

     Tracker.getInstance().trackers.push(GoogleAdWords);
     
     // the script is only loaded if we are on a browser
     application.getLayout().once('afterAppendView', jQuery.proxy(GoogleAdWords, 'loadScript'));
    }
   }
  };

  return GoogleAdWords;
 }
);

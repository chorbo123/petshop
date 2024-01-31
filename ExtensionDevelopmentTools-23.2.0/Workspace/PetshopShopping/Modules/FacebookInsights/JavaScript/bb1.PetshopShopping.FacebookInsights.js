//@module bb1.PetshopShopping.FacebookInsights
(function (win, name)
{
	'use strict';
 
	win.FacebookInsightsObject = name;
	win[name] = win[name] || function ()
	{
  win[name].callMethod ? win[name].callMethod.apply(win[name],arguments) : win[name].queue.push(arguments)
	};
 
 if (!win['_'+name])
  win['_'+name] = win[name];
  
 win[name].push = win[name];
 win[name].loaded = !0;
 win[name].version = '2.0';
 win[name].queue = [];

	//@class bb1.PetshopShopping.FacebookInsights @extends ApplicationModule
	// ------------------
	// Loads facebook analytics script and extends application with methods:
	// * trackPageview
	// * trackEvent
	// Also wraps layout's showInModal
	define(
  'bb1.PetshopShopping.FacebookInsights',
  [
   'Tracker',
   'SC.Configuration',
   'GoogleUniversalAnalytics',
   
   'underscore',
   'jQuery',
   'Backbone',
   'Utils'
  ],
  function (
   Tracker,
   Configuration,
   GoogleUniversalAnalytics,
   
   _,
   jQuery,
   Backbone,
   Utils
  )
  {
   
   _.extend(GoogleUniversalAnalytics, {
    
    trackTransaction: function (transaction)
    {
     //console.log('transaction');
     //console.log(transaction);
     var transaction_id = transaction.get('confirmationNumber');

     GoogleUniversalAnalytics.addTrans({
      id: transaction_id
     ,	revenue: transaction.get('subTotal')
     ,	shipping: transaction.get('shippingCost') + transaction.get('handlingCost')
     ,	tax: transaction.get('taxTotal')
     ,	currency: SC.ENVIRONMENT.currentCurrency && SC.ENVIRONMENT.currentCurrency.code || ''

     ,	page: '/' + Backbone.history.fragment
     });

     transaction.get('products').each(function (product)
     {
      GoogleUniversalAnalytics.addItem({
       id: transaction_id
      ,	affiliation: Configuration.get('siteSettings.displayname')
      ,	sku: product.get('id')
      ,	name: product.get('name')
      ,	category: product.get('category') || ''
      ,	price: product.get('rate')
      ,	quantity: product.get('quantity')
      });
     });

     return GoogleUniversalAnalytics.trackTrans();
    }
   
   });
   
   
   var FacebookInsights = {

    //@method doCallback Indicates if this module do a callback after some particular events
    //@return {Boolean}
    doCallback: function()
    {
     return !win[name].queue;
    },

    //@method trackPageview
    //@param {String} url
    //@return {FacebookInsights}
   	trackPageview: function (url)
    {
     //console.log('facebook PageView');
     //console.log(url);
     if (_.isString(url))
     {
      win[name]('track', 'PageView', url);
     }
     
     return this;
    },
    
    //@method trackProductView
    //@param {ProductDetails.Model} product
    //@return {FacebookInsights}
    trackProductView: function(product)
    {
     var item = product.get('item') || product;
     //console.log('facebook ViewContent');
     //console.log(item);
     //console.log(item.get('_sku'));
     //console.log(item.get('_name'));
     //console.log(item.getPrice());
     win[name]('track', 'ViewContent', {
      content_ids: item.get('_sku'),
      content_name: item.get('_name'),
      content_type: 'product',
      contents: [{
       id: item.get('_sku'),
       quantity: 1
      }],
      currency: SC.ENVIRONMENT.currentCurrency.code,
      value: item.getPrice().price
     });
     //ViewContent
     //content_ids, content_category, content_name, content_type, contents, currency, value
     //None required.
     //Required for Dynamic Ads: content_ids, content_type, and contents
     
     return this;
    },
    
    trackAddToCart: function (line)
    {
     //console.log('facebook trackAddToCart');
     //console.log(line);
     if (line)
     {
      var item = line.get('item') || line;
      
      win[name].push('track', 'AddToCart', {
        content_ids: item.get('_sku'),
        content_name: item.get('_name'),
        content_type: 'product',
        contents: [{
         id: item.get('_sku'),
         quantity: line.get('quantity')
        }],
        currency: SC.ENVIRONMENT.currentCurrency.code,
        value: line.get('quantity') * line.get('rate')
       }
      );
     }
    },
     
     //CompleteRegistration
     //content_name, currency, status, value
     
     //AddToWishlist
     //content_name, content_category, content_ids, contents, currency, value
     
    trackProceedToCheckout: function ()
    {
     win[name]('track', 'InitiateCheckout');
     //content_category, content_ids, contents, currency, num_items, value
     //console.log('facebook trackInitiateCheckout');
     
     return this;
    },

    trackSelectedPayment: function (payment)
    {
     win[name]('track', 'AddPaymentInfo');
     
     //console.log('facebook trackAddPaymentInfo');
     
     //content_category, content_ids, contents, currency, value
     
     return this;
    },

    trackTransaction: function (order)
    {    
 				var transaction_id = order.get('confirmationNumber');

     var item = null
     , itemIds = []
     , cartContents = []
     , value = 0
     , numberOfItems = 0;

     order.get('products').each(function (line)
     {
      itemIds.push(line.get('id'));
      value += line.get('quantity') * line.get('rate');
      cartContents.push({
       id: line.get('id'),
       quantity: line.get('quantity')
      });
      numberOfItems += line.get('quantity');
     });

     win[name]('track', 'Purchase', {
      content_ids: itemIds,
      content_name: 'Order Confirmation: ' + transaction_id,
      content_type: 'product',
      contents: cartContents,
      num_items: numberOfItems,
      value: order.get('subTotal'),
      currency: SC.ENVIRONMENT.currentCurrency.code
     });
     
     return this;
    },

    //@method setAccount
    //@param {SC.Configuration} config
    //@return {Void}
   	setAccount: function (config)
    {
     if (!config)
     {
      return this;
     }

     win[name]('init', config.applicationId);

     return this;
    },

    //@method loadScript
    //@return {jQuery.Promise|Void}
   	loadScript: function ()
    {
     return SC.ENVIRONMENT.jsEnvironment === 'browser' && jQuery.getScript('//connect.facebook.net/en_US/fbevents.js');
    },

    //@method mountToApp
    //@param {ApplicationSkeleton} application
    //@return {Void}
   	mountToApp: function (application)
    {
     var tracking = application.getConfig('tracking.facebookInsights');

     if (tracking && tracking.enabled && tracking.applicationId)
     {
      FacebookInsights.setAccount(tracking);

      Tracker.getInstance().trackers.push(FacebookInsights);

      application.getLayout().once('afterAppendView', jQuery.proxy(FacebookInsights, 'loadScript'));
     }
    }
    
   };

   return FacebookInsights;
  }
 );
})(window, 'fbq');

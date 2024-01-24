//@module bb1.PetshopShopping.Main
define(
 'bb1.PetshopShopping.Main.Checkout',
 [
  'bb1.PetshopShopping.Profile',
  'bb1.PetshopShopping.Header',
  'bb1.PetshopShopping.Footer',
  'bb1.PetshopShopping.PcaCapturePlus',
  //'bb1.PetshopShopping.Prescriptions',
  'bb1.PetshopShopping.GoogleCustomerReviews',
  'bb1.PetshopShopping.GoogleCustomerReviews.Checkout',
  'bb1.PetshopShopping.SmsSubscription',
  'bb1.PetshopShopping.HandlebarsExtras',
  'bb1.PetshopShopping.FacebookInsights',
  'bb1.PetshopShopping.BrontoScriptManager',
  'bb1.PetshopShopping.GoogleAdWords',
  'bb1.PetshopShopping.LoginRegister',
  'bb1.PetshopShopping.RestrictCustomers',
  'bb1.PetshopShopping.Checkout',
  'bb1.PetshopShopping.SupplierStock',
  'bb1.PetshopShopping.BrontoPopup',
  'bb1.PetshopShopping.Checkout.Configuration.Steps.EnhancedPromotions',
  'bb1.PetshopShopping.Checkout.Configuration.Steps.EnhancedPromotions.Staging',
  'bb1.PetshopShopping.ProductDetails',
  'bb1.PetshopShopping.Promotions.ItemKeyMapping',
  'bb1.PetshopShopping.ItemKeyMapping',
  'bb1.PetshopShopping.EstimatedDelivery.Checkout',
  'bb1.PetshopShopping.Prescriptions.Checkout',
  'bb1.PetshopShopping.GoogleTagManager',
  //'bb1.PetshopShopping.BrandReferral',
  'bb1.PetshopShopping.BloomreachTracking',
  'bb1.PetshopShopping.PersonalisedCustomerViews',
  
  'Transaction.Line.Views.Cell.Navigable.View',
  'Application',
  'underscore',
  'Utils'
 ],
 function
 (
  Profile,
  Header,
  Footer,
  PcaCapturePlus,
  //Prescriptions,
  GoogleCustomerReviews,
  GoogleCustomerReviewsCheckout,
  SmsSubscription,
  HandlebarsExtras,
  FacebookInsights,
  BrontoScriptManager,
  GoogleAdWords,
  LoginRegister,
  RestrictCustomers,
  Checkout,
  SupplierStock,
  BrontoPopup,
  CheckoutConfigurationStepsEnhancedPromotions,
  CheckoutConfigurationStepsEnhancedPromotionsStaging,
  ProductDetails,
  PromotionsItemKeyMapping,
  ItemKeyMapping,
  EstimatedDeliveryCheckout,
  PrescriptionsCheckout,
  GoogleTagManager,
  //BrandReferral,
  BloomreachTracking,
  PersonalisedCustomerViews,
  
  TransactionLineViewsCellNavigableView,
  Application,
  _,
  Utils
 )
 {
  'use strict';
  
    _.extend(TransactionLineViewsCellNavigableView.prototype, {
     
     getContext: _.wrap(TransactionLineViewsCellNavigableView.prototype.getContext, function (originalGetContext)
     {
      var result = originalGetContext.apply(this, _.rest(arguments));
      
      //@class Transaction.Line.Views.Price.View.Context
      return _.extend(result, {
       // @property {String} rateFormatted
       detail3: this.model.get('total') == 0 ? 'FREE!' : result.rateFormatted
      //@class Transaction.Line.Views.Price.View
      });
     })
     
    });
    
  //SC._applications.Checkout.on('afterStart', function() {
   //console.log('afterStart');
   
   /*var CustomUtils = {
    formatCurrency: _.wrap(Utils.formatCurrency, function(originalFormatCurrency, value, symbol, noDecimalPosition) {
     console.log('tisijsij');
     if (value == 0)
      return 'FREE!';
     
     return originalFormatCurrency.apply(this, _.rest(arguments));
    })
   };
   
   _.extend(SC.Utils, Utils, CustomUtils);
   
   _.mixin(CustomUtils);*/
  
  //});
  
  var Modules = arguments;
  
  return {
   
   mountToApp: function(container) {
    
    for (var i in Modules) {
     var module = Modules[i];
     if (module && module.mountToApp)
      module.mountToApp(container);
    }
    
   }
   
  };
  
 }
);

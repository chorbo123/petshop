//@module bb1.PetshopShopping.Main
define(
 'bb1.PetshopShopping.Main.MyAccount',
 [
  'bb1.PetshopShopping.Profile',
  'bb1.PetshopShopping.Header',
  'bb1.PetshopShopping.Footer',
  'bb1.PetshopShopping.Pets',
  'bb1.PetshopShopping.SubscriptionOrders',
  'bb1.PetshopShopping.PcaCapturePlus',
  'bb1.PetshopShopping.TrackingServices',
  'bb1.PetshopShopping.FacebookInsights',
  'bb1.PetshopShopping.BrontoScriptManager',
  'bb1.PetshopShopping.GoogleAdWords',
  'bb1.PetshopShopping.RestrictCustomers',
  'bb1.PetshopShopping.SupplierStock',
  'bb1.PetshopShopping.BrontoPopup',
  'bb1.PetshopShopping.ItemKeyMapping',
  'bb1.PetshopShopping.Case',
  'bb1.PetshopShopping.MyAccount',
  'bb1.PetshopShopping.LoyaltyRewards',
  'bb1.PetshopShopping.Breeders',
  //'bb1.PetshopShopping.Vouchers',
  'bb1.PetshopShopping.Prescriptions.MyAccount',
  'bb1.PetshopShopping.GoogleTagManager',
  //'bb1.PetshopShopping.BrandReferral'
  'bb1.PetshopShopping.PersonalisedCustomerViews'
 ],
 function
 (
  Profile,
  Header,
  Footer,
  Pets,
  SubscriptionOrders,
  PcaCapturePlus,
  TrackingServices,
  FacebookInsights,
  BrontoScriptManager,
  GoogleAdWords,
  RestrictCustomers,
  SupplierStock,
  BrontoPopup,
  ItemKeyMapping,
  Case,
  MyAccount,
  LoyaltyRewards,
  Breeders,
  //Vouchers,
  PrescriptionsMyAccount,
  GoogleTagManager,
  //BrandReferral
  PersonalisedCustomerViews
 )
 {
  'use strict';
  
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

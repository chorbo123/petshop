//@module bb1.PetshopShopping.Main
define(
  'bb1.PetshopShopping.Main.Shopping',
  [
    'bb1.PetshopShopping.Profile',
    'bb1.PetshopShopping.ProductList',
    'bb1.PetshopShopping.ProductDetails',
    'bb1.PetshopShopping.Header',
    'bb1.PetshopShopping.Footer',
    'bb1.PetshopShopping.Home',
    'bb1.PetshopShopping.Promotions',
    'bb1.PetshopShopping.Contact',
    'bb1.PetshopShopping.HandlebarsExtras',
    'bb1.PetshopShopping.ItemListBanners',
    'bb1.PetshopShopping.ZopimChat',
    'bb1.PetshopShopping.GoogleCustomerReviews',
    'bb1.PetshopShopping.FacebookInsights',
    'bb1.PetshopShopping.BrontoScriptManager',
    'bb1.PetshopShopping.GoogleAdWords',
    'bb1.PetshopShopping.SupplierStock',
    'bb1.PetshopShopping.RestrictCustomers',
    'bb1.PetshopShopping.BrontoPopup',
    'bb1.PetshopShopping.SeopaInsurance',
    'bb1.PetshopShopping.ProductReviews',
    'bb1.PetshopShopping.ItemKeyMapping',
    'bb1.PetshopShopping.EstimatedDelivery.Shopping',
    'bb1.PetshopShopping.Prescriptions.Shopping',
    'bb1.PetshopShopping.NewsletterSignup',
    'bb1.PetshopShopping.Breeders',
    'bb1.PetshopShopping.LoyaltyRewards',
    'bb1.PetshopShopping.Cart',
    'bb1.PetshopShopping.GoogleTagManager',
    'bb1.PetshopShopping.Merchandising',
    //'bb1.PetshopShopping.BrandReferral',
    'bb1.PetshopShopping.BloomreachTracking',
    'bb1.PetshopShopping.PersonalisedCustomerViews',

    'bootstrap-multiselect'
  ],
  function
    (
      Profile,
      ProductList,
      ProductDetails,
      Header,
      Footer,
      Home,
      Promotions,
      Contact,
      HandlebarsExtras,
      ItemListBanners,
      ZopimChat,
      GoogleCustomerReviews,
      FacebookInsights,
      BrontoScriptManager,
      GoogleAdWords,
      RestrictCustomers,
      SupplierStock,
      BrontoPopup,
      SeopaInsurance,
      ProductReviews,
      ItemKeyMapping,
      EstimatedDeliveryShopping,
      PrescriptionsShopping,
      NewsletterSignup,
      Breeders,
      LoyaltyRewards,
      Cart,
      GoogleTagManager,
      Merchandising,
      //BrandReferral
      BloomreachTracking,
      PersonalisedCustomerViews
    ) {
    'use strict';

    var Modules = arguments;

    return {

      mountToApp: function (container) {

        for (var i in Modules) {
          var module = Modules[i];
          if (module && module.mountToApp)
            module.mountToApp(container);
        }

      }

    };

  }
);

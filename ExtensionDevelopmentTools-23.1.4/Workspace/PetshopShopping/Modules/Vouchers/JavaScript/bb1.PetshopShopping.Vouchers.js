// @module bb1.PetshopShopping.Vouchers
define(
 'bb1.PetshopShopping.Vouchers',
 [
  'bb1.PetshopShopping.Vouchers.Model',
  'bb1.PetshopShopping.Vouchers.Router',
  'bb1.PetshopShopping.Vouchers.Collection',
  'SC.Configuration'
 ],
 function (
  VouchersModel,
  VouchersRouter,
  VouchersCollection,
  Configuration
 )
 {
  'use strict';
  
  return {
   
   Model: VouchersModel,
   
   Collection: VouchersCollection,
   
   Router: VouchersRouter,
   
   MenuItems: {
    id: 'vouchers',
    name: _('Your Vouchers').translate(),
    url: 'vouchers',
    index: 4
   },
   
   mountToApp: function (application)
   {
    var vouchersConfig = Configuration.get('vouchers') || {};
    
    //if (!vouchersConfig.enabled)
    // return;
    
    var myAccountMenu = application.getComponent('MyAccountMenu');
    
    if (myAccountMenu) {
     myAccountMenu.addGroup({
      id: 'vouchers',
      name: _('Your Vouchers').translate(),
      url: 'vouchers',
      index: 4
     });
    }
    
    // Initializes the router');
    return new VouchersRouter(application);
   }
   
  };
 }
);

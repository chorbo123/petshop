//@module bb1.PetshopShopping.Promotions
define(
 'bb1.PetshopShopping.Promotions',
 [
  'LiveOrder.Model',
  'Application',
  'Configuration',
  'Utils',
  'Models.Init',

  'underscore'
 ],
 function (
  LiveOrderModel,
  Application,
  Configuration,
  Utils,
  ModelsInit,

  _
 )
{
 'use strict';
 
 ModelsInit.context.setSessionObject('bb1CheckoutPromotionsWebSite', '1');
 
 //Application.extendModel('LiveOrder', {
 _.extend(LiveOrderModel, {
  
  addPromotion: function(promo_code)
		{
			ModelsInit.order.applyPromotionCode(promo_code);
   
   var invalidPromoCodeMessage = context.getSessionObject('invalidPromoCodeMessage');
   if (invalidPromoCodeMessage) {
    order.removePromotionCode(promo_code);
    throw nlapiCreateError('INVALID_PROMOCODE', invalidPromoCodeMessage);
   }
		}
 
 });

 Application.on('after:LiveOrder.get', function(model, result) {

  var invalidPromoCodeMessage = context.getSessionObject('invalidPromoCodeMessage');
  result.invalidPromoCodeMessage = invalidPromoCodeMessage;
  if (result.promocode && invalidPromoCodeMessage) {
   order.removePromotionCode(result.promocode.code);
   result.promocode = null;
  }
  
 });

});

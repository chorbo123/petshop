// @module bb1.PetshopShopping.ProductDetails
define(
  'bb1.PetshopShopping.ProductDetails.Promotions.View',
  [
    'Profile.Model',

    'bb1_petshopshopping_productdetails_promotions.tpl',

    'Backbone',
    'underscore'
  ],
  function (
    ProfileModel,

    bb1_petshopshopping_productdetails_promotions_tpl,

    Backbone,
    _
  ) {
    'use strict';

    // @class bb1.PetshopShopping.ProductDetails.Promotions.View @extends Backbone.View
    return Backbone.View.extend({

      template: bb1_petshopshopping_productdetails_promotions_tpl,

      // @method getContext @returns {bb1.PetshopShopping.ProductDetails.Promotions.View.Context}
      getContext: function () {
        if (!this.options.model) return;

        var model = this.options.model,
          item = model.get('item') || model,
          profile = ProfileModel.getInstance(),
          customerId = profile.get('internalid'),
          itemPrice = item.getPrice(),
          currentPromotions = item.get('_currentPromotions') || [],
          promotionButtonText = this.options.actionButtonLabel || item.get('custitem_bb1_cop_promobuttontext'),
          priceSchedule = (item.get('_priceDetails') || {}).priceschedule || [],
          blbDiscountRate = item.get('custitem_bb1_bb_discountrate') || 0,
          showSavings = !this.options.hidePricingSavings && itemPrice.price < itemPrice.compare_price,
          saveUpToFlag = false;

        //console.log('this.options');
        //console.log(this.options);

        if (priceSchedule.length > 1) {
          itemPrice.price = priceSchedule[1].price;
          saveUpToFlag = true;
        }
        if (blbDiscountRate) {
          itemPrice.price *= (100 + blbDiscountRate) / 100;
          saveUpToFlag = true;
        }
        itemPrice.price_formatted = _.formatCurrency(itemPrice.price);
        itemPrice.savings = itemPrice.compare_price - itemPrice.price;
        itemPrice.savings_formatted = _.formatCurrency(itemPrice.savings);

        currentPromotions = _.filter(currentPromotions, function (promo) {
          var promoWebsite = promo.website || [];
          return (promoWebsite.indexOf('1') != -1 && promo.buttonText && (!promo.testCustomer || customerId == promo.testCustomer));
        });

        //@class bb1.PetshopShopping.ProductDetails.Promotions.View.Context
        return {
          // @property {Object} itemPrice
          itemPrice: itemPrice,
          // @property {Array} promotions
          promotions: currentPromotions,
          // @property {String} promotionButtonText
          promotionButtonText: promotionButtonText,
          // @property {Boolean} hasPromotions
          hasPromotions: !!currentPromotions.length,
          // @property {Boolean} showSavings
          showSavings: showSavings,
          // @property {Boolean} saveUpToFlag
          saveUpToFlag: saveUpToFlag
        };
      }
    });
  });


//@class bb1.PetshopShopping.ProductDetails.Promotions.View.Initialize.Options
//@property {Item.Model} model

// @module bb1.PetshopShopping.EstimatedDelivery
define(
  'bb1.PetshopShopping.EstimatedDelivery.Cart.Stock.View',
  [
    'ProductLine.Stock.View',

    'bb1_petshopshopping_estimateddelivery_cart_stock.tpl',

    'Backbone'
  ],
  function (
    ProductLineStockView,

    bb1_petshopshopping_estimateddelivery_cart_stock_tpl,

    Backbone
  ) {
    'use strict';

    // @class bb1.PetshopShopping.EstimatedDelivery.Cart.Stock.View @extends ProductLine.Stock.View
    return ProductLineStockView.extend({

      template: bb1_petshopshopping_estimateddelivery_cart_stock_tpl,

      //@method getContext
      //@return {bb1.PetshopShopping.EstimatedDelivery.Cart.Stock.View.Context}
      getContext: _.wrap(ProductLineStockView.prototype.getContext, function (originalGetContext) {
        var context = originalGetContext.apply(this, _.rest(arguments));
        var item = this.model.get('item') || this.model;

        context.estimatedDeliveryDetails = item.get('_expressDelivery');
        context.estimatedDeliveryDetails.standardDeliveryDayFormatted = context.estimatedDeliveryDetails.standardDeliveryDateFormatted.split(',')[1];

        console.log('contextcontextcontextcontext');
        console.log(context);

        return context;
        //@class bb1.PetshopShopping.EstimatedDelivery.Cart.Stock.View
      })

    });
  }
);

// @module bb1.PetshopShopping.Vouchers
define(
 'bb1.PetshopShopping.Vouchers.Router',
 [
  'bb1.PetshopShopping.Vouchers.List.View',
  'bb1.PetshopShopping.Vouchers.Model',
  'GlobalViews.Message.View',
  
  'Backbone',
  'underscore'
 ],
 function (
  VouchersListView,
  VouchersModel,
  GlobalViewsMessageView,
  
  Backbone,
  _
 )
 {
  'use strict';
  
  return Backbone.Router.extend({
   
   routes: {
    'vouchers': 'vouchersList'
   },
   
   initialize: function (application)
   {
    this.application = application;
   },
   
   vouchersList: function (params)
   {
    console.log('bb1.PetshopShopping.Vouchers.Router');
    var options = null;

    if (params)
    {
     options = SC.Utils.parseUrlOptions(params);
    }
    
    var self = this,
        application = this.application,
        model = new VouchersModel(),
        view = new VouchersListView({
         model: model,
         application: this.application,
         urlOptions: options
        });

    model.fetch({
     data: _.extend({}, options),
     killerId: this.application.killerId
    }).then(function (data) {
     //collection.set(data.pets);
     //model.set({pets: collection});
     view.showContent().then(function (view) {});
    });
   }
   
  });
 }
);

// @module bb1.PetshopShopping.Vouchers
define(
 'bb1.PetshopShopping.Vouchers.ListCell.View',
 [
  'GlobalViews.Message.View',
  
  'bb1_petshopshopping_vouchers_list_cell.tpl',
  
  'Backbone',
  'underscore'
 ],
 function (
  GlobalViewsMessageView,
  
  bb1_petshopshopping_vouchers_list_cell_tpl,
  
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_vouchers_list_cell_tpl,

   initialize: function (options)
   {
    this.application = options.application;
   },

   getContext: function ()
   {
    var voucher = this.model || new Backbone.Model(),
        title = _('Exclusive for you:').translate();
    
    //voucher.set('title', title);
    
    //@class bb1.PetshopShopping.Vouchers.ListCell.View.Context
    return {
     //@property {Backbone.Model} voucher
     voucher: voucher,
     //@property {String} title
     title: title
    };
   }
   
  });

 }
);

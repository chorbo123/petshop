// @module bb1.PetshopShopping.Vouchers
define(
 'bb1.PetshopShopping.Vouchers.List.View',
 [
  'bb1.PetshopShopping.Vouchers.ListCell.View',
  'bb1.PetshopShopping.BrandReferral.ShareCode.ListCell.View',
  'GlobalViews.Message.View',
  
  'bb1_petshopshopping_vouchers_list.tpl',
  
  'Backbone.CollectionView',
  'Backbone.CompositeView',
  'Backbone',
  'underscore'
 ],
 function (
  VouchersListCellView,
  BrandReferralShareCodeListCellView,
  GlobalViewsMessageView,
  
  bb1_petshopshopping_vouchers_list_tpl,
  
  BackboneCollectionView,
  BackboneCompositeView,
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_vouchers_list_tpl,
   
   page_header: _('Your Voucher Codes').translate(),
   
   title: _('Your Voucher Codes').translate(),
   
   attributes: {'class': 'VouchersListView'},

   initialize: function (options)
   {
    this.application = options.application;
    BackboneCompositeView.add(this);
   },

   childViews: {
    
    'Vouchers.List': function() {
     return new BackboneCollectionView(
     {
      childView: VouchersListCellView,
      collection: this.model.get('vouchers'),
      viewsPerRow: 2
     });
    },
    
    'BreederVouchers.List': function() {
     return new BackboneCollectionView(
     {
      childView: VouchersListCellView,
      collection: this.model.get('breederVouchers'),
      viewsPerRow: 2
     });
    },
    
    'ReferralShareCodes.List': function() {
     return new BackboneCollectionView(
     {
      childView: BrandReferralShareCodeListCellView,
      collection: this.model.get('brandReferralShareCodes'),
      viewsPerRow: 1,
      childViewOptions: {
       application: this.application
      }
     });
    },
    
    'ReferrerVouchers.List': function() {
     return new BackboneCollectionView(
     {
      childView: VouchersListCellView,
      collection: this.model.get('brandReferralVouchers'),
      viewsPerRow: 2
     });
    }
    
   },
   
   showContent: function ()
   {
    var paths = [
     {
      text: this.page_header,
      href: '/vouchers'
     }
    ];

    return this.application.getLayout().showContent(this, 'vouchers', paths);
   },
   
   getContext: function ()
   {
    var vouchers = this.model.get('vouchers'),
        breederVouchers = this.model.get('breederVouchers'),
        brandReferralShareCodes = this.model.get('brandReferralShareCodes'),
        brandReferralVouchers = this.model.get('brandReferralVouchers');
        
    //@class bb1.PetshopShopping.Vouchers.List.View.Context
    return {
     //@property {String} pageHeader
     pageHeader: this.page_header,
     //@property {Boolean} hasVouchers
     hasVouchers: vouchers.length > 0,
     //@property {Boolean} hasBreederVouchers
     hasBreederVouchers: breederVouchers.length > 0,
     //@property {Boolean} hasBrandReferralVouchers
     hasBrandReferralVouchers: brandReferralShareCodes.length > 0 || brandReferralVouchers.length > 0,
     //@property {Boolean} hasAnyVouchers
     hasAnyVouchers: vouchers.length > 0 || breederVouchers.length > 0
    };
   }
   
  });

 }
);

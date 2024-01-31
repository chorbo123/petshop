// @module bb1.PetshopShopping.BrandReferral
define(
 'bb1.PetshopShopping.BrandReferral.ShareCode.ListCell.View',
 [
  'bb1.PetshopShopping.BrandReferral.ShareCode.Form.View',
    
  'bb1_petshopshopping_brandreferral_sharecode_list_cell.tpl',
  
  'Backbone',
  'underscore'
 ],
 function (
  BrandReferralShareCodeFormView,
  
  bb1_petshopshopping_brandreferral_sharecode_list_cell_tpl,
  
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_brandreferral_sharecode_list_cell_tpl,

   events:
   {
    'click [data-action="send-share-code"]': 'showShareCodeForm'
   },
   
   initialize: function (options)
   {
    this.application = options.application;
   },

   showShareCodeForm: function (e)
   {
    console.log('showShareCodeForm');
    
    var shareCodeFormView = new BrandReferralShareCodeFormView({
     application: this.application,
     shareCodeId: this.model.get('internalId')
    });
    
    console.log(shareCodeFormView);
    console.log(this.application);
    console.log(this.model);
    
    //shareCodeFormView.showContent();
    //shareCodeFormView.beforeShowContent().done(function() {
     shareCodeFormView.showInModal();
    //});
   },

   getContext: function ()
   {
    var shareCode = this.model || new Backbone.Model();
        
    //@class bb1.PetshopShopping.BrandReferral.ShareCode.ListCell.View.Context
    return {
     //@property {string} shareCode
     shareCode: shareCode
    };
   }
   
  });

 }
);

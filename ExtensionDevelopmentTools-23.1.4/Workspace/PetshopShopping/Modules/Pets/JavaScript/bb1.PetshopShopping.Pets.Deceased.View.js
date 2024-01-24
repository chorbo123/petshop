// @module bb1.PetshopShopping.Pets
define(
 'bb1.PetshopShopping.Pets.Deceased.View',
 [
  'bb1.PetshopShopping.Pets.List.View',
  'GlobalViews.Message.View',
  'Profile.Model',
  
  'bb1_petshopshopping_pets_deceased.tpl',
  
  'Backbone',
  'underscore'
 ],
 function (
  PetsListView,
  GlobalViewsMessageView,
  ProfileModel,
  
  bb1_petshopshopping_pets_deceased_tpl,
  
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_pets_deceased_tpl,
   
   page_header: _('We\'re so sorry for your loss').translate(),
   
   title: _('We\'re so sorry for your loss').translate(),
   
   attributes: { 'class': 'PetDeceasedView' },

   initialize: function (options)
   {
    this.application = options.application;
   },

   /*showContent: function ()
   {
    var paths = [
                 {
                  text: PetsListView.prototype.page_header,
                  href: '/pets'
                 },
                 {
                  text: this.page_header,
                  href: '/pets/rainbow-bridge'
                 }
                ];

    return this.application.getLayout().showContent.call(this, null, paths);
   },*/
   
   getContext: function ()
   {
    //@class bb1.PetshopShopping.Pets.Deceased.View.Context
    var firstName = ProfileModel.getInstance().get('firstname');
    
    return {
     //@property {String} pageHeader
     pageHeader: firstName && _('We\'re so sorry for your loss $(0)').translate(firstName) || this.page_header,
     //@property {String} firstName
     firstName: firstName
    };
   }
   
  });

 }
);

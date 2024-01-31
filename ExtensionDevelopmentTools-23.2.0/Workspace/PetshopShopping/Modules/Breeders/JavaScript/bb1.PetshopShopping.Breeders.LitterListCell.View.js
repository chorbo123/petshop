// @module bb1.PetshopShopping.Breeders
define(
 'bb1.PetshopShopping.Breeders.LitterListCell.View',
 [
  'GlobalViews.Message.View',
  
  'bb1_petshopshopping_breeders_litter_list_cell.tpl',
  
  'Backbone',
  'underscore'
 ],
 function (
  GlobalViewsMessageView,
  
  bb1_petshopshopping_breeders_litter_list_cell_tpl,
  
  Backbone,
  _
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_breeders_litter_list_cell_tpl,

   events: {
    'click [data-action="edit-pet"]': 'editPet',
    'click [data-action="delete-pet"]': 'deletePet'
   },

   initialize: function (options)
   {
    this.application = options.application;
   },

   editPet: function (e) {
    var petId = jQuery(e.target).closest("[data-id]").data("id");
    Backbone.history.navigate('pets/' + petId, {trigger: true});
   },
   
   deletePet: function (e) {
   
    if (!confirm(_("Are you sure you want to delete this pet?").translate())) return;
    
    var self = this,
        petId = jQuery(e.target).closest("[data-id]").data("id"),
        model = this.model.get('pets').get(petId),
        petName = model.get('name');

    model.destroy({wait: true}).then(function (model, response) {
     self.render();
     var message = _("'$(0)' has been deleted from your pets.").translate(petName),
         messageView = new GlobalViewsMessageView({message: message, closable: true, type: "success"});
     messageView.render();
     self.$('[data-type="alert-placeholder"]').empty().append(messageView.$el);
    });
   },
   
   getContext: function ()
   {
    //@class Pets.ListCell.View.Context
    return {
     //@property {Backbone.Model} pet
     pet: this.model || Backbone.Model()
    };
   }
   
  });

 }
);

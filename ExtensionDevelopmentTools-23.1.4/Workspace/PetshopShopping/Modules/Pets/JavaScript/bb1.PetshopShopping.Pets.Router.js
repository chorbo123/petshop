// @module bb1.PetshopShopping.Pets
define(
 'bb1.PetshopShopping.Pets.Router',
 [
  'bb1.PetshopShopping.Pets.List.View',
  'bb1.PetshopShopping.Pets.Form.View',
  'bb1.PetshopShopping.Pets.FormSubmitted.View',
  'bb1.PetshopShopping.Pets.Model',
  'bb1.PetshopShopping.Pets.Collection',
  'GlobalViews.Message.View',
  
  'Backbone',
  'underscore'
 ],
 function (
  PetsListView,
  PetsFormView,
  PetsFormSubmittedView,
  PetsModel,
  PetsCollection,
  GlobalViewsMessageView,
  
  Backbone,
  _
 )
 {
  'use strict';
  // Adds routes to the application
  return Backbone.Router.extend({
   
   routes: {
    'pets': 'petsList',
    'pets/new': 'newPet',
    'pets/added': 'petSaved',
    'pets/:pet': 'editPet'
   },
   
   initialize: function (application)
   {
    this.application = application;
   },
   
   petsList: function (params)
   {
    console.log('bb1.PetshopShopping.Pets.Router');
    var options = null;

    if (params)
    {
     options = SC.Utils.parseUrlOptions(params);
    }
    
    var self = this,
        application = this.application,
        model = new PetsModel(),
        collection = new PetsCollection(),
        view = new PetsListView({
         model: model,
         application: this.application,
         urlOptions: options
        });

    model.fetch({
     data: _.extend({}, options),
     killerId: this.application.killerId
    }).then(function (data) {
     collection.set(data.pets);
     model.set({pets: collection});
     view.showContent().then(function (view) {});
    });
   },

   editPet: function (petId)
   {
    var self = this,
        model = new PetsModel(),
        view = new PetsFormView({
         application: this.application,
         model: model
        });

    model.fetch({
     data: {internalid: petId},
     killerId: this.application.killerId
    }).then(function (model, response, options) {
     view.page_header = _('Edit Your Pet').translate();
     view.title = _('Edit Your Pet').translate();
     view.menuItem = 'pet_list';
     view.model.on('reset destroy change add', function () {
      if (view.model.get('deceased') || view.model.get('skipnextorder') || view.model.get('placeorder')) return;
      if (self.inModal && self.$containerModal)
      {
       self.$containerModal.modal('hide');
       self.destroy();
       var formSubmittedView = new PetsFormSubmittedView({
        application: self.application
       });
       formSubmittedView.showInModal();
      }
      else
      {
       self.application.getLayout().once('afterAppendView', function (view) {
        var message = _('Your pet has been updated.').translate(),
            messageView = new GlobalViewsMessageView({message: message, closable: true, type: "success"});
        messageView.render();
        view.$('[data-type="alert-placeholder"]').empty().append(messageView.$el);
       });
       Backbone.history.navigate('pets', {trigger: true});
      }
     }, view);
     view.showContent();
    });
   },
   
   newPet: function ()
   {
    var self = this,
        model = new PetsModel(),
        view = new PetsFormView({
         application: this.application,
         model: new PetsModel()
        });

    view.model.on('reset destroy change add', function () {
     if (self.inModal && self.$containerModal)
     {
      self.$containerModal.modal('hide');
      self.destroy();
      var formSubmittedView = new PetsFormSubmittedView({
       application: self.application
      });
      formSubmittedView.showInModal();
     }
     else
     {
      self.application.getLayout().once('afterAppendView', function (view) {
       var message = _('Your pet has been created.').translate(),
           messageView = new GlobalViewsMessageView({message: message, closable: true, type: "success"});
       messageView.render();
       view.$('[data-type="alert-placeholder"]').empty().append(messageView.$el);
      });
      Backbone.history.navigate('#pets', {trigger: true});
     }
    }, view);
    view.showContent();
   },
   
   petSaved: function (url)
   {
    var view = new PetsFormSubmittedView({
         application: this.application
        });

    view.showContent();
   }
   
  });
 }
);

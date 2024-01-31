// @module bb1.PetshopShopping.SubscriptionOrders
define(
 'bb1.PetshopShopping.SubscriptionOrders.Router',
 [
  'bb1.PetshopShopping.SubscriptionOrders.List.View',
  'bb1.PetshopShopping.SubscriptionOrders.Form.View',
  'bb1.PetshopShopping.SubscriptionOrders.FormSubmitted.View',
  'bb1.PetshopShopping.SubscriptionOrders.Details.View',
  'bb1.PetshopShopping.SubscriptionOrders.Model',
  'bb1.PetshopShopping.SubscriptionOrders.Collection',
  'GlobalViews.Message.View',
  'Item.Model',
  
  'Backbone',
  'underscore'
 ],
 function (
  SubscriptionOrdersListView,
  SubscriptionOrdersFormView,
  SubscriptionOrdersFormSubmittedView,
  SubscriptionOrdersDetailsView,
  SubscriptionOrdersModel,
  SubscriptionOrdersCollection,
  GlobalViewsMessageView,
  ItemModel,
  
  Backbone,
  _
 )
 {
  'use strict';
  
  // Adds routes to the application
  return Backbone.Router.extend({
   
   routes: {
    'subscription-orders': 'subscriptionOrderList',
    'subscription-orders/saved': 'subscriptionOrderSaved',
    'subscription-orders/new': 'newSubscriptionOrder',
    'subscription-orders/new?:options': 'newSubscriptionOrder',
    'subscription-orders/edit/:itemid': 'editSubscriptionOrder',
    'subscription-orders/edit/:itemid?:options': 'editSubscriptionOrder',
    'subscription-orders/view/:itemid': 'viewSubscriptionOrder'
   },
   
   initialize: function (application)
   {
    this.application = application;
   },
   
   subscriptionOrderList: function (params)
   {
    var options = null;

    if (params)
    {
     options = SC.Utils.parseUrlOptions(params);
    }
    
    var self = this,
        application = this.application,
        collection = new SubscriptionOrdersCollection(),
        view = new SubscriptionOrdersListView({
         collection: collection,
         application: this.application,
         urlOptions: options
        });

    collection.fetch({
     data: _.extend({}, options),
     killerId: this.application.killerId
    }).then(function (data) {
     view.showContent();
    });
   },

   newSubscriptionOrder: function (options)
   {
    var self = this,
        layout = self.application.getLayout(),
        urlOptions = _.parseUrlOptions(options) || {},
        model = new SubscriptionOrdersModel(),
        view = new SubscriptionOrdersFormView({
         application: this.application,
         model: model
        });
        
        console.log(urlOptions);

    if (urlOptions.item) {
     
     console.log('setting');
     model.set({'item': urlOptions.item});//, {silent: true});
     //model.set({'itemname': urlOptions.item});//, {silent: true});
    
     var itemModel = new ItemModel();
     
     var promise = itemModel.fetch({
      data: {id: urlOptions.item},
      killerId: this.application.killerId
     })
     
     layout.once('afterAppendView', function(view) {
      promise.done(function (response) {
       if (response && response.items && response.items.length) {
        view.$('.subscriptionorder-form-itemsearcher .tt-input').val(response.items[0].storedisplayname2);
       }
      });
     });
     
    }
    
    view.model.on('reset destroy change add', function () {
     if (self.inModal && self.$containerModal)
     {
      self.$containerModal.modal('hide');
      self.destroy();
      var formSubmittedView = new SubscriptionOrdersFormSubmittedView({
       application: self.application
      });
      formSubmittedView.showInModal();
     }
     else
     {
      layout.once('afterAppendView', function (view) {
       var message = _('Your bottomless bowl item has been created.').translate(),
           messageView = new GlobalViewsMessageView({message: message, closable: true, type: "success"});
       messageView.render();
       view.$('[data-type="alert-placeholder"]').empty().append(messageView.$el);
      });
      Backbone.history.navigate('subscription-orders', {trigger: true});
     }
    }, view);
    
    view.showContent().done(function() {
    });

   },
   
   editSubscriptionOrder: function (itemid, options)
   {
    var self = this,
        urlOptions = _.parseUrlOptions(options) || {},
        model = new SubscriptionOrdersModel(),
        view = new SubscriptionOrdersFormView({
         application: this.application,
         model: model
        });
        
        console.log(urlOptions);
        
    model.fetch({
     data: {internalid: itemid},
     killerId: this.application.killerId
    }).then(function () {
     
     if (urlOptions.isinactive) {
      console.log('setting');
      model.set({'isinactive': urlOptions.isinactive == 'yes'});//, {silent: true});
     }
     
     view.model.on('reset destroy change add', function () {
      if (view.model.get('skipnextorder') || view.model.get('placeorder')) return;
      
      if (self.inModal && self.$containerModal)
      {
       self.$containerModal.modal('hide');
       self.destroy();
       var formSubmittedView = new SubscriptionOrdersFormSubmittedView({
        application: self.application
       });
       formSubmittedView.showInModal();
      }
      else
      {
       self.application.getLayout().once('afterAppendView', function (view) {
        var message = _('Your subscription order has been updated.').translate(),
            messageView = new GlobalViewsMessageView({message: message, closable: true, type: "success"});
        messageView.render();
        view.$('[data-type="alert-placeholder"]').empty().append(messageView.$el);
       });
       Backbone.history.navigate('subscription-orders', {trigger: true});
      }
     }, view);
     view.showContent().done(function() {
      if (urlOptions.isinactive) {
       console.log('setting');
       //this.$('[name="isinactive"]').prop('checked', urlOptions.isinactive == 'yes');
      }
     });
    });
   },
   
   viewSubscriptionOrder: function (itemid)
   {
    var self = this,
        model = new SubscriptionOrdersModel(),
        view = new SubscriptionOrdersDetailsView({
         application: this.application,
         model: model
        });

    model.fetch({
     data: {internalid: itemid},
     killerId: this.application.killerId
    }).then(function (model, response, options) {
     view.showContent();
    });
   },
   
   subscriptionOrderSaved: function ()
   {
    var view = new SubscriptionOrdersFormSubmittedView({
         application: this.application
        });

    view.showContent();
   }
   
  });
  
 }
);

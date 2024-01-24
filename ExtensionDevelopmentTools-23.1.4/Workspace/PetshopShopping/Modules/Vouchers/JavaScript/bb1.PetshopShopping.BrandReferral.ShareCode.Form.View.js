// @module bb1.PetshopShopping.BrandReferral
define(
 'bb1.PetshopShopping.BrandReferral.ShareCode.Form.View',
 [
  'bb1.PetshopShopping.BrandReferral.ShareCode.Model',
  'GlobalViews.Message.View',
  
  'bb1_petshopshopping_brandreferral_sharecode_form.tpl',
  
  'Backbone.FormView',
  'Backbone',
  'underscore',
  'jQuery'
 ],
 function (
  BrandReferralShareCodeModel,
  GlobalViewsMessageView,
  
  bb1_petshopshopping_brandreferral_sharecode_form_tpl,
  
  BackboneFormView,
  Backbone,
  _,
  jQuery
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_brandreferral_sharecode_form_tpl,

   title: _('Referral Share Code').translate(),

   page_header: _('Referral Share Code').translate(),

   attributes: {
    'id': 'brand-referral-share-code-form-view',
   	'class': 'brand-referral-share-code-form-view'
   },

   events:
   {
    'submit form': 'saveForm',
    'click [data-action="reset"]': 'resetForm',
    'change [name="firstname"]': 'updateMessage',
    'change [name="email"]': 'updateMessage'
   },
   
   initialize: function (options)
   {
    this.application = options.application;
    this.model = new BrandReferralShareCodeModel();
    
    this.model.on('save', _.bind(this.showSuccess, this));
    BackboneFormView.add(this);
   },
   
   /*getBreadcrumbPages: function ()
   {
    var model = this.model,
        //programmeName = model.get('breederprogrammename'),
        programmeName = (model.get('programmes') || [{}]).at(0).get('name'),
        urlComponent = (model.get('programmes') || [{}]).at(0).get('urlComponent');
        
    return [
     {
      text: programmeName ? programmeName + ' ' + this.page_header : this.page_header,
      href: '/referral-share-code'
     }
    ];
   },*/
   
   showSuccess: function()
   {
    var firstname = this.model.get('firstname'),
        brand = this.model.get('brand') || {},
        message = _('Your $(0) share code was sent to $(1).').translate(brand.name || '', firstname),
        messageView = new GlobalViewsMessageView({message: message, closable: true, type: "success"}),
        layout = this.application.getLayout();
        
    messageView.render();
    
    layout.$containerModal && layout.$containerModal.modal('hide');
    this.destroy();
       
    layout.currentView.$('[data-type="alert-placeholder"]').empty().append(messageView.$el);
    //jQuery(document).scrollTop(0);
    jQuery('html, body').animate({scrollTop: 0}, 300);
   },
   
   saveForm: function (e, model, props)
   {
    console.log('test2222');
    e.preventDefault();
    
    console.log('saveFor');
    console.log(e);

    var self = this;
    var promise = Backbone.View.prototype.saveForm.apply(this, arguments);
    
    if (!promise) {
     self.$savingForm.find('*[type=submit]').attr('disabled', false);
    }
    
    return promise;
   },
   
   resetForm: function (e)
   {
    e.preventDefault();
    this.showContent();
   },
   
   beforeShowContent: function beforeShowContent()
   {
    var self = this,
        promise = jQuery.Deferred(),
        shareCodeId = this.options.shareCodeId;

    this.model.fetch({
     data: {
      internalid: shareCodeId
     }
    }).done(function() {
     promise.resolve();
    });
    
    return promise;
   },

   showContent: function(dont_scroll) {
    var application = this.options.application || this.options.container;
    var layout = application && application.getLayout();
    var brand = this.model.get('brand') || {};
    
    this.title = brand.name ? brand.name + ' ' + this.title : this.title;
    this.page_header = brand.name ? brand.name + ' ' + this.page_header : this.page_header;
     
			 return layout&& layout.showContent(this, dont_scroll).done(jQuery.proxy(this, 'afterShowContent'));
   },
   
   showInModal: function() {
    var self = this;
    var promise = jQuery.Deferred();
    var application = this.options.application || this.options.container;
    var layout = application && application.getLayout();
    
    this.beforeShowContent().done(function() {
     var brand = self.model.get('brand') || {};
    
     self.title = brand.name ? brand.name + ' ' + self.title : self.title;
     self.page_header = brand.name ? brand.name + ' ' + self.page_header : self.page_header;
     //self.showInModal();
     layout && layout.showInModal(self).done(jQuery.proxy(self, 'afterShowContent'));
     promise.resolveWith(layout, [self]);
    });
    
			 return promise;
   },
   
   afterShowContent: function() {},
   
   updateMessage: function() {
    var message = this.model.get('refereePromoMessage') || '',
        refereeFirstName = this.$('[name="firstname"]').val(),
        refereeEmail = this.$('[name="email"]').val();
        
    if (message) {
     message = message.replace(/{{firstname}}/gi, refereeFirstName);
     message = message.replace(/{{email}}/gi, refereeEmail);
    }
    
    this.$('.brand-referral-share-code-form-message').html(message);
   },
   
   getContext: function ()
   {
    var options = this.options || {},
        model = this.model,
        brand = model.get('brand') || {},
        message = model.get('refereePromoMessage') || '';
        
    if (message) {
     message = message.replace(/{{firstname}}/gi, '');
     message = message.replace(/{{email}}/gi, '');
    }
    
    //@class bb1.PetshopShopping.BrandReferral.ShareCode.Form.View.Context
    return {
     //@property {String} pageHeader
     pageHeader: brand.name ? brand.name + ' ' + this.page_header : this.page_header,
     //@property {boolean} isInModal
     isInModal: this.inModal,
     //@property {Backbone.Model} model
     model: model,
     //@property {string} message
     message: message
    };
   }
   
  });

 }
);

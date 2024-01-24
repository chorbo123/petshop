// @module bb1.PetshopShopping.Pets
define(
 'bb1.PetshopShopping.Breeders.LitterForm.View',
 [
  'bb1.PetshopShopping.Breeders.PetParentForm.View',
  'bb1.PetshopShopping.Breeders.LitterList.View',
  'bb1.PetshopShopping.Breeders.Litter.Model',
  'bb1.PetshopShopping.Breeders.PetParent.Collection',
  'GlobalViews.Message.View',
  
  'bb1_petshopshopping_breeders_litter_form.tpl',
  
  'Backbone.FormView',
  'Backbone.CompositeView',
  'Backbone',
  'underscore',
  'Handlebars'
 ],
 function (
  BreedersPetParentFormView,
  BreedersLitterListView,
  BreedersLitterModel,
  PetParentCollection,
  GlobalViewsMessageView,
  
  bb1_petshopshopping_breeders_litter_form_tpl,
  
  BackboneFormView,
  BackboneCompositeView,
  Backbone,
  _,
  Handlebars
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_breeders_litter_form_tpl,
   
   page_header: _('Add a New Litter & Pet Parents').translate(),
   
   title: _('Add a New Litter & Pet Parents').translate(),
   
   attributes: { 'class': 'LitterFormView' },
   
   events: {
    'submit form': 'saveForm',
    'click [data-action="reset"]': 'resetForm',
    'change [name="numberofanimals"]': 'updatePetParentForm',
    'change [name="email"]': 'updatePetParentModel',
    'change [name="firstname"]': 'updatePetParentModel'
   },

   bindings: {
    '[name="numberofanimals"]': 'numberofanimals',
   	'[name="litterdob"]': 'litterdob'
   },
   
   initialize: function (options)
   {
    var self = this;
    this.application = options.application;
    this.model = new BreedersLitterModel();
    
    //var petParents = new PetParentCollection();
    //this.model.set('petparents', petParents);
    
    //var petParents = new Backbone.Collection([{}]);
    this.model.set('numberofanimals', 1);
    //this.model.set('petparents', petParents);
    
    this.model.on('validated', function(isValid, model, errors) {
      model.get('petparents').each(function(petparent) {
       petparent.validate();
      });
    });
    
    this.model.on('save', _.bind(this.showSuccess, this));
    
    BackboneCompositeView.add(this);
    //Backbone.Validation.bind(this);
    BackboneFormView.add(this);
   },

   childViews: {
    
    'PetParents.Form': function() {
     return new BreedersPetParentFormView(
     {
      application: this.application,
      model: this.model
     });
    }
    
   },
   
   showSuccess: function()
   {
    var urlComponent = this.options.routerArguments[0];
    console.log('showSuccess');
    this.application.getLayout().once('afterAppendView', function (view) {
     var message = _('Successfully added your new litter to the breeder programme.').translate(),
         messageView = new GlobalViewsMessageView({message: message, closable: true, type: "success"});
         
     messageView.render();
     view.$('[data-type="alert-placeholder"]').empty().append(messageView.$el);
    });
    Backbone.history.navigate('breeder-programmes/' + urlComponent, {trigger: true});
   },
   
   beforeShowContent: function()
   {
    var self = this,
        promise = jQuery.Deferred(),
        programmeId = this.options.routerArguments[0];

    this.model.fetch({
     data: {
      id: programmeId
     }
    }).done(function(response) {
     console.log('beforeShowContent done');
     console.log(arguments);
     
     self.menuItem = 'breeder_' + self.model.get('applicationid');
     
     //self.model.clear();
     //self.model.set('applicationid', response.applicationid);
     self.model.set('numberofanimals', 1);
     
     promise.resolve();
    });
    
    return promise;
   },

   showContent: function ()
   {
    var programmeId = this.options.routerArguments[0],
        paths = [
                 {
                  text: BreedersLitterListView.prototype.page_header,
                  href: '/breeder-programmes'
                 },
                 {
                  text: this.page_header,
                  href: '/breeder-programmes/' + programmeId + '/new'
                 }
                ];

    return this.application.getLayout().showContent(this, this.menuItem, paths).done(_.bind(this.afterShowContent, this));
   },
   
   afterShowContent: function ()
   {
    this.$('[name="litterdob"]').datepicker({
     format: 'd/m/yyyy'
    }).on('changeDate', function(e) {
     //self.model.validate();
     //jQuery(this).datepicker('update');
    });
   },
   
   saveForm: function (e, model, props)
   {
    e.preventDefault();

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
   
   updatePetParentForm: function (e)
   {
    var numberOfAnimals = parseInt(this.$('[name="numberofanimals"]').val(), 10);
    
    this.model.set('numberofanimals', numberOfAnimals);
    this.renderChild('PetParents.Form');
   },
   
   updatePetParentModel: function (e)
   {
    var $target = jQuery(e.target),
        $containingRow = $target.closest('[data-id]'),
        petParentId = $containingRow.data('id'),
        petParentModels = this.model.get('petparents'),
        petParentModel = petParentModels.get(petParentId),
        petParentEmail = $containingRow.find('[name="email"]').val(),
        petParentFirstName = $containingRow.find('[name="firstname"]').val();
        
    console.log('petParentId');
    console.log(petParentId);
    console.log('petParentEmail');
    console.log(petParentEmail);
    console.log('petParentFirstName');
    console.log(petParentFirstName);
    
    petParentModel.set('email', petParentEmail);
    petParentModel.set('firstname', petParentFirstName);
    
    console.log('validate');
    console.log(petParentModel.validate());
   },
   
   getContext: function ()
   {
    var options = this.options || {},
        model = this.model,
        cmsSectionId = 'breeders_form_cms_area_top_' + this.options.routerArguments[0].toLowerCase().replace(/-/g, '_');
    
    //@class Address.List.View.Context
    return {
     //@property {String} pageHeader
     pageHeader: this.page_header,
     //@property {String} cmsSectionId
     cmsSectionId: cmsSectionId,
     //@property {Backbone.Model} pet
     litter: model,
     //@property {Boolean} inModal
     isInModal: this.inModal
    };
   }
   
  });

 }
);

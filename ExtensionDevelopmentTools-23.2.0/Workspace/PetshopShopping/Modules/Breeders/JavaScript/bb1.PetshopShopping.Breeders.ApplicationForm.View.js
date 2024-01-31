// @module bb1.PetshopShopping.Breeders
define(
 'bb1.PetshopShopping.Breeders.ApplicationForm.View',
 [
  'bb1.PetshopShopping.Breeders.ApplicationFormSubmitted.View',
  'bb1.PetshopShopping.Breeders.Programme.Model',
  'bb1.PetshopShopping.Breeders.Programme.Collection',
  'bb1.PetshopShopping.Breeders.Header.View',
  
  'bb1_petshopshopping_breeders_application_form.tpl',
  
  'Backbone.FormView',
  'Backbone',
  'underscore',
  'jQuery'
 ],
 function (
  BreedersApplicationFormSubmittedView,
  BreedersProgrammeModel,
  BreedersProgrammeCollection,
  BreedersHeaderView,
  
  bb1_petshopshopping_breeders_application_form_tpl,
  
  BackboneFormView,
  Backbone,
  _,
  jQuery
 )
 {
  'use strict';

  return Backbone.View.extend({

   template: bb1_petshopshopping_breeders_application_form_tpl,

   title: _('Breeders Programme').translate(),

   page_header: _('Breeders Programme').translate(),

   attributes: {
    'id': 'breeders-form-view',
   	'class': 'breeders-form-view'
   },

   events:
   {
    'submit form': 'saveForm',
    'click [data-action="reset"]': 'resetForm',
    'change [name="breedertype"]': 'updateBreederType',
    'change [name="animaltype"]': 'updateAnimalType',
    'change [name="advertisingchannels"]': 'updateAdvertisingChannels',
    'change [name="breeds"]': 'updateBreeds'
    //'change [name="breederwebsite"]': 'validateWebsiteUrl'
   },
   
   bindings: {
    '[name="breedertype"]': 'breedertype',
   	'[name="email"]': 'email'
   },
   
   initialize: function (options)
   {
    this.application = options.application;
    this.model = new BreedersProgrammeModel();
    
    console.log('options.routerArguments');
    console.log(options.routerArguments);
    
    if (this.model.isNew())
     this.model.set('breedertype', '1');
    
    this.model.on('save', _.bind(this.showSuccess, this));
    //this.model.on('sync', jQuery.proxy(this, 'showSuccess'));
    //this.model.on('change:breedertype', jQuery.proxy(this, 'updateBreederType'));
    //Backbone.Validation.bind(this);
    BackboneFormView.add(this);
   },
   
   getBreadcrumbPages: function ()
   {
    var model = this.model,
        //programmeName = model.get('breederprogrammename'),
        programmeName = (model.get('programmes') || [{}]).at(0).get('name'),
        urlComponent = (model.get('programmes') || [{}]).at(0).get('urlComponent');
        
    return [
     {
      text: programmeName ? programmeName + ' ' + this.page_header : this.page_header,
      href: '/Breeders'
     }
    ];
   },
   
   showSuccess: function()
   {
    var view = new BreedersApplicationFormSubmittedView({
     application: this.application,
     model: this.model
    });
    
    view.showContent();
    //Backbone.history.navigate('Breeders-Application-Submitted', {trigger: true});
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
        programmeId = this.options.routerArguments[0];

    this.model.fetch({
     data: {
      id: programmeId
     }
    }).done(function() {
     //var breederProgrammes = self.model.get('programmes') || [];
     //var breederProgrammeId = breederProgrammes.length && breederProgrammes[0].internalId;
     
     //console.log('breederProgrammeId');
     //console.log(breederProgrammeId);
     
     //self.model.set('breederprogramme', breederProgrammeId);
     
     promise.resolve();
    });
    
    return promise;
   },

   getHeaderView: function() {
    return BreedersHeaderView;
   },
   
   showContent: function(dont_scroll) {
    var application = this.options.application || this.options.container;
    var layout = application && application.getLayout();
    
			 return layout&& layout.showContent(this, dont_scroll).done(jQuery.proxy(this, 'afterShowContent'));
   },
   
   afterShowContent: function() {
    //this.$('[name="breedertype"]')[0].click();
    //this.$('[name="breedertype"]')[0].click();
    
    this.updateBreederType();
    this.updateAnimalType();
    this.setupMultiSelects();
    this.updateAdvertisingChannels();
    this.updateBreeds();
   },
   
   setupMultiSelects: function ()
   {
    this.$('#breeds, #advertisingchannels').multiselect({
     maxHeight: 310,
     widthSynchronizationMode: 'always'
    });
   },
   
   destroy: function() {
    console.log('destroy');
    var application = this.options.application || this.options.container;
    var layout = application && application.getLayout();
    
    layout.headerView = layout.originalHeaderView;
    //layout && layout.updateHeader();
    
    //layout.rendered = false;
    //layout.headerViewInstance = null;
    layout.render();
   },
   
   
   updateBreederType: function(e) {
    //this.model.isValid();
    
    var breederTypeId = this.$('[name="breedertype"]:checked').val(); //e && jQuery(e.target).val() || '1'; //this.model.get('breedertype') || '1';
    
    this.$('[name="breederregistrationnumber"],[name="kennelname"],[name="breedername"],[name="rescuecentrename"],[name="regcharitynumber"],[name="animaltype"],[name="numberoflittersperyear"],[name="numberofanimalsrehomedperyear"]').closest('[data-validation="control-group"]').hide();
    
    console.log(breederTypeId);
    switch (breederTypeId) {
     case '1':
      this.$('[name="breederregistrationnumber"],[name="kennelname"],[name="animaltype"],[name="numberoflittersperyear"]').closest('[data-validation="control-group"]').show();
      break;
     case '2':
      this.$('[name="breedername"],[name="animaltype"],[name="numberoflittersperyear"]').closest('[data-validation="control-group"]').show();
      break;
     case '3':
      this.$('[name="rescuecentrename"],[name="regcharitynumber"],[name="numberofanimalsrehomedperyear"]').closest('[data-validation="control-group"]').show();
      break;
    }
   },
   
   updateAnimalType: function(e) {
    var animalTypeId = this.$('[name="animaltype"]').val(); //e && jQuery(e.target).val() || '1'; //this.model.get('breedertype') || '1';
    
    console.log(animalTypeId);
    
    this.$('[name="numberofanimals"],[name="numberofcats"],[name="numberofmaledogs"],[name="numberoffemaledogs"]').closest('[data-validation="control-group"]').hide();
    
    if (!animalTypeId) return;
    
    switch (animalTypeId) {
     case '2':
      this.$('[name="numberofcats"]').closest('[data-validation="control-group"]').show();
      break;
     case '1':
      this.$('[name="numberofmaledogs"],[name="numberoffemaledogs"]').closest('[data-validation="control-group"]').show();
      break;
     default:
      this.$('[name="numberofanimals"]').closest('[data-validation="control-group"]').show();
    }
   },
   
   updateAdvertisingChannels: function(e) {
    var advertisingChannels = this.$('[name="advertisingchannels"]').val();
    
    console.log(advertisingChannels);
    
    if (advertisingChannels.indexOf('other') != -1)
     this.$('[name="advertisingchannelsother"]').closest('[data-validation="control-group"]').show();
    else
     this.$('[name="advertisingchannelsother"]').closest('[data-validation="control-group"]').hide();
   },
   
   updateBreeds: function(e) {
    var breeds = this.$('[name="breeds"]').val();
    
    console.log(breeds);
    
    if (breeds.indexOf('other') != -1)
     this.$('[name="breedsother"]').closest('[data-validation="control-group"]').show();
    else
     this.$('[name="breedsother"]').closest('[data-validation="control-group"]').hide();
   },
   
   validateWebsiteUrl: function(e) {
    var $breederWebsite = jQuery(e.target),
        websiteUrl = $breederWebsite.val();
    
    console.log(websiteUrl);
    
    if (!/^https?:\/\//i.test(websiteUrl))
     $breederWebsite.val('http://' + websiteUrl);
   },
   
   getContext: function ()
   {
    var options = this.options || {},
        model = this.model,
        //programmeName = model.get('breederprogrammename'),
        programmeName = (model.get('programmes') || new BreedersProgrammeCollection([{}])).at(0).get('name'),
        cmsSectionId = 'breeders_form_cms_area_top_' + this.options.routerArguments[0].toLowerCase().replace(/-/g, '_'),
        titles = model.get('titles'),
        animalTypes = model.get('animalTypes'),
        animalBreeds = model.get('animalBreeds'),
        advertisingChannels = model.get('advertisingChannels'),
        leadSources = model.get('leadSources'),
        numberOfLittersPerYear = _.map(_.range(1, 1001), function(num) { return {internalId: num, name: num}; }),
        numberOfAnimalsRehomedPerYear = _.map(_.range(1, 1001), function(num) { return {internalId: num, name: num}; }),
        numberOfAnimals = _.map(_.range(1, 1001), function(num) { return {internalId: num, name: num}; }),
        numberOfCats = _.map(_.range(1, 1001), function(num) { return {internalId: num, name: num}; }),
        numberOfMaleDogs = _.map(_.range(0, 1001), function(num) { return {internalId: num, name: num}; }),
        numberOfFemaleDogs = _.map(_.range(0, 1001), function(num) { return {internalId: num, name: num}; });
        
    //@class bb1.PetshopShopping.Breeders.Form.View.Context
    return {
     //@property {String} pageHeader
     pageHeader: programmeName ? programmeName + ' ' + this.page_header : this.page_header,
     //@property {Backbone.Model} model
     model: model,
     //@property {String} cmsSectionId
     cmsSectionId: cmsSectionId,
     //@property {Boolean} inModal
     isInModal: false,
     //@property {Array} titles
     titles: titles,
     //@property {Array} animalTypes
     animalTypes: animalTypes,
     //@property {Array} animalBreeds
     animalBreeds: animalBreeds,
     //@property {Array} advertisingChannels
     advertisingChannels: advertisingChannels,
     //@property {Array} leadSources
     leadSources: leadSources,
     //@property {Array} numberOfLittersPerYear
     numberOfLittersPerYear: numberOfLittersPerYear,
     //@property {Array} numberOfAnimalsRehomedPerYear
     numberOfAnimalsRehomedPerYear: numberOfAnimalsRehomedPerYear,
     //@property {Array} numberOfAnimals
     numberOfAnimals: numberOfAnimals,
     //@property {Array} numberOfCats
     numberOfCats: numberOfCats,
     //@property {Array} numberOfMaleDogs
     numberOfMaleDogs: numberOfMaleDogs,
     //@property {Array} numberOfFemleDogs
     numberOfFemaleDogs: numberOfFemaleDogs
    };
   }
   
  });

 }
);

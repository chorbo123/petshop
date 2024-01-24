// @module bb1.PetshopShopping.Breeders
define(
 'bb1.PetshopShopping.Breeders.Header.View',
 [
  'Header.View',
  
  'Backbone',
  'underscore',
  'jQuery'
 ],
 function (
  HeaderView,
  
  Backbone,
  _,
  jQuery
 )
 {
  'use strict';

  return HeaderView.extend({

   //template: bb1_petshopshopping_breeders_application_form_tpl,
   
   //childViews: _.extend({}, HeaderView.prototype.childViews, {
   // 'Header.Menu': undefined
   //}),
   
   initialize: function(options) {
    //delete this.childViews['Header.Menu'];
    HeaderView.prototype.initialize.apply(arguments);
    
    console.log(this);
    console.log(this.childViewInstances['Header.Menu']['Header.Menu']);
    this.removeChildViewInstance('Header.Menu', 'Header.Menu', true);
    console.log(this.childViewInstances['Header.Menu']['Header.Menu']);
    
    //delete this.childViewInstances['Header.Menu']['Header.Menu'];
   }/*,

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

   showContent: function(dont_scroll) {
    var application = this.options.application || this.options.container;

			 return application && application.getLayout().showContent(this, dont_scroll).done(jQuery.proxy(this, 'afterShowContent'));
   },
   
   afterShowContent: function() {
    //this.$('[name="breedertype"]')[0].click();
    //this.$('[name="breedertype"]')[0].click();
    
    this.updateBreederType();
    this.updateAnimalType();
   }*/
   
  });

 }
);

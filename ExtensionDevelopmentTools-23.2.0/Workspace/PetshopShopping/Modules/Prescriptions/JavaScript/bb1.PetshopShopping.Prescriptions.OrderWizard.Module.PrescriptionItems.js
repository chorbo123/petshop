// @module bb1.PetshopShopping.Prescriptions
define('bb1.PetshopShopping.Prescriptions.OrderWizard.Module.PrescriptionItems',
 [
  'Wizard.Module',
  'bb1.PetshopShopping.Pets.Form.View',
  'bb1.PetshopShopping.Pets.Dropdown.View',
  'bb1.PetshopShopping.Pets.Model',
  'bb1.PetshopShopping.Pets.Collection',
  'bb1.PetshopShopping.Prescriptions.Order.Model',
  'bb1.PetshopShopping.Prescriptions.Item.Model',
  'bb1.PetshopShopping.Prescriptions.Item.Collection',
  'GlobalViews.Message.View',
  'Profile.Model',
  
  'bb1_order_wizard_prescriptionitems_module.tpl',
  
  'Backbone.CompositeView',
  'Backbone',
  'underscore'
 ],
 function (
  WizardModule,
  PetsFormView,
  PetsDropdownView,
  PetsModel,
  PetsCollection,
  PrescriptionOrderModel,
  PrescriptionItemModel,
  PrescriptionItemCollection,
  GlobalViewsMessageView,
  ProfileModel,
  
  bb1_order_wizard_prescriptionitems_module_tpl,
  
  BackboneCompositeView,
  Backbone,
  _
 )
 {
  'use strict';

  return WizardModule.extend({

   daysToShip: 4,
   
   template: bb1_order_wizard_prescriptionitems_module_tpl,

   events: {
    'change select[name="pet"]': 'changePetOptions',
    'click input[name="treatmentstartdateautocalc"]': 'showTreatmentStartDate',
    'submit form': 'saveForm'
   },

   initialize: function(options)
   {
    WizardModule.prototype.initialize.apply(this, arguments);
    this.application = this.wizard.application;
    this.currentPrescriptionItemIndex = 0;
    BackboneCompositeView.add(this);
    //Backbone.Validation.bind(this);
   },
   
   saveForm: function (e, model, props)
   {
    e.preventDefault();

    var self = this,
        parentModel = this.model;
    
    var promise = Backbone.View.prototype.saveForm.apply(this, arguments);
    
    if (promise) {
     promise.done(function(data) {
      var prescriptionItems = self.prescriptionOrder.get('prescriptionItems');
      
      var updatedPet = self.prescriptionOrder.get('pets').get(data.pet),
          treatmentsAllocated = parseInt(self.model.get('treatmentsallocated')) || 0,
          totalAllocated = parseInt(self.model.get('totalallocated')) || 0,
          totalTreatments = parseInt(self.model.get('totaltreatments')) || 1;
          
      totalAllocated += parseInt(data.treatmentsallocated);
      
      self.model.set('totalallocated', totalAllocated);
      updatedPet.set('weight_kg', data.petweight);
     
      switch (data.treatmenttype) {
       case '1':
        updatedPet.set('nextwormingreminder', data.nextwormingreminder);
        break;
       case '2':
        updatedPet.set('nextfleareminder', data.nextfleareminder);
        break;
      }
      
      self.successMessage = _('You successfully updated the treatment details for \'$(0)\'.').translate(self.model.get('itemname'));
      
      if (totalAllocated < totalTreatments) {
       self.successMessage += _('<br /><br />There are more treatments leftover for this item. Please allocate the remaining items to another pet below.').translate();
      }
      else if (self.currentPrescriptionItemIndex < prescriptionItems.models.length-1) {
       self.successMessage += _('<br /><br />You have more prescription items to enter details for. Please continue updating the details for the remaining items below.').translate();
       self.model = prescriptionItems.at(++self.currentPrescriptionItemIndex);
      }
      else {
       self.model = null;
      }
      
      Backbone.Validation.bind(self);
      
      self._render();
      
      setTimeout(function() {
       self.$('.alert-success').fadeOut('slow');
      }, 5000);
      
     });
    }
    else {
     self.$savingForm.find('*[type=submit]').attr('disabled', false);
    }
    
    return promise;
   },

   changePetOptions: function (e)
   {
    var value = this.$(e.target).val();

    if (value === 'create') {
     this.createPet();
    }
    else if (value) {
     var pet = this.prescriptionOrder.get('pets').get(value);
     if (pet) {
      var treatmentType = this.model.get('treatmenttype'),
          weight = parseInt(pet.get('weight_kg') || pet.get('weight_text')) || '',
          dob = _.stringToDate(pet.get('dob'), {format: 'dd/MM/YYYY', dateSplitCharacter: '/'}),
          nextWormingReminder = _.stringToDate(pet.get('nextwormingreminder'), {format: 'dd/MM/YYYY', dateSplitCharacter: '/'}),
          nextFleaReminder = _.stringToDate(pet.get('nextfleareminder'), {format: 'dd/MM/YYYY', dateSplitCharacter: '/'}),
          today = new Date(),
          shippingDate = new Date(),
          age = parseInt(new Date(today.getTime() - dob.getTime()).getFullYear() - 1970) || '',
          nextReminderDate;
          
      shippingDate.setDate(shippingDate.getDate() + this.daysToShip);
      
      if (treatmentType == '1')
       nextReminderDate = nextWormingReminder && this.dateToString(nextWormingReminder.getTime() > today.getTime() ? nextWormingReminder : shippingDate) || '';
      else if (treatmentType == '2')
       nextReminderDate = nextFleaReminder && this.dateToString(nextFleaReminder.getTime() > today.getTime() ? nextFleaReminder : shippingDate) || '';
       
      this.$('input[name="petweight"]').val(weight);
      this.$('input[name="petage"]').val(age);
     }
    }
    else {
     this.$('input[name="petweight"]').val('');
     this.$('input[name="petage"]').val('');
    }
   },

   showTreatmentStartDate: function (e)
   {
    var $target = this.$(e.target),
        $treatmentStartDateDiv = this.$('[data-input="treatmentstartdate"]');

    if ($target.is(":checked")) {
     $treatmentStartDateDiv.hide();
     
     this.$('input[name="treatmentstartdate"]').val('');
    }
    else {
     $treatmentStartDateDiv.show();
     this.$('input[name="treatmentstartdate"]').val('');
    }
   },

  dateToString: function (date)
  {
   var month = ''+(date.getMonth()+1)
   ,	day = ''+ date.getDate();

   if (month.length === 1)
   {
    month = '0' + month;
   }

   return  day + '/' + month + '/' + date.getFullYear();
  },

   createPet: function ()
   {
    var self = this,
        view = new PetsFormView({
         application: this.application,
         model: new PetsModel()
        });

    view.model.on('change add', function (model, collection, options) {
     self.prescriptionOrder.set('pets', model.get('pets'));
     model.unset('pets', {silent: true});
     var pets = self.prescriptionOrder.get('pets') || [],
         newPetId = pets.reduce(function(memo, pet) { var id = parseInt(pet.get('internalid')); return memo > id ? memo : id; }, 0);
     var petsDropDownView = new PetsDropdownView({selectedPet: newPetId, pets: pets});
     petsDropDownView.render();
     self.$('[data-view="Pets.Dropdown"]').empty().append(petsDropDownView.$el).find('select').change();
     var message = _('Your pet has been created.').translate(),
         messageView = new GlobalViewsMessageView({message: message, type: "success", closable: true});
     messageView.render();
     self.$('[data-type="alert-placeholder"]').empty().append(messageView.$el);
    }, view);
    
    view.showInModal().done(function() {
     this.$containerModal.on('hidden.bs.modal', function () {
      if (self.$('[data-input="pet"] select').val() == 'create')
       self.$('[data-input="pet"] select').val('').change();
     });
    });
    
   },
   
   isActive: function ()
   {
    var userId = ProfileModel.getInstance().get('internalid'),
        currentStep = this.wizard.currentStep;
    
    return currentStep == 'confirmation' || (currentStep != 'confirmation' && userId == '80423');
   },
   
   render: function()
   {
    if (this.isActive())
    {
     var self = this,
         application = this.wizard.application,
         userId = ProfileModel.getInstance().get('internalid'),
         confirmation = this.model.get('confirmation'),
         orderId = confirmation && confirmation.get('internalid') || '';

     //console.log('userId: ' + userId);
     //console.log('this.wizard.currentStep: ' + this.wizard.currentStep);
     //console.log('orderId: ' + orderId);
     
     if (userId == '80423' && this.wizard.currentStep != 'confirmation') orderId = 1955635;
     
     this.prescriptionOrder = new PrescriptionOrderModel();
     
     this.prescriptionOrder.fetch({
      data: {orderid: orderId},
      killerId: application.killerId
     }).then(function (data) {
      
      self.model = self.prescriptionOrder.get('prescriptionItems').at(self.currentPrescriptionItemIndex);
      
      Backbone.Validation.bind(self);
      
      self._render();
     });
    
    }
   },
   
   showError: function ()
   {
    var messageView = new GlobalViewsMessageView({message: this.error.errorMessage, type: "error", closable: true});
    messageView.render();
    this.$('[data-type="alert-placeholder-module"]:first').html(messageView.$el);
   },
   
   childViews: {
    
    'Pets.Dropdown': function() {
     return new PetsDropdownView({
      application: this.application,
      pets: this.prescriptionOrder.get('pets') || new Backbone.Collection()
      //selectedPet: this.model ? this.model.get('pet') : new Backbone.Model()
     });
    }
    
   },
   
   getContext: function()
   {
    var model = this.model || new Backbone.Model(),
        prescriptionItems = this.prescriptionOrder.get('prescriptionItems') || new Backbone.Collection(),
        pets = this.prescriptionOrder.get('pets') || new Backbone.Collection(),
        selectedPet = model.get('pet') || new Backbone.Model(),
        treatmentType = model.get('treatmenttype'),
        pet = pets.get(selectedPet),
        totalAllocated = parseInt(model.get('totalallocated')) || 0,
        totalTreatments = parseInt(model.get('totaltreatments')) || 1,
        totalTreatmentsRemaining = totalTreatments - totalAllocated,
        treatmentStartDate = new Date();
    
    treatmentStartDate.setDate(treatmentStartDate.getDate() + this.daysToShip);
    
    // @class bb1.PetshopShopping.Prescriptions.OrderWizard.Module.TermsAndConditions.Context
    return {
     // @property {Backbone.Model} model
     model: model,
     // @property {Backbone.Collection} prescriptionItems
     prescriptionItems: prescriptionItems,
     // @property {Boolean} hasPrescriptionItems
     hasPrescriptionItems: prescriptionItems.models.length > 0,
     //@property {Backbone.collection} pets
     pets: pets,
     //@property {String} successMessage
     successMessage: this.successMessage || '',
     //@property {Number} totalTreatmentsRemaining
     totalTreatmentsRemaining: totalTreatmentsRemaining,
     //@property {Number} totalAllocated
     totalAllocated: totalAllocated,
     //@property {Number} totalTreatments
     totalTreatments: totalTreatments,
     //@property {Number} treatmentType
     treatmentType: treatmentType,
     //@property {Number} selectedPet
     selectedPet: selectedPet,
     //@property {Number} dosagePerItem
     dosagePerItem: parseFloat(model.get('dosageperitem'))/2,
     //@property {String} treatmentstartdate
     treatmentStartDate: this.dateToString(treatmentStartDate),
     //@property {String} petWeight
     petWeight: false && pet.get('weight_kg') || '',
     //@property {String} petAge
     petAge: false && pet.get('petage') || '',
     //@property {String} isNotPregnant
     isNotPregnant: false && model.get('isnotpregnant') === 'T',
     //@property {Boolean} moreItems
     moreItems: !!this.model,
     //@property {Boolean} lastItem
     lastItem: this.currentPrescriptionItemIndex < prescriptionItems.models.length-1,
     //@property {Boolean} isNewModel
     isNewModel: false
    };
   }
   
  });
  
 }
);

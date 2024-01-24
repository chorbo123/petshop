// @module bb1.PetshopShopping.Prescriptions
define('bb1.PetshopShopping.Prescriptions.OrderWizard.Module.PrescriptionItems.BeforeSubmit',
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
  'SC.Configuration',
  
  'bb1_order_wizard_prescriptionitems_module_v2.tpl',
  
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
  Configuration,
  
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
    this.cart = this.wizard.model;
    this.currentPrescriptionItemIndex = 0;
    BackboneCompositeView.add(this);
    //Backbone.Validation.bind(this);
   },
   
   //@method past
  	past: function()
   {
    console.log('bb1.PetshopShopping.Prescriptions.OrderWizard.Module.PrescriptionItems.BeforeSubmit past()');
    this.successMessage = '';
    this.currentPrescriptionItemIndex = 0;
    this.eventHandlersOff();
   },
   
   //@method present
  	present: function ()
   {
    console.log('bb1.PetshopShopping.Prescriptions.OrderWizard.Module.PrescriptionItems.BeforeSubmit present()');
    this.eventHandlersOn();
   },
   
   //@method future
  	future: function()
   {
    console.log('bb1.PetshopShopping.Prescriptions.OrderWizard.Module.PrescriptionItems.BeforeSubmit future()');
    this.successMessage = '';
    this.currentPrescriptionItemIndex = 0;
    this.eventHandlersOff();
   },
   
   //@method eventHandlersOn
  	eventHandlersOn: function ()
   {
    this.eventHandlersOff();
    this.$('[name="treatmentstartdate"]').datepicker({
     format: 'd/m/yyyy',
     beforeShowDay: function(date) {
      /*var selectedOrderSchedule = view.$('[name="orderschedule"]').val(),
          scheduleForSetDate = view.$('[name="scheduleforsetdate"]').is(':checked'),
          scheduledDayOfMonth = parseInt(view.$('[name="scheduleddayofmonth"]').val()),
          subscriptionOrderSettings = SC.ENVIRONMENT.subscriptionOrderSettings && SC.ENVIRONMENT.subscriptionOrderSettings || {},
          orderSchedules = subscriptionOrderSettings.orderSchedules || {},
          orderScheduleInDays = (_.findWhere(orderSchedules, {id: selectedOrderSchedule}) || {}).scheduleindays || 1,
          canScheduleMonthly = orderScheduleInDays % self.daysInMonth === 0,
          lastDateOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();*/
          
      return true; //!canScheduleMonthly || !scheduleForSetDate || date.getDate() === Math.min(scheduledDayOfMonth, lastDateOfMonth);
     }
    }).on('changeDate', function(e) {
     //self.model.validate();
     //jQuery(this).datepicker('update');
    });
   },
   
   //@method eventHandlersOff
  	eventHandlersOff: function ()
   {
    this.$('[name="treatmentstartdate"]').datepicker('destroy');
   },
   
   saveForm: function (e, model, props)
   {
    e.preventDefault();

    var self = this,
        parentModel = this.model,
        lineId = self.model.get('line'),
        totalAllocated = self.model.get('totalallocated') || 0;
    
    self.model.set('isnew', totalAllocated == 0);
    
    var promise = Backbone.View.prototype.saveForm.apply(this, arguments);
    
    if (promise) {
     promise.done(function(data) {
      var line = self.cart.get('lines').get(lineId);
      var linesSort = self.cart.get('lines_sort');
      var currentPosition = _.indexOf(linesSort, lineId);
    
      linesSort[currentPosition] = data.line;
    
      line.set('internalid', data.line);
      self.cart.set('lines_sort', linesSort);
      
      var prescriptionItems = self.prescriptionOrder.get('prescriptionItems');
      
      var treatmentsAllocated = parseInt(self.model.get('treatmentsallocated'), 10) || 0,
          totalAllocated = parseInt(self.model.get('totalallocated'), 10) || 0,
          totalTreatments = parseInt(self.model.get('totaltreatments'), 10) || 1,
          cartLineId = data.line;
          
      if (treatmentsAllocated > 0) {
       totalAllocated += parseInt(data.treatmentsallocated);
       
       //self.model.set('internalid', data.internalid);
       //self.model.set('line', data.line);
       self.model.set('totalallocated', totalAllocated);
      }
      
      prescriptionItems.each(function(prescriptionItem) {
       if (prescriptionItem.get('internalid') == lineId)
        prescriptionItem.set('internalid', data.internalid);
       if (prescriptionItem.get('line') == lineId)
        prescriptionItem.set('line', data.line);
      });
      
      line.set('prescriptionOptions', self.model);
      
      var updatedPet = self.prescriptionOrder.get('pets').get(data.pet);
      
      data.petweight && updatedPet.set('weight_kg', data.petweight);
     
      switch (data.treatmenttype) {
       case '1':
        data.nextwormingreminder && updatedPet.set('nextwormingreminder', data.nextwormingreminder);
        break;
       case '2':
        data.nextfleareminder && updatedPet.set('nextfleareminder', data.nextfleareminder);
        break;
      }
      
      var itemName = self.model.get('itemname');
      
      self.successMessage = _('You successfully updated the treatment details for \'$(0)\'.').translate(itemName);
      
      if (treatmentsAllocated > 0 && totalAllocated < totalTreatments) {
       self.successMessage += _('<br /><br />There are more treatments leftover for this item. Please allocate the remaining items to another pet below.').translate();
       if (!self.prescriptionOrder.get('pet'))
        self.model.set('pet', self.prescriptionOrder.get('pets').at(0));
      }
      else if (self.currentPrescriptionItemIndex < prescriptionItems.models.length-1) {
       self.successMessage += _('<br /><br />You have more prescription items to enter details for. Please continue updating the details for the remaining items below.').translate();
       self.model = prescriptionItems.at(++self.currentPrescriptionItemIndex);
       console.log('self.model');
       console.log(self.model.get('pet'));
       console.log(self.prescriptionOrder.get('pets').at(0));
       
       if (!self.prescriptionOrder.get('pet'))
        self.model.set('pet', self.prescriptionOrder.get('pets').at(0));
       
       console.log(self.model.get('pet'));
      }
      else {
       self.model = null;
       self.application.getLayout().currentView.$('[data-action="submit-step"]').text(_('Continue').translate());
      }
     
      self.setPetDefaults();
      
      Backbone.Validation.bind(self);
      
      self._render();
      
      jQuery('html, body').animate({scrollTop: 0}, 300);
      
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
    else {
     this.setPetDefaults(value);
    }
   },
   
   calcPetWeightFromRange: function(pet) {
    
    if (!pet) return;
    
    var weightText = pet.get('weight_text'),
        weightRangeTokens = weightText.match(/(\d+)-(\d+)/),
        weightRangeMin = weightRangeTokens.length > 1 ? parseInt(weightRangeTokens[1], 10) : 0,
        weightRangeMax = weightRangeTokens.length > 2 ? parseInt(weightRangeTokens[2], 10) : 0,
        weight = Math.round(((weightRangeMax - weightRangeMin) / 2) + weightRangeMin);
        
    return weight;
   },
   
   setPetDefaults: function(petId) {
    
    if (!this.model) return;
    
    var pet = petId && this.prescriptionOrder.get('pets').get(petId) || this.model.get('pet');
    
    if (pet) {
     var treatmentType = this.model.get('treatmenttype'),
         weight = parseInt(pet.get('weight_kg'), 10) || this.calcPetWeightFromRange(pet),
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
      
     this.model.set('weight_kg', weight);
     this.model.set('age', age);
     this.$('input[name="petweight"]').val(weight);
     this.$('input[name="petage"]').val(age);
    }
    else {
     this.model.set('weight_kg', null);
     this.model.set('age', null);
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
        defaultPetType = this.getDefaultPetType(),
        model = new PetsModel({type: defaultPetType}),
        view = new PetsFormView({
         application: this.application,
         model: model
        });
        
        console.log('defaultPetType');
        console.log(defaultPetType);
        console.log(model);

    view.model.on('change add', function (model, collection, options) {
     console.log('change add model');
     console.log(model);
     console.log(collection);
     console.log(options);
     self.prescriptionOrder.set('pets', model.get('pets'));
     model.unset('pets', {silent: true});
     
     var pets = self.prescriptionOrder.get('pets') || [],
         newPet = pets.length && pets.sortBy(function(pet) { return -(parseInt(pet.get('internalid'))); })[0],
         petsDropDownView = new PetsDropdownView({selectedPet: newPet, pets: pets});
         
     petsDropDownView.render();
     
     self.$('[data-view="Pets.Dropdown"]').empty().append(petsDropDownView.$el).find('select').change();
     
     var message = _('Your pet has been created.').translate(),
         messageView = new GlobalViewsMessageView({message: message, type: "success", closable: true});
     messageView.render();
     self.$('[data-type="alert-placeholder"]').empty().append(messageView.$el);
    }, view);
    
    view.showInModal().done(function() {
     this.$containerModal.on('hidden.bs.modal', function () {
     
     var pets = self.prescriptionOrder.get('pets') || [],
         newPetId = pets.reduce(function(memo, pet) { var id = parseInt(pet.get('internalid')); return memo > id ? memo : id; }, 0) || '';
         
      if (self.$('[data-input="pet"] select').val() == 'create')
       self.$('[data-input="pet"] select').val(newPetId).change();
     });
    });
    
   },
   
  	getDefaultPetType: function ()
   {
    var petSettings = SC.ENVIRONMENT.petSettings && SC.ENVIRONMENT.petSettings || {},
        petTypesAndBreeds = petSettings.petTypesAndBreeds || [],
        cartAnimalTypes = this.getCartAnimalTypes(),
        defaultPetType = cartAnimalTypes.length == 1 ? (_.findWhere(petTypesAndBreeds, {name: cartAnimalTypes[0]}) || {}).id : undefined;
    
    return defaultPetType;
   },
   
  	getCartAnimalTypes: function ()
   {
    var cartAnimalTypes = [];
    this.cart.get('lines').each(function(line) {
     cartAnimalTypes = cartAnimalTypes.concat(line.get('item').get('custitem_bb1_web_animaltype').split(/\s*,\s*/));
    });
    cartAnimalTypes = _.unique(cartAnimalTypes);
    
    return cartAnimalTypes;
   },
   
   isActive: function ()
   {
    return this.hasPrescriptionItemsInCart();
   },
   
   render: function()
   {
    if (this.isActive())
    {
     var self = this,
         application = this.wizard.application,
         prescriptionOrderItems = this.getPrescriptionOrderItems();
         //userId = ProfileModel.getInstance().get('internalid'),
         //confirmation = this.model.get('confirmation'),
         //orderId = confirmation && confirmation.get('internalid') || '';

     //console.log('userId: ' + userId);
     //console.log('this.wizard.currentStep: ' + this.wizard.currentStep);
     //console.log('orderId: ' + orderId);
     
     //if (userId == '80423' && this.wizard.currentStep != 'confirmation') orderId = 1955635;
     
     if (prescriptionOrderItems.length) {
     
      this.prescriptionOrder = new PrescriptionOrderModel();
      
      this.prescriptionOrder.fetch({ // get details from cart
       //data: {orderid: orderId},
       killerId: application.killerId
      }).then(function (data) {
       
       //console.log('prescriptionOrder.fetch');
       //console.log(data);
       //console.log(this.prescriptionOrder);
       //console.log(prescriptionOrderItems);
       self.prescriptionOrder.set('prescriptionItems', prescriptionOrderItems);
       
       self.model = self.prescriptionOrder.get('prescriptionItems').at(self.currentPrescriptionItemIndex);
       
       console.log('self.model');
       console.log(self.model.get('pet'));
       console.log(self.prescriptionOrder.get('pets').at(0));
       
       if (!self.prescriptionOrder.get('pet'))
        self.model.set('pet', self.prescriptionOrder.get('pets').at(0));
       
       self.setPetDefaults();
       
       console.log(self.model.get('pet'));
       Backbone.Validation.bind(self);
       
       self._render();
       self.eventHandlersOn();
      });
      
     }
    
    }
   },
   
   showError: function ()
   {
    var messageView = new GlobalViewsMessageView({message: this.error.errorMessage, type: "error", closable: true});
    messageView.render();
    this.$('[data-type="alert-placeholder-module"]:first').html(messageView.$el);
   },
   
  	hasPrescriptionItemsInCart: function ()
   {
    return !!this.getCartPrescriptionItems().length;
   },
   
  	getPrescriptionOrderItems: function ()
   {
    return _.map(this.getCartPrescriptionItems(), function(product) {
     var item = product.get('item'),
         quantity = parseInt(product.get('quantity')) || 1,
         itemsPerPack = item.get('_prescriptionItemsPerPack'),
         totalTreatments = quantity * itemsPerPack;
     
     //console.log('quantity');
     //console.log(quantity);
     //console.log(itemsPerPack);
     //console.log(totalTreatments);
     //return new prescriptionItemModel({
     return {
      internalid: product.get('internalid'),
      line: product.get('internalid'),
      item: item.get('internalid'),
      itemname: item.get('_name'),
      treatmenttype: item.get('_prescriptionTreatmentType'),
      itemsperpack: itemsPerPack,
      dosageperitem: item.get('_prescriptionWeightPerTablet'),
      totaltreatments: totalTreatments
     };
    });
   },
   
  	getCartPrescriptionItems: function ()
   {
    var cartPrescriptionItems = this.cart.get('lines').filter(function(line) {
     return ['Flea', 'Worming'].indexOf(line.get('item').get('_prescriptionTreatmentType')) != -1;
    });
    
    return cartPrescriptionItems;
   },
   
  	getCartItemIds: function ()
   {
    var cartItemIds = _.unique(this.cart.get('lines').map(function(line) {
     return line.get('item').get('internalid');
    }));
    
    return cartItemIds;
   },
   
   childViews: {
    
    'Pets.Dropdown': function() {
     return new PetsDropdownView({
      application: this.application,
      pets: this.prescriptionOrder.get('pets') || new Backbone.Collection(),
      selectedPet: this.model ? this.model.get('pet') : new PetsModel()
     });
    }
    
   },
   
   getContext: function()
   {
    var model = this.model || new Backbone.Model(),
        prescriptionItems = this.prescriptionOrder.get('prescriptionItems') || new Backbone.Collection(),
        pets = this.prescriptionOrder.get('pets') || new Backbone.Collection(),
        selectedPet = model.get('pet') || new PetsModel(),
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
     petWeight: model && model.get('weight_kg') || '',
     //@property {String} petAge
     petAge: model && model.get('petage') || '',
     //@property {String} isNotPregnant
     isNotPregnant: true, //model.get('isnotpregnant') === 'T',
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

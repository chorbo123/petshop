// @module bb1.PetshopShopping.Pets
define(
    'bb1.PetshopShopping.Pets.Form.View',
    [
        'bb1.PetshopShopping.Pets.List.View',
        'bb1.PetshopShopping.Pets.BreedsDropdown.View',
        'bb1.PetshopShopping.Pets.Deceased.View',

        'bb1_petshopshopping_pets_form.tpl',

        'Utils',
        'Backbone.CompositeView',
        'Backbone',
        'underscore',
        'Handlebars'
    ],
    function (
        PetsListView,
        PetsBreedsDropdownView,
        PetsDeceasedView,

        bb1_petshopshopping_pets_form_tpl,

        Utils,
        BackboneCompositeView,
        Backbone,
        _,
        Handlebars
    ) {
        'use strict';

        Handlebars.registerHelper('eq', function (operand1, operand2, options) {
            if (operand1 == operand2) {
                return (typeof options.fn == 'function') ? options.fn(this) : true;
            }
        });

        return Backbone.View.extend({

            template: bb1_petshopshopping_pets_form_tpl,

            page_header: Utils.translate('Add Your Pet'),

            title: Utils.translate('Add Your Pet'),

            attributes: { 'class': 'PetFormView' },

            menuItem: 'new_pet',

            events: {
                'submit form': 'saveForm',
                'click [data-action="reset"]': 'resetForm',
                'change select[data-type="pet-type"]': 'updateBreeds',
                'click [data-action="pet-deceased"]': 'petDeceased'
            },

            initialize: function (options) {
                var self = this;
                this.application = options.application;
                BackboneCompositeView.add(this);
                Backbone.Validation.bind(this);
            },

            childViews: {

                'Pets.BreedsDropdown': function () {
                    var options = this.options || {},
                        model = this.model,
                        manage = options.manage ? options.manage + '-' : '',
                        petSettings = SC.ENVIRONMENT.petSettings && SC.ENVIRONMENT.petSettings || {},
                        petTypesAndBreeds = petSettings.petTypesAndBreeds || [],
                        currentType = model.get('type');

                    return new PetsBreedsDropdownView(
                        {
                            petTypes: petTypesAndBreeds,
                            selectedType: currentType,
                            selectedBreed: model.get('breed'),
                            manage: manage
                        });
                }

            },

            showContent: function () {
                var paths = [
                    {
                        text: PetsListView.prototype.page_header,
                        href: '/pets'
                    },
                    {
                        text: this.page_header,
                        href: '/pets/new'
                    }
                ];

                return this.application.getLayout().showContent(this, this.menuItem, paths);
            },

            saveForm: function (e, model, props) {
                e.preventDefault();

                var self = this;

                var promise = Backbone.View.prototype.saveForm.apply(this, arguments);

                if (!promise) {
                    self.$savingForm.find('*[type=submit]').attr('disabled', false);
                }

                return promise;
            },

            resetForm: function (e) {
                e.preventDefault();
                this.showContent();
            },

            updateBreeds: function (e) {
                var type = this.$(e.target).val(),
                    manage = this.options && this.options.manage ? this.options.manage + '-' : '',
                    petSettings = SC.ENVIRONMENT.petSettings && SC.ENVIRONMENT.petSettings || {},
                    petTypesAndBreeds = petSettings.petTypesAndBreeds || [],
                    petsBreedDropdownView = new PetsBreedsDropdownView({ petTypes: petTypesAndBreeds, selectedType: type, manage: manage });

                petsBreedDropdownView.render();
                this.$('[data-view="Pets.BreedsDropdown"]').empty().append(petsBreedDropdownView.$el);
            },

            petDeceased: function (e) {
                var self = this,
                    type = this.$(e.target).val();

                //this.model.set('deceased', true);

                if (confirm('Are you sure?')) {
                    this.model.save({ deceased: true }).done(function (response) {
                        console.log('petDeceased response');
                        console.log(response);
                        var petsDeceasedView = new PetsDeceasedView({
                            application: self.application
                        });
                        if (self.inModal && self.$containerModal) {
                            self.$containerModal.modal('hide');
                            self.destroy();
                            petsDeceasedView.showInModal();
                        }
                        else {
                            petsDeceasedView.showContent();
                        }
                    });
                }

                //return false;
            },

            getContext: function () {
                var options = this.options || {},
                    model = this.model,
                    manage = options.manage ? options.manage + '-' : '',
                    petSettings = SC.ENVIRONMENT.petSettings && SC.ENVIRONMENT.petSettings || {},
                    petTypesAndBreeds = petSettings.petTypesAndBreeds || [],
                    petGenders = petSettings.petGenders || [],
                    petWeights = petSettings.petWeights || [],
                    currentType = model.get('type'),
                    currentGender = model.get('gender'),
                    currentWeight = model.get('weight');

                //@class Address.List.View.Context
                return {
                    //@property {String} pageHeader
                    pageHeader: this.page_header,
                    //@property {Backbone.Model} pet
                    pet: model,
                    //@property {String} manage
                    manage: manage,
                    //@property {Boolean} inModal
                    isInModal: this.inModal,
                    //@property {Array} petTypesAndBreeds
                    petTypesAndBreeds: petTypesAndBreeds,
                    //@property {Array} petGenders
                    petGenders: petGenders,
                    //@property {Array} petWeights
                    petWeights: petWeights,
                    //@property {String} currentType
                    currentType: currentType,
                    //@property {String} currentGender
                    currentGender: currentGender,
                    //@property {String} currentWeight
                    currentWeight: currentWeight
                };
            }

        });

    }
);

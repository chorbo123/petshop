/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="OrderWizard.Module.PaymentMethod.ACH"/>

import * as _ from 'underscore';
import * as paymentinstrument_ach_edit_tpl from 'paymentinstrument_ach_edit.tpl';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';
import { Configuration } from '../../SCA/JavaScript/Configuration';
import { ProfileModel } from '../../../Commons/Profile/JavaScript/Profile.Model';
import { WizardStepModuleMigrated } from '../../Wizard/JavaScript/Wizard.StepModule.Migrated';
import { PaymentInstrumentACHModel } from '../../../Commons/PaymentInstrumentACH/JavaScript/PaymentInstrumentACH.Model';
import { PaymentInstrumentACHCollection } from '../../../Commons/PaymentInstrumentACH/JavaScript/PaymentInstrumentACH.Collection';
import { PaymentInstrumentACHCollectionView } from '../../../Commons/PaymentInstrumentACH/JavaScript/PaymentInstrumentACH.CollectionView';
import { PaymentInstrumentACHEditFormView } from '../../../Commons/PaymentInstrumentACH/JavaScript/PaymentInstrumentACH.Edit.Form.View';

import { ChildViews } from '../../../Commons/Core/JavaScript/View';
import { AjaxRequestsKiller } from '../../../Commons/AjaxRequestsKiller/JavaScript/AjaxRequestsKiller';
import { OrderWizardModuleACHUtils } from './OrderWizard.Module.ACH.Utils';

import GlobalViewsConfirmationView = require('../../../Commons/GlobalViews/JavaScript/GlobalViews.Confirmation.View');
import BackboneView = require('../../../Commons/BackboneExtras/JavaScript/Backbone.View');

interface OrderWizardModulePaymentMethodACHContext {
    showForm: boolean;
    showTitle: boolean;
    title: string;
    selectedACH: PaymentInstrumentACHModel;
    listACH: PaymentInstrumentACHCollection;
}

export class OrderWizardModulePaymentMethodACH extends WizardStepModuleMigrated<
    OrderWizardModulePaymentMethodACHContext
> {
    protected template;

    private selectMessage = Utils.translate('Use this ACH');

    public itemsPerRow = Utils.isDesktopDevice() ? 3 : 2;

    public className: 'OrderWizard.Module.PaymentMethod.ACH';

    protected profileModel;

    private paymentmethod: PaymentInstrumentACHModel;

    private ACHDetailView;

    private paymentMethodSelected: PaymentInstrumentACHModel | number;

    private unset;

    public $el;

    public paymentMethod;

    public events = {
        'click [data-action="select"]': 'selectACH',
        'mouseover [data-toggle="popover"]': 'openPopover',
        'click [data-action="change-ach"]': 'changeACH',
        'click [data-action="remove"]': 'removeACH',
        'click [data-action="show-safe-secure-info"]': 'showSecureInfo'
    };

    public errors = ['ERR_CHK_INCOMPLETE_ACH', 'ERR_CHK_SELECT_ACH', 'ERR_WS_INVALID_PAYMENT'];

    public constructor(args) {
        super(args);
        this.template = OrderWizardModuleACHUtils.getACHTemplate();
        this.wizard.model.on('change:payment', jQuery.proxy(this, 'changeTotal'));
        this.itemsPerRow = _.result(args, 'itemsPerRow') || this.itemsPerRow;
        this.profileModel = ProfileModel.getInstance();
    }

    private listenPaymentMethods(): void {
        const paymentMethods = this.profileModel.get('paymentmethodsach');
        paymentMethods.on(
            'reset',
            (): void => {
                this.updateCollectionList().then(() => {
                    this.selectedPaymentMethod();
                });
            },
            this
        );
        paymentMethods.on(
            'add',
            (): void => {
                this.updateCollectionList().then(() => {
                    this.selectedPaymentMethod();
                });
            },
            this
        );
        paymentMethods.on(
            'update',
            (): void => {
                this.selectedPaymentMethod();
            },
            this
        );
        paymentMethods.on(
            'remove',
            (): void => {
                this.updateCollectionList().then(() => {
                    this.selectedPaymentMethod();
                });
            },
            this
        );
        paymentMethods.on(
            'noconsent',
            (): void => {
                this.updateCollectionList().then(() => {
                    this.selectedPaymentMethod();
                });
            },
            this
        );
    }

    public updateCollectionList() {
        const promise = jQuery.Deferred();
        return this.profileModel
            .get('paymentmethodsach')
            .fetch({
                killerId: AjaxRequestsKiller.getKillerId()
            })
            .then(() => {
                promise.resolve();
                return promise;
            });
    }

    public isActive(): boolean {
        const anACH: { internalid: number } = _.findWhere(
            Configuration.get('siteSettings.paymentmethods', []),
            {
                isautomatedclearinghouse: 'T'
            }
        );
        const isQuote = this.wizard.currentStep.indexOf('quotetosalesorder') !== -1;

        return (
            OrderWizardModuleACHUtils.isTemplateAvailable() &&
            anACH &&
            !!anACH.internalid &&
            !isQuote
        );
    }

    public selectedPaymentMethod() {
        if (this.wizard.hidePayment()) {
            this.$el.empty();
        } else {
            const self = this;
            // search for the paymentmethod in the order that is ach
            const orderPayMethod = self.model.get('paymentmethods').findWhere({ type: 'ACH' });
            const orderACHId =
                (orderPayMethod &&
                    orderPayMethod.get('ACH') &&
                    orderPayMethod.get('ACH').internalid) ||
                this.getDefaultACHId();

            // used by the view to show radio input selected
            self.paymentMethodSelected = orderACHId;

            // if the order has an ACH and that ACH exists on
            // the profile we set it (making sure it is the same as in the profile)

            if (orderACHId && self.profileModel.get('paymentmethodsach').get(orderACHId)) {
                self.setACH({ id: orderACHId });
            }
            // if the ACH in the order is not longer in the profile we delete it.
            else if (orderACHId) {
                self.unsetACH(null);
            }
            self.render();
        }
    }

    public render(): this {
        if (this.wizard.hidePayment()) {
            this.$el.empty();
        } else {
            const paymentMethods = this.profileModel.get('paymentmethodsach');
            paymentMethods.off(null, null, this);
            this.listenPaymentMethods();
            const self = this;

            const orderPaymentMethod = this.model.get('paymentmethods').findWhere({ type: 'ACH' });

            this.paymentmethod = null;

            this.paymentMethod =
                orderPaymentMethod || new PaymentInstrumentACHModel({ type: 'ACH' });

            const orderACH = this.paymentMethod.get('ACH') || this.paymentMethod;
            this.paymentMethodSelected = orderACH.get('internalid');

            if (!paymentMethods.length) {
                this.paymentmethod = new PaymentInstrumentACHModel({
                    paymentmethods: Configuration.get('siteSettings.paymentmethods')
                });
            } else if (orderACH && orderACH.get('internalid')) {
                this.paymentmethod = paymentMethods.get(orderACH.get('internalid'));
            } else if (this.profileModel.get('isGuest') === 'T') {
                // if the order is empty and is a guest use the first ACH in the list
                this.paymentmethod = paymentMethods.at(0);

                this.setACH({
                    id: this.paymentmethod.get('id')
                });
            } else if (!this.unset) {
                this.paymentmethod = _.findWhere(paymentMethods.models, {
                    isdefault: 'T'
                });

                if (this.paymentmethod && this.paymentmethod.get('id')) {
                    this.setACH({
                        id: this.paymentmethod.get('id')
                    });
                }
            }

            this._render();

            this.isValid().done(function() {
                self.trigger('ready', true);
            });
        }
        return this;
    }

    public removeACH(e) {
        e.preventDefault();

        const deleteConfirmationView = new GlobalViewsConfirmationView({
            callBack: this._removeACHFromCollection,
            callBackParameters: {
                context: this,
                achId: jQuery(e.target).data('id')
            },
            title: Utils.translate('Remove ACH'),
            body: Utils.translate('Are you sure you want to remove this ACH?'),
            autohide: true
        });

        return this.wizard.application.getLayout().showInModal(deleteConfirmationView);
    }

    private _removeACHFromCollection(options) {
        options.context.unsetACH();

        if (options.achId !== '-temporal-') {
            options.context.paymentmethods.get(options.achId).destroy({ wait: true });
        } else {
            options.context.paymentmethods.remove(options.achId);
        }
    }

    public changeACH(e) {
        if (
            ProfileModel.getInstance().get('isGuest') !== 'T' ||
            this.paymentmethod.get('internalid') === '-temporal-'
        ) {
            if (this.paymentmethod.get('internalid') === '-temporal-') {
                const internalid = this.paymentmethod.get('internalid');
                this.profileModel.get('paymentmethodsach').remove(internalid);
                ProfileModel.getInstance()
                    .get('paymentmethodsach')
                    .remove(internalid);
            }
            this.unsetACH(e);
        } else {
            const self = this;
            e.preventDefault();
            e.stopPropagation();

            const des = this.paymentmethod.destroy({ wait: true });
            if (des) {
                des.then(function() {
                    self.profileModel.get('paymentmethodsach').reset([]);
                    ProfileModel.getInstance()
                        .get('paymentmethodsach')
                        .reset([]);
                });
            }
        }
    }

    public changeTotal(): void {
        const was = this.model.previous('payment');
        const was_confirmation = this.model.previous('confirmation');
        const is_confirmation = this.model.get('confirmation');
        const is = this.model.get('payment');

        // Changed from or to 0
        if (
            ((was === 0 && is !== 0) || (was !== 0 && is === 0)) &&
            !was_confirmation &&
            !is_confirmation
        ) {
            this.render();
        }
    }

    private selectACH(e): void {
        const idSelected = jQuery(e.target).data('id');

        if (idSelected) {
            this.paymentMethodSelected = idSelected.toString();

            this.setACH({
                id: idSelected
            });
        }

        // re render so if there is changes to be shown they are represented in the view
        this.render();

        // As we alreay set the ach, we let the step know that we are ready
        this.trigger('ready', true);
    }

    private setACH(options): void {
        const paymentMethods = this.profileModel.get('paymentmethodsach');
        const ACH = options.model || paymentMethods.get(options.id) || paymentMethods.get(options);

        this.paymentMethod = new PaymentInstrumentACHModel({
            type: 'ACH',
            ACH: ACH
        });

        this.model.addPayment(this.paymentMethod);
    }

    private unsetACH(e): void {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        this.unset = true;

        this.paymentMethod = new PaymentInstrumentACHModel({
            type: 'ACH'
        });

        const payment_method = this.paymentMethod;
        this.model.addPayment(payment_method);

        // We re render so if there is changes to be shown they are represented in the view
        this.render();
    }

    // @method submit
    public submit(...args): JQueryDeferred<void> {
        // This order is bing payed with some other method (Gift Cert probably)
        if (this.wizard.hidePayment()) {
            return jQuery.Deferred().resolve();
        }

        if (this.ACHDetailView) {
            const save_result = jQuery.Deferred();
            const result = this.ACHDetailView.persistForm();

            if (result) {
                result
                    .then(
                        (): void => {
                            this.profileModel.get('paymentmethodsach').once(
                                'add',
                                (payment_method): void => {
                                    this.model.addPayment(payment_method);
                                    this.setACH({
                                        model: payment_method
                                    });
                                    save_result.resolve();
                                }
                            );
                            this.profileModel.get('paymentmethodsach').once(
                                'noconsent',
                                (): void => {
                                    save_result.reject();
                                }
                            );
                        }
                    )
                    .catch(save_result.reject);
            } else {
                save_result.reject();
            }

            return save_result;
        }

        return this.isValid().always(
            (): void => {
                this.render();
            }
        );
    }

    public isValid(): JQueryDeferred<void> {
        if (this.wizard.hidePayment()) {
            return jQuery.Deferred().resolve();
        }

        // user's ach
        const paymentMethods = this.profileModel.get('paymentmethodsach');

        // current order payment method
        const orderPaymentMethod = this.model.get('paymentmethods').findWhere({
            type: 'ACH'
        });
        // current order ach
        const orderACH = orderPaymentMethod && orderPaymentMethod.get('ACH');

        // Order is using a ach
        // it is a temporal ach
        // or there is a collection of ACHs
        // and the order's ach is on that collection
        if (
            orderACH &&
            (orderACH.internalid === '-temporal-' ||
                (paymentMethods.length &&
                    (paymentMethods.get(orderACH.internalid) ||
                        paymentMethods.get(orderACH.id) ||
                        (SC.ENVIRONMENT.paymentInstrumentEnabled &&
                            paymentMethods.get('-temporal-')))))
        ) {
            return jQuery.Deferred().resolve();
        }

        // if it not set, then lets reject it
        return jQuery.Deferred().reject({
            errorCode: 'ERR_CHK_SELECT_ACH',
            errorMessage: Utils.translate('Please select an ACH')
        });
    }

    public manageError(error): void {
        if (error && error.errorCode !== 'ERR_CHK_INCOMPLETE_ACH') {
            if (error.errorCode === 'ERR_WS_INVALID_PAYMENT') {
                this.unsetACH(null);
            }
            super.manageError(error);
        }
    }

    private showSecureInfo(): void {
        const view = new BackboneView({ application: this.wizard.application });
        const self = this;

        view.setTitle(Utils.translate('Safe and Secure Shopping'));
        view.render = function() {
            const { creditCard } = self.wizard.application.getConfig();
            this.$el.html(Utils.translate(creditCard.creditCardShowSecureInfo));
            return this;
        };
        view.showInModal();
    }

    // @method getPaymentMethodsToShow returns a copy of the payment methods collection including the new card button available to show
    private getPaymentMethodsToShow() {
        let payment_methods_to_show;
        const paymentMethods = this.profileModel.get('paymentmethodsach');

        if (paymentMethods && !!paymentMethods.length) {
            payment_methods_to_show = paymentinstrument_ach_edit_tpl
                ? paymentMethods.getCollectionForRendering()
                : paymentMethods;
        }

        return payment_methods_to_show ? payment_methods_to_show.models : [];
    }

    private getDefaultACHId(): string {
        let defaultACH;
        const paymentMethods = this.profileModel.get('paymentmethodsach');

        if (paymentMethods && !!paymentMethods.length) {
            defaultACH = _.findWhere(paymentMethods.models, {
                ccdefault: 'T'
            });
        }
        return defaultACH ? defaultACH.id : '';
    }

    protected getChildViews(): ChildViews {
        return {
            'ACH.List': (): PaymentInstrumentACHCollectionView => {
                if (this.paymentMethodSelected) {
                    this.setACH({
                        id: this.paymentMethodSelected
                    });
                }

                let viewsPerRow = this.itemsPerRow;

                if (Utils.isDesktopDevice()) {
                    viewsPerRow = viewsPerRow || 3;
                } else if (Utils.isTabletDevice()) {
                    viewsPerRow = viewsPerRow || 2;
                } else {
                    viewsPerRow = viewsPerRow || 1;
                }

                return new PaymentInstrumentACHCollectionView(
                    this.getPaymentMethodsToShow() || [],
                    {
                        showSelect: true,
                        hideSelector: false,
                        selectMessage: this.selectMessage,
                        selectedACHId: this.paymentMethodSelected || this.getDefaultACHId(),
                        viewsPerRow: viewsPerRow,
                        showActions: true
                    }
                );
            },
            'ACH.Form': () => {
                this.ACHDetailView = new PaymentInstrumentACHEditFormView({
                    model: new PaymentInstrumentACHModel(),
                    noRedirect: true,
                    collection: this.profileModel.get('paymentmethodsach'),
                    showFooter: false,
                    isSection: true,
                    inModal: false
                });
                return this.ACHDetailView;
            }
        };
    }

    public getContext(): OrderWizardModulePaymentMethodACHContext {
        const paymentMethods = this.profileModel.get('paymentmethodsach');
        const isPaymentMethodsEmpty =
            !paymentMethods.length ||
            (paymentMethods.length === 1 &&
                this.profileModel
                    .get('paymentmethodsach')
                    .first()
                    .get('internalid') === '-1');
        const showForm =
            isPaymentMethodsEmpty &&
            (!this.paymentmethod || (this.paymentmethod && this.paymentmethod.isNew()));

        if (!showForm) {
            this.ACHDetailView = null;
        }

        return {
            showForm: showForm,
            showTitle: !!this.getTitle(),
            title: this.getTitle(),
            selectedACH: this.paymentmethod,
            listACH: this.profileModel.get('paymentmethodsach')
        };
    }
}

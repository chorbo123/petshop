/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PaymentInstrumentACH.Edit.Form.View"/>

import * as _ from 'underscore';
import * as paymentinstrument_ach_edit_form_tpl from 'paymentinstrument_ach_edit_form.tpl';
import { FormView, FormFieldsError, FormFieldValue } from '../../Core/JavaScript/FormView';
import { Loggers } from '../../Loggers/JavaScript/Loggers';
import * as jQuery from '../../Core/JavaScript/jQuery';
import * as Utils from '../../Utilities/JavaScript/Utils';
import { EventsHash } from '../../Core/JavaScript/View';
import { PaymentInstrumentACHModel } from './PaymentInstrumentACH.Model';
import { PaymentInstrumentACH } from '../../../ServiceContract/SC/PaymentInstrumentACH/PaymentInstrumentACH';

import { Configuration } from '../../Utilities/JavaScript/Configuration';
import { ProfileModel } from '../../Profile/JavaScript/Profile.Model';

import { Errors } from '../../Core/JavaScript/Error';
import { PaymentInstrumentACHCollection } from './PaymentInstrumentACH.Collection';

import GlobalViewsConfirmationView = require('../../GlobalViews/JavaScript/GlobalViews.Confirmation.View');
import Backbone = require('../../Utilities/JavaScript/backbone.custom');

interface PaymentInstrumentACHEditFormViewOptions {
    model: PaymentInstrumentACHModel;
    collection: PaymentInstrumentACHCollection;
    inModal: boolean;
    isSection: boolean;
    noRedirect: boolean;
    showFooter: boolean;
}

interface PaymentInstrumentACHEditViewContext {
    paymentMethods: object | string;
    paymentMethodValue: string;
    paymentMethodSaved: string;
    isModal: boolean;
    showFooter: boolean;
    isNew: boolean;
    isSection: boolean;
    isModalOrCollectionLength: boolean;
    accountTypes: object[];
    accountType: string | object;
    accountTypeSaved: string;
    account: string;
    routingNumber: string;
    bankName: string;
    ownerName: string;
    limit: string;
}

export class PaymentInstrumentACHEditFormView extends FormView<
    PaymentInstrumentACHModel,
    PaymentInstrumentACHEditViewContext
> {
    protected template = paymentinstrument_ach_edit_form_tpl;

    public options: PaymentInstrumentACHEditFormViewOptions;

    private user: ProfileModel;

    public constructor(options: PaymentInstrumentACHEditFormViewOptions) {
        super(new PaymentInstrumentACHModel());
        this.options = options;
        this.user = ProfileModel.getInstance();
        this.formModel = this.options.model;
    }

    protected getEvents(): EventsHash | null {
        return {
            'submit form': 'customSaveForm',
            'blur [name="paymentmethod"]': 'onFormFieldChange',
            'blur [name="account"]': 'onFormFieldChange',
            'blur [name="accounttype"]': 'onFormFieldChange',
            'blur [name="routingnumber"]': 'onFormFieldChange',
            'blur [name="bankname"]': 'onFormFieldChange',
            'blur [name="ownername"]': 'onFormFieldChange',
            'blur [name="limit"]': 'onFormFieldChange',
            'change form [name="account"]': 'setPaymethodKey'
        };
    }

    protected getFormValues(
        $savingForm: JQuery<HTMLElement>
    ): Partial<PaymentInstrumentACH> | FormFieldsError<PaymentInstrumentACH> {
        const formValues = $savingForm.serializeObject();
        let account = '';
        let routingNumber = '';
        let bankName = '';
        let ownerName = '';
        let limit = '';
        let paymentMethod = null;
        let accountType = '';

        let validFields: Partial<PaymentInstrumentACH>;

        const errorsResult: FormFieldsError<PaymentInstrumentACH> = {
            errorCode: Errors.FormValidation,
            errors: {}
        };

        if ('limit' in formValues && typeof formValues.limit === 'string' && formValues.limit) {
            limit = formValues.limit;
        } else {
            errorsResult.errors.limit = Utils.translate('Limit is required');
        }

        if (this.formModel.isNew()) {
            if (
                'account' in formValues &&
                typeof formValues.account === 'string' &&
                formValues.account
            ) {
                account = formValues.account;
            } else {
                errorsResult.errors.account = Utils.translate('Account is required');
            }

            if (
                'routingnumber' in formValues &&
                typeof formValues.routingnumber === 'string' &&
                formValues.routingnumber
            ) {
                routingNumber = formValues.routingnumber;
            } else {
                errorsResult.errors.routingnumber = Utils.translate('Routing Number is required');
            }

            if (
                'bankname' in formValues &&
                typeof formValues.bankname === 'string' &&
                formValues.bankname
            ) {
                bankName = formValues.bankname;
            } else {
                errorsResult.errors.bankname = Utils.translate('Bank Name is required');
            }

            if (
                'ownername' in formValues &&
                typeof formValues.ownername === 'string' &&
                formValues.ownername
            ) {
                ownerName = formValues.ownername;
            } else {
                errorsResult.errors.ownername = Utils.translate('Owner Name is required');
            }
            if (
                'accounttype' in formValues &&
                typeof formValues.accounttype === 'string' &&
                formValues.accounttype !== '0' &&
                formValues.accounttype
            ) {
                accountType = formValues.accounttype;
            } else {
                errorsResult.errors.accounttype = Utils.translate('Account Type is required');
            }

            if (
                'paymentmethod' in formValues &&
                typeof formValues.paymentmethod === 'string' &&
                formValues.paymentmethod !== '0' &&
                formValues.paymentmethod
            ) {
                paymentMethod = formValues.paymentmethod;
            } else {
                errorsResult.errors.paymentmethod = Utils.translate('Payment method is required');
            }

            if (
                account &&
                accountType &&
                paymentMethod &&
                routingNumber &&
                bankName &&
                ownerName &&
                limit
            ) {
                validFields = {
                    account: account,
                    accounttype: accountType,
                    paymentmethod: paymentMethod,
                    routingnumber: routingNumber,
                    bankname: bankName,
                    ownername: ownerName,
                    limit: limit
                };
            }
        } else if (limit) {
            validFields = {
                limit: limit
            };
        }

        return validFields || errorsResult;
    }

    protected getFormFieldValue(
        changedInput: JQuery<HTMLElement>
    ): FormFieldValue<PaymentInstrumentACH> {
        const newVal = changedInput.val();
        const fieldName = changedInput.attr('name');

        if (fieldName === 'account' && typeof newVal === 'string') {
            return {
                name: fieldName,
                value: newVal
            };
        }
        if (fieldName === 'routingnumber' && typeof newVal === 'string') {
            return {
                name: fieldName,
                value: newVal
            };
        }
        if (fieldName === 'bankname' && typeof newVal === 'string') {
            return {
                name: fieldName,
                value: newVal
            };
        }
        if (fieldName === 'ownername' && typeof newVal === 'string') {
            return {
                name: fieldName,
                value: newVal
            };
        }
        if (fieldName === 'limit' && typeof newVal === 'string') {
            return {
                name: fieldName,
                value: newVal
            };
        }
        if (fieldName === 'accounttype' && typeof newVal === 'string' && newVal !== '0') {
            return {
                name: fieldName,
                value: newVal
            };
        }
        if (fieldName === 'paymentmethod' && newVal !== '0') {
            return {
                name: fieldName,
                value: newVal
            };
        }

        return {
            name: fieldName || '',
            error: Utils.translate('Please provide a valid $(0)', fieldName)
        };
    }

    public persistForm(): false | JQuery.jqXHR<PaymentInstrumentACH> {
        return this.customSaveForm(
            jQuery.Event('click', {
                target: this.$el.find('form').get(0)
            })
        );
    }

    private customSaveForm(e): false | JQuery.jqXHR<PaymentInstrumentACH> {
        const loggers = Loggers.getLogger();
        const actionId = loggers.start('Save ACH');
        const promise = super.saveForm(e);

        if (promise) {
            promise.then(
                (): void => {
                    loggers.end(actionId, {
                        operationIds: this.formModel.getOperationIds(),
                        status: 'success'
                    });
                    this.confirmConsent();
                }
            );
        }
        return promise;
    }

    private confirmConsent(): void {
        const consentMessage = this.formModel.get('customerconsent');
        const approveConsentView = new GlobalViewsConfirmationView({
            callBack: (): void => {
                this.formModel.set('consent', true);
                const promise = this.formModel.save();
                if (promise) {
                    promise.then(
                        (): void => {
                            this.options.collection.fetch().then(
                                (): void => {
                                    if (!this.options.inModal && !this.options.noRedirect) {
                                        Backbone.history.navigate('#ach', {
                                            trigger: true
                                        });
                                    }
                                }
                            );
                        }
                    );
                }
            },
            title: Utils.translate('Approve Consent'),
            body: Utils.translate(consentMessage),
            autohide: true
        });
        approveConsentView.once('destroy', () => {
            if (!!this.formModel.get('consent') === false) {
                this.options.collection.trigger('noconsent', this.options.collection);
            }
        });
        return this.application.getLayout().showInModal(approveConsentView, {});
    }

    private paymenthodKeyACH(ach_number) {
        const payment_methods_configuration = Configuration.get('paymentmethods');
        let paymenthod_key;

        // validate that the number and issuer
        _.each(payment_methods_configuration, function(payment_method_configuration: any) {
            if (
                payment_method_configuration.regex &&
                payment_method_configuration.regex.test(ach_number)
            ) {
                paymenthod_key = payment_method_configuration.key;
            }
        });

        const paymentmethod: any =
            paymenthod_key &&
            _.findWhere(Configuration.get('siteSettings.paymentmethods'), { key: paymenthod_key });

        return paymentmethod && paymentmethod.key;
    }

    private setPaymethodKey(e): void {
        const ach_number = String(jQuery(e.target).val()).replace(/\s/g, '');
        const form = jQuery(e.target).closest('form');
        const paymenthod_key = this.paymenthodKeyACH(ach_number);

        form.find('[name="paymentmethod"]').val(paymenthod_key || 0);
    }

    public getContext(): PaymentInstrumentACHEditViewContext {
        const accountTypes = this.formModel.getAccountTypes();

        const payment_methods_from_configuration = Configuration.get(
            'siteSettings.paymentmethods',
            []
        );
        const selected_payment_method: any = _.findWhere(payment_methods_from_configuration, {
            internalid: this.formModel.get('paymentmethod')
        });

        const isNew = this.formModel.isNew();
        const paymentMethods = _.map(
            _.where(payment_methods_from_configuration, {
                isautomatedclearinghouse: 'T'
            }),
            function(paymentmethod: any) {
                return {
                    hidden: !(
                        isNew ||
                        (selected_payment_method &&
                            paymentmethod.key === selected_payment_method.key)
                    ),
                    icon: paymentmethod.imagesrc,
                    internalid: paymentmethod.internalid,
                    key: paymentmethod.key,
                    name: paymentmethod.name,
                    selected:
                        selected_payment_method && paymentmethod.key === selected_payment_method.key
                };
            }
        );

        let typeSaved = null;
        let accountTypeSaved = '';
        let paymentMethodSaved = '';

        if (!isNew) {
            typeSaved = _.first(
                _.where(this.formModel.getAccountTypes(), {
                    name: this.formModel.getAccountType()
                })
            );

            accountTypeSaved = typeSaved.name ? typeSaved.name : '';

            paymentMethodSaved =
                this.formModel.get('paymentmethod') && this.formModel.get('paymentmethod').name
                    ? this.formModel.get('paymentmethod').name
                    : '';
        }
        return {
            account: this.formModel.get('mask'),
            accountTypes: accountTypes,
            accountType: this.formModel.get('accounttype'),
            accountTypeSaved: accountTypeSaved,
            routingNumber: this.formModel.get('routingnumber'),
            bankName: this.formModel.get('bankname'),
            ownerName: this.formModel.get('ownername'),
            isModal: this.options.inModal,
            isSection: this.options.isSection,
            isModalOrCollectionLength:
                this.options.inModal ||
                !(this.options.collection && this.options.collection.length),
            showFooter: this.options.showFooter,
            limit: this.formModel.get('limit'),
            paymentMethods: paymentMethods,
            paymentMethodValue: selected_payment_method ? selected_payment_method.key : '',
            paymentMethodSaved: paymentMethodSaved,
            isNew: isNew
        };
    }
}

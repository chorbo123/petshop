/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="PaymentWizard.Configuration"/>

import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';

import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';
import { isPaymentAuthenticationRequired } from '../../../Commons/CardHolderAuthentication/JavaScript/CardHolderAuthentication';
import { Configuration } from '../../SCA/JavaScript/Configuration';

import PaymentWizardModuleInvoice = require('./PaymentWizard.Module.Invoice');
import PaymentWizardThreeDSecure = require('./PaymentWizard.ThreeDSecure');
import PaymentWizardModuleSummary = require('./PaymentWizard.Module.Summary');
import PaymentWizardModuleCreditTransaction = require('./PaymentWizard.Module.CreditTransaction');
import PaymentWizardModulePaymentMethodSelector = require('./PaymentWizard.Module.PaymentMethod.Selector');
import PaymentWizardModulePaymentMethodCreditcard = require('./PaymentWizard.Module.PaymentMethod.Creditcard');
import PaymentWizardModuleShowInvoices = require('./PaymentWizard.Module.ShowInvoices');
import PaymentWizardModuleConfirmation = require('./PaymentWizard.Module.Confirmation');
import PaymentWizardModuleShowPayments = require('./PaymentWizard.Module.ShowPayments');
import PaymentWizardModuleConfirmationSummary = require('./PaymentWizard.Module.ConfirmationSummary');
import PaymentWizardModuleShowCreditTransaction = require('./PaymentWizard.Module.ShowCreditTransaction');
import Backbone = require('../../../Commons/Utilities/JavaScript/backbone.custom');

const paymentWizardSteps = [
    {
        name: Utils.translate('Select invoices to pay').toUpperCase(),
        steps: [
            {
                url: 'make-a-payment',
                hideBackButton: true,
                hideContinueButton: false,
                modules: [
                    PaymentWizardModuleInvoice,
                    [
                        PaymentWizardModuleSummary,
                        {
                            container: '#wizard-step-content-right',
                            show_estimated_as_invoices_total: true
                        }
                    ]
                ],
                save: function() {
                    return jQuery.Deferred().resolve();
                }
            }
        ]
    },
    {
        name: Utils.translate('Payment and review').toUpperCase(),
        steps: [
            {
                url: 'review-payment',
                hideBackButton: false,
                hideContinueButton: false,
                modules: [
                    [
                        PaymentWizardModuleCreditTransaction,
                        {
                            transaction_type: 'deposit'
                        }
                    ],
                    [
                        PaymentWizardModuleCreditTransaction,
                        {
                            transaction_type: 'credit'
                        }
                    ],
                    [
                        PaymentWizardModulePaymentMethodSelector,
                        {
                            title: Utils.translate('Payment Method'),
                            record_type: 'customerpayment',
                            modules: [
                                {
                                    classModule: PaymentWizardModulePaymentMethodCreditcard,
                                    name: Utils.translate('Credit / Debit Card'),
                                    type: 'creditcard',
                                    options: {}
                                }
                            ]
                        }
                    ],
                    [
                        PaymentWizardModuleSummary,
                        {
                            container: '#wizard-step-content-right',
                            total_label: Utils.translate('Payment Total'),
                            submit: true
                        }
                    ],
                    [
                        PaymentWizardModuleShowInvoices,
                        {
                            container: '#wizard-step-content-right'
                        }
                    ]
                ],
                save: function() {
                    const promise = jQuery.Deferred();
                    promise.done(() => {
                        this.wizard.model.get('invoicesSelected').reset();
                    });
                    return this.wizard.model
                        .save()
                        .then(customerPayment => {
                            const confirmation = new Backbone.Model(customerPayment);
                            if (
                                isPaymentAuthenticationRequired(confirmation) &&
                                SC.CONFIGURATION.isThreeDSecureEnabled
                            ) {
                                new PaymentWizardThreeDSecure({
                                    layout: this.wizard.application.getLayout(),
                                    application: this.wizard.application,
                                    wizard: this.wizard,
                                    deferred: promise,
                                    confirmation: customerPayment
                                }).showInModal();
                                return promise;
                            }
                            if (
                                customerPayment.confirmation &&
                                customerPayment.confirmation.statuscode === 'redirect'
                            ) {
                                window.location.href = Utils.addParamsToUrl(
                                    customerPayment.confirmation.redirecturl,
                                    {
                                        touchpoint: Configuration.get('currentTouchpoint')
                                    }
                                );

                                return promise.reject();
                            }
                            return promise.resolve();
                        })
                        .fail(
                            (): void => {
                                promise.reject();
                            }
                        );
                }
            },
            {
                url: 'payment-confirmation',
                hideBackButton: true,
                hideBreadcrumb: true,
                hideContinueButton: true,
                modules: [
                    PaymentWizardModuleConfirmation,
                    PaymentWizardModuleShowInvoices,
                    [
                        PaymentWizardModuleShowCreditTransaction,
                        {
                            transaction_type: 'deposit'
                        }
                    ],
                    [
                        PaymentWizardModuleShowCreditTransaction,
                        {
                            transaction_type: 'credit'
                        }
                    ],
                    PaymentWizardModuleShowPayments,
                    [
                        PaymentWizardModuleConfirmationSummary,
                        {
                            container: '#wizard-step-content-right',
                            submit: true
                        }
                    ]
                ]
            }
        ]
    }
];

export = paymentWizardSteps;

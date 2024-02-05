/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("PaymentWizard.Configuration", ["require", "exports", "Utils", "jQuery", "CardHolderAuthentication", "Configuration", "PaymentWizard.Module.Invoice", "PaymentWizard.ThreeDSecure", "PaymentWizard.Module.Summary", "PaymentWizard.Module.CreditTransaction", "PaymentWizard.Module.PaymentMethod.Selector", "PaymentWizard.Module.PaymentMethod.Creditcard", "PaymentWizard.Module.ShowInvoices", "PaymentWizard.Module.Confirmation", "PaymentWizard.Module.ShowPayments", "PaymentWizard.Module.ConfirmationSummary", "PaymentWizard.Module.ShowCreditTransaction", "Backbone"], function (require, exports, Utils, jQuery, CardHolderAuthentication_1, Configuration_1, PaymentWizardModuleInvoice, PaymentWizardThreeDSecure, PaymentWizardModuleSummary, PaymentWizardModuleCreditTransaction, PaymentWizardModulePaymentMethodSelector, PaymentWizardModulePaymentMethodCreditcard, PaymentWizardModuleShowInvoices, PaymentWizardModuleConfirmation, PaymentWizardModuleShowPayments, PaymentWizardModuleConfirmationSummary, PaymentWizardModuleShowCreditTransaction, Backbone) {
    "use strict";
    var paymentWizardSteps = [
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
                    save: function () {
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
                    save: function () {
                        var _this = this;
                        var promise = jQuery.Deferred();
                        promise.done(function () {
                            _this.wizard.model.get('invoicesSelected').reset();
                        });
                        return this.wizard.model
                            .save()
                            .then(function (customerPayment) {
                            var confirmation = new Backbone.Model(customerPayment);
                            if (CardHolderAuthentication_1.isPaymentAuthenticationRequired(confirmation) &&
                                SC.CONFIGURATION.isThreeDSecureEnabled) {
                                new PaymentWizardThreeDSecure({
                                    layout: _this.wizard.application.getLayout(),
                                    application: _this.wizard.application,
                                    wizard: _this.wizard,
                                    deferred: promise,
                                    confirmation: customerPayment
                                }).showInModal();
                                return promise;
                            }
                            if (customerPayment.confirmation &&
                                customerPayment.confirmation.statuscode === 'redirect') {
                                window.location.href = Utils.addParamsToUrl(customerPayment.confirmation.redirecturl, {
                                    touchpoint: Configuration_1.Configuration.get('currentTouchpoint')
                                });
                                return promise.reject();
                            }
                            return promise.resolve();
                        })
                            .fail(function () {
                            promise.reject();
                        });
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
    return paymentWizardSteps;
});

//# sourceMappingURL=PaymentWizard.Configuration.js.map

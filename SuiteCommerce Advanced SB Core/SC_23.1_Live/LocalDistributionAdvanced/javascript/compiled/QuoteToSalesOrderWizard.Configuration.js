/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("QuoteToSalesOrderWizard.Configuration", ["require", "exports", "underscore", "Utils", "Configuration", "jQuery", "CardHolderAuthentication", "OrderWizard.Module.CartSummary", "OrderWizard.Module.ShowShipments", "OrderWizard.Module.ShowPayments", "OrderWizard.Module.TermsAndConditions", "OrderWizard.Module.SubmitButton", "OrderWizard.Module.PaymentMethod.Creditcard", "OrderWizard.Module.PaymentMethod.Invoice", "QuoteToSalesOrderWizard.Module.QuoteDetails", "QuoteToSalesOrderWizard.Module.Confirmation", "QuoteToSalesOrderWizard.Module.PaymentMethod.Selector", "QuoteToSalesOrderWizard.ThreeDSecure", "Header.View", "QuoteToSalesOrder.Module.Address.Billing"], function (require, exports, _, Utils, Configuration_1, jQuery, CardHolderAuthentication_1, OrderWizardModuleCartSummary, OrderWizardModuleShowShipments, OrderWizardModuleShowPayments, OrderWizardModuleTermsAndConditions, OrderWizardModuleSubmitButton, OrderWizardModulePaymentMethodCreditcard, OrderWizardModulePaymentMethodInvoice, QuoteToSalesOrderWizardModuleQuoteDetails, QuoteToSalesOrderWizardModuleConfirmation, QuoteToSalesOrderWizardModulePaymentMethodSelector, QuoteToSalesOrderWizardThreeDSecure, HeaderView, QuoteToSalesOrderModuleAddressBilling) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QuoteToSalesOrderWizardConfiguration = void 0;
    exports.QuoteToSalesOrderWizardConfiguration = {
        steps: [
            {
                name: Utils.translate('Review your order').toUpperCase(),
                steps: [
                    {
                        url: 'quotetosalesorder-review',
                        name: Utils.translate('Review Your Oder'),
                        hideBackButton: true,
                        hideContinueButton: false,
                        continueButtonLabel: Utils.translate('Place Order'),
                        hideBreadcrumb: true,
                        showBottomMessage: true,
                        modules: [
                            QuoteToSalesOrderWizardModuleQuoteDetails,
                            [
                                OrderWizardModuleCartSummary,
                                {
                                    container: '#wizard-step-content-right',
                                    warningMessage: Utils.translate('Total may include handling costs not displayed in the summary breakdown')
                                }
                            ],
                            [
                                OrderWizardModuleTermsAndConditions,
                                {
                                    container: '#wizard-step-content-right',
                                    showWrapper: true,
                                    wrapperClass: 'order-wizard-termsandconditions-module-top-summary'
                                }
                            ],
                            [
                                OrderWizardModuleTermsAndConditions,
                                {
                                    container: '#wizard-step-content-right',
                                    showWrapper: true,
                                    wrapperClass: 'order-wizard-termsandconditions-module-bottom'
                                }
                            ],
                            [
                                OrderWizardModuleSubmitButton,
                                {
                                    container: '#wizard-step-content-right',
                                    showWrapper: true,
                                    wrapperClass: 'order-wizard-submitbutton-container'
                                }
                            ],
                            [
                                QuoteToSalesOrderWizardModulePaymentMethodSelector,
                                {
                                    record_type: 'salesorder',
                                    modules: [
                                        {
                                            classModule: OrderWizardModulePaymentMethodCreditcard,
                                            name: Utils.translate('Credit / Debit Card'),
                                            type: 'creditcard',
                                            options: {}
                                        },
                                        {
                                            classModule: OrderWizardModulePaymentMethodInvoice,
                                            name: Utils.translate('Invoice'),
                                            type: 'invoice',
                                            options: {}
                                        }
                                    ]
                                }
                            ],
                            [
                                QuoteToSalesOrderModuleAddressBilling,
                                {
                                    title: Utils.translate('Billing Address')
                                }
                            ],
                            [
                                OrderWizardModuleShowShipments,
                                {
                                    hide_edit_cart_button: true,
                                    hide_edit_address_button: true
                                }
                            ],
                            [
                                OrderWizardModuleTermsAndConditions,
                                {
                                    showWrapper: true,
                                    wrapperClass: 'order-wizard-termsandconditions-module-default'
                                }
                            ]
                        ],
                        save: function () {
                            var _this = this;
                            var first_module_instance = _.first(this.moduleInstances);
                            first_module_instance.trigger('change_label_continue', Utils.translate('Processing...'));
                            var orderSubmission = jQuery.Deferred();
                            return this.wizard.model
                                .submit()
                                .then(function (salesOrder) {
                                var confirmation = _this.wizard.model.get('confirmation');
                                if (SC.CONFIGURATION.isThreeDSecureEnabled) {
                                    if (CardHolderAuthentication_1.isPaymentAuthenticationRequired(confirmation)) {
                                        new QuoteToSalesOrderWizardThreeDSecure({
                                            layout: _this.wizard.application.getLayout(),
                                            application: _this.wizard.application,
                                            wizard: _this.wizard,
                                            deferred: orderSubmission,
                                            confirmation: confirmation
                                        }).showInModal();
                                    }
                                    else {
                                        orderSubmission.rejectWith(_this.wizard);
                                    }
                                    return orderSubmission;
                                }
                                if (salesOrder.confirmation &&
                                    salesOrder.confirmation.statuscode === 'redirect') {
                                    window.location.href = Utils.addParamsToUrl(salesOrder.confirmation.redirecturl, {
                                        touchpoint: Configuration_1.Configuration.get('currentTouchpoint')
                                    });
                                    return orderSubmission.reject();
                                }
                                first_module_instance.trigger('change_label_continue', Utils.translate('Placed Order'));
                                return orderSubmission.resolve();
                            })
                                .fail(function (error) {
                                first_module_instance.trigger('change_label_continue', Utils.translate('Submit'));
                                return orderSubmission.reject(error);
                            });
                        }
                    }
                ]
            },
            {
                steps: [
                    {
                        url: 'quotetosalesorder-confirmation',
                        hideContinueButton: true,
                        name: Utils.translate('Thank you'),
                        hideBackButton: true,
                        hideBreadcrumb: true,
                        headerView: HeaderView,
                        modules: [
                            [
                                OrderWizardModuleCartSummary,
                                {
                                    container: '#wizard-step-content-right',
                                    warningMessage: Utils.translate('Total may include handling costs not displayed in the summary breakdown')
                                }
                            ],
                            QuoteToSalesOrderWizardModuleConfirmation,
                            QuoteToSalesOrderWizardModuleQuoteDetails,
                            [OrderWizardModuleShowPayments],
                            [
                                OrderWizardModuleShowShipments,
                                {
                                    hide_edit_cart_button: true,
                                    hide_edit_address_button: true
                                }
                            ]
                        ]
                    }
                ]
            }
        ]
    };
});

//# sourceMappingURL=QuoteToSalesOrderWizard.Configuration.js.map

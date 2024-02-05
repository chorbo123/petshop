/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="QuoteToSalesOrderWizard.Configuration"/>

import * as _ from 'underscore';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import { Configuration } from '../../SCA/JavaScript/Configuration';

import * as jQuery from '../../../Commons/Core/JavaScript/jQuery';
import { isPaymentAuthenticationRequired } from '../../../Commons/CardHolderAuthentication/JavaScript/CardHolderAuthentication';

import OrderWizardModuleCartSummary = require('../../OrderWizard.Module.CartSummary/JavaScript/OrderWizard.Module.CartSummary');
import OrderWizardModuleShowShipments = require('../../OrderWizard.Module.Shipmethod/JavaScript/OrderWizard.Module.ShowShipments');
import OrderWizardModuleShowPayments = require('../../OrderWizard.Module.PaymentMethod/JavaScript/OrderWizard.Module.ShowPayments');
import OrderWizardModuleTermsAndConditions = require('../../OrderWizard.Module.TermsAndConditions/JavaScript/OrderWizard.Module.TermsAndConditions');
import OrderWizardModuleSubmitButton = require('../../OrderWizard.Module.SubmitButton/JavaScript/OrderWizard.Module.SubmitButton');
import OrderWizardModulePaymentMethodCreditcard = require('../../OrderWizard.Module.PaymentMethod/JavaScript/OrderWizard.Module.PaymentMethod.Creditcard');
import OrderWizardModulePaymentMethodInvoice = require('../../OrderWizard.Module.PaymentMethod/JavaScript/OrderWizard.Module.PaymentMethod.Invoice');

import QuoteToSalesOrderWizardModuleQuoteDetails = require('../../QuoteToSalesOrderWizard/JavaScript/QuoteToSalesOrderWizard.Module.QuoteDetails');
import QuoteToSalesOrderWizardModuleConfirmation = require('../../QuoteToSalesOrderWizard/JavaScript/QuoteToSalesOrderWizard.Module.Confirmation');
import QuoteToSalesOrderWizardModulePaymentMethodSelector = require('../../QuoteToSalesOrderWizard/JavaScript/QuoteToSalesOrderWizard.Module.PaymentMethod.Selector');
import QuoteToSalesOrderWizardThreeDSecure = require('../../QuoteToSalesOrderWizard/JavaScript/QuoteToSalesOrderWizard.ThreeDSecure');
import HeaderView = require('../../Header/JavaScript/Header.View');
import QuoteToSalesOrderModuleAddressBilling = require('./QuoteToSalesOrder.Module.Address.Billing');

export type QuoteToSalesOrderWizardConfiguration = any;
export const QuoteToSalesOrderWizardConfiguration: any = {
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
                                warningMessage: Utils.translate(
                                    'Total may include handling costs not displayed in the summary breakdown'
                                )
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
                    save: function() {
                        const first_module_instance: any = _.first(this.moduleInstances);
                        first_module_instance.trigger(
                            'change_label_continue',
                            Utils.translate('Processing...')
                        );
                        const orderSubmission = jQuery.Deferred();
                        return this.wizard.model
                            .submit()
                            .then(salesOrder => {
                                const confirmation = this.wizard.model.get('confirmation');
                                if (SC.CONFIGURATION.isThreeDSecureEnabled) {
                                    if (isPaymentAuthenticationRequired(confirmation)) {
                                        new QuoteToSalesOrderWizardThreeDSecure({
                                            layout: this.wizard.application.getLayout(),
                                            application: this.wizard.application,
                                            wizard: this.wizard,
                                            deferred: orderSubmission,
                                            confirmation: confirmation
                                        }).showInModal();
                                    } else {
                                        orderSubmission.rejectWith(this.wizard);
                                    }
                                    return orderSubmission;
                                }
                                if (
                                    salesOrder.confirmation &&
                                    salesOrder.confirmation.statuscode === 'redirect'
                                ) {
                                    window.location.href = Utils.addParamsToUrl(
                                        salesOrder.confirmation.redirecturl,
                                        {
                                            touchpoint: Configuration.get('currentTouchpoint')
                                        }
                                    );
                                    return orderSubmission.reject();
                                }

                                first_module_instance.trigger(
                                    'change_label_continue',
                                    Utils.translate('Placed Order')
                                );

                                return orderSubmission.resolve();
                            })
                            .fail(error => {
                                first_module_instance.trigger(
                                    'change_label_continue',
                                    Utils.translate('Submit')
                                );
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
                                warningMessage: Utils.translate(
                                    'Total may include handling costs not displayed in the summary breakdown'
                                )
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

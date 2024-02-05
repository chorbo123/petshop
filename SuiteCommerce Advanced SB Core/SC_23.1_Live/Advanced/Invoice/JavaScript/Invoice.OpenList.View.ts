/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Invoice.OpenList.View"/>

import '../../../Commons/Backbone.CompositeView/JavaScript/Backbone.CompositeView';
import './Invoice.Date.View';
import * as _ from 'underscore';
import * as invoice_open_list_tpl from 'invoice_open_list.tpl';
import * as Utils from '../../../Commons/Utilities/JavaScript/Utils';
import { Configuration } from '../../SCA/JavaScript/Configuration';
import { ListHeaderView } from '../../../Commons/ListHeader/JavaScript/ListHeader.View';
import { GlobalViewsPaginationView } from '../../../Commons/GlobalViews/JavaScript/GlobalViews.Pagination.View';
import { AjaxRequestsKiller } from '../../../Commons/AjaxRequestsKiller/JavaScript/AjaxRequestsKiller';
import { GlobalViewsMessageView } from '../../../Commons/GlobalViews/JavaScript/GlobalViews.Message.View';

import TransactionListView = require('../../../Commons/Transaction/JavaScript/Transaction.List.View');
import InvoiceCollection = require('./Invoice.Collection');
import LivePaymentModel = require('../../LivePayment/JavaScript/LivePayment.Model');
import BackboneCollectionView = require('../../../Commons/Backbone.CollectionView/JavaScript/Backbone.CollectionView');
import Handlebars = require('../../../Commons/Utilities/JavaScript/Handlebars');
import RecordViewsSelectableView = require('../../RecordViews/JavaScript/RecordViews.Selectable.View');
import Backbone = require('../../../Commons/Utilities/JavaScript/backbone.custom');

// returns the amount of days based on milliseconds
function getDays(milliseconds: number): number {
    return milliseconds / 1000 / 60 / 60 / 24;
}

// @class Invoice.OpenList.View @extends Backbone.View
const InvoiceOpenListView: any = TransactionListView.extend({
    // @property {Function} template
    template: invoice_open_list_tpl,

    // @property {String} title
    title: Utils.translate('Invoices'),

    // @property {String} page_header
    page_header: Utils.translate('Invoices'),

    // @property {Object} attributes
    attributes: {
        id: 'OpenInvoicesHistory',
        class: 'Invoices'
    },

    // @property {Object} events
    events: {
        'click [data-action="select-invoice"]': 'toggleInvoiceHandler',
        'click [data-type="make-a-payment"]': 'makeAPayment'
    },

    // @method initialize
    initialize: function initialize(options): void {
        this.params = {};

        if (options.routerArguments && options.routerArguments[0]) {
            this.params = Utils.parseUrlOptions(options.routerArguments[0]);
        }

        this.collection = new InvoiceCollection([], { status: 'open' });
        this.collection.on('sync', this.showContent, this);

        this.livePaymentModel = LivePaymentModel.getInstance();
        this.disableCheckField = 'disable_payment';

        // manges sorting and filtering of the collection
        this.listHeader = new ListHeaderView({
            view: this,
            application: options.application,
            collection: this.collection,
            filters: this.filterOptions,
            sorts: this.sortOptions,
            selectable: true,
            hidePagination: true,
            avoidFirstFetch: true
        });

        this.listHeader.getUnselectedLength = this.getUnselectedLength;
        this.listHeader.getCollectionLength = this.getCollectionLength;

        this.collection.on('sync reset', () => {
            this.livePaymentModel.get('invoicesSelected').each(invoice => {
                const invCol = this.collection.get(invoice);

                if (invCol) {
                    invCol.set('checked', true);
                }
            });
        });

        this.params.page = this.params.page || 1;
        this.params.range = this.params.range
            ? this.listHeader.getRangeFromUrl(this.params.range)
            : {};
        this.params.sort = this.params.sort || this.sortOptions.find(sort => sort.default).value;
    },

    beforeShowContent: function beforeShowContent() {
        const data = {
            sort: this.params.sort,
            order: this.params.order,
            from: this.params.range.from,
            to: this.params.range.to,
            page: this.params.page,
            status: 'open'
        };

        return this.collection.fetch({
            data: data,
            killerId: AjaxRequestsKiller.getKillerId()
        });
    },

    // @method getCollectionLength Returns the length of selectable invoices
    getCollectionLength: function() {
        const self = this.view;

        return this.collection.filter(function(inv) {
            return !inv.get(self.disableCheckField);
        }).length;
    },

    // @method getUnselectedLength Returns the length of unselected invoices
    getUnselectedLength: function() {
        const self = this.view;

        return this.collection.filter(function(record) {
            return !record.get(self.disableCheckField) && !record.get('checked');
        }).length;
    },

    // @method getSelectedInvoicesLength Returns the count of selected invoices (This method is used by the template)
    getSelectedInvoicesLength: function() {
        return this.livePaymentModel.get('invoicesSelected').length;
    },

    // @method differentCurrencies Returns if there are different currencies selected
    differentCurrencies: function(): boolean {
        let differentCurrencies = [];
        const invoicesSelected = this.livePaymentModel.get('invoicesSelected');

        if (invoicesSelected.length > 0) {
            const firstInvoiceCurrency = invoicesSelected.at(0).currency;
            if (firstInvoiceCurrency) {
                differentCurrencies = invoicesSelected.filter(invoice => {
                    return invoice.currency.internalid !== firstInvoiceCurrency.internalid;
                });
            }
        }

        return differentCurrencies.length > 0;
    },

    // @method paymentStatus UnapprovedPayment Returns if exist a invoice with last payment status unapprovedPayment
    paymentStatusUnapprovedPayment: function(): boolean {
        return this.livePaymentModel
            .get('invoicesSelected')
            .some(
                (invoice: any) =>
                    invoice.get('payment') && invoice.get('payment').status === 'unapprovedPayment'
            );
    },

    // @method toggleInvoiceHandler Handle to used to change the status of an invoice
    toggleInvoiceHandler: function(e): void {
        this.toggleInvoice(this.$(e.currentTarget).data('id'));
    },

    // @method toggleInvoice Change the state (selected/unselected) of the specified invoice Model
    toggleInvoice: function(invoice): void {
        invoice = this.collection.get(invoice);

        if (invoice) {
            this[invoice.get('checked') ? 'unselectInvoice' : 'selectInvoice'](invoice);
            this.render();
        }
    },

    // @method makeAPayment change the currency of the LivePayment
    makeAPayment: function(): void {
        this.livePaymentModel.makeAPayment(this.livePaymentModel.get('invoicesSelected').models);
    },

    // @method selectInvoice select a specified invoice Model
    selectInvoice: function(invoice): void {
        if (invoice && !invoice.get(this.disableCheckField)) {
            invoice.set('checked', true);
        }

        this.livePaymentModel.get('invoicesSelected').add(invoice);
    },

    // @method unselectInvoice unselect a specified invoice Model
    unselectInvoice: function(invoice): void {
        if (invoice) {
            invoice.set('checked', false);
        }

        this.livePaymentModel.get('invoicesSelected').remove(invoice);
    },

    // @method selectAll selects all invoices
    selectAll: function(): void {
        const self = this;
        let has_changed = false;

        this.collection.each(function(invoice) {
            if (!invoice.get('checked') && !invoice.get(self.disableCheckField)) {
                has_changed = true;
                // select the invoice
                self.selectInvoice(invoice, {
                    silent: true
                });
            }
        });

        // The select all might've been called
        // on a collection that was already fully selected
        // so let's not due an painfull useless render, shall we?
        if (has_changed) {
            this.render();
        }
    },

    // @method unselectAll unselects all invoices
    unselectAll: function(): void {
        const self = this;
        let has_changed = false;

        this.collection.each(function(invoice) {
            if (invoice.get('checked')) {
                has_changed = true;
                // unselects the invoice
                self.unselectInvoice(invoice, {
                    silent: true
                });
            }
        });

        // The unselect all might've been called
        // on a collection that had none selected
        // so let's not due an painfull useless render, shall we?
        if (has_changed) {
            this.render();
        }
    },
    // @method getSelectedMenu
    getSelectedMenu: function(): string {
        return 'invoices';
    },
    // @method getBreadcrumbPages
    getBreadcrumbPages: function() {
        return {
            text: this.title,
            href: '/paid-invoices'
        };
    },
    // @property {Array} filterOptions
    // Array of default filter options
    // filters always apply on the original collection
    filterOptions: [
        {
            value: 'overdue',
            name: Utils.translate('Show Overdue'),
            filter: function() {
                return this.original.filter(function(invoice) {
                    return !invoice.get('dueinmilliseconds') || invoice.get('isOverdue');
                });
            }
        },
        {
            value: 'next7days',
            name: Utils.translate('Show Due next 7 days'),
            filter: function() {
                return this.original.filter(function(invoice) {
                    return (
                        !invoice.get('dueinmilliseconds') ||
                        getDays(invoice.get('dueinmilliseconds')) <= 7
                    );
                });
            }
        },
        {
            value: 'next30days',
            name: Utils.translate('Show Due next 30 days'),
            filter: function() {
                return this.original.filter(function(invoice) {
                    return (
                        !invoice.get('dueinmilliseconds') ||
                        getDays(invoice.get('dueinmilliseconds')) <= 30
                    );
                });
            }
        },
        {
            value: 'next60days',
            name: Utils.translate('Show Due next 60 days'),
            filter: function() {
                return this.original.filter(function(invoice) {
                    return (
                        !invoice.get('dueinmilliseconds') ||
                        getDays(invoice.get('dueinmilliseconds')) <= 60
                    );
                });
            }
        },
        {
            value: 'next90days',
            name: Utils.translate('Show Due next 90 days'),
            filter: function() {
                return this.original.filter(function(invoice) {
                    return (
                        !invoice.get('dueinmilliseconds') ||
                        getDays(invoice.get('dueinmilliseconds')) <= 90
                    );
                });
            }
        },
        {
            value: 'all',
            name: Utils.translate('Show All'),
            selected: true,
            default: true,
            filter: function() {
                return this.original.models;
            }
        }
    ],
    // @property {Array} sortOptions
    // Array of default sort options
    // sorts only apply on the current collection
    // which might be a filtered version of the original
    sortOptions: [
        {
            value: 'duedate',
            name: Utils.translate('By Due Date'),
            selected: true,
            default: true,
            sort: function() {
                return this.models.sort(function(invoiceOne, invoiceTwo) {
                    const milli_inv_one = invoiceOne.get('dueinmilliseconds') || 0;
                    const milli_inv_two = invoiceTwo.get('dueinmilliseconds') || 0;

                    if (milli_inv_one !== milli_inv_two) {
                        return milli_inv_one < milli_inv_two ? -1 : 1;
                    }

                    return invoiceOne.get('tranid') < invoiceTwo.get('tranid') ? -1 : 1;
                });
            }
        },
        {
            value: 'trandate',
            name: Utils.translate('By Invoice Date'),
            sort: function() {
                return this.models.sort(function(invoiceOne, invoiceTwo) {
                    const milli_inv_one = invoiceOne.get('tranDateInMilliseconds') || 0;
                    const milli_inv_two = invoiceTwo.get('tranDateInMilliseconds') || 0;

                    if (milli_inv_one !== milli_inv_two) {
                        return milli_inv_one < milli_inv_two ? -1 : 1;
                    }

                    return invoiceOne.get('tranid') < invoiceTwo.get('tranid') ? -1 : 1;
                });
            }
        },
        {
            value: 'tranid',
            name: Utils.translate('By Invoice Number'),
            sort: function() {
                return this.sortBy(function(invoice) {
                    return parseInt(
                        invoice
                            .get('tranid')
                            .split(/[^\(\)0-9]*/)
                            .join(''),
                        10
                    );
                });
            }
        },
        {
            value: 'amount_remaining',
            name: Utils.translate('By Amount Due'),
            sort: function() {
                return this.sortBy(function(invoice) {
                    return invoice.get('amountremaining');
                });
            }
        }
    ],

    getInvoiceMaxCountPayment: function() {
        return Configuration.get('checkoutApp.invoiceMaxCountPayment', 20);
    },

    // @property {Object} childViews
    childViews: {
        ListHeader: function() {
            return this.listHeader;
        },
        'Invoice.Results': function() {
            return this._resultsView;
        },
        'Invoices.Message': function() {
            const messages = [];

            if (this.differentCurrencies()) {
                messages.push(
                    Utils.translate('Sorry, you can not pay invoices in different currencies')
                );
            }

            if (this.paymentStatusUnapprovedPayment()) {
                messages.push(
                    Utils.translate(
                        'Sorry, you can not pay an invoice with an Unapproved Payment. In order to pay this invoice, get in contact with us'
                    )
                );
            }

            const diffSelectedMaxCount =
                this.getSelectedInvoicesLength() - this.getInvoiceMaxCountPayment();

            if (diffSelectedMaxCount > 0) {
                messages.push(
                    Utils.translate(
                        'Sorry, you cannot pay more than $(0) invoice(s) at the same time. Please unselect $(1) invoice(s)',
                        this.getInvoiceMaxCountPayment(),
                        diffSelectedMaxCount,
                        '(0): Max number of invoices that the user can pay. (1): Number of invoices that the user needs to unselect'
                    )
                );
            }

            if (!_.isEmpty(messages)) {
                return new GlobalViewsMessageView({
                    message: messages,
                    type: 'warning',
                    closable: false
                });
            }
        },
        'GlobalViews.Pagination': function() {
            return new GlobalViewsPaginationView(
                _.extend(
                    {
                        totalPages: Math.ceil(
                            this.collection.totalRecordsFound / this.collection.recordsPerPage
                        )
                    },
                    Configuration.defaultPaginationSettings
                )
            );
        }
    },
    _buildResultsView: function() {
        const self = this;
        let selectedColumns = [];

        if (!Configuration.get().transactionListColumns.enableInvoice) {
            selectedColumns.push({ label: 'Date', type: 'date', name: 'date', id: 'trandate' });
            selectedColumns.push({
                label: 'Amount',
                type: 'currency',
                name: 'amount',
                id: 'amount_formatted'
            });
            selectedColumns.push({
                label: 'Due Date',
                id: 'due-date',
                type: 'date',
                compositeKey: 'InvoiceDateView',
                composite: 'Invoice.Date.View',
                fields: ['isOverdue', 'dueDate', 'isPartiallyPaid', 'payment']
            });
        } else {
            selectedColumns = Configuration.get().transactionListColumns.invoiceOpen;
        }

        const records_collection = new Backbone.Collection(
            this.collection.map(function(invoice) {
                const model = new Backbone.Model({
                    touchpoint: 'customercenter',
                    title: new Handlebars.SafeString(
                        Utils.translate(
                            'Invoice #<span class="tranid">$(0)</span>',
                            invoice.get('tranid')
                        )
                    ),
                    url: `invoices/${invoice.get('internalid')}`,
                    actionType: 'select-invoice',

                    active: true,

                    id: invoice.get('internalid'),
                    internalid: invoice.get('internalid'),

                    check: invoice.get('checked'),
                    navigable: true,

                    columns: self._buildColumns(selectedColumns, invoice)
                });

                return model;
            })
        );

        return new BackboneCollectionView({
            childView: RecordViewsSelectableView,
            collection: records_collection,
            viewsPerRow: 1,
            childViewOptions: {
                referrer: 'invoices'
            }
        });
    },

    // @method getContext
    // @returns {Invoice.OpenList.View.Context}
    getContext: function() {
        this._resultsView = this._buildResultsView();
        let columns = [];
        if (this._resultsView.collection.length > 0) {
            columns = this._resultsView.collection.at(0).get('columns');
        }
        const invoices = this.collection;

        // @class Invoice.OpenList.View.Context
        return {
            // @property {Invoice.Collection} invoices
            invoices: invoices,
            // @property {Boolean} showInvoices
            showInvoices: !!invoices.length,
            // @property {String} pageHeader
            pageHeader: this.page_header,
            // @property {Boolean} showMakeAPaymentButton
            showMakeAPaymentButton: this.collection.length > 0,
            // @property {Boolean} enableMakeAPaymentButton
            enableMakeAPaymentButton:
                this.getSelectedInvoicesLength() > 0 &&
                this.getSelectedInvoicesLength() <= this.getInvoiceMaxCountPayment() &&
                !this.differentCurrencies() &&
                !this.paymentStatusUnapprovedPayment(),
            // @property {Boolean} showBackToAccount
            showBackToAccount: Configuration.get('siteSettings.sitetype') === 'STANDARD',
            // @property {Array<{}>} columns
            columns: columns,
            // @property {Boolean} showPagination
            showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage)
        };
    }
});

export = InvoiceOpenListView;

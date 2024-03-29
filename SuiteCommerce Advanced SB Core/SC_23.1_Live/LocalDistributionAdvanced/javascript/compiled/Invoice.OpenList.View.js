/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Invoice.OpenList.View", ["require", "exports", "underscore", "invoice_open_list.tpl", "Utils", "Configuration", "ListHeader.View", "GlobalViews.Pagination.View", "AjaxRequestsKiller", "GlobalViews.Message.View", "Transaction.List.View", "Invoice.Collection", "LivePayment.Model", "Backbone.CollectionView", "Handlebars", "RecordViews.Selectable.View", "Backbone", "Backbone.CompositeView", "Invoice.Date.View"], function (require, exports, _, invoice_open_list_tpl, Utils, Configuration_1, ListHeader_View_1, GlobalViews_Pagination_View_1, AjaxRequestsKiller_1, GlobalViews_Message_View_1, TransactionListView, InvoiceCollection, LivePaymentModel, BackboneCollectionView, Handlebars, RecordViewsSelectableView, Backbone) {
    "use strict";
    // returns the amount of days based on milliseconds
    function getDays(milliseconds) {
        return milliseconds / 1000 / 60 / 60 / 24;
    }
    // @class Invoice.OpenList.View @extends Backbone.View
    var InvoiceOpenListView = TransactionListView.extend({
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
        initialize: function initialize(options) {
            var _this = this;
            this.params = {};
            if (options.routerArguments && options.routerArguments[0]) {
                this.params = Utils.parseUrlOptions(options.routerArguments[0]);
            }
            this.collection = new InvoiceCollection([], { status: 'open' });
            this.collection.on('sync', this.showContent, this);
            this.livePaymentModel = LivePaymentModel.getInstance();
            this.disableCheckField = 'disable_payment';
            // manges sorting and filtering of the collection
            this.listHeader = new ListHeader_View_1.ListHeaderView({
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
            this.collection.on('sync reset', function () {
                _this.livePaymentModel.get('invoicesSelected').each(function (invoice) {
                    var invCol = _this.collection.get(invoice);
                    if (invCol) {
                        invCol.set('checked', true);
                    }
                });
            });
            this.params.page = this.params.page || 1;
            this.params.range = this.params.range
                ? this.listHeader.getRangeFromUrl(this.params.range)
                : {};
            this.params.sort = this.params.sort || this.sortOptions.find(function (sort) { return sort.default; }).value;
        },
        beforeShowContent: function beforeShowContent() {
            var data = {
                sort: this.params.sort,
                order: this.params.order,
                from: this.params.range.from,
                to: this.params.range.to,
                page: this.params.page,
                status: 'open'
            };
            return this.collection.fetch({
                data: data,
                killerId: AjaxRequestsKiller_1.AjaxRequestsKiller.getKillerId()
            });
        },
        // @method getCollectionLength Returns the length of selectable invoices
        getCollectionLength: function () {
            var self = this.view;
            return this.collection.filter(function (inv) {
                return !inv.get(self.disableCheckField);
            }).length;
        },
        // @method getUnselectedLength Returns the length of unselected invoices
        getUnselectedLength: function () {
            var self = this.view;
            return this.collection.filter(function (record) {
                return !record.get(self.disableCheckField) && !record.get('checked');
            }).length;
        },
        // @method getSelectedInvoicesLength Returns the count of selected invoices (This method is used by the template)
        getSelectedInvoicesLength: function () {
            return this.livePaymentModel.get('invoicesSelected').length;
        },
        // @method differentCurrencies Returns if there are different currencies selected
        differentCurrencies: function () {
            var differentCurrencies = [];
            var invoicesSelected = this.livePaymentModel.get('invoicesSelected');
            if (invoicesSelected.length > 0) {
                var firstInvoiceCurrency_1 = invoicesSelected.at(0).currency;
                if (firstInvoiceCurrency_1) {
                    differentCurrencies = invoicesSelected.filter(function (invoice) {
                        return invoice.currency.internalid !== firstInvoiceCurrency_1.internalid;
                    });
                }
            }
            return differentCurrencies.length > 0;
        },
        // @method paymentStatus UnapprovedPayment Returns if exist a invoice with last payment status unapprovedPayment
        paymentStatusUnapprovedPayment: function () {
            return this.livePaymentModel
                .get('invoicesSelected')
                .some(function (invoice) {
                return invoice.get('payment') && invoice.get('payment').status === 'unapprovedPayment';
            });
        },
        // @method toggleInvoiceHandler Handle to used to change the status of an invoice
        toggleInvoiceHandler: function (e) {
            this.toggleInvoice(this.$(e.currentTarget).data('id'));
        },
        // @method toggleInvoice Change the state (selected/unselected) of the specified invoice Model
        toggleInvoice: function (invoice) {
            invoice = this.collection.get(invoice);
            if (invoice) {
                this[invoice.get('checked') ? 'unselectInvoice' : 'selectInvoice'](invoice);
                this.render();
            }
        },
        // @method makeAPayment change the currency of the LivePayment
        makeAPayment: function () {
            this.livePaymentModel.makeAPayment(this.livePaymentModel.get('invoicesSelected').models);
        },
        // @method selectInvoice select a specified invoice Model
        selectInvoice: function (invoice) {
            if (invoice && !invoice.get(this.disableCheckField)) {
                invoice.set('checked', true);
            }
            this.livePaymentModel.get('invoicesSelected').add(invoice);
        },
        // @method unselectInvoice unselect a specified invoice Model
        unselectInvoice: function (invoice) {
            if (invoice) {
                invoice.set('checked', false);
            }
            this.livePaymentModel.get('invoicesSelected').remove(invoice);
        },
        // @method selectAll selects all invoices
        selectAll: function () {
            var self = this;
            var has_changed = false;
            this.collection.each(function (invoice) {
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
        unselectAll: function () {
            var self = this;
            var has_changed = false;
            this.collection.each(function (invoice) {
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
        getSelectedMenu: function () {
            return 'invoices';
        },
        // @method getBreadcrumbPages
        getBreadcrumbPages: function () {
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
                filter: function () {
                    return this.original.filter(function (invoice) {
                        return !invoice.get('dueinmilliseconds') || invoice.get('isOverdue');
                    });
                }
            },
            {
                value: 'next7days',
                name: Utils.translate('Show Due next 7 days'),
                filter: function () {
                    return this.original.filter(function (invoice) {
                        return (!invoice.get('dueinmilliseconds') ||
                            getDays(invoice.get('dueinmilliseconds')) <= 7);
                    });
                }
            },
            {
                value: 'next30days',
                name: Utils.translate('Show Due next 30 days'),
                filter: function () {
                    return this.original.filter(function (invoice) {
                        return (!invoice.get('dueinmilliseconds') ||
                            getDays(invoice.get('dueinmilliseconds')) <= 30);
                    });
                }
            },
            {
                value: 'next60days',
                name: Utils.translate('Show Due next 60 days'),
                filter: function () {
                    return this.original.filter(function (invoice) {
                        return (!invoice.get('dueinmilliseconds') ||
                            getDays(invoice.get('dueinmilliseconds')) <= 60);
                    });
                }
            },
            {
                value: 'next90days',
                name: Utils.translate('Show Due next 90 days'),
                filter: function () {
                    return this.original.filter(function (invoice) {
                        return (!invoice.get('dueinmilliseconds') ||
                            getDays(invoice.get('dueinmilliseconds')) <= 90);
                    });
                }
            },
            {
                value: 'all',
                name: Utils.translate('Show All'),
                selected: true,
                default: true,
                filter: function () {
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
                sort: function () {
                    return this.models.sort(function (invoiceOne, invoiceTwo) {
                        var milli_inv_one = invoiceOne.get('dueinmilliseconds') || 0;
                        var milli_inv_two = invoiceTwo.get('dueinmilliseconds') || 0;
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
                sort: function () {
                    return this.models.sort(function (invoiceOne, invoiceTwo) {
                        var milli_inv_one = invoiceOne.get('tranDateInMilliseconds') || 0;
                        var milli_inv_two = invoiceTwo.get('tranDateInMilliseconds') || 0;
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
                sort: function () {
                    return this.sortBy(function (invoice) {
                        return parseInt(invoice
                            .get('tranid')
                            .split(/[^\(\)0-9]*/)
                            .join(''), 10);
                    });
                }
            },
            {
                value: 'amount_remaining',
                name: Utils.translate('By Amount Due'),
                sort: function () {
                    return this.sortBy(function (invoice) {
                        return invoice.get('amountremaining');
                    });
                }
            }
        ],
        getInvoiceMaxCountPayment: function () {
            return Configuration_1.Configuration.get('checkoutApp.invoiceMaxCountPayment', 20);
        },
        // @property {Object} childViews
        childViews: {
            ListHeader: function () {
                return this.listHeader;
            },
            'Invoice.Results': function () {
                return this._resultsView;
            },
            'Invoices.Message': function () {
                var messages = [];
                if (this.differentCurrencies()) {
                    messages.push(Utils.translate('Sorry, you can not pay invoices in different currencies'));
                }
                if (this.paymentStatusUnapprovedPayment()) {
                    messages.push(Utils.translate('Sorry, you can not pay an invoice with an Unapproved Payment. In order to pay this invoice, get in contact with us'));
                }
                var diffSelectedMaxCount = this.getSelectedInvoicesLength() - this.getInvoiceMaxCountPayment();
                if (diffSelectedMaxCount > 0) {
                    messages.push(Utils.translate('Sorry, you cannot pay more than $(0) invoice(s) at the same time. Please unselect $(1) invoice(s)', this.getInvoiceMaxCountPayment(), diffSelectedMaxCount, '(0): Max number of invoices that the user can pay. (1): Number of invoices that the user needs to unselect'));
                }
                if (!_.isEmpty(messages)) {
                    return new GlobalViews_Message_View_1.GlobalViewsMessageView({
                        message: messages,
                        type: 'warning',
                        closable: false
                    });
                }
            },
            'GlobalViews.Pagination': function () {
                return new GlobalViews_Pagination_View_1.GlobalViewsPaginationView(_.extend({
                    totalPages: Math.ceil(this.collection.totalRecordsFound / this.collection.recordsPerPage)
                }, Configuration_1.Configuration.defaultPaginationSettings));
            }
        },
        _buildResultsView: function () {
            var self = this;
            var selectedColumns = [];
            if (!Configuration_1.Configuration.get().transactionListColumns.enableInvoice) {
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
            }
            else {
                selectedColumns = Configuration_1.Configuration.get().transactionListColumns.invoiceOpen;
            }
            var records_collection = new Backbone.Collection(this.collection.map(function (invoice) {
                var model = new Backbone.Model({
                    touchpoint: 'customercenter',
                    title: new Handlebars.SafeString(Utils.translate('Invoice #<span class="tranid">$(0)</span>', invoice.get('tranid'))),
                    url: "invoices/" + invoice.get('internalid'),
                    actionType: 'select-invoice',
                    active: true,
                    id: invoice.get('internalid'),
                    internalid: invoice.get('internalid'),
                    check: invoice.get('checked'),
                    navigable: true,
                    columns: self._buildColumns(selectedColumns, invoice)
                });
                return model;
            }));
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
        getContext: function () {
            this._resultsView = this._buildResultsView();
            var columns = [];
            if (this._resultsView.collection.length > 0) {
                columns = this._resultsView.collection.at(0).get('columns');
            }
            var invoices = this.collection;
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
                enableMakeAPaymentButton: this.getSelectedInvoicesLength() > 0 &&
                    this.getSelectedInvoicesLength() <= this.getInvoiceMaxCountPayment() &&
                    !this.differentCurrencies() &&
                    !this.paymentStatusUnapprovedPayment(),
                // @property {Boolean} showBackToAccount
                showBackToAccount: Configuration_1.Configuration.get('siteSettings.sitetype') === 'STANDARD',
                // @property {Array<{}>} columns
                columns: columns,
                // @property {Boolean} showPagination
                showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage)
            };
        }
    });
    return InvoiceOpenListView;
});

//# sourceMappingURL=Invoice.OpenList.View.js.map

/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Quote.List.View", ["require", "exports", "underscore", "quote_list.tpl", "Utils", "Configuration", "ListHeader.View", "RecordViews.View", "Transaction.List.View", "Quote.Collection", "Backbone", "Backbone.CollectionView", "Backbone.View", "Quote.ListExpirationDate.View"], function (require, exports, _, quote_list_tpl, Utils, Configuration_1, ListHeader_View_1, RecordViewsView_1, TransactionListView, QuoteCollection, Backbone, BackboneCollectionView, BackboneView) {
    "use strict";
    return TransactionListView.extend({
        // @property {Function} template
        template: quote_list_tpl,
        // @property {String} className
        className: 'QuoteListView',
        // @property {String} title
        title: Utils.translate('Quotes'),
        // @property {String} page_header
        page_header: Utils.translate('Quotes'),
        // @property {Object} attributes
        attributes: {
            id: 'QuotesHistory',
            class: 'QuoteListView'
        },
        // @method initialize
        // @param {application:AplpicationSkeleton} options
        // @return {Void}
        initialize: function (options) {
            this.application = options.application;
            this.collection = new QuoteCollection();
            this.listenCollection();
            this.setupListHeader();
            this.collection.on('reset', this.showContent, this);
        },
        // @method listenCollection Attaches to the current collection events request and reset to indicate if it is loading data or not
        // @return {Void}
        listenCollection: function () {
            this.setLoading(true);
            this.collection.on({
                request: _.bind(this.setLoading, this, true),
                reset: _.bind(this.setLoading, this, false)
            });
        },
        // @method setupListHeader Initialize the list header component
        // @return {Void}
        setupListHeader: function () {
            // manges sorting and filtering of the collection
            // remove columns that are not in configuration
            var config = Configuration_1.Configuration.get().transactionListColumns;
            if (config.enableQuote) {
                var configOptions_1 = _.pluck(config.quote, 'id');
                this.sortOptions = _.filter(this.sortOptions, function (column) {
                    return configOptions_1.indexOf(column.value) >= 0 || column.selected;
                });
            }
            this.listHeader = new ListHeader_View_1.ListHeaderView({
                view: this,
                application: this.application,
                collection: this.collection,
                filters: this.filterOptions,
                sorts: this.sortOptions,
                allowEmptyBoundaries: true
            });
        },
        // @method setLoading Set the loading status of the current view
        // @param {Boolean} is_loading
        // @return {Void}
        setLoading: function (is_loading) {
            // @property {Boolean} isLoading
            this.isLoading = is_loading;
        },
        // @property {Array<ListHeader.View.FilterOption>} filterOptions
        filterOptions: [
            {
                value: 'ALL',
                name: Utils.translate('Show all statuses'),
                selected: true,
                default: true
            },
            {
                value: '14',
                name: Utils.translate('Closed Lost')
            },
            {
                value: '8',
                name: Utils.translate('In Discussion')
            },
            {
                value: '9',
                name: Utils.translate('Identified Decision Makers')
            },
            {
                value: '10',
                name: Utils.translate('Proposal')
            },
            {
                value: '11',
                name: Utils.translate('In Negotiation')
            },
            {
                value: '12',
                name: Utils.translate('Purchasing')
            }
        ],
        // @property {Array<ListHeader.View.SortOption>} sortOptions
        sortOptions: [
            {
                value: 'tranid',
                name: Utils.translate('by Number'),
                selected: true,
                default: true
            },
            {
                value: 'trandate',
                name: Utils.translate('by Request date')
            },
            {
                value: 'duedate',
                name: Utils.translate('by Expiration date')
            },
            {
                value: 'total',
                name: Utils.translate('by Amount')
            }
        ],
        // @method getSelectedMenu Indicates what my account menu is selected when this view is being rendered
        // @return {String}
        getSelectedMenu: function () {
            return 'quotes';
        },
        // @method getBreadcrumbPages
        // @return {BreadcrumbPage}
        getBreadcrumbPages: function () {
            return {
                text: this.title,
                href: '/quotes'
            };
        },
        // @property {ChildViews} childViews
        childViews: {
            'Quote.List.Items': function () {
                return this._resultsView;
            },
            'List.Header': function () {
                return this.listHeader;
            }
        },
        _buildResultsView: function () {
            var self = this;
            var records_collection = new Backbone.Collection(this.collection.map(function (quote) {
                var quote_internalid = quote.get('internalid');
                var selectedColumns = [];
                if (!Configuration_1.Configuration.get().transactionListColumns.enableQuote) {
                    selectedColumns.push({
                        label: 'Request date:',
                        type: 'request-date',
                        name: 'request-date',
                        id: 'trandate'
                    });
                    selectedColumns.push({
                        label: 'Amount:',
                        type: 'currency',
                        name: 'amount-date',
                        id: 'amount_formatted',
                        visible: quote.get('status').internalid !== 'open' ||
                            quote.get('entitystatus').name !== '',
                        message: Utils.translate('Price to be determined')
                    });
                    selectedColumns.push({
                        label: 'Expiration date:',
                        type: 'expiration-date',
                        name: 'expiration-date',
                        compositeKey: 'QuoteListExpirationDateView',
                        composite: 'Quote.ListExpirationDate.View'
                    });
                    selectedColumns.push({
                        label: 'Status:',
                        type: 'status',
                        name: 'status',
                        id: 'status'
                    });
                }
                else {
                    selectedColumns = Configuration_1.Configuration.get().transactionListColumns.quote;
                }
                return new Backbone.Model({
                    touchpoint: 'customercenter',
                    title: Utils.translate('Quote #$(0)', quote.get('tranid')),
                    detailsURL: "#/quotes/" + quote_internalid,
                    id: quote_internalid,
                    internalid: quote_internalid,
                    columns: self._buildColumns(selectedColumns, quote)
                });
            }));
            return new BackboneCollectionView({
                childView: RecordViewsView_1.RecordViewsView,
                collection: records_collection,
                viewsPerRow: 1
            });
        },
        // @method destroy Override default method to  from collection events
        // @return {Void}
        destroy: function () {
            this.collection.off('request reset');
            BackboneView.prototype.destroy.apply(this, arguments);
        },
        // @method getContext
        // @return {Quote.List.View.Context}
        getContext: function () {
            this._resultsView = this._buildResultsView();
            var columns = [];
            if (this._resultsView.collection.length > 0) {
                columns = this._resultsView.collection.at(0).get('columns');
            }
            // @class Quote.List.View.Context
            return {
                // @property {String} pageHeader
                pageHeader: this.page_header,
                // @property {Array} collection
                collection: this.collection,
                // @property {Boolean} collectionLength
                collectionLength: this.collection.length,
                // @property {Boolean} isLoading
                isLoading: this.isLoading,
                // @property {Boolean} showBackToAccount
                showBackToAccount: Configuration_1.Configuration.get('siteSettings.sitetype') === 'STANDARD',
                // @property {Array<{}>} columns
                columns: columns
            };
            // @class Quote.List.View
        }
    });
});

//# sourceMappingURL=Quote.List.View.js.map

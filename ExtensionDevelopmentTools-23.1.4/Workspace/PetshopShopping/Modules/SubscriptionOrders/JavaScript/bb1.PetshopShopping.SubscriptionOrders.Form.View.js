// @module bb1.PetshopShopping.SubscriptionOrders
define(
    'bb1.PetshopShopping.SubscriptionOrders.Form.View',
    [
        'bb1.PetshopShopping.SubscriptionOrders.List.View',
        'bb1.PetshopShopping.SubscriptionOrders.FormSubmitted.View',
        'ItemsSearcher.View',
        'QuickAdd.ItemsSearcher.Plugins',
        'GlobalViews.Message.View',
        'SC.Configuration',

        'bb1_petshopshopping_subscriptionorder_form.tpl',

        'Backbone.FormView',
        'Backbone.CompositeView',
        'Backbone',
        'underscore',
        'Handlebars'
    ],
    function (
        SubscriptionOrdersListView,
        SubscriptionOrdersFormSubmittedView,
        ItemsSearcherView,
        QuickAddItemsSearcherPlugins,
        GlobalViewsMessageView,
        Configuration,

        bb1_petshopshopping_subscriptionorder_form_tpl,

        BackboneFormView,
        BackboneCompositeView,
        Backbone,
        _,
        Handlebars
    ) {
        'use strict';

        return Backbone.View.extend({

            template: bb1_petshopshopping_subscriptionorder_form_tpl,

            attributes: { 'class': 'subscription-orders-form-view' },

            menuItem: 'subscriptionorder_form',

            daysInMonth: 28,

            bindings: {
                '[name="quantity"]': 'quantity',
                '[name="orderschedule"]': 'orderschedule',
                '[name="scheduleforsetdate"]': 'scheduleforsetdate',
                '[name="scheduleddayofmonth"]': 'scheduleddayofmonth',
                '[name="nextorderdate"]': 'nextorderdate',
                '[name="isinactive"]': 'isinactive'
            },

            events: {
                'submit form': 'saveForm',
                'click [data-action="reset"]': 'resetForm',
                'click [data-action="skip-next-order"]': 'skipNextOrder',
                'click [data-action="place-order"]': 'placeOrder',
                'change [data-type="orderschedule"]': 'scheduleChanged',
                'change [name="scheduleddayofmonth"]': 'updateNextOrderDate',
                'click [name="scheduleforsetdate"]': 'updateNextOrderDate',
                //'change [name="nextorderdate"]': 'nextOrderDateChanged'
                'focus .itemssearcher-input.tt-input': 'focusItemSearcher',
                'blur .itemssearcher-input.tt-input': 'blurItemSearcher'
            },

            initialize: function (options) {
                this.application = options.application;

                //if (this.model.isNew()) {
                this.itemsSearcherComponent = new ItemsSearcherView({
                    placeholderLabel: _('Enter SKU or Item Name').translate()
                    , showBackorderables: this.options.showBackorderable
                    , minLength: Configuration.get('typeahead.minLength', 3)
                    , maxLength: Configuration.get('searchPrefs.maxLength', 0)
                    , limit: Configuration.get('typeahead.maxResults', 10)
                    , sort: Configuration.get('typeahead.sort', 'relevance:desc')
                    , highlight: Configuration.get('typeahead.highlight', true)
                    //,	componentId: 'quickaddSearch'
                    //,	componentName: 'quickaddSearch'
                    //,	showMenuOnClick: true
                    , showSeeAll: false
                    , collectionOptions:
                    {
                        //searcherAPIConfiguration: 'searchApiMasterOptions.typeahead'
                    }

                    , getItemDisplayName: function (item, query) {
                        return item ? item.getSku() : query;
                    }
                });
                //this.itemsSearcherComponent.postItemsSuggestionObtained.install(QuickAddItemsSearcherPlugins.flatItemsMatrixResult);

                //this.model = new QuickAddModel();
                //this.model.setOptions({getItemQuantitySet:this.options.getItemQuantitySet, validateMaxQty:this.options.validateMaxQty});

                this.itemsSearcherComponent.on('itemSelected', this.onItemSelected, this);
                //this.itemsSearcherComponent.on('keyUp', this.showReset, this);
                //this.itemsSearcherComponent.on('keyDown', this.cleanSearchOnEnter, this);

                /*this.itemsSearcherComponent = new QuickAddView({
                 getItemQuantitySet: _.bind(this.getItemQuantitySet, this),
                 showBackorderable: false,
                 validateMaxQty: true
                });
                this.itemsSearcherComponent.on('selectedLine', this.selectItem, this);*/
                /*this.itemsSearcherComponent = new ItemsSearcherView({
                 minLength: Configuration.get('typeahead.minLength', 3)
                ,	maxLength: Configuration.get('searchPrefs.maxLength', 0)
                ,	limit: Configuration.get('typeahead.maxResults', 10)
                ,	sort: Configuration.get('typeahead.sort','relevance:desc')
                ,	highlight: Configuration.get('typeahead.highlight', true)
                });
           
                this.itemsSearcherComponent.on('itemSelected', this.onItemSelected, this);
                this.itemsSearcherComponent.on('keyUp', this.showReset, this);
                this.itemsSearcherComponent.on('keyDown', this.cleanSearchOnEnter, this);*/
                //}

                BackboneFormView.add(this);
            },

            //@method addNewLine
            //@param {QuickAdd.View.SelectedLine.Properties} options
            //@return {Void}
            selectItem: function (options) {
                console.log(options);
                this.cart.addLine(options.selectedLine);
            },

            //@method showReset Handle when to show or hide the reset button
            //@param {ItemsSearcher.View.KeyDown.Properties} event_properties
            //@return {Void}
            /*showReset: function (event_properties)
       {
        console.log('showReset');
    console.log(event_properties);
        if (event_properties.currentQuery)
        {
         this.$('[data-type="search-reset"]').show();
        }
        else
        {
         this.$('[data-type="search-reset"]').hide();
        }
        if (event_properties.eventObject.keyCode === 13 || event_properties.eventObject.keyCode === 9)
        {
         //this.$('.subscriptionorder-form-itemsearcher .tt-input').val(this.selectedItemName || '');
        }
       },
    
       //@method cleanSearchOnEnter Cleans the current search status
       //@param {ItemsSearcher.View.KeyDown.Properties} event_properties
       //@return {Void}
            cleanSearchOnEnter: function (event_properties)
       {
        console.log('cleanSearchOnEnter');
    console.log(event_properties);
        if (event_properties.eventObject.keyCode === 13 || event_properties.eventObject.keyCode === 9)
        {
         console.log('cleanSearch');
         //this.$('[data-type="search-reset"]').hide();
         //this.itemsSearcherComponent.cleanSearch();
         //this.$('.subscriptionorder-form-itemsearcher .tt-input').val(this.selectedItemName || '');
        }
       },*/

            //@method onItemSelected Handle the selection of an item of the type-ahead result
            //@param {ItemsSearcher.View.itemSelected.Properties} result
            //@return {Void}
            onItemSelected: function (result) {
                var item = result.selectedItem
                    , collection = result.collection
                    , query = result.currentQuery
                    , selectedItemName = '';
                console.log('result');
                console.log(result);
                //this.$('[data-type="search-reset"]').hide();
                this.itemsSearcherComponent.cleanSearch(true);

                if (item) {
                    var itemId = item.get('internalid');

                    selectedItemName = item.get('_name') || '';

                    console.log('itemId');
                    console.log(itemId);
                    this.$('[name="item"]').val(itemId);
                    this.$('[name="quantity"]').focus();
                    //return true;
                }

                this.$('.subscriptionorder-form-itemsearcher .tt-input').val(selectedItemName);

                return true;
            },

            focusItemSearcher: function (e) {
                console.log('focus');
                this.$('[name="item"]').val('');
                this.$('.subscriptionorder-form-itemsearcher .tt-input').val('');
            },

            blurItemSearcher: function (e) {
                console.log('blur');
                var itemId = this.$('[name="item"]').val();
                console.log('itemId');
                console.log(itemId);
                if (!itemId)
                    setTimeout(function () {
                        this.$('.subscriptionorder-form-itemsearcher .tt-input').val('');
                    }, 50);
            },

            /*render: function () {
            
             var urlOptions = _.parseUrlOptions(Backbone.history.fragment) || {};
             console.log(urlOptions);
             if (urlOptions.isinactive) {
              console.log('setting');
              this.model.set({'isinactive': urlOptions.isinactive == 'yes'}, {silent: true});
             }
         
             this._render();
            
            },*/

            showContent: function () {
                var self = this;
                var paths = [
                    {
                        text: SubscriptionOrdersListView.prototype.page_header,
                        href: '/subscription-orders'
                    },
                    {
                        text: this.page_header,
                        href: '/subscription-orders/edit'
                    }
                ];

                return this.application.getLayout().showContent(this, this.menuItem, paths).done(function (view) {
                    view.$('[name="nextorderdate"]').datepicker({
                        format: 'd/m/yyyy',
                        beforeShowDay: function (date) {
                            var selectedOrderSchedule = view.$('[name="orderschedule"]').val(),
                                scheduleForSetDate = view.$('[name="scheduleforsetdate"]').is(':checked'),
                                scheduledDayOfMonth = parseInt(view.$('[name="scheduleddayofmonth"]').val()),
                                subscriptionOrderSettings = SC.ENVIRONMENT.subscriptionOrderSettings && SC.ENVIRONMENT.subscriptionOrderSettings || {},
                                orderSchedules = subscriptionOrderSettings.orderSchedules || {},
                                orderScheduleInDays = (_.findWhere(orderSchedules, { id: selectedOrderSchedule }) || {}).scheduleindays || 1,
                                canScheduleMonthly = orderScheduleInDays % self.daysInMonth === 0,
                                lastDateOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

                            return !canScheduleMonthly || !scheduleForSetDate || date.getDate() === Math.min(scheduledDayOfMonth, lastDateOfMonth);
                        }
                    }).on('changeDate', function (e) {
                        //self.model.validate();
                        //jQuery(this).datepicker('update');
                    });
                });
            },

            saveForm: function (e, model, props) {
                e.preventDefault();

                var self = this;

                var promise = Backbone.View.prototype.saveForm.apply(this, arguments);

                if (!promise) {
                    self.$savingForm.find('*[type=submit]').attr('disabled', false);
                }

                return promise.done(function () {
                    if (self.inModal && self.$containerModal) {
                        self.$containerModal.modal('hide');
                        self.destroy();
                        var formSubmittedView = new SubscriptionOrdersFormSubmittedView({
                            application: self.application
                        });
                        formSubmittedView.showInModal();
                    }
                    else {
                        self.application.getLayout().once('afterAppendView', function (view) {
                            var message = _('Your bottomless bowl item has been created.').translate(),
                                messageView = new GlobalViewsMessageView({ message: message, closable: true, type: "success" });
                            messageView.render();
                            view.$('[data-type="alert-placeholder"]').empty().append(messageView.$el);
                        });
                        Backbone.history.navigate('#subscription-orders', { trigger: true });
                    }
                });
            },

            resetForm: function (e) {
                e.preventDefault();
                this.showContent();
            },

            skipNextOrder: function (e) {
                e.preventDefault();

                var self = this,
                    blbItemId = this.model.get('internalid');
                console.log('skipNextOrder');
                console.log(self);
                console.log(blbItemId);
                var message = _('Are you sure you want to skip your next scheduled order for this item?').translate(),
                    messageView = new GlobalViewsMessageView({ message: message, closable: true, type: "success" });
                //messageView.render();
                //view.$('[data-type="alert-placeholder"]').empty().append(messageView.$el);
                if (confirm(message)) {
                    this.model.set('skipnextorder', true);

                    this.model.save().done(function (data) {

                        console.log('skipped next order');
                        console.log(data);
                        var nextOrderDate = self.model.get('nextorderdate');
                        console.log(nextOrderDate);
                        console.log(data.nextorderdate);

                        //data.nextorderdate && self.model.set('nextorderdate', data.nextorderdate, {silent: true});

                        self.application.getLayout().once('afterAppendView', function (view) {
                            var message = _('You have updated your bottomless bowl item to skip the next scheduled order.').translate(),
                                messageView = new GlobalViewsMessageView({ message: message, closable: true, type: "success" });
                            messageView.render();
                            view.$('[data-type="alert-placeholder"]').empty().eq(0).append(messageView.$el);
                        });
                        Backbone.history.navigate('/subscription-orders', { trigger: true });
                    });

                }

            },

            placeOrder: function (e) {
                e.preventDefault();

                var self = this,
                    blbItemId = this.model.get('internalid');
                console.log('placeOrder');
                console.log(self);
                console.log(blbItemId);
                var message = _('Are you sure you want to place your order now? This will only process an order for the item selected and may incur a shipping charge if under £59.99').translate(),
                    messageView = new GlobalViewsMessageView({ message: message, closable: true, type: "success" });
                //messageView.render();
                //view.$('[data-type="alert-placeholder"]').empty().append(messageView.$el);
                if (confirm(message)) {
                    this.model.set('placeorder', true);

                    self.$('*[data-action="place-order"]').attr('disabled', true);

                    this.model.save().done(function (data) {

                        console.log('placed order');
                        console.log(data);
                        var placedOrderId = self.model.get('placedOrderId');
                        var reactivateUrl = '/purchases/view/salesorder/{{placedOrderId}}'.replace(/{{placedOrderId}}/g, placedOrderId);
                        console.log(placedOrderId);
                        console.log(reactivateUrl);

                        self.application.getLayout().once('afterAppendView', function (view) {
                            var message = _('An immediate order for your bottomless bowl item has been placed. You can view the order details below.').translate(),
                                messageView = new GlobalViewsMessageView({ message: message, closable: true, type: "success" });
                            messageView.render();
                            view.$('[data-type="alert-placeholder"]').empty().eq(0).append(messageView.$el);
                        });
                        Backbone.history.navigate(reactivateUrl, { trigger: true });
                    }).fail(function () {
                        self.$('*[data-action="place-order"]').attr('disabled', false);
                    });

                }

            },

            scheduleChanged: function (e) {
                var selectedOrderSchedule = jQuery(e.target).val(),
                    subscriptionOrderSettings = SC.ENVIRONMENT.subscriptionOrderSettings && SC.ENVIRONMENT.subscriptionOrderSettings || {},
                    orderSchedules = subscriptionOrderSettings.orderSchedules || {},
                    orderScheduleInDays = (_.findWhere(orderSchedules, { id: selectedOrderSchedule }) || {}).scheduleindays || 1;

                if (orderScheduleInDays % this.daysInMonth === 0)
                    this.$('[data-visibility="schedule-by-date"]').show()
                else
                    this.$('[data-visibility="schedule-by-date"]').hide()

                this.updateNextOrderDate(e);
            },

            nextOrderDateChanged: function (e) {
                var nextOrderDate = jQuery(e.target).val(),
                    scheduleForSetDate = this.$('#scheduleforsetdate').is(':checked'),
                    scheduledDayOfMonth = this.$('#scheduleddayofmonth').val();

                if (scheduleForSetDate) {
                    var nextOrderDateFixed = nextOrderDate.replace(/^\d+/, scheduledDayOfMonth);
                    jQuery(e.target).val(nextOrderDateFixed);
                }
            },

            updateNextOrderDate: function (e) {
                this.$('[name="nextorderdate"]').datepicker('update');
            },

            //@method destroy Override default implementation to clean up all attached events of the initialize
            //@return {Void}
            destroy: function () {
                Backbone.View.prototype.destroy.apply(this, arguments);

                this.itemsSearcherComponent.off('itemSelected');
                this.itemsSearcherComponent.off('keyUp');
                this.itemsSearcherComponent.off('keyDown');
            },

            childViews: {

                'ItemSearcher': function () {
                    return this.itemsSearcherComponent;
                }

            },

            getContext: function () {
                var options = this.options || {},
                    model = this.model,
                    manage = options.manage ? options.manage + '-' : '',
                    subscriptionOrderSettings = SC.ENVIRONMENT.subscriptionOrderSettings && SC.ENVIRONMENT.subscriptionOrderSettings || {},
                    orderSchedules = subscriptionOrderSettings.orderSchedules || [],
                    selectedOrderSchedule = model.get('orderschedule'),
                    orderScheduleInDays = (_.findWhere(orderSchedules, { id: selectedOrderSchedule }) || {}).scheduleindays || 1,
                    scheduleForSetDate = model.get('scheduleforsetdate'),
                    scheduledDayOfMonth = model.get('scheduleddayofmonth'),
                    itemDetails = model.get('item_details'),
                    daysOfMonth = _.times(31, function (index) { return { id: index + 1, name: _('$(0)').translate(index + 1) }; });

                this.title = this.model.isNew() ? _('Add To Your Bottomless Bowl').translate() : _('Edit Your Bottomless Bowl').translate();
                this.page_header = this.title;

                //@class bb1.PetshopShopping.SubscriptionOrders.Form.View.Context
                return {
                    //@property {String} pageHeader
                    pageHeader: this.page_header,
                    //@property {Backbone.Model} item
                    item: model,
                    //@property {Boolean} isNew
                    isNew: model.isNew(),
                    //@property {Backbone.Model} itemDetails
                    itemDetails: itemDetails,
                    //@property {Array} orderSchedules
                    orderSchedules: orderSchedules,
                    //@property {String} selectedOrderSchedule
                    selectedOrderSchedule: selectedOrderSchedule,
                    //@property {String} manage
                    manage: manage,
                    //@property {Boolean} inModal
                    isInModal: false,
                    //@property {Boolean} scheduleForSetDate
                    scheduleForSetDate: scheduleForSetDate,
                    //@property {Array} daysOfMonth
                    daysOfMonth: daysOfMonth,
                    //@property {Number} scheduledDayOfMonth
                    scheduledDayOfMonth: scheduledDayOfMonth,
                    //@property {Boolean} canScheduleMonthly
                    canScheduleMonthly: orderScheduleInDays % this.daysInMonth == 0
                };
            }

        });

    }
);

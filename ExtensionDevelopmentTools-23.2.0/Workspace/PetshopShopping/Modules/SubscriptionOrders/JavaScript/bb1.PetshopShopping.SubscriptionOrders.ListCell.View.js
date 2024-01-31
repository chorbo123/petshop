// @module bb1.PetshopShopping.SubscriptionOrders
define(
    'bb1.PetshopShopping.SubscriptionOrders.ListCell.View',
    [
        'ProductViews.Price.View',
        'Transaction.Line.Views.Options.Selected.View',
        'ProductLine.Stock.View',
        'GlobalViews.StarRating.View',
        'GlobalViews.Message.View',
        'Product.Model',

        'bb1_petshopshopping_subscriptionorder_list_cell.tpl',

        'Backbone.CollectionView',
        'Backbone.CompositeView',
        'Backbone',
        'underscore'
    ],
    function (
        ProductViewsPriceView,
        TransactionLineViewsOptionsSelectedView,
        ProductLineStockView,
        GlobalViewsStarRatingView,
        GlobalViewsMessageView,
        ProductModel,

        bb1_petshopshopping_subscriptionorder_list_cell_tpl,

        BackboneCollectionView,
        BackboneCompositeView,
        Backbone,
        _
    ) {
        'use strict';

        return Backbone.View.extend({

            template: bb1_petshopshopping_subscriptionorder_list_cell_tpl,

            events: {
                'click [data-action="view-item"]': 'viewItem',
                'click [data-action="edit-item"]': 'editItem',
                'click [data-action="reactivate-item"]': 'reactivateItem',
                'click [data-action="place-order"]': 'placeOrder'
            },

            initialize: function (options) {
                this.application = options.application;
                BackboneCompositeView.add(this);
            },

            viewItem: function (e) {
                var itemId = jQuery(e.target).closest("[data-id]").data("id");
                Backbone.history.navigate('subscription-orders/view/' + itemId, { trigger: true });
            },

            editItem: function (e) {
                var itemId = jQuery(e.target).closest("[data-id]").data("id");
                Backbone.history.navigate('subscription-orders/edit/' + itemId, { trigger: true });
            },

            reactivateItem: function (e) {
                var itemId = this.model.get('internalid');
                var reactivateUrl = 'subscription-orders/edit/{{itemId}}?isinactive=no'.replace(/{{itemId}}/g, itemId);

                Backbone.history.navigate(reactivateUrl, { trigger: true });
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

            childViews: {
                'ItemViews.Price': function () {
                    return new ProductViewsPriceView({
                        model: this.model.get('item_details')
                        , origin: 'PRODUCTLISTDETAILSFULL'
                    });
                }
                , 'Item.SelectedOptions': function () {
                    var product = new ProductModel({ item: this.model.get('item_details') });

                    return new TransactionLineViewsOptionsSelectedView({
                        model: product
                    });
                }
                , 'ItemViews.Stock': function () {
                    return new ProductLineStockView({
                        model: this.model.get('item_details')
                    });
                }
                , 'GlobalViews.StarRating': function () {
                    return new GlobalViewsStarRatingView({
                        model: this.model.get('item_details')
                    });
                }
            },

            getContext: function () {
                console.log('getContext');
                var item = this.model,
                    options = this.options,
                    product = item.get('item'),
                    itemDetails = item.get('item_details') || new Backbone.Model(),
                    thumbnail = itemDetails instanceof Backbone.Model ? itemDetails.get('_thumbnail') || {} : {},
                    description = item.get('description');

                // @class ProductList.DisplayFull.View.Context
                return {
                    // @property {String} itemId
                    itemId: item.get('internalid'),
                    // @property {Backbone.Model} item
                    item: item,
                    // @property {Backbone.Model} product
                    product: product,
                    // @property {Backbone.Model} itemDetails
                    itemDetails: itemDetails,
                    // @property {Boolean} hasDescription
                    hasDescription: !!description,
                    // @property {String} itemDetailsId
                    itemDetailsId: itemDetails.get('internalid'),
                    // @property {String} itemDetailsUrl
                    itemDetailsUrl: _(itemDetails.get('_url')).fixUrl(),
                    // @property {String} thumbnailAlt
                    thumbnailAlt: thumbnail.altimagetext,
                    // @property {String} thumbnailResized
                    thumbnailResized: this.application.resizeImage(thumbnail.url, 'thumbnail'),
                    // @property {Boolean} showRating
                    showRating: !options || !options.hide_rating,
                    // @property {String} productName
                    productName: item.getProductName() || item.get('name'),
                    // @property {String} linkAttributes
                    linkAttributes: itemDetails.get('_linkAttributes'),
                    // @property {String} createdFromText
                    createdFromText: (item.get('createdfrom_text') || '').replace(/^Sales Order #/i, '')
                };
            }

        });

    }
);

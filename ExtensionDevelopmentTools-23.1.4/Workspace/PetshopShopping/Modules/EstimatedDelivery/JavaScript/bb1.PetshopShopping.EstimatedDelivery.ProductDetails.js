//@module bb1.PetshopShopping.EstimatedDelivery
define(
    'bb1.PetshopShopping.EstimatedDelivery.ProductDetails',
    [
        'bb1.PetshopShopping.EstimatedDelivery.Utils',
        'bb1.PetshopShopping.ProductDetails.EstimatedDelivery.View',
        'bb1.PetshopShopping.ProductDetails.EstimatedDelivery.Model',
        'ProductDetails.QuickView.View',
        'ProductDetails.Full.View',
        'ProductDetails.Base.View',
        'ProductViews.Price.View',
        'ProductDetails.ImageGallery.View',
        'ProductDetails.Options.Selector.View',
        'ProductDetails.Information.View',
        'ProductViews.Option.View',
        'ProductLine.Stock.View',
        'ProductLine.Common',
        'LiveOrder.Model',
        'Product.Model',
        'Item.Model',
        'Transaction.Line.Views.Price.View',
        'Cart.Item.Summary.View',
        'SC.Configuration',

        'Backbone.CollectionView',
        'Backbone',
        'underscore'
    ],
    function (
        EstimatedDeliveryUtils,
        EstimatedDeliveryView,
        EstimatedDeliveryModel,
        ProductDetailsQuickView,
        ProductDetailsFullView,
        ProductDetailsBaseView,
        ProductViewsPriceView,
        ProductDetailsImageGalleryView,
        ProductDetailsOptionsSelectorView,
        ProductDetailsInformationView,
        ProductViewsOptionView,
        ProductLineStockView,
        ProductLineCommon,
        LiveOrderModel,
        ProductModel,
        ItemModel,
        TransactionLineViewsPriceView,
        CartItemSummaryView,
        Configuration,

        BackboneCollectionView,
        Backbone,
        _
    ) {
        'use strict';

        var estimatedDeliveryConfig = Configuration.get('estimatedDelivery')

        if (estimatedDeliveryConfig.enabled) {

            _.extend(ProductModel.prototype, {

                getStockInfo: _.wrap(ProductModel.prototype.getStockInfo, function (originalGetStockInfo, selected_matrix_children, options_selection) {
                    //console.log('ProductModel.prototype.getStockInfo');
                    //console.log(this);
                    //console.log(this instanceof ItemModel);
                    //console.log(this instanceof ProductModel);
                    this.get('item').productModel = this;


                    //console.log('this.getSelectedMatrixChilds()');
                    //console.log(this.getSelectedMatrixChilds());
                    var stockInfo = originalGetStockInfo.apply(this, _.rest(arguments));

                    //console.log(stockInfo);
                    return stockInfo;
                })

            });

            _.extend(ItemModel.prototype, {

                getStockInfo: _.wrap(ItemModel.prototype.getStockInfo, function (originalGetStockInfo, selected_matrix_children, options_selection) {
                    //console.log('ItemModel.prototype.getStockInfo');
                    //console.log(this);
                    //console.log(this instanceof ItemModel);
                    //console.log(this instanceof ProductModel);

                    options_selection = options_selection || {};
                    //console.log('selected_matrix_children');
                    //console.log(selected_matrix_children);
                    selected_matrix_children = selected_matrix_children || [];

                    var stockInfo = originalGetStockInfo.apply(this, _.rest(arguments)),
                        model = selected_matrix_children.length === 1 ? selected_matrix_children[0] : this,
                        //parent = this.get('_matrixParent'),
                        //estimatedDeliveryConfig = Configuration.get('estimatedDelivery') || {},
                        //daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                        //product = model.get('product'),
                        expressDelivery = model.get('_expressDelivery', true);
                    //console.log('expressDelivery');
                    //console.log(expressDelivery);
                    /*deliveryCutoffTime = expressDelivery.warehouseStock ? estimatedDeliveryConfig.deliveryCutoffTime : expressDelivery.supplierDeliveryCutoff || estimatedDeliveryConfig.deliveryCutoffTime,
                    todaysDate = EstimatedDeliveryUtils.toUKDateTime(new Date()),
                    beforeDeliveryCutoff = todaysDate.getHours() < deliveryCutoffTime,
                    currentDay = (todaysDate.getDay() + (beforeDeliveryCutoff ? 0 : 1)) % 7,
                    isWeekend = todaysDate.getDay() == 0 || todaysDate.getDay() == 6,
                    //daysNeededForNextDayDelivery = currentDay == 0 ? 2 : currentDay == 6 ? 3 : 1,
                    //daysNeededFor2DayDelivery = currentDay == 0 ? 3 : currentDay == 6 ? 4 : 2,
                    cutoffDate = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate() + (beforeDeliveryCutoff ? 0 : 1) + (currentDay == 0 ? 1 : currentDay == 6 ? 2 : 0), deliveryCutoffTime, 0, 0),
                    cutoffTimeTicks = cutoffDate.getTime(),
                    deliveryDate = new Date(),
                    deliveryCutoffCountdown = EstimatedDeliveryUtils.dateDifferenceFormatted(todaysDate, cutoffDate); //'1hr 30min 10 secs';
                    
                
                console.log('expressDelivery');
                console.log(expressDelivery);
                console.log('deliveryCutoffTime');
                console.log(deliveryCutoffTime);
                if (expressDelivery.nextDayAvailable || expressDelivery.twoDayAvailable) {
                 var deliveryDate = EstimatedDeliveryUtils.addWorkingDays(cutoffDate, expressDelivery.warehouseStock ? 1 : 2); // deliveryDate.setDate(deliveryDate.getDate() + (expressDelivery.warehouseStock ? 1 : 2));
                }
                else if (expressDelivery.expectedDeliveryDate) {
                 var deliveryDate = EstimatedDeliveryUtils.addWorkingDays(expressDelivery.expectedDeliveryDate, 3);
                }
                //console.log('expressDelivery.expectedDeliveryDate');
                //console.log(expressDelivery.expectedDeliveryDate);
                //console.log(deliveryDate);
                
                var deliveryDayName = daysOfWeek[deliveryDate.getDay()];
                console.log(deliveryDayName);
                
                stockInfo.estimatedDeliveryDate = deliveryDate;*/

                    /*if (expressDelivery.nextDayAvailable && !isWeekend) {
                     stockInfo.inStockDeliveredMessage = _('In Stock, Get it Tomorrow').translate();
                     stockInfo.inStockDeliveredFullMessage = _('&#x2714; In Stock, <span class="product-line-stock-delivery-estimate">Get it Tomorrow</span>' + (beforeDeliveryCutoff ? '<br /> <span class="product-line-stock-delivery-estimate-countdown" data-type="countdown" data-countdown-endtime="$(0)">Order within $(1)</span>' : '')).translate(cutoffTimeTicks, deliveryCutoffCountdown);
                    }
                    else if (expressDelivery.nextDayAvailable && isWeekend) {
                     stockInfo.inStockDeliveredMessage = _('In Stock, Get it $(0)').translate(deliveryDayName);
                     stockInfo.inStockDeliveredFullMessage = _('&#x2714; In Stock, <span class="product-line-stock-delivery-estimate">Get it $(0)</span>' + (beforeDeliveryCutoff ? '<br /> <span class="product-line-stock-delivery-estimate-countdown" data-type="countdown" data-countdown-endtime="$(1)">Order within $(2)</span>' : '')).translate(deliveryDayName, cutoffTimeTicks, deliveryCutoffCountdown);
                    }
                    else if (expressDelivery.twoDayAvailable) {
                     stockInfo.inStockDeliveredMessage = _('In Stock, Get it $(0)').translate(deliveryDayName);
                     stockInfo.inStockDeliveredFullMessage = _('&#x2714; In Stock, <span class="product-line-stock-delivery-estimate">Get it $(0)</span>' + (beforeDeliveryCutoff ? '<br /> <span class="product-line-stock-delivery-estimate-countdown" data-type="countdown" data-countdown-endtime="$(1)">Order within $(2)</span>' : '')).translate(deliveryDayName, cutoffTimeTicks, deliveryCutoffCountdown);
                    }*/
                    if (expressDelivery.expectedDeliveryDate) {
                        stockInfo.isInStock = true;
                        stockInfo.inStockDeliveredMessage = _('In Stock, Get it $(0)').translate(expressDelivery.deliveryDayName);
                        stockInfo.inStockDeliveredFullMessage = _('&#x2714; In Stock, <span class="product-line-stock-delivery-estimate">Get it $(0)</span>').translate(expressDelivery.deliveryDayName);
                    }
                    else if (expressDelivery.deliveryDate) {
                        //console.log('testing 123');
                        stockInfo.inStockDeliveredMessage = _('In Stock, Get it $(0)').translate(expressDelivery.deliveryDayName);
                        stockInfo.inStockDeliveredFullMessage = _('&#x2714; In Stock, <span class="product-line-stock-delivery-estimate">Get it $(0)</span>' + (expressDelivery.beforeDeliveryCutoff ? '<br /> <span class="product-line-stock-delivery-estimate-countdown" data-type="countdown" data-countdown-endtime="$(1)">Order within $(2)</span>' : '')).translate(expressDelivery.deliveryDayName, expressDelivery.cutoffDate.getTime(), expressDelivery.deliveryCutoffCountdown);
                    }
                    else {
                        //console.log('testing !!!!!!!!!!!!');
                        stockInfo.inStockDeliveredMessage = stockInfo.inStockMessage;
                        stockInfo.inStockDeliveredFullMessage = stockInfo.inStockMessage;
                    }

                    if (expressDelivery.beforeDeliveryCutoff && (expressDelivery.nextDayAvailable || expressDelivery.twoDayAvailable))
                        stockInfo.inStockDeliveredFullMessage = '<span class="product-line-stock-delivery-estimate-countdown-container" style="display: block; margin-top: -10px;">' + stockInfo.inStockDeliveredFullMessage + '</span>';

                    return stockInfo;
                })

            });

            ProductDetailsFullView.prototype.showContent = _.wrap(ProductDetailsFullView.prototype.showContent, function (originalShowContent) {
                var self = this,
                    promise = originalShowContent.apply(this, _.rest(arguments));

                promise.done(function () {

                    this.countdownTimer = setInterval(function () {
                        self.$('[data-type="countdown"]').each(function () {
                            var $countdownSpan = jQuery(this),
                                endDateTicks = $countdownSpan.data('countdown-endtime'),
                                endDate = new Date(endDateTicks),
                                todaysDate = EstimatedDeliveryUtils.toUKDateTime(new Date()),
                                dateDifferenceFormatted = EstimatedDeliveryUtils.dateDifferenceFormatted(todaysDate, endDate),
                                countdownMessage = _('Order within $(0)').translate(dateDifferenceFormatted);

                            if (endDateTicks && dateDifferenceFormatted)
                                $countdownSpan.html(countdownMessage);
                        });
                    }, 1000);

                });

                return promise;
            });

            ProductDetailsFullView.prototype.initialize = _.wrap(ProductDetailsFullView.prototype.initialize, function (originalInitialize) {
                var results = originalInitialize.apply(this, _.rest(arguments));

                var view = this,
                    product = this.model; //.get('item');

                product.on('change:quantity', function (model, response, options) {

                    //console.log('change:quantity');
                    //console.log(model);
                    var quantity = product.get('quantity');
                    product.get('item').set('quantity', quantity);
                    var matrixChilds = product.get('item').get('_matrixChilds');

                    matrixChilds && matrixChilds.each(function (matrixChild) {
                        //console.log('matrixChilds ' + quantity);
                        matrixChild.set('quantity', quantity);
                    });
                });

                return results;
            });

            /*ProductLineStockView.prototype.render = _.wrap(ProductLineStockView.prototype.render, function(originalRender)
            //ProductLineStockView.prototype._render = function()
            {
             console.log('ProductLineStockView.prototype.render');
             this.options.application && this.options.application.getCart(function(cart) {
              var results = originalRender.apply(this, _.rest(arguments));
             });
             
             return originalRender.apply(this, _.rest(arguments));
            //};
            });*/

            ProductLineStockView.prototype.initialize = _.wrap(ProductLineStockView.prototype.initialize, function (originalInitialize) {
                var self = this,
                    result = originalInitialize.apply(this, _.rest(arguments));

                var cart = this.options.application && this.options.application.getCart().done(function (cart) {
                    self.render();
                });

                return result;
            });

        }
        else { // attach old estimated delivery view

            ProductDetailsFullView.prototype.childViews['Product.EstimatedDelivery'] = ProductDetailsBaseView.prototype.childViews['Product.EstimatedDelivery'] = function () {
                var model = new EstimatedDeliveryModel();
                var view = new EstimatedDeliveryView({
                    application: this.application,
                    model: model,
                    item: this.model //.get('item') || this.model
                });

                model.fetch().done(function (model) {
                    view.render();
                });

                return view;
            };

        }

    }
);

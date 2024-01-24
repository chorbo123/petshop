//@module bb1.PetshopShopping.ItemKeyMapping
define(
    'bb1.PetshopShopping.ItemKeyMapping',
    [
        'Item.KeyMapping',
        'Product.Model',
        'LiveOrder.Model',
        'SC.Configuration',

        'Utils',
        'underscore'
    ],
    function (
        ItemKeyMapping,
        ProductModel,
        LiveOrderModel,
        Configuration,

        Utils,
        _
    ) {
        'use strict';

        function itemImageFlattenForOptions(images, options) {
            if ('url' in images && 'altimagetext' in images) {
                return [images];
            }

            var results = _.compact(_.flatten(_.map(options, function (label, index) {
                if (label && images[label]) {
                    var new_options = options.slice(0);
                    new_options.splice(index, 1);
                    return itemImageFlattenForOptions(images[label], new_options);
                }
            }))) || [];

            if (!results.length) {
                results = _.compact(_.flatten(_.map(images, function (image) {
                    return itemImageFlattenForOptions(image, options);
                })));
            }

            return results;

        }

        ItemKeyMapping.getKeyMapping = _.wrap(ItemKeyMapping.getKeyMapping, function (originalGetKeyMapping) {

            var keyMapping = originalGetKeyMapping.apply(this, _.rest(arguments));

            _.extend(keyMapping, {

                _comparePriceAgainst: 'pricelevel2',

                _comparePriceAgainstFormated: 'pricelevel2_formatted',

                _bottomlessBowlDiscount: function (item) {
                    return Math.abs(parseFloat(item.get('custitem_bb1_bb_discountrate')) / 100) || 0;
                },

                _bottomlessBowlDiscountFormatted: function (item) {
                    return (item.get('_bottomlessBowlDiscount') * 100).toFixed(0) + '%';
                },

                _firstOrderBottomlessBowlDiscount: function (item) {
                    return Math.abs(parseFloat(item.get('custitem_bb1_blbi_firstdiscountrate')) / 100) || 0;
                },

                _firstOrderBottomlessBowlDiscountFormatted: function (item) {
                    return (item.get('_firstOrderBottomlessBowlDiscount') * 100).toFixed(0) + '%';
                },

                _isFoodItem: function (item) {
                    var itemClass = item.get('class'),
                        isFoodItem = /^Foods/i.test(itemClass);

                    return isFoodItem;
                },

                _isMinPriceSelectedByDefault: function (item) {
                    var selectMinPriceOptionByDefault = Configuration.get('productLists.selectMinPriceOptionByDefault', false);

                    if (!selectMinPriceOptionByDefault)
                        return false;

                    var itemClass = item.get('class'),
                        isMinPriceSelected = /Foods|Health & Hygiene|Hay & Bedding|Litters/i.test(itemClass);

                    return isMinPriceSelected;
                },

                _displayMinPriceAvailable: function (item) {
                    var displayMinPriceAvailable = !!Configuration.get('productLists.displayMinPriceAvailable', false);
                    var itemShowCheapestPrice = !!item.get('custitem_bb1_showcheapestprice');

                    return displayMinPriceAvailable && itemShowCheapestPrice;
                },

                _brand: function (item) {
                    return item.get('custitem_bb1_pet_brand');
                },

                _brandUrl: function (item) {
                    var brandName = item.get('_brand'),
                        facets = item.get('facets'),
                        brandFacet = _.findWhere(facets, { 'id': 'custitem_bb1_pet_brand' }) || {},
                        brandFacetUrl = (_.findWhere(brandFacet.values, { label: brandName }) || {}).url || '';

                    return brandFacetUrl;
                },

                _saleUnit: function (item) {
                    return item.get('custitem_bb1_web_saleunit') || 'Item';
                },

                _subscriptionDiscountedPrice: function (item) {
                    var pricing = item.getPrice(),
                        price = pricing.maxPrice || pricing.price || 0,
                        subscriptionDiscountRate = item.get('_bottomlessBowlDiscount');

                    return price * (1 - subscriptionDiscountRate);
                },

                _subscriptionDiscountedPriceFormatted: function (item) {
                    return _.formatCurrency(item.get('_subscriptionDiscountedPrice'));
                },

                _hasFirstOrderSubscriptionDiscount: function (item) {
                    return item.get('_isSubscriptionItem') && item.get('_firstOrderBottomlessBowlDiscount') > 0;
                },

                _firstOrderSubscriptionDiscountedPrice: function (item) {
                    var pricing = item.getPrice(),
                        price = pricing.maxPrice || pricing.price || 0,
                        subscriptionDiscountRate = item.get('_firstOrderBottomlessBowlDiscount');

                    return price * (1 - subscriptionDiscountRate);
                },

                _firstOrderSubscriptionDiscountedPriceFormatted: function (item) {
                    return _.formatCurrency(item.get('_firstOrderSubscriptionDiscountedPrice'));
                },

                _firstOrderSubscriptionDiscountedSavings: function (item) {
                    var pricing = item.getPrice();

                    //return item.get('_hasSubscriptionDiscount') ? pricing.compare_price - item.get('_subscriptionDiscountedPrice') : 0;
                    return pricing.compare_price - item.get('_firstOrderSubscriptionDiscountedPrice');
                },

                _firstOrderSubscriptionDiscountedSavingsPercentage: function (item) {
                    var pricing = item.getPrice(),
                        subscriptionDiscountedSavings = item.get('_firstOrderSubscriptionDiscountedSavings');

                    //return item.get('_hasSubscriptionDiscount') ? _.roundNumber(subscriptionDiscountedSavings / pricing.compare_price * 100, 0) : 0;
                    return _.roundNumber(subscriptionDiscountedSavings / pricing.compare_price * 100, 0);
                },

                _isSubscriptionItem: function (item) {
                    var itemOptions = item.get('_optionsDetails'),
                        orderSchedule = itemOptions && _.findWhere(itemOptions.fields, { internalid: 'custcol_bb1_blbi_orderschedule' });

                    return !!orderSchedule;
                },

                _hasSubscriptionDiscount: function (item) {
                    return item.get('_isSubscriptionItem') && item.get('_bottomlessBowlDiscount') > 0;
                },

                _subscriptionDiscountedSavings: function (item) {
                    var pricing = item.getPrice();

                    //return item.get('_hasSubscriptionDiscount') ? pricing.compare_price - item.get('_subscriptionDiscountedPrice') : 0;
                    return pricing.compare_price - item.get('_subscriptionDiscountedPrice');
                },

                _subscriptionDiscountedSavingsPercentage: function (item) {
                    var pricing = item.getPrice(),
                        subscriptionDiscountedSavings = item.get('_subscriptionDiscountedSavings');

                    //return item.get('_hasSubscriptionDiscount') ? _.roundNumber(subscriptionDiscountedSavings / pricing.compare_price * 100, 0) : 0;
                    return _.roundNumber(subscriptionDiscountedSavings / pricing.compare_price * 100, 0);
                },

                _pricePerKg: function (item) {
                    var pricing = item.getPrice(),
                        price = pricing.maxPrice || pricing.price || 0,
                        pricePerKg = 0,
                        weight = item.get('weight');

                    if (item.get('weightunit') == 'g')
                        weight /= 1000;

                    if (weight)
                        pricePerKg = price / weight;

                    return pricePerKg;
                },

                _savings: function (item) {
                    var pricing = item.getPrice(),
                        price = pricing.maxPrice || pricing.price || 0,
                        savings = pricing.compare_price - price;

                    return savings;
                },

                _savingsPercentage: function (item) {
                    var pricing = item.getPrice(),
                        price = pricing.maxPrice || pricing.price || 0,
                        savings = pricing.compare_price - price,
                        savingsPercentage = 0;

                    if (savings > 0)
                        savingsPercentage = _.roundNumber(savings / pricing.compare_price * 100, 0);

                    return savingsPercentage;
                },

                _priceDiscountOptions: function (item) {
                    var pricing = item.getPrice(),
                        priceDetails = item.get('_priceDetails') || {},
                        priceSchedules = priceDetails.priceschedule || [],
                        priceTableOption = item instanceof ProductModel ? item.get('priceTableOption') || {} : undefined,
                        subscriptionDiscountRate = item.get('_bottomlessBowlDiscount'),
                        firstOrderSubscriptionDiscountRate = item.get('_firstOrderBottomlessBowlDiscount'),
                        saleUnit = item.get('_saleUnit'),
                        lastSchedulePriceMinQuantity,
                        freeDeliveryOrderLimit = parseFloat(Configuration.get('shoppingcart.freeDeliveryOrderLimit', 0), 10) || 0

                    var priceSchedulesMapped = _.map(priceSchedules.slice(0).reverse(), function (priceSchedule) {
                        var schedulePriceMinQuantity = priceSchedule.minimumquantity || 1;
                        var schedulePriceSavings = pricing.compare_price - priceSchedule.price;
                        var schedulePriceSavingsPercentage = schedulePriceSavings / pricing.compare_price * 100;
                        var subscriptionDiscountedSchedulePrice = priceSchedule.price * (1 - subscriptionDiscountRate);
                        var subscriptionDiscountedSchedulePriceSavings = pricing.compare_price - subscriptionDiscountedSchedulePrice;
                        var subscriptionDiscountedSchedulePriceSavingsPercentage = subscriptionDiscountedSchedulePriceSavings / pricing.compare_price * 100;
                        var firstOrderSubscriptionDiscountedSchedulePrice = priceSchedule.price * (1 - firstOrderSubscriptionDiscountRate);
                        var firstOrderSubscriptionDiscountedSchedulePriceSavings = pricing.compare_price - firstOrderSubscriptionDiscountedSchedulePrice;
                        var firstOrderSubscriptionDiscountedSchedulePriceSavingsPercentage = firstOrderSubscriptionDiscountedSchedulePriceSavings / pricing.compare_price * 100;
                        var selectedMinQuantity = priceTableOption ? priceTableOption.quantity >= schedulePriceMinQuantity && !(priceTableOption.quantity >= lastSchedulePriceMinQuantity) : undefined;
                        var priceScheduleMapped = {
                            price: priceSchedule.price,
                            priceFormatted: priceSchedule.price_formatted,
                            schedulePriceMinQuantity: schedulePriceMinQuantity,
                            schedulePriceSavings: _.roundNumber(schedulePriceSavings),
                            schedulePriceSavingsFormatted: _.formatCurrency(schedulePriceSavings),
                            schedulePriceSavingsPercentage: _.roundNumber(schedulePriceSavingsPercentage, schedulePriceSavingsPercentage < 1 ? 1 : 0),
                            subscriptionDiscountRate: subscriptionDiscountRate * 100,
                            hasSubscriptionDiscount: subscriptionDiscountRate > 0,
                            subscriptionDiscountedSchedulePrice: _.roundNumber(subscriptionDiscountedSchedulePrice),
                            subscriptionDiscountedSchedulePriceFormatted: _.formatCurrency(subscriptionDiscountedSchedulePrice),
                            subscriptionDiscountedSchedulePriceSavings: _.roundNumber(subscriptionDiscountedSchedulePriceSavings),
                            subscriptionDiscountedSchedulePriceSavingsFormatted: _.formatCurrency(subscriptionDiscountedSchedulePriceSavings),
                            subscriptionDiscountedSchedulePriceSavingsPercentage: _.roundNumber(subscriptionDiscountedSchedulePriceSavingsPercentage, subscriptionDiscountedSchedulePriceSavingsPercentage < 1 ? 1 : 0),
                            firstOrderSubscriptionDiscountRate: firstOrderSubscriptionDiscountRate * 100,
                            hasFirstOrderSubscriptionDiscount: firstOrderSubscriptionDiscountRate > 0,
                            firstOrderSubscriptionDiscountedSchedulePrice: _.roundNumber(firstOrderSubscriptionDiscountedSchedulePrice),
                            firstOrderSubscriptionDiscountedSchedulePriceFormatted: _.formatCurrency(firstOrderSubscriptionDiscountedSchedulePrice),
                            firstOrderSubscriptionDiscountedSchedulePriceSavings: _.roundNumber(firstOrderSubscriptionDiscountedSchedulePriceSavings),
                            firstOrderSubscriptionDiscountedSchedulePriceSavingsFormatted: _.formatCurrency(firstOrderSubscriptionDiscountedSchedulePriceSavings),
                            firstOrderSubscriptionDiscountedSchedulePriceSavingsPercentage: _.roundNumber(firstOrderSubscriptionDiscountedSchedulePriceSavingsPercentage, firstOrderSubscriptionDiscountedSchedulePriceSavingsPercentage < 1 ? 1 : 0),
                            selectedMinQuantity: selectedMinQuantity,
                            saleUnit: saleUnit + (schedulePriceMinQuantity > 1 ? 's' : ''),
                            isFreeDelivery: (schedulePriceMinQuantity * priceSchedule.price) > freeDeliveryOrderLimit,
                            subscriptionIsFreeDelivery: (schedulePriceMinQuantity * subscriptionDiscountedSchedulePrice) > freeDeliveryOrderLimit
                        };

                        lastSchedulePriceMinQuantity = schedulePriceMinQuantity;

                        return priceScheduleMapped;
                    });

                    return priceSchedulesMapped;
                },

                _minPriceAvailable: function (item) {
                    var priceDiscountOptions = item.get('_priceDiscountOptions');
                    var isMinPriceSelectedByDefault = item.get('_isMinPriceSelectedByDefault');
                    var subscriptionDiscountRate = item.get('_firstOrderBottomlessBowlDiscount') || item.get('_bottomlessBowlDiscount');
                    var pricing = item.getPrice();
                    var minSinglePrice = (pricing.min || pricing.price) * (1 - subscriptionDiscountRate);
                    var minPrice = _.reduce(priceDiscountOptions, function (minPrice, priceDiscountOption) {
                        if (priceDiscountOption.price < minPrice)
                            minPrice = priceDiscountOption.price;

                        if (priceDiscountOption.subscriptionDiscountedSchedulePrice < minPrice)
                            minPrice = priceDiscountOption.subscriptionDiscountedSchedulePrice;

                        if (priceDiscountOption.firstOrderSubscriptionDiscountedSchedulePrice < minPrice)
                            minPrice = priceDiscountOption.firstOrderSubscriptionDiscountedSchedulePrice;

                        return minPrice;
                    }, minSinglePrice);

                    return isMinPriceSelectedByDefault ? _.roundNumber(minPrice) : pricing.min || pricing.price;
                },

                _specials: function (item) {
                    var specials = (item.get('custitem_bb1_specials') || "").split(/\s*,\s*/);

                    specials = _.map(specials, function (special) {
                        return specials != '&nbsp;' ? specials : '';
                    });

                    return specials.length ? specials : null;
                },

                _productType: function (item) {
                    var productType = (item.get('custitem_bb1_producttype') || "").split(/\s*,\s*/);
                    return productType.length ? productType : null;
                },

                // @property {String} _productTypeListImageUrl
                _productTypeListImageUrl: function (item) {
                    var productTypes = item.get('_productType'),
                        productTypeImageUrls = {},
                        productTypeImageUrl = null;

                    if (SC.ENVIRONMENT.productTypeImages) {
                        for (var i = 0; i < SC.ENVIRONMENT.productTypeImages.length; i++) {
                            var productTypeImage = SC.ENVIRONMENT.productTypeImages[i];
                            if (productTypeImage && productTypeImage.listImage) {
                                productTypeImageUrls[productTypeImage.name] = productTypeImage.listImage;
                            }
                        }

                        for (var i = 0; i < productTypes.length; i++) {
                            var productType = productTypes[i];
                            if (productType != 'On Sale' && productType != 'Free Delivery' && productType != '&nbsp;' && productTypeImageUrls[productType]) {
                                productTypeImageUrl = productTypeImageUrls[productType];
                                break;
                            }
                        }
                    }

                    return productTypeImageUrl;
                },

                _productTypeDetailImageUrl: function (item) {
                    var productTypes = item.get('_productType'),
                        productTypeImageUrls = {},
                        productTypeImageUrl = null;

                    if (SC.ENVIRONMENT.productTypeImages) {
                        for (var i = 0; i < SC.ENVIRONMENT.productTypeImages.length; i++) {
                            var productTypeImage = SC.ENVIRONMENT.productTypeImages[i];
                            if (productTypeImage && productTypeImage.detailImage) {
                                productTypeImageUrls[productTypeImage.name] = productTypeImage.detailImage;
                            }
                        }

                        for (var i = 0; i < productTypes.length; i++) {
                            var productType = productTypes[i];
                            if (productType != 'On Sale' && productType != 'Free Delivery' && productType != '&nbsp;' && productTypeImageUrls[productType]) {
                                productTypeImageUrl = productTypeImageUrls[productType];
                                break;
                            }
                        }
                    }

                    return productTypeImageUrl;
                },

                // @property {Boolean} _isFreeDelivery
                _isFreeDelivery: function (item) {
                    var pricing = item.getPrice(),
                        price = pricing.price,
                        freeDeliveryOrderLimit = parseFloat(Configuration.get('shoppingcart.freeDeliveryOrderLimit', 0), 10) || 0;

                    return price > freeDeliveryOrderLimit;
                },

                // @property {Boolean} _isOnSale
                _isOnSale: function (item) {
                    var productType = item.get('_productType');
                    return _.contains(productType, "On Sale");
                },

                _thumbnail: function (item) {
                    var item_images_detail = item.get('itemimages_detail') || {};

                    // If you generate a thumbnail position in the itemimages_detail it will be used
                    if (item_images_detail.thumbnail) {
                        if (_.isArray(item_images_detail.thumbnail.urls) && item_images_detail.thumbnail.urls.length) {
                            return item_images_detail.thumbnail.urls[0];
                        }

                        return item_images_detail.thumbnail;
                    }

                    // otherwise it will try to use the storedisplaythumbnail
                    if (SC.ENVIRONMENT.siteType && SC.ENVIRONMENT.siteType === 'STANDARD' && item.get('storedisplaythumbnail')) {
                        return {
                            url: item.get('storedisplaythumbnail')
                            , altimagetext: item.get('_name')
                        };
                    }
                    // No images huh? carry on

                    var parent_item = item.get('_matrixParent');
                    // If the item is a matrix child, it will return the thumbnail of the parent
                    if (parent_item && parent_item.get('internalid')) {
                        return parent_item.get('_thumbnail');
                    }

                    if (item_images_detail.vetshop)
                        delete item_images_detail.vetshop;

                    var images = itemImageFlattenForOptions(item_images_detail);
                    // If you using the advance images features it will grab the 1st one
                    if (images.length) {
                        return images[0];
                    }

                    // still nothing? image the not available
                    return {
                        url: Configuration.get('imageNotAvailable')
                        , altimagetext: item.get('_name')
                    };
                },

                _images: function (item) {
                    var result = [],
                        selected_options = item.itemOptions,
                        item_images_detail = item.get('itemimages_detail') || {},
                        option_labels = _.compact(_.map(selected_options, function (option) { return option && option.label && option.label.replace(/[^\w\s]/g, "").replace(/\s+/g, " "); })) || null;

                    item_images_detail = item_images_detail.media || item_images_detail;

                    if (item_images_detail.vetshop)
                        delete item_images_detail.vetshop;

                    result = itemImageFlattenForOptions(item_images_detail, option_labels);

                    return result.length ? result : [{
                        url: Configuration.imageNotAvailable
                        , altimagetext: item.get('_name')
                    }];
                },

                _maximumQuantity: function (item) {
                    var product = new ProductModel({
                        item: item
                        //quantity: this.model.get('_minimumQuantity', true)
                    });
                    var childs = product.getSelectedMatrixChilds();
                    if (childs && childs.length === 1) {
                        return childs[0].get('custitem_bb1_maxorderqty') || Infinity;
                    }
                    return item.get('custitem_bb1_maxorderqty') || Infinity;
                }

            });

            return keyMapping;

        });

    }
);

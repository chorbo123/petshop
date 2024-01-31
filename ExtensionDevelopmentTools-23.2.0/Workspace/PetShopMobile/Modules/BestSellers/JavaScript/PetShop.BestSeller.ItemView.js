// @module PetShop.PetShopBestSellers.BestSellers
define('PetShop.BestSeller.ItemView'
    , [
        'petshop_bestsellers_items.tpl'

        , 'bb1.PetshopShopping.ProductDetails.Promotions.View'

        , 'Product.Model'
        , 'Item.Model'

        , 'Backbone'
    ]
    , function (
        petshop_bestsellers_items_tpl

        , bb1PetshopShoppingProductDetailsPromotionsView

        , ProductModel
        , ItemModel

        , Backbone
    ) {
        'use strict';

        // @class PetShop.PetShopBestSellers.BestSellers.View @extends Backbone.View
        return bb1PetshopShoppingProductDetailsPromotionsView.extend({

            template: petshop_bestsellers_items_tpl


            //Fetch the best sellers upon initialize
            , initialize: function (options) {

                this.model = options.model;
                this.bestSellersArray = [];
                this.testArray = [];
                this.itemImagesArray = [];

                var self = this,
                    internalIdArray = [];

                this.model.fetch().done(function (result) {

                    result.forEach(function (arrayData) {
                        internalIdArray.push(arrayData.internalId);
                        self.itemImagesArray.push({
                            'internalId': arrayData.internalId,
                            'itemImage': arrayData.itemImage
                        });
                    });

                    var idString = internalIdArray.join(','),
                        queryString = 'https://www.petshop.co.uk/api/items?id=' + idString + '&fieldset=details';

                    $.get(queryString).done(function (data) {
                        self.setItemObject(data);

                        self.render();
                    })
                });
            }

            //Sets each of the items to an object
            , setItemObject(data) {
                var self = this;

                data.items.forEach(function (itemData) {
                    var productModel = new ProductModel({ item: itemData }),
                        item = productModel.get('item'),
                        promotionObject = JSON.parse(item.get('custitem_bb1_cop_currentpromotionsjson')),
                        promotionButtonText = !!promotionObject.length ? promotionObject[0].buttonText : '',
                        itemPrice = item.getPrice(),
                        showSavings = itemPrice.price < itemPrice.compare_price,
                        priceSchedule = item.get('onlinecustomerprice_detail').priceschedule,
                        bottomlessBowlDiscount = item.get('_bottomlessBowlDiscount'),
                        minPrice = priceSchedule && priceSchedule.length > 1 ? (priceSchedule[1].price - (bottomlessBowlDiscount * priceSchedule[1].price)) : item['_keyMapping']['_minPriceAvailable'](item),
                        savings = _.roundNumber(itemPrice.compare_price - minPrice),
                        savingsFormatted = _.formatCurrency(savings);

                    var bestSellerItemObj = self.itemImagesArray.find(function (element) {
                        return element.internalId == item.id;
                    });

                    var itemObj = {
                        displayName: item.get('storedisplayname2'),
                        itemImage: item.get('itemimages_detail').urls ? item.get('itemimages_detail').urls[0].url : bestSellerItemObj.itemImage,
                        urlComponent: item.get('urlcomponent'),
                        itemPrice: itemPrice,
                        showSavings: showSavings,
                        currentPromotions: item.get('_currentPromotions') || [],
                        promoButtonText: promotionButtonText,
                        savingsFormatted: savingsFormatted
                    };

                    self.bestSellersArray.push(itemObj);
                });
            }

            //@method getContext @return PetShop.PetShopBestSellers.BestSellers.View.Context
            , getContext: function getContext() {
                //@class PetShop.PetShopBestSellers.BestSellers.View.Context

                return {
                    bestSellers: this.bestSellersArray || []
                };
            }
        });
    });

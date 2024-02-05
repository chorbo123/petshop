/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="ProductViews.Price.View"/>
/// <reference path="../../../Commons/Utilities/JavaScript/GlobalDeclarations.d.ts" />

import * as _ from 'underscore';
import * as product_views_price_tpl from 'product_views_price.tpl';
import { Configuration } from '../../Utilities/JavaScript/Configuration';
import { ProfileModel } from '../../Profile/JavaScript/Profile.Model';

import Session = require('../../Session/JavaScript/Session');
import Backbone = require('../../Utilities/JavaScript/backbone.custom');
import BackboneView = require('../../BackboneExtras/JavaScript/Backbone.View');

// @class ProductViews.Price.View @extends BackboneView
const ProductViewsPriceView: any = BackboneView.extend(
    {
        // @property {Function} template
        template: product_views_price_tpl,

        profileModel: ProfileModel.getInstance(),

        // @method initialize
        // @param {ProductViews.Price.View.Initialize.Options} options
        // @return {Void}
        initialize: function() {
            this.model.on('change', this.render, this);
        },

        // @method getUrlLogin Get the login URL contains an origin
        // hash parameter indicating the current URL to came back after login
        // @return {String}
        getUrlLogin: function(): string {
            const url = `${Session.get('touchpoints.login')}&origin=${Configuration.get(
                'currentTouchpoint'
            ) || 'home'}&origin_hash=`;

            return (
                url +
                encodeURIComponent(
                    this.options.origin === 'PDPQUICK'
                        ? this.model.generateURL().replace('/', '')
                        : Backbone.history.fragment
                )
            );
        },

        // @method getContext
        // @returns {ProductViews.Price.View.Context}
        getContext: function() {
            const price = this.model.getPrice();
            const isPriceRange = !!(price.min && price.max);
            let showComparePrice = false;
            const frequency = this.model.get('frequency');
            const frequencyLabel = frequency ? ` / ${frequency}` : '';

            // Show PreOrder or InStock when allow backorders.
            const backOrderPreOrder =
                Configuration.get('structureddatamarkup.availabilityonbackorder') === 'PreOrder';

            if (!this.options.hideComparePrice) {
                showComparePrice = isPriceRange
                    ? price.max.price < price.compare_price
                    : price.price < price.compare_price;
            }

            const item = (this.model.getItem && this.model.getItem()) || this.model;
            const strikeThroughPrice = item && item.getStrikeThroughPrice();
            const hasStrikeThrough = !!strikeThroughPrice;

            if (hasStrikeThrough) {
                showComparePrice = true;
            }

            // @class ProductViews.Price.View.Context
            return {
                // @property {Boolean} isPriceEnabled
                isPriceEnabled: !this.profileModel.hidePrices(),
                // @property {Boolean} isPriceVisible
                isPriceVisible:
                    (item && item.get('ispricevisible') !== false) ||
                    (SC.Configuration && SC.Configuration.isSCIS),
                // @property {Object} isPriceVisible_detail
                isPriceVisible_detail: item && item.get('ispricevisible_detail'),
                // @property {Boolean} isLoggedIn
                isLoggedIn: this.profileModel.isLoggedIn(),
                // @property {String} urlLogin
                urlLogin: this.getUrlLogin(),
                // @property {Boolean} isPriceRange
                isPriceRange: isPriceRange,
                // @property {Boolean} showComparePrice
                showComparePrice: showComparePrice,
                // @property {Boolean} isInStock
                isInStock: this.model.getStockInfo().isInStock,
                // @property {Boolean} isPurchasable
                isPurchasable: this.model.getStockInfo().isPurchasable,
                // @property {Boolean} backOrderPreOrder
                backOrderPreOrder: backOrderPreOrder,
                // @property {Item.Model|Product.Model} model
                model: this.model,
                // @property {String} currencyCode
                currencyCode:
                    SC.getSessionInfo('currency') && SC.getSessionInfo('currency').code
                        ? SC.getSessionInfo('currency').code
                        : Configuration.get('siteSettings.shopperCurrency.code'),
                // @property {String} priceFormatted
                priceFormatted: price.price_formatted || '',
                // @property {String} comparePriceFormatted
                comparePriceFormatted: item.getComparePrice(price, strikeThroughPrice),
                // @property {String} minPriceFormatted
                minPriceFormatted: price.min ? price.min.price_formatted : '',
                // @property {String} maxPriceFormatted
                maxPriceFormatted: price.max ? price.max.price_formatted : '',
                // @property {Number} price
                price: price.price ? price.price : 0,
                // @property {Number} price
                frequency: frequencyLabel,
                // @property {Number} comparePrice
                comparePrice: price.compare_price ? price.compare_price : 0,
                // @property {Number} minPrice
                minPrice: price.min ? price.min.price : 0,
                // @property {Number} maxPrice
                maxPrice: price.max ? price.max.price : 0,

                // @property {Boolean} showHighlightedMessage
                showHighlightedMessage:
                    _.indexOf(ProductViewsPriceView.highlightedViews, this.options.origin) >= 0
            };
            // @class ProductViews.Price.View
        }
    },
    {
        // @property {Array<String>} highlightedViews Contains the list
        // of all origins that in case of using the "LOGIN TO SEE PRICES"
        // feature must render a highlighted notification message
        // @static
        highlightedViews: ['PDPQUICK', 'PDPFULL']
    }
);

export = ProductViewsPriceView;

// @class ProductViews.Price.View.Initialize.Options
// @property {String?} origin Possible values are:
//	PDPCONFIRMATION 		For the PDP confirmation message
//	ITEMCELL 				For each item being shown in the item list (ex your-domain.com/search)
//	PDPQUICK 				For a PDP being shown on a quick view form
//	PDPFULL 				Full PDP view
//	RELATEDITEM				Related Item
//	PRODUCTLISTDETAILSLATER	Used to render each item that was saved for later
//	PRODUCTLISTDETAILSFULL	Used to render each item that is shown inside My Account in the details
//	of a particular Product List
//	PRODUCTLISTDETAILSEDIT	Used when rendering the form to edit an item inside a product list
//	ITEMVIEWCELL			For all list where items are rendered
//
// @property {Number?} linePrice Specify this value if you want to use a different price rather
// than the one of the line
// @property {String?} linePriceFormatted This string valid must be present if you want to use a
// custom price containing the formatted value of linePrice
// @property {Boolean?} hideComparePrice
// @property {Item.Model|Product.Model} model

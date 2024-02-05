// @module PetShop.PetShopBestSellers.BestSellers
define('PetShop.PetShopBestSellers.BestSellers.View'
	, [
		'petshop_petshopbestsellers_bestsellers.tpl'

		, 'PetShop.BestSeller.ItemView'
		, 'bb1.PetshopShopping.ProductDetails.Promotions.View'

		, 'PetShop.PetShopBestSellers.BestSellers.Model'
		, 'Item.Model'
		, 'Product.Model'

		, 'Backbone'
	]
	, function (
		petshop_petshopbestsellers_bestsellers_tpl

		, PetShopBestSellerItemView
		, PromotionsView

		, BestSellersModel
		, ItemModel
		, ProductModel

		, Backbone
	) {
		'use strict';

		// @class PetShop.PetShopBestSellers.BestSellers.View @extends Backbone.View
		return Backbone.View.extend({

			template: petshop_petshopbestsellers_bestsellers_tpl

			, initialize: function (options) {

			}

			, childViews: {
				'BestSeller.Items': function () {
					return new PetShopBestSellerItemView({
						model: new BestSellersModel()
					})
				}
			}

			//@method getContext @return PetShop.PetShopBestSellers.BestSellers.View.Context
			, getContext: function getContext() {
				//@class PetShop.PetShopBestSellers.BestSellers.View.Context


				return {
				};
			}
		});
	});

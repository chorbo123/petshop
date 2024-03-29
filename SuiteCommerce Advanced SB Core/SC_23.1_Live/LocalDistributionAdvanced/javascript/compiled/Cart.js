/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("Cart", ["require", "exports", "underscore", "Utils", "jQuery", "Configuration", "LiveOrder.Model", "Cart.Detailed.View", "Cart.Confirmation.Helpers", "Cart.Component"], function (require, exports, _, Utils, jQuery, Configuration_1, LiveOrderModel, CartDetailedView, CartConfirmationHelpers, CartComponent) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mountToApp = void 0;
    /*
        @class Cart
    
        Defines the Cart module
    
        mountToApp() handles some environment issues
    
        @extends ApplicationModule
    */
    function mountToApp(application) {
        this.cart_model = LiveOrderModel.getInstance();
        // Check if cart was bootstrapped
        if (!SC.ENVIRONMENT.CART_BOOTSTRAPED) {
            // Load the cart information
            LiveOrderModel.loadCart();
        }
        else if (!_.isEmpty(SC.ENVIRONMENT.CART)) {
            var cart = SC.ENVIRONMENT.CART;
            // If the condition below is false, that means the cart is empty.
            // I would suggest to remove the confirmation
            // property if not required as a sustainability task.
            if (!(Object.keys(cart).length === 1 && cart.hasOwnProperty('confirmation'))) {
                this.cart_model.set(cart);
                this.cart_model.cartLoad = this.cart_model.cartLoad || jQuery.Deferred();
                this.cart_model.isLoading = false;
                this.cart_model.cartLoad.resolveWith(cart);
            }
        }
        var self = this;
        // IMPORTANT: This api/method is preserve ONLY for Bronto Integration.
        // IT IS NOT A PUBLIC API!
        application.getCart = function getCart() {
            console.warn('Using application.getCart is deprecated!');
            var cart_promise = jQuery.Deferred();
            LiveOrderModel.loadCart()
                .done(function () {
                cart_promise.resolve(self.cart_model);
            })
                .fail(function () {
                cart_promise.reject.apply(this, arguments);
            });
            return cart_promise;
        };
        application.getLayout().goToCart = function () {
            return CartConfirmationHelpers._goToCart(this.application.getCart());
        };
        application.getLayout().showMiniCart = function () {
            return CartConfirmationHelpers._showMiniCart(this.application.getCart(), null, this.application);
        };
        application.getLayout().showCartConfirmationModal = function () {
            return CartConfirmationHelpers._showCartConfirmationModal(this.application.getCart(), null, this.application);
        };
        // Initializes the router
        if (Configuration_1.Configuration.get('modulesConfig.Cart.startRouter', true)) {
            var pageType = application.getComponent('PageType');
            pageType.registerPageType({
                name: 'Cart.Detailed.View',
                routes: ['cart', 'cart?*options'],
                view: CartDetailedView,
                defaultTemplate: {
                    name: 'cart_detailed.tpl',
                    displayName: 'Cart detailed default',
                    thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-cart.png')
                }
            });
        }
        return CartComponent(application);
    }
    exports.mountToApp = mountToApp;
});

//# sourceMappingURL=Cart.js.map

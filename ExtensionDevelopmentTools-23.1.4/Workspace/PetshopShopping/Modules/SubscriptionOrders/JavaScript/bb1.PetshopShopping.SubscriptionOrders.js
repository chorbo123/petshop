// @module bb1.PetshopShopping.SubscriptionOrders
define(
    'bb1.PetshopShopping.SubscriptionOrders',
    [
        'bb1.PetshopShopping.SubscriptionOrders.Model',
        'bb1.PetshopShopping.SubscriptionOrders.Router',
        'bb1.PetshopShopping.SubscriptionOrders.Collection',

        'Utils'
    ],
    function (
        SubscriptionOrdersModel,
        SubscriptionOrdersRouter,
        SubscriptionOrdersCollection,

        Utils
    ) {
        'use strict';

        return {

            Model: SubscriptionOrdersModel,

            Router: SubscriptionOrdersRouter,

            Collection: SubscriptionOrdersCollection,

            mountToApp: function (application) {
                var myAccountMenu = application.getComponent('MyAccountMenu');

                if (myAccountMenu) {
                    myAccountMenu.addGroup({
                        id: 'subscriptions',
                        name: Utils.translate('Your Bottomless Bowl'),
                        index: 2
                    });
                    myAccountMenu.addGroupEntry({
                        groupid: 'subscriptions',
                        id: 'subscription_orders',
                        name: Utils.translate('Manage Bottomless Bowl'),
                        url: 'subscription-orders',
                        index: 1
                    });
                    myAccountMenu.addGroupEntry({
                        groupid: 'subscriptions',
                        id: 'new_subscription',
                        name: Utils.translate('Set Up Bottomless Bowl'),
                        url: 'subscription-orders/new',
                        index: 2
                    });
                }

                // Initializes the router
                return new SubscriptionOrdersRouter(application);
            }

        };
    }
);

// @module bb1.PetshopShopping.LoyaltyRewards
define(
  'bb1.PetshopShopping.LoyaltyRewards',
  [
    'bb1.PetshopShopping.LoyaltyRewards.Model',
    'bb1.PetshopShopping.LoyaltyRewards.Router',
    'bb1.PetshopShopping.LoyaltyRewards.Collection',
    'SC.Configuration'
  ],
  function (
    LoyaltyRewardsModel,
    LoyaltyRewardsRouter,
    LoyaltyRewardsCollection,
    Configuration
  ) {
    'use strict';

    return {

      Model: LoyaltyRewardsModel,

      Collection: LoyaltyRewardsCollection,

      Router: LoyaltyRewardsRouter,

      MenuItems: {
        id: 'loyalty-rewards',
        name: 'Your Loyalty Rewards',
        url: 'loyalty-rewards',
        index: 4
      },

      mountToApp: function (application) {
        var loyaltyRewardCardsConfig = Configuration.get('loyaltyRewardCards') || {};

        if (!loyaltyRewardCardsConfig.enabled)
          return;

        var myAccountMenu = application.getComponent('MyAccountMenu');

        if (myAccountMenu) {
          myAccountMenu.addGroup({
            id: 'loyalty-rewards',
            name: 'Your Loyalty Rewards',
            url: 'loyalty-rewards',
            index: 4
          });

          application.getUser().done(function (user) {

            var loyaltyRewardCards = user.get('loyaltyRewardCards') || {};

            if (loyaltyRewardCards.loyaltyRewardsAccrued || loyaltyRewardCards.minPurchasesForNextReward)
              application.getLayout().on('afterAppendView', function (view) {
                var $banners = jQuery('.header-2019-bottom-banners');

                if (loyaltyRewardCards.loyaltyRewardsAccrued) {
                  var voucherCountText = _('$(0) voucher$(1)').translate(loyaltyRewardCards.loyaltyRewardsAccrued, loyaltyRewardCards.loyaltyRewardsAccrued > 1 ? 's' : '');
                  var voucherBannerHtml = _('<p>You have $(0) to redeem!</p><p>Save on your next order</p>').translate(voucherCountText);
                  $banners.find('.header-2019-bottom-banner').eq(2).html(voucherBannerHtml);
                }

                if (loyaltyRewardCards.minPurchasesForNextReward) {
                  var bagCountText = _('$(0) bag$(1)').translate(loyaltyRewardCards.minPurchasesForNextReward, loyaltyRewardCards.minPurchasesForNextReward > 1 ? 's' : '');
                  var voucherBannerHtml = _('<p>Your Loyalty Card</p><p>$(0) away from discount!</p>').translate(bagCountText);
                  $banners.find('.header-2019-bottom-banner').eq(3).html(voucherBannerHtml);
                }
              });

          });
        }

        // Initializes the router');
        return new LoyaltyRewardsRouter(application);
      }

    };
  }
);

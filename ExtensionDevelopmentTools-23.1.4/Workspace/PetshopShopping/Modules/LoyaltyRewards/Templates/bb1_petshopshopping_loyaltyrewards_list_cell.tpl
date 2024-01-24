<div class="loyalty-reward-card-container">
	<div class="loyalty-reward-card">
  {{#if card.brandImage}}
  <div class="loyalty-reward-card-image">
   <img class="loyalty-reward-card-image-img" src="{{card.brandImage}}" alt="{{card.brand}}" />
  </div>
  {{/if}}
		<h2 class="loyalty-reward-card-title">{{translate 'Loyalty Reward Card - because we love loyalty'}}</h2>
		<div class="loyalty-reward-card-stamps">
			{{#each card.stamps}}
    <div class="loyalty-reward-card-stamp spacer{{#if collected}} collected{{/if}}">
     {{#unless @first}}
     {{#if rewardStamp}}
     <div class="loyalty-reward-card-stamp-spacer"><span>+</span></div>
     {{else}}
     <div class="loyalty-reward-card-stamp-spacer"><span>+</span></div>
     {{/if}}
     {{/unless}}
     {{#if rewardStamp}}
     <img src="{{getExtensionAssetsPathWithDefault rewardImage 'extensions/bb1/PetshopShopping/1.0.0/img/loyalty-rewards-programme-card-reward.png'}}" alt="Reward" />
     {{else}}
     <img src="{{getExtensionAssetsPath 'extensions/bb1/PetshopShopping/1.0.0/img/loyalty-rewards-programme-card-stamp.png'}}" alt="Stamp{{#if collected}} Collected{{/if}}" />
     <div class="loyalty-reward-card-stamp-number">
      <span>{{number}}</span>
     </div>
     {{/if}}
    </div>
			{{/each}}
		</div>
  <div class="loyalty-reward-card-caption-container">
   {{#if firstUnusedCouponCode}}
    <div class="loyalty-reward-card-caption-coupon-applied">
     <a href="https://staging.petshop.co.uk/cart?promocode={{firstUnusedCouponCode}}">
     {{translate 'Redeem Code: $(0)' firstUnusedCouponCode}}
     </a>
    </div>
   {{else}}
    <div class="loyalty-reward-card-caption">
    {{#if purchasesRemainingText}}
     {{purchasesRemainingText}}
    {{else}}
     {{translate 'Coupon code missing?!'}}
    {{/if}}
    </div>
   {{/if}}
  </div>
  <div class="loyalty-reward-card-items">
   <a href="/{{qualifyingItemsUrl}}" data-touchpoint="home" data-hashtag="#{{qualifyingItemsUrl}}">
   {{translate 'View Qualifying Items'}}
   </a>
  </div>
  {{#if showRedeemedDate}}
  <div class="loyalty-reward-card-redeemed">
   Redeemed:<br />
   {{card.dateRedeemed}}
  </div>
  {{/if}}
	</div>
</div>
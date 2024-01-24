<div class="voucher-wrapper">
	<div class="voucher">
  {{#if voucher.thumbnailUrl}}
  <div class="voucher-image">
   <img class="voucher-image-img" src="{{voucher.thumbnailUrl}}" alt="{{voucher.description}}" />
  </div>
  {{/if}}
		<div class="voucher-info">
   <p class="voucher-info-title">{{voucher.title}}</p>
   <p class="voucher-info-description">{{voucher.description}}</p>
   {{#if voucher.enddate}}
   <p class="voucher-info-expires">Expires {{voucher.enddate}}</p>
   {{/if}}
		</div>
  <div class="voucher-caption">
  {{#if voucher.code}}
   <a href="/cart?promocode={{voucher.code}}" data-touchpoint="home" data-hashtag="#/cart?promocode={{voucher.code}}">
    <div class="voucher-caption-coupon-applied">
    {{translate 'Apply Code: $(0)' voucher.code}}
    </div>
   </a>
  {{else}}
   {{translate 'Coupon code missing?!'}}
  {{/if}}
  </div>
	</div>
</div>
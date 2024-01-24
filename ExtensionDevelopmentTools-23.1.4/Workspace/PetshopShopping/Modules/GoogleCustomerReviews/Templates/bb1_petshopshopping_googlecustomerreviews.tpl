<section class="order-wizard-googlecustomerreviews-module">
 <div id="gts-order" style="display:none;" translate="no">
   <span id="gts-o-id">{{confirmationNumber}}</span>
   <span id="gts-o-email">{{email}}</span>
   <span id="gts-o-country">{{country}}</span>
   <span id="gts-o-currency">{{currencyCode}}</span>
   <span id="gts-o-total">{{total}}</span>
   <span id="gts-o-discounts">{{discountTotal}}</span>
   <span id="gts-o-shipping-total">{{shippingCost}}</span>
   <span id="gts-o-tax-total">{{taxTotal}}</span>
   <span id="gts-o-est-ship-date">{{shipDate}}</span>
   <span id="gts-o-est-delivery-date">{{deliveryDate}}</span>
   <span id="gts-o-has-preorder">N</span>
   <span id="gts-o-has-digital">N</span>
   {{#each orderLines}}
    <span class="gts-item">
      <span class="gts-i-name">{{item/_name}}</span>
      <span class="gts-i-price">{{rate}}</span>
      <span class="gts-i-quantity">{{quantity}}</span>
      <span class="gts-i-prodsearch-id">{{item/itemid}}</span>
      <span class="gts-i-prodsearch-store-id">{{../googleStoreId}}</span>
    </span>
   {{/each}}
 </div>
</section>
<div class="product-line-stock">
  {{#if isNotAvailableInStore}}
  <div class='product-line-stock-msg-not-available'>{{translate 'This item is no longer available'}}</div>
  {{else}}
  {{#if showFullStockMessage}}
  {{#if showInStockMessage}}
  <div class="item-detail-stock-status">
    {{#if stockInfo.inStockDeliveredFullMessage}}
    {{{stockInfo.inStockDeliveredFullMessage}}}
    {{else}}
    {{{stockInfo.inStockMessage}}}
    {{/if}}
  </div>
  {{/if}}
  {{#if showOutOfStockMessage}}
  <div class="item-detail-stock-status out-of-stock">
    {{outOfStockMessage}}
  </div>
  {{/if}}
  {{else}}
  {{#if showOutOfStockMessage}}
  <p class="product-line-stock-msg-out">
    <span class="product-line-stock-msg-out-text">{{stockInfo.outOfStockMessage}}</span>
  </p>
  {{/if}}
  {{#if showInStockMessage}}
  {{#if estimatedDeliveryDetails.deliveryDate}}
  <p class="product-line-stock-msg-in">
    {{#if stockInfo.inStockDeliveredMessage}}
    {{{translate 'Express Delivery: $(0)' stockInfo.inStockDeliveredMessage}}}
    {{else}}
    {{{stockInfo.inStockMessage}}}
    {{/if}}
  </p>
  {{/if}}
  {{#if estimatedDeliveryDetails.standardDeliveryDateFormatted}}
  <p class="product-line-stock-delivery-estimate-standard">
    {{translate 'Standard Delivery: In Stock, Get it by the $(0)'
    estimatedDeliveryDetails.standardDeliveryDayFormatted}}
  </p>
  {{/if}}
  {{/if}}
  {{/if}}
  {{/if}}
</div>
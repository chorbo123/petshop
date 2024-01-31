{{#if showWarehouseDeliveryMessage}}
<div class="item-detail-delivery-message">
 {{translate "<strong>Get it from $(0) - $(1)</strong> when you select Express Delivery, Order within <strong>$(2)</strong>" earliestDeliveryDateFormatted latestDeliveryDateFormatted timeBeforeTime11amFormatted}}
</div>
{{else if showPhWarehouseDeliveryMessage}}
<div class="item-detail-delivery-message">
 {{translate "Order within <strong>$(0)</strong>, get it as soon as <strong>$(1) - $(2)<strong> when you select Express Delivery" timeBeforeTime11amFormatted earliestDeliveryDatePhFormatted latestDeliveryDatePhFormatted}}
</div>
{{/if}}
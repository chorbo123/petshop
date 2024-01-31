<div class="order-wizard-upsellitems-module">
 {{#if showTitle}}
 <h3 class="order-wizard-upsellitems-module-title">
  {{title}}
 </h3>
 {{/if}}
  
 {{#if showLoadingItems}}
  <div class="order-wizard-upsellitems-module-message">
   {{translate 'Loading...'}}
  </div>
 {{else if noItems}}
  <div class="order-wizard-upsellitems-module-message">
   {{translate 'The are no items to display.'}}
  </div>
 {{else }}
  <div class="order-wizard-upsellitems-list" data-view="SeasonalItems.List"></div>
 {{/if}}
</div>
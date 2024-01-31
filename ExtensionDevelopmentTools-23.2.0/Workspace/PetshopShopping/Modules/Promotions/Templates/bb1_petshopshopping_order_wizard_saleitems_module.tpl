<div class="order-wizard-freeitems-module">
 {{#if showTitle}}
 <h3 class="order-wizard-freeitems-module-title">
  {{title}}
 </h3>
 {{/if}}
  
 {{#if showLoadingItems}}
  <div class="order-wizard-freeitems-module-message">
   {{translate 'Loading...'}}
  </div>
 {{else if cartContainsSaleItems}}
  <div class="order-wizard-freeitems-module-message">
   {{translate 'You have already selected a sale item.'}}
  </div>
 {{else if noItems}}
  <div class="order-wizard-freeitems-module-message">
   {{translate 'The are no items to display.'}}
  </div>
 {{else}}
  <div class="order-wizard-freeitems-list" data-view="SaleItems.List"></div>
 {{/if}}
</div>
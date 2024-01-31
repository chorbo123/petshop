<div class="order-wizard-freeitems-module">
 {{#if showTitle}}
 <h3 class="order-wizard-freeitems-module-title">
  {{title}}
 </h3>
 {{/if}}
  
 {{#if cartContainsFreeItems}}
  <div class="order-wizard-freeitems-module-message">
   {{translate 'You have already selected your freebie.'}}
  </div>
 {{else if showLoadingItems}}
  <div class="order-wizard-freeitems-module-message">
   {{translate 'Loading...'}}
  </div>
 {{else}}
  <div class="order-wizard-freeitems-list" data-view="FreeItems.List"></div>
 {{/if}}
</div>
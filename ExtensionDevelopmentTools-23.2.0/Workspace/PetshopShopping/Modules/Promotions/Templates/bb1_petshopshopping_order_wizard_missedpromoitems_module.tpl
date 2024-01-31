<div class="order-wizard-upsellitems-module">
 {{#if showTitle}}
 <h3 class="order-wizard-upsellitems-module-title">
  {{title}}
 </h3>
 {{/if}}
  
 {{#if noItems}}
  <div class="order-wizard-upsellitems-module-message">
   {{translate 'The are no items to display.'}}
  </div>
 {{else if showLoadingItems}}
  <div class="order-wizard-upsellitems-module-message">
   {{translate 'Loading...'}}
  </div>
 {{else}}
 {{#each collections}}
  <div class="order-wizard-upsellitems-list-wrapper">
   {{#if title}}
   <h3 class="order-wizard-upsellitems-list-title">{{title}}</h3>
   {{/if}}
   {{#if description}}
   <p class="order-wizard-upsellitems-list-description">{{description}}</p>
   {{/if}}
   <div class="order-wizard-upsellitems-list" data-view="MissedPromoItems.List{{@index}}"></div>
  </div>
 {{/each}}
 {{/if}}
</div>
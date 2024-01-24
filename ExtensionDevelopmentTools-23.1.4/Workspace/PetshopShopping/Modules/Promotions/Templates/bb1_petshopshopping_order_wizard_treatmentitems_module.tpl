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
 {{else}}
  {{#if hasFleaTreatmentItems}}
  <div class="order-wizard-upsellitems-list-wrapper">
   {{#if fleaTreatmentItemsTitle}}
   <h3 class="order-wizard-upsellitems-list-title">{{fleaTreatmentItemsTitle}}</h3>
   {{/if}}
   <div class="order-wizard-upsellitems-list" data-view="FleaTreatment.ItemList"></div>
  </div>
  {{/if}}
  {{#if hasWormingTreatmentItems}}
  <div class="order-wizard-upsellitems-list-wrapper">
   {{#if wormingTreatmentItemsTitle}}
   <h3 class="order-wizard-upsellitems-list-title">{{wormingTreatmentItemsTitle}}</h3>
   {{/if}}
   <div class="order-wizard-upsellitems-list" data-view="WormingTreatment.ItemList"></div>
  </div>
  {{/if}}
 {{/if}}
</div>
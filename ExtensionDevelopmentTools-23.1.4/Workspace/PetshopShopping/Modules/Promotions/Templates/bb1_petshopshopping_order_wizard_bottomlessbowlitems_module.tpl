{{#if hasItems}}
<div class="order-wizard-bottomlessbowlitems-module">
 {{#if showLoadingItems}}
  <div class="order-wizard-bottomlessbowlitems-module-message">
   <p>{{translate 'Loading...'}}</p>
  </div>
 {{else}} 
  <div class="order-wizard-bottomlessbowlitems-module-header">
   <p>{{translate 'Your order qualifies to <strong>save an extra $(0)</strong> on $(1) $(2) with our Subscribe &amp; Save Bottomless Bowl service.' maxDiscountPercentage petNames itemName}}</p>
   <p>{{translate 'You may pause or cancel at any time, the idea is to save you time and money and be uber convenient.'}}</p>
  </div>
   
  <div class="order-wizard-bottomlessbowlitems-list" data-view="BottomlessBowlItems.List"></div>
  
  <div class="order-wizard-bottomlessbowlitems-actions">
   <button class="order-wizard-bottomlessbowlitems-close-button" data-action="hide-module">{{translate 'No thanks!'}}</button>
  </div>
 {{/if}}
</div>
{{/if}}
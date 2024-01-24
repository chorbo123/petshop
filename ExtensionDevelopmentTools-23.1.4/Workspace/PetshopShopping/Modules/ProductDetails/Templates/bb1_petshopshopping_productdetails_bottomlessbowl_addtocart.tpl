{{#if canSubscribe}}
<div id="{{cartOptionId}}-container" class="bottomless-bowl-option-container-alt" data-type="option" data-cart-option-id="{{cartOptionId}}" data-item-option-id="{{itemOptionId}}">
 <div class="bottomless-bowl-option-container-alt-row {{cartOptionId}}-controls-group" data-validation="control-group">
 
  <div class="bottomless-bowl-toggle">
   {{#if heading}}
    <p>{{heading}}</p>
   {{else if bottomlessBowlDiscount}}
    <p>{{translate 'Subscribe &amp; Save $(0) on Every Order' bottomlessBowlDiscountFormatted}}</p>
   {{else}}
    <p>{{translate 'Subscribe &amp; Save Time with Subscription'}}</p>
   {{/if}}
  </div>
  
  <div id="bottomless-bowl-select" class="bottomless-bowl-select">
  
   <label class="option-label" for="{{cartOptionId}}">
    {{translate 'Deliver to me every'}}
   </label>
   
   <div class="{{cartOptionId}}-controls" data-validation="control">
    <select name="{{cartOptionId}}" id="{{cartOptionId}}" class="bottomless-bowl-select-input" data-action="updateOrderSchedule">
     <option value="">{{#if forceUserToSelectDeliveryOption}}{{translate 'Delivery Frequency'}}{{else}}{{translate 'Just Ship Once'}}{{/if}}</option>
     {{#each orderScheduleOptionValues}}
      {{#if internalId}}
       <option
        class="{{#if isActive}}active{{/if}} {{#unless isAvailable}}muted{{/unless}}"
        value="{{internalId}}"
        {{#if isActive}}selected{{/if}}
        data-active="{{isActive}}"
        data-available="{{isAvailable}}">
         {{label}}
       </option>
      {{/if}}
     {{/each}}
    </select>
   </div>
   
  </div>
  
  <p class="bottomless-bowl-option-learn-more">
   <a
    href="#/bottomless-bowl"
    data-toggle="popover"
    data-placement="top"
    title=""
    {{#if bottomlessBowlDiscount}}
    data-content="<a href='#' class='close' data-dismiss='alert'>&times;</a><p>Subscribe & Save {{bottomlessBowlDiscountFormatted}} on this product with Bottomless Bowl. Our auto reorder service means that you never worry about running out of pet supplies again.</p><p>By Selecting Bottomless Bowl, you will be sent &amp; billed your chosen product(s) at the frequency you have chosen.</p><p>You can change delivery dates, skip a delivery, or cancel by logging into your account or by giving us a call.</p><p class='footer-link'><a href='/bottomless-bowl'>View full details</a></p>"
    {{else}}
    data-content="<a href='#' class='close' data-dismiss='alert'>&times;</a><p>Subscribe to our Bottomless Bowl auto-reorder service. Our auto reorder service means that you never worry about running out of pet supplies again.</p><p>By Selecting Bottomless Bowl, you will be sent &amp; billed your chosen product(s) at the frequency you have chosen.</p><p>You can change delivery dates, skip a delivery, or cancel by logging into your account or by giving us a call.</p><p class='footer-link'><a href='/bottomless-bowl'>View full details</a></p>"
    {{/if}}
   >
    {{translate 'Learn more'}}
   </a>
  </p>
 </div>
</div>
{{/if}}
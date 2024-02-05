{{!
 © 2016 NetSuite Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
}}

<div class="product-views-price">
 {{#if isPriceEnabled}}
 
  {{#if showSubscriptionPricing}}
   <div class="product-views-subscription-price-table-2022" itemprop="offers" itemscope="" itemtype="https://schema.org/Offer">
    <meta itemprop="priceCurrency" content="{{currencyCode}}" />
    <meta itemprop="price" content="{{price}}" />
    <link itemprop="availability" href="{{#if isInStock}}https://schema.org/InStock{{else}}https://schema.org/OutOfStock{{/if}}" />
  
    <form>
     <table>
      <thead>
       <tr>
        <td class="product-views-subscription-price-table-select-heading"></td>
        <td colspan="2" class="product-views-subscription-price-table-label-heading"></td>
        <td class="product-views-subscription-price-table-label-heading"></td>
        <td class="product-views-subscription-price-table-label-heading-price">{{translate 'Price per $(0)' saleUnit}}
         {{#if savings}}
          <p class="product-views-subscription-price-table-rrp">
           {{translate 'RRP <strike>$(0)</strike>' comparePriceFormatted}}
          </p>
         {{/if}}
        </td>
        <td class="product-views-subscription-price-table-savings-heading"></td>
       </tr>
      </thead>
      <tbody>
       {{#if priceSchedules}}
        {{#each priceSchedules}}
         <tr{{#if ../selectedOrderSchedule}}{{#if selectedMinQuantity}} class="selected"{{/if}}{{/if}}>
          <td class="product-views-subscription-price-table-select-td">
           <input type="radio" name="select-delivery-option" class="product-views-subscription-price-table-select" value="?" data-action="select-delivery-option" data-delivery-option="?" data-quantity="{{schedulePriceMinQuantity}}"{{#if ../selectedOrderSchedule}}{{#if selectedMinQuantity}} checked{{/if}}{{/if}} />
          </td>
          <td class="product-views-subscription-price-table-quantity-td">
           <span class="product-views-subscription-price-table-quantity">{{translate '$(0) $(1)' schedulePriceMinQuantity saleUnit}}</span>
          </td>
          <td class="product-views-subscription-price-table-label-td">
           {{#if hasSubscriptionDiscount}}
           <span class="product-views-subscription-price-table-label">{{translate 'Bottomless Bowl'}}</span>
           {{else}}
           <span class="product-views-subscription-price-table-label">{{translate 'Bottomless Bowl'}}</span>
           {{/if}}
          </td>
          <td class="product-views-subscription-price-table-label-td">
           {{#if hasFirstOrderSubscriptionDiscount}}
           <span class="product-views-subscription-price-table-label-first-price">{{translate '$(0)% off your first order' firstOrderSubscriptionDiscountRate}}</span>
           <span class="product-views-subscription-price-table-label-repeat-price">{{translate '$(0)% off your repeat order' subscriptionDiscountRate}}</span>
           {{else}}
           {{#if hasSubscriptionDiscount}}
           <span class="product-views-subscription-price-table-label-discount">{{translate '$(0)% off ALL orders' subscriptionDiscountRate}}</span>
           {{/if}}
           {{/if}}
          </td>
          <td class="product-views-subscription-price-table-lead-td">
           {{#if hasFirstOrderSubscriptionDiscount}}
           <span class="product-views-subscription-price-table-lead-first-price">{{firstOrderSubscriptionDiscountedSchedulePriceFormatted}}</span>
           <span class="product-views-subscription-price-table-lead-repeat-price">{{subscriptionDiscountedSchedulePriceFormatted}}</span>
           {{else}}
           <span class="product-views-subscription-price-table-lead{{#if hasSubscriptionDiscount}}-discount{{/if}}">{{subscriptionDiscountedSchedulePriceFormatted}}</span>
           {{/if}}
           {{#if subscriptionIsFreeDelivery}}
            <span class="free-delivery">{{translate 'Free Delivery'}}</span>
           {{/if}}
          </td>
          <td class="product-views-subscription-price-table-savings-td">
           {{#if hasFirstOrderSubscriptionDiscount}}
           <span class="product-views-subscription-price-table-savings-first-price">{{translate '-$(1)%' firstOrderSubscriptionDiscountedSchedulePriceSavingsFormatted firstOrderSubscriptionDiscountedSchedulePriceSavingsPercentage}}</span>
           <span class="product-views-subscription-price-table-savings-repeat-price">{{translate '-$(1)%' subscriptionDiscountedSchedulePriceSavingsFormatted subscriptionDiscountedSchedulePriceSavingsPercentage}}</span>
           {{else}}
           {{#if subscriptionDiscountedSchedulePriceSavings}}
           <span class="product-views-subscription-price-table-savings{{#if hasSubscriptionDiscount}}-discount{{/if}}">{{translate '-$(1)%' subscriptionDiscountedSchedulePriceSavingsFormatted subscriptionDiscountedSchedulePriceSavingsPercentage}}</span>
           {{/if}}
           {{/if}}
          </td>
         </tr>
         <tr{{#unless ../selectedOrderSchedule}}{{#if selectedMinQuantity}} class="selected"{{/if}}{{/unless}}>
          <td class="product-views-subscription-price-table-select-td">
           <input type="radio" name="select-delivery-option" class="product-views-subscription-price-table-select" value="" data-action="select-delivery-option" data-delivery-option="" data-quantity="{{schedulePriceMinQuantity}}"{{#unless ../selectedOrderSchedule}}{{#if selectedMinQuantity}} checked{{/if}}{{/unless}} />
          </td>
          <td class="product-views-subscription-price-table-quantity-td">
           <span class="product-views-subscription-price-table-quantity">{{translate '$(0) $(1)' schedulePriceMinQuantity saleUnit}}</span>
          </td>
          <td class="product-views-subscription-price-table-label-td">
           <span class="product-views-subscription-price-table-label">{{translate 'One Time Purchase'}}</span>
          </td>
          <td class="product-views-subscription-price-table-label-td">
           <span class="product-views-subscription-price-table-label"></span>
          </td>
          <td class="product-views-subscription-price-table-lead-td">
           <span class="product-views-subscription-price-table-lead">{{priceFormatted}}</span>
           {{#if isFreeDelivery}}
            <span class="free-delivery">{{translate 'Free Delivery'}}</span>
           {{/if}}
          </td>
          <td class="product-views-subscription-price-table-savings-td">
           {{#if schedulePriceSavings}}
           <span class="product-views-subscription-price-table-savings">{{translate '-$(1)%' schedulePriceSavingsFormatted schedulePriceSavingsPercentage}}</span>
           {{/if}}
          </td>
         </tr>
        {{/each}}
       {{else}}
        <tr{{#if selectedOrderSchedule}} class="selected"{{/if}}>
         <td class="product-views-subscription-price-table-select-td">
          <input type="radio" name="select-delivery-option" class="product-views-subscription-price-table-select" value="?" data-action="select-delivery-option" data-delivery-option="?" data-quantity="1"{{#if selectedOrderSchedule}} checked{{/if}} />
         </td>
         <td class="product-views-subscription-price-table-label-td" colspan="2">
          {{#if hasSubscriptionDiscount}}
          <span class="product-views-subscription-price-table-label">{{translate 'Bottomless Bowl'}} <span class="product-views-subscription-price-table-label-discount">{{subscriptionDiscountRate}}%</span></span>
          {{else}}
          <span class="product-views-subscription-price-table-label">{{translate 'Bottomless Bowl'}}</span>
          {{/if}}
         </td>
         <td class="product-views-subscription-price-table-label-td">
          {{#if hasFirstOrderSubscriptionDiscount}}
          <span class="product-views-subscription-price-table-label-first-price">{{translate '$(0)% off your first order' firstOrderSubscriptionDiscountRate}}</span>
          <span class="product-views-subscription-price-table-label-repeat-price">{{translate '$(0)% off your repeat order' subscriptionDiscountRate}}</span>
          {{else}}
          {{#if hasSubscriptionDiscount}}
          <span class="product-views-subscription-price-table-label-discount">{{translate '$(0)% off ALL orders' subscriptionDiscountRate}}</span>
          {{/if}}
          {{/if}}
         </td>
         <td class="product-views-subscription-price-table-lead-td">
          {{#if hasFirstOrderSubscriptionDiscount}}
          <span class="product-views-subscription-price-table-lead-first-price">{{firstOrderSubscriptionDiscountedPriceFormatted}}</span>
          <span class="product-views-subscription-price-table-lead-repeat-price">{{subscriptionDiscountedPriceFormatted}}</span>
          {{else}}
          <span class="product-views-subscription-price-table-lead{{#if hasSubscriptionDiscount}}-discount{{/if}}">{{subscriptionDiscountedPriceFormatted}}</span>
          {{/if}}
         </td>
         <td class="product-views-subscription-price-table-savings-td">
          {{#if hasFirstOrderSubscriptionDiscount}}
          <span class="product-views-subscription-price-table-savings-first-price">{{translate '-$(1)%' firstOrderSubscriptionDiscountedPriceSavingsPercentage firstOrderSubscriptionDiscountedSavingsPercentage}}</span>
          <span class="product-views-subscription-price-table-savings-repeat-price">{{translate '-$(1)%' subscriptionDiscountedPriceSavingsPercentage subscriptionDiscountedSavingsPercentage}}</span>
          {{else}}
          {{#if subscriptionDiscountedSavings}}
          <span class="product-views-subscription-price-table-savings{{#if hasSubscriptionDiscount}}-discount{{/if}}">{{translate '-$(1)%' subscriptionDiscountedSavingsFormatted subscriptionDiscountedSavingsPercentage}}</span>
          {{/if}}
          {{/if}}
         </td>
        </tr>
        <tr{{#unless selectedOrderSchedule}} class="selected"{{/unless}}>
         <td class="product-views-subscription-price-table-select-td">
          <input type="radio" name="select-delivery-option" class="product-views-subscription-price-table-select" value="" data-action="select-delivery-option" data-delivery-option="" data-quantity="1"{{#unless selectedOrderSchedule}} checked{{/unless}} />
         </td>
         <td class="product-views-subscription-price-table-label-td" colspan="2">
          <span class="product-views-subscription-price-table-label">{{translate 'One Time Purchase'}}</span>
         </td>
         <td class="product-views-subscription-price-table-label-td">
          <span class="product-views-subscription-price-table-label"></span>
         </td>
         <td class="product-views-subscription-price-table-lead-td">
          <span class="product-views-subscription-price-table-lead">{{priceFormatted}}</span>
         </td>
         <td class="product-views-subscription-price-table-savings-td">
          {{#if savings}}
          <span class="product-views-subscription-price-table-savings">{{translate '-$(1)%' savingsFormatted savingsPercentage}}</span>
          {{/if}}
         </td>
        </tr>
       {{/if}}
      </tbody>
     </table>
    </form>
    
   </div>
   
  {{else}}
   <!--
   {{#if savings}}
    <p class="row-fluid was">
     <span class="label">{{translate 'Was:'}}</span>
     <span class="value"><strike>{{comparePriceFormatted}}</strike></span>
    </p>
   {{/if}}
   
   <p class="row-fluid price" itemprop="offers" itemscope="" itemtype="https://schema.org/Offer">
    <meta itemprop="priceCurrency" content="{{currencyCode}}">
    <meta itemprop="price" content="{{price}}">
    <link itemprop="availability" href="{{#if isInStock}}https://schema.org/InStock{{else}}https://schema.org/OutOfStock{{/if}}" />
    
    <span class="label">{{translate 'Your Price:'}}</span>
    <span class="value">
     <span class="lead-price" itemprop="price" data-rate="{{price}}">{{priceFormatted}}</span> --><!-- WHAT ABOUT PRICE RANGES -->
     <!--{{#if savings}}
      <span class="saving"> {{translate '(You save $(0))' savingsFormatted}}</span>
     {{/if}}
    </span>
   </p>-->
   
   {{#if isPriceRange}}
    <span class="product-views-price-range" itemprop="offers" itemscope itemtype="https://schema.org/AggregateOffer">
     <meta itemprop="priceCurrency" content="{{currencyCode}}"/>
     <meta itemprop="lowPrice" content="{{minPrice}}" />
     <meta itemprop="highPrice" content="{{maxPrice}}" />
     <!-- Price Range -->
     <span class="product-views-price-lead" data-role="product-view-price-lead">
      {{translate '<span>$(1)</span> to <span>$(3)</span>' minPrice minPriceFormatted maxPrice maxPriceFormatted}}
     </span>
     {{#if showComparePrice}}
      <small class="product-views-price-old">
       {{translate 'Was:'}} {{comparePriceFormatted}}
      </small>
     {{/if}}
     <link itemprop="availability" href="{{#if isInStock}}https://schema.org/InStock{{else}}https://schema.org/OutOfStock{{/if}}"/>
    </span>

   {{else}}
    <span class="product-views-price-exact" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
     <meta itemprop="priceCurrency" content="{{currencyCode}}"/>
     <meta itemprop="price" content="{{price}}" />
     <!-- Single -->
      {{#if showMinPricing}}
       <span class="product-views-price-starting" data-role="price-lead-formatted">
        {{translate '<span>From: </span>$(0)' minPriceAvailableFormatted}}
       </span>
      {{else}}
       <span class="product-views-price-lead" data-role="price-lead-formatted">
       {{minPriceAvailableFormatted}}
       </span>
      {{/if}}
     {{#if showComparePrice}}
      <small class="product-views-price-old">
       {{translate 'Was:'}} {{comparePriceFormatted}}
      </small>
     {{/if}}
     <link itemprop="availability" href="{{#if isInStock}}https://schema.org/InStock{{else}}https://schema.org/OutOfStock{{/if}}"/>
    </span>
   {{/if}}
   
  {{/if}}
 {{else}}
  {{#if showHighlightedMessage}}
   <div class="product-views-price-login-to-see-prices-highlighted">
    <p class="product-views-price-message">
     {{translate 'Please <a href="$(0)" data-navigation="ignore-click">log in</a> to see price or purchase this item' urlLogin}}
    </p>
   </div>
  {{else}}
   <div class="product-views-price-login-to-see-prices">
    <p class="product-views-price-message">
     {{translate '<a href="$(0)" data-navigation="ignore-click">Log in</a> to see price' urlLogin}}
    </p>
   </div>
  {{/if}}
 {{/if}}
  
 {{#if pricingMessage}}
 <div class="product-views-price-pricing-message">{{pricingMessage}}</div>
 {{/if}}
        
</div>



{{!----
Use the following context variables when customizing this template: 
 
 isPriceEnabled (Boolean)
 urlLogin (String)
 isPriceRange (Boolean)
 showComparePrice (Boolean)
 isInStock (Boolean)
 model (Object)
 model.item (Object)
 model.item.internalid (Number)
 model.item.type (String)
 model.quantity (Number)
 model.internalid (String)
 model.options (Array)
 model.options.0 (Object)
 model.options.0.cartOptionId (String)
 model.options.0.itemOptionId (String)
 model.options.0.label (String)
 model.options.0.type (String)
 model.options.0.values (Array)
 model.location (String)
 model.fulfillmentChoice (String)
 model.description (String)
 model.priority (Object)
 model.priority.id (String)
 model.priority.name (String)
 model.created (String)
 model.createddate (String)
 model.lastmodified (String)
 currencyCode (String)
 priceFormatted (String)
 comparePriceFormatted (String)
 minPriceFormatted (String)
 maxPriceFormatted (String)
 price (Number)
 comparePrice (Number)
 minPrice (Number)
 maxPrice (Number)
 showHighlightedMessage (Boolean)

----}}

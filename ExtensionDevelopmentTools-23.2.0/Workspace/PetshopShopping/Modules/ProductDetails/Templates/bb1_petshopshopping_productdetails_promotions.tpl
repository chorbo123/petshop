{{#if hasPromotions}}
<div class="item-views-promotions">
    {{#each promotions}}
    <a class="item-views-promotions-button" href="/Promotions/{{internalid}}">
        {{buttonText}}
    </a>
    {{/each}}
</div>
{{else if promotionButtonText}}
<div class="item-views-promotions">
    <button class="item-views-promotions-button">
        {{promotionButtonText}}
    </button>
</div>
{{else if showSavings}}
<div class="item-views-promotions">
    <button class="item-views-promotions-button">
        {{#if saveUpToFlag}}
        {{translate 'Save up to $(0)' itemPrice.savings_formatted}}
        {{else}}
        {{translate 'Save $(0)' itemPrice.savings_formatted}}
        {{/if}}
    </button>
</div>
{{/if}}
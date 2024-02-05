<div class="pbs-flex">
    {{#each bestSellers}}
    <div class="pbs-item-wrap">
        <a href="{{urlComponent}}" class="pbs-item">
            <div class="pbs-img-wrap">
                <div class="pbs-img">
                    <img src="{{this.itemImage}}" alt="">
                </div>
                <p>{{this.displayName}}</p>

                {{#if currentPromotions}}
                <span class="facets-item-cell-grid-image-sale"></span>
                {{/if}}

                {{#if showSavings}}
                <span class="facets-item-cell-grid-image-sale"></span>
                {{/if}}
            </div>
            <div class="pbs-tag">
                {{#if currentPromotions}}
                <span>{{promoButtonText}}</span>
                {{else if showSavings}}
                <span>{{translate 'Save up to $(0)' savingsFormatted}}</span>
                {{else}}
                <span>Buy Now</span>
                {{/if}}
            </div>
        </a>
    </div>
    {{/each}}
</div>

<!--
    Available helpers:
    {{ getExtensionAssetsPath "img/image.jpg"}} - reference assets in your extension
    
    {{ getExtensionAssetsPathWithDefault context_var "img/image.jpg"}} - use context_var value i.e. configuration variable. If it does not exist, fallback to an asset from the extension assets folder
    
    {{ getThemeAssetsPath context_var "img/image.jpg"}} - reference assets in the active theme
    
    {{ getThemeAssetsPathWithDefault context_var "img/theme-image.jpg"}} - use context_var value i.e. configuration variable. If it does not exist, fallback to an asset from the theme assets folder
  -->
<div class="facets-item-cell-grid" data-type="item" data-item-id="{{itemId}}" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/Product" data-track-productlist-list="{{track_productlist_list}}" data-track-productlist-category="{{track_productlist_category}}" data-track-productlist-position="{{track_productlist_position}}" data-sku="{{sku}}">
	<meta itemprop="sku" content="{{sku}}"/>
 <meta itemprop="url" content="{{url}}"/>
	<meta itemprop="description" content="{{description}}"/>

	<div class="facets-item-cell-grid-image-wrapper">
		<a class="facets-item-cell-grid-link-image" href="{{url}}">
			<img class="facets-item-cell-grid-image" src="{{resizeImage thumbnail.url 'thumbnail'}}" alt="{{thumbnail.altimagetext}}" itemprop="image"/>
   {{#if isFreeDelivery}}
    <span class="facets-item-cell-grid-image-free-delivery"></span>
   {{/if}}
   {{#if isOnSale}}
    <span class="facets-item-cell-grid-image-sale"></span>
   {{/if}}
   {{#if productTypeImageUrl}}
    <span class="facets-item-cell-grid-image-product-type" style="background-image: url({{productTypeImageUrl}});"></span>
   {{/if}}
   {{#if expressDelivery.nextDayAvailable}}
    <span class="facets-item-cell-grid-image-next-day-delivery"></span>
   {{/if}}
		</a>
		{{#if isEnvironmentBrowser}}
			<div class="facets-item-cell-grid-quick-view-wrapper">
				<a href="{{url}}" class="facets-item-cell-grid-quick-view-link" data-toggle="show-in-modal">
					<i class="facets-item-cell-grid-quick-view-icon"></i>
					{{translate 'Quick View'}}
				</a>
			</div>
		{{/if}}
	</div>
 
	<div class="facets-item-cell-grid-details">
	 <div class="facets-item-cell-grid-details-top">
   <a class="facets-item-cell-grid-title" href="{{url}}">
    <span itemprop="name">{{name}}</span>
   </a>
   
   <div data-view="StockDescription"></div>
   
   <div data-view="ItemViews.Promotions"></div>
  </div>
  
  <div class="facets-item-cell-grid-details-bottom">
   <div class="facets-item-cell-grid-price" data-view="ItemViews.Price"></div>

   <div data-view="Cart.QuickAddToCart"></div>
   
   {{#if showRating}}
    <div class="facets-item-cell-grid-rating" itemprop="aggregateRating" itemscope="" itemtype="https://schema.org/AggregateRating" data-view="GlobalViews.StarRating">
    </div>
   {{/if}}

   {{#if cheaperOptionsAvailable}}
   <div class="facets-item-cell-grid-cheaper-options">
    <a href="{{url}}" data-toggle="show-in-modal">
     {{translate 'Cheaper Options Available'}}
    </a>
   </div>
   {{/if}}
   
   <div data-view="ItemDetails.Options"></div>

   <a href="{{url}}" class="facets-item-cell-grid-addtocart-btn" data-toggle="show-in-modal">
    <i class="facets-item-cell-grid-addtocart-btn-icon"></i>
    {{translate 'Add to Cart'}}
   </a>
   
   <div class="facets-item-cell-grid-stock">
    <div data-view="ItemViews.Stock" class="facets-item-cell-grid-stock-message"></div>
   </div>
   
   {{#if isFreeDelivery}}
    <div class="facets-item-cell-grid-footer-free-delivery">Includes FREE Delivery</div>
   {{/if}}
	 </div>
	</div>
</div>




{{!----
Use the following context variables when customizing this template: 
	
	itemId (Number)
	name (String)
	url (String)
	sku (String)
	isEnvironmentBrowser (Boolean)
	thumbnail (Object)
	thumbnail.url (String)
	thumbnail.altimagetext (String)
	itemIsNavigable (Boolean)
	showRating (Boolean)
	rating (Number)

----}}

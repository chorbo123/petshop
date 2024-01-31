<div class="promotions-upsellitems-item-wrapper">
 <div class="promotions-freeitems-item" data-type="item" data-item-id="{{itemId}}" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/Product" data-track-productlist-list="{{track_productlist_list}}" data-track-productlist-category="{{track_productlist_category}}" data-track-productlist-position="{{track_productlist_position}}" data-sku="{{sku}}">
  <meta itemprop="url" content="{{url}}"/>

  <div class="promotions-freeitems-item-image-wrapper">
   <a class="promotions-freeitems-item-link-image" href="{{url}}" data-action="add-item-to-cart">
    <img class="promotions-freeitems-item-image" src="{{resizeImage thumbnail.url 'thumbnail'}}" alt="{{thumbnail.altimagetext}}" itemprop="image"/>
    {{#if isFreeDelivery}}
     <span class="promotions-freeitems-item-image-free-delivery"></span>
    {{/if}}
    {{#if isOnSale}}
     <span class="promotions-freeitems-item-image-sale"></span>
    {{/if}}
    {{#if productTypeImageUrl}}
     <span class="promotions-freeitems-item-image-product-type" style="background-image: url({{productTypeImageUrl}});"></span>
    {{/if}}
   </a>
   {{#if isEnvironmentBrowser}}
    <div class="promotions-freeitems-item-quick-view-wrapper">
     <a href="{{url}}" class="promotions-freeitems-item-quick-view-link" data-toggle="show-in-modal" data-action="add-item-to-cart">
      <i class="promotions-freeitems-item-quick-view-icon"></i>
      {{translate 'Quick View'}}
     </a>
    </div>
   {{/if}}
  </div>
  
  <div class="promotions-freeitems-item-details">
   <div class="promotions-freeitems-item-details-top">
    <a class="promotions-freeitems-item-title" href="{{url}}" data-action="add-item-to-cart">
     <span itemprop="name">{{name}}</span>
    </a>
    
    <div data-view="StockDescription"></div>
    
    <div data-view="ItemViews.Promotions"></div>
   </div>
   
   <div class="promotions-freeitems-item-details-bottom">
    <div class="promotions-freeitems-item-price" data-view="ItemViews.Price"></div>

    <div data-view="Cart.QuickAddToCart"></div>
    
    {{#if showRating}}
     <div class="promotions-freeitems-item-rating" itemprop="aggregateRating" itemscope="" itemtype="https://schema.org/AggregateRating" data-view="GlobalViews.StarRating">
     </div>
    {{/if}}

    {{#if cheaperOptionsAvailable}}
    <div class="promotions-freeitems-item-cheaper-options">
     <a href="{{url}}" data-action="add-item-to-cart">
      {{translate 'Cheaper Options Available'}}
     </a>
    </div>
    {{/if}}
    
    <div data-view="ItemDetails.Options"></div>

    <a href="{{url}}" class="promotions-freeitems-item-addtocart-btn" data-action="add-item-to-cart">
     {{actionButtonText}}
    </a>
    
    {{#if showStockStatus}}
    <div class="promotions-freeitems-item-stock">
     <div data-view="ItemViews.Stock" class="promotions-freeitems-item-stock-message"></div>
    </div>
    {{/if}}
    
    {{#if isFreeDelivery}}
     <div class="promotions-freeitems-item-footer-free-delivery">Includes FREE Delivery</div>
    {{/if}}
   </div>
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

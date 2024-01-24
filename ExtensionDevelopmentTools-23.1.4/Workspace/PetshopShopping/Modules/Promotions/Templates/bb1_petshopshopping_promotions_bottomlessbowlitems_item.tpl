<div class="promotions-bottomlessbowlitems-item" itemprop="itemListElement" itemscope itemtype="http://schema.org/Product">
	<meta itemprop="url" content="{{item._url}}"/>

	<div class="promotions-bottomlessbowlitems-item-image-wrapper">
		<a class="promotions-bottomlessbowlitems-item-link-image" href="{{item._url}}" data-touchpoint="home" data-hashtag="{{item._url}}">
			<img class="promotions-bottomlessbowlitems-item-image" src="{{resizeImage thumbnail.url 'thumbnail'}}" alt="{{thumbnail.altimagetext}}" itemprop="image" />
		</a>
	</div>
 
	<div class="promotions-bottomlessbowlitems-item-details">
 
  <a class="promotions-bottomlessbowlitems-item-title" href="{{item._url}}" data-touchpoint="home" data-hashtag="{{item._url}}">
   <span itemprop="name">{{item._name}}</span>
  </a>
 
  <div class="promotions-bottomlessbowlitems-item-price">
   <span class="promotions-bottomlessbowlitems-item-price-discounted">{{price.price_formatted}}</span>
   <span class="promotions-bottomlessbowlitems-item-price-purchased-label">Was </span>
   <span class="promotions-bottomlessbowlitems-item-price-purchased">{{price.compare_price_formatted}}</span>
  </div>
  
  <div class="promotions-bottomlessbowlitems-item-quantity">
			<label for="quantity" class="promotions-bottomlessbowlitems-item-quantity-label">
				{{translate 'Quantity:'}}
			</label>
			<input type="text" name="quantity" id="quantity" class="promotions-bottomlessbowlitems-item-quantity-value" value="{{model.quantity}}" disabled />
		</div>
  
	</div>
 
	<div class="promotions-bottomlessbowlitems-item-actions">  
  <form action="">
  
   <div data-view="BottomlessBowl.AddToCart"></div>
   
   <button type="submit" class="promotions-bottomlessbowlitems-item-addtocart-btn" data-action="update-order">
    {{actionButtonText}}
   </button>
   
   <div data-type="alert-placeholder"></div>
  </form>
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

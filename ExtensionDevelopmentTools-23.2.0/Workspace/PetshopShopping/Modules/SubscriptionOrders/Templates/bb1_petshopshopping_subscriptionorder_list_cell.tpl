<tr data-id="{{itemId}}" data-item-id="{{itemDetailsId}}" data-action="product-list-item">

	<td class="product-list-display-full-thumnail">
		<img src="{{thumbnailResized}}" alt="{{thumbnailAlt}}">
	</td>

	<td class="product-list-display-full-details">
		<p class="product-list-display-full-name">
			<a class="product-list-display-full-name-anchor" {{linkAttributes}}> {{productName}}</a>
		</p>

		<div class="product-list-display-full-price">
			<div data-view="ItemViews.Price"></div>
		</div>

		{{#if showRating}}
		<p class="product-list-display-full-rating" itemscope itemtype="http://schema.org/AggregateRating">
			<span data-view="GlobalViews.StarRating"></span>
		</p>
		{{/if}}

		<div data-view="Item.SelectedOptions"></div>

		<div class="product-list-display-full-stock">
			<div data-view="ItemViews.Stock"></div>
		</div>
	</td>

	<td class="product-list-display-full-extras">
		<p>
			{{#if item.isinactive}}
				{{translate '<strong>This order is currently inactive</strong>'}}<br />
				<a href="#" class="subscription-order-reactivate" data-action="reactivate-item">
     {{translate '<strong>Click here to reactivate</strong>'}}
    </a>
    <br />
			{{/if}}
			{{translate '<strong>Quantity:</strong> $(0)' item.quantity}}<br />
   {{#unless item.isinactive}}
			{{translate '<strong>Order Frequency:</strong> $(0)' item.orderschedule_text}}<br />
   {{/unless}}
			{{translate '<strong>Start Date:</strong> $(0)' item.startdate}}<br />
			{{#if item.lastorderdate}}
				{{translate '<strong>Last Order Date:</strong> $(0)' item.lastdateordered}}<br />
			{{/if}}
   {{#unless item.isinactive}}
			{{#if item.nextorderdate}}
				{{translate '<strong>Next Order Date:</strong> $(0)' item.nextorderdate}}<br />
			{{/if}}
			{{/unless}}
			{{#if item.createdfrom}}
				{{translate '<strong>Original Order: </strong> <a href="/ordershistory/view/$(0)">$(1)</a>' item.createdfrom createdFromText}}<br />
			{{/if}}
			{{#unless item.isinactive}}
				<button class="subscription-place-order" data-action="place-order">
     {{translate '<strong>Need this item asap?</strong>'}}
    </button>
    <br />
			{{/unless}}
		</p>
	</td>

	<td class="product-list-display-full-actions">
		<!--<button class="product-list-list-details-button-view" data-action="view-item">View</button>-->
		<button class="product-list-list-details-button-edit" data-action="edit-item">Edit</button>
	</td>
	
</tr>
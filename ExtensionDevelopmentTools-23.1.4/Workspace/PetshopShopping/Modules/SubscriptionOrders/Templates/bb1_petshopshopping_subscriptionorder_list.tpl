{{#if showBackToAccount}}
	<a href="/" class="product-list-lists-button-back">
		<i class="product-list-lists-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="product-list-lists">
	<div data-type="alert-placeholder" class="product-list-lists-message"></div>

	<header class="product-list-lists-header">
		<h2 class="product-list-lists-title">{{{pageHeader}}}</h2>
	</header>

	{{#if hasSubscriptionOrders}}
		<div class="product-list-lists-wrapper">
			<table class="product-list-lists-details">
				<tbody data-view="SubscriptionOrders.List"></tbody>
			</table>
		</div>
	{{else}}
		<p>{{translate 'You currently have no subscribe & save items.'}}</p>
		<p>&nbsp;</p>
		<p>{{translate 'To signup for subscribe & save, shop for items in our store and select the \'Subscribe & Save\' order frequency when adding the item to your cart. Once the order is placed it will be added to this page for you to edit and cancel at anytime.'}}</p>
	{{/if}}
</section>
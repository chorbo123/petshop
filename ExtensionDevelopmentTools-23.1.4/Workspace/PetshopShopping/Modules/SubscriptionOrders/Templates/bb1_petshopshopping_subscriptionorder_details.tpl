{{#if showBackToAccount}}
	<a href="/" class="subscriptionorder-details-button-back">
		<i class="subscriptionorder-details-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="subscriptionorder-details">

	<header class="subscriptionorder-details-header">
		<h2 class="subscriptionorder-details-title">{{pageHeader}}</h2>
	</header>

	<div class="subscriptionorder-details-alert-placeholder" data-type="alert-placeholder"></div>
	
	{{#if isInModal}}
		<div class="modal-body">
	{{/if}}
 
 {{#if itemDetails._thumbnail.url}}
	<p class="subscriptionorder-details-thumbnail">
		{{itemDetails._thumbnail.url}}
	</p>
 {{/if}}

	<div class="subscriptionorder-details-controls-group" data-validation="control-group" data-input="item">
		<label class="subscriptionorder-details-label" for="item">
			{{translate 'Item'}}
		</label>
		<div class="subscriptionorder-details-controls" data-validation="control">
			{{itemDetails._name}}
		</div>
	</div>

	<div class="subscriptionorder-details-controls-group" data-validation="control-group" data-input="quantity">
		<label class="subscriptionorder-details-label" for="quantity">
			{{translate 'Quantity'}}
		</label>
		<div class="subscriptionorder-details-controls" data-validation="control">
			{{item.quantity}}
		</div>
	</div>

	<div class="subscriptionorder-details-controls-group" data-validation="control-group" data-input="orderschedule">
		<label class="subscriptionorder-details-label" for="orderschedule">
			{{translate 'Order Schedule'}}
		</label>
		<div class="subscriptionorder-details-controls" data-validation="control">
			{{item.orderschedule_text}}
		</div>
	</div>
	
	<div class="subscriptionorder-details-controls-group" data-validation="control-group" data-input="nextorderdate">
		<label class="subscriptionorder-details-label" for="nextorderdate">
			{{translate 'Next Order Date'}}
		</label>
		<div class="subscriptionorder-details-controls" data-validation="control">
			{{item.nextorderdate}}
		</div>
	</div>

	<div class="subscriptionorder-details-controls-group" data-validation="control-group" data-input="isinactive">
		<label class="subscriptionorder-details-label" for="isinactive">
			{{translate 'Inactive'}}
		</label>
		<div class="subscriptionorder-details-controls" data-validation="control">
			{{#if item.isinactive}}{{translate 'Yes'}}{{else}}{{translate 'No'}}{{/if}}
		</div>
	</div>

	{{#if isInModal}}
		</div>
	{{/if}}
 
	<div class="{{#if isInModal}}modal-footer{{else}}form-actions{{/if}}">
		{{#if isInModal}}
			<button class="subscriptionorder-details-button" data-dismiss="modal">
				{{translate 'Close'}}
			</button>
		{{else}}
			<a class="subscriptionorder-details-button" href="/subscription-orders">
				{{translate 'Back'}}
			</a>
		{{/if}}
	</div>
 
</section>
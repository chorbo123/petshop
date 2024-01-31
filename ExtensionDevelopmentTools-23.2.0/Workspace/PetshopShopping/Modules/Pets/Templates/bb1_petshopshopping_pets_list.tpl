{{#if showBackToAccount}}
	<a href="/" class="product-list-lists-button-back">
		<i class="product-list-lists-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="product-list-lists">
	<div data-type="alert-placeholder" class="product-list-lists-message"></div>

	<header class="product-list-lists-header">
		<h2 class="product-list-lists-title">{{pageHeader}}</h2>
		<a class="product-list-lists-button-add" href="/pets/new">{{translate 'Add A New Pet'}}</a>
	</header>

	{{#if hasPets}}
		<div class="product-list-lists-wrapper">
			<table class="product-list-lists-details">
				<tbody data-view="Pets.List"></tbody>
			</table>
		</div>
	{{else}}
		<p>{{translate 'Add your pets to your online profile.'}}</p>
	{{/if}}
</section>
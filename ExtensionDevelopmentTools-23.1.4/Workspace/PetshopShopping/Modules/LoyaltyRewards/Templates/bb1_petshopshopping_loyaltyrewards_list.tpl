{{#if showBackToAccount}}
	<a href="/" class="product-list-lists-button-back">
		<i class="product-list-lists-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="loyalty-reward-cards">
	<div data-type="alert-placeholder" class="product-list-lists-message"></div>

	<header class="loyalty-reward-cards-header">
		<h2>{{{pageHeader}}}</h2>
	</header>

	{{#if hasCards}}
		<div class="loyalty-reward-card-list-container">
			<div class="loyalty-reward-card-list" data-view="LoyaltyRewards.ActiveList"></div>
		</div>
	{{else}}
		<p>{{translate 'You do not currently have any loyalty reward cards in your account.'}}</p>
	{{/if}}
 
	{{#if hasRedeemedCards}}
  <header class="loyalty-reward-cards-header">
   <h2>{{translate 'Paws of Fame - <small>Your Redeemed Loyalty Cards</small>'}}</h2>
  </header>

		<div class="loyalty-reward-redeemed-card-list-container">
			<div class="loyalty-reward-redeemed-card-list" data-view="LoyaltyRewards.RedeemedList"></div>
		</div>
	{{/if}}
</section>
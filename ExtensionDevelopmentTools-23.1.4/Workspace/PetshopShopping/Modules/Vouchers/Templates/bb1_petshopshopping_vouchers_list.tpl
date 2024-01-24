{{#if showBackToAccount}}
	<a href="/" class="product-list-lists-button-back">
		<i class="product-list-lists-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="vouchers">
	<div data-type="alert-placeholder" class="product-list-lists-message"></div>

	{{#if hasAnyVouchers}}
  {{#if hasVouchers}}
  <header class="vouchers-header">
   <h2>{{pageHeader}}</h2>
  </header>
  
  <div class="vouchers-list-container">
			<div class="vouchers-list" data-view="Vouchers.List"></div>
		</div>
  {{/if}}
  
  {{#if hasBrandReferralVouchers}}
  <header class="vouchers-header">
   <h2>{{translate 'Referral Voucher Codes'}}</h2>
  </header>
  
		<div class="vouchers-list-container">
			<div class="referral-sharecodes-list" data-view="ReferralShareCodes.List"></div>
		</div>
  
		<div class="vouchers-list-container">
			<div class="referrer-vouchers-list" data-view="ReferrerVouchers.List"></div>
		</div>
  {{/if}}
  
  {{#if hasBreederVouchers}}
  <header class="vouchers-header">
   <h2>{{translate 'Breeder Voucher Codes'}}</h2>
  </header>
  
		<div class="vouchers-list-container">
			<div class="breeder-vouchers-list" data-view="BreederVouchers.List"></div>
		</div>
  {{/if}}
	{{else}}
  <header class="vouchers-header">
   <h2>{{pageHeader}}</h2>
  </header>

		<p>{{translate 'You do not currently have any vouchers in your account.'}}</p>
	{{/if}}
</section>
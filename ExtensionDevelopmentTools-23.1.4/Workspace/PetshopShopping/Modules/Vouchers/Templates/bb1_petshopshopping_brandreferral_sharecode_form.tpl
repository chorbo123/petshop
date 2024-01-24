{{#if showBackToAccount}}
	<a href="/" class="brand-referral-share-code-form-button-back">
		<i class="brand-referral-share-code-form-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

{{#unless isInModal}}
<section class="brand-referral-share-code-form">
{{/unless}}

	<header class="brand-referral-share-code-form-header">
	 {{#unless isInModal}}
			<h2 class="brand-referral-share-code-form-title">{{pageHeader}}</h2>
		{{/unless}}
		<p>{{translate 'Fill in the form below and click the Send Share Code button.'}}</p>
	</header>

	<div class="brand-referral-share-code-form-alert-placeholder" data-type="alert-placeholder"></div>
	<small class="brand-referral-share-code-form-required">
		{{translate 'Required'}} <span class="brand-referral-share-code-form-required-star">*</span>
	</small>

	<form action="#" class="brand-referral-share-code-form-form" novalidate>
	
	 <fieldset>
		
		<div class="brand-referral-share-code-form-controls-group" data-validation="control-group" data-input="firstname">
			<label class="brand-referral-share-code-form-label" for="firstname">
				{{translate 'First Name'}} <small class="brand-referral-share-code-form-required-star">*</small>
			</label>
			<div class="brand-referral-share-code-form-controls" data-validation="control">
				<input data-action="text" type="text" name="firstname" id="firstname" class="brand-referral-share-code-form-input" value="" maxlength="300" />
			</div>
		</div>
  
  <div class="breeders-form-controls-group" data-validation="control-group" data-input="email">
   <label class="breeders-form-label" for="email">
    {{translate 'Email Address'}} <small class="breeders-form-required-star">*</small>
   </label>
   <div class="breeders-form-controls" data-validation="control">
    <input data-action="text" type="text" name="email" id="email" class="breeders-form-input" value="" maxlength="300" />
   </div>
  </div>
  
		<div class="brand-referral-share-code-form-controls-group" data-validation="control-group" data-input="sharecode">
			<label class="brand-referral-share-code-form-label" for="sharecode">
				{{translate 'Share Code'}}
			</label>
			<div class="brand-referral-share-code-form-controls" data-validation="control">
				<input data-action="text" type="text" name="sharecode" id="sharecode" class="brand-referral-share-code-form-input" value="{{model.code}}" disabled />
			</div>
		</div>
  
		<div class="brand-referral-share-code-form-controls-group" data-validation="control-group" data-input="message">
			<label class="brand-referral-share-code-form-label" for="message">
				{{translate 'Message'}}
			</label>
			<div class="brand-referral-share-code-form-message">
				{{{message}}}
			</div>
		</div>
  
 </fieldset>
 
	<div class="{{#if isInModal}}modal-footer{{else}}brand-referral-share-code-form-actions{{/if}}">
 
		<button type="submit" class="brand-referral-share-code-form-button-submit">
			{{translate 'Send Share Code'}}
		</button>

  {{#if isInModal}}
   <button class="brand-referral-share-code-form-button" data-dismiss="modal">
    {{translate 'Cancel'}}
   </button>
  {{else}}
   <a class="brand-referral-share-code-form-button" href="/vouchers">
    {{translate 'Cancel'}}
   </a>
		{{/if}}
  
	</div>
 
</form>

{{#unless isInModal}}
</section>
{{/unless}}
{{#if showBackToAccount}}
	<a href="/" class="breeders-litter-form-button-back">
		<i class="breeders-litter-form-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

{{#unless isInModal}}
<div data-cms-area="{{cmsSectionId}}" data-cms-area-filters="global"></div>

<section class="breeders-litter-form">
{{/unless}}

	<header class="breeders-litter-form-header">
	 {{#unless isInModal}}
			<h2 class="breeders-litter-form-title">{{pageHeader}}</h2>
		{{/unless}}
		<p>{{translate 'Fill in the form below and click the Save Litter button.'}}</p>
	</header>

	<div class="breeders-litter-form-alert-placeholder" data-type="alert-placeholder"></div>
	<small class="breeders-litter-form-required">
		{{translate 'Required'}} <span class="breeders-litter-form-required-star">*</span>
	</small>

	<form action="#" class="breeders-litter-form-form" novalidate>
	
		{{#if isInModal}}
			<div class="modal-body">
		{{/if}}

	 <fieldset>
		
		<div class="breeders-litter-form-controls-group" data-validation="control-group" data-input="numberofanimals">
			<label class="breeders-litter-form-label" for="numberofanimals">
				{{translate 'Number of puppies/kittens'}} <small class="breeders-litter-form-required-star">*</small>
			</label>
			<div class="breeders-litter-form-controls" data-validation="control">
				<input data-action="number" type="number" name="numberofanimals" id="numberofanimals" class="breeders-litter-form-input" min="1" value="{{litter.numberofanimals}}" />
			</div>
		</div>

		<div class="breeders-litter-form-controls-group" data-validation="control-group" data-input="litterdob">
			<label class="breeders-litter-form-label" for="litterdob">
				{{translate 'Date of birth of litter'}} <small class="breeders-litter-form-required-star">*</small>
			</label>
			<div class="breeders-litter-form-controls" data-validation="control">
				<input data-action="text" type="text" name="litterdob" id="litterdob" class="breeders-litter-form-input" value="{{litter.litterdob}}" />
			</div>
		</div>
  
  <div class="breeders-litter-form-litters" data-view="PetParents.Form"></div>
  
  <div class="breeders-litter-form-controls-group" data-validation="control-group" data-input="petparentconsent">
   <div data-validation="control">
    <label class="breeders-litter-form-label" for="petparentconsent">
     <input type="checkbox" id="petparentconsent" name="petparentconsent" value="T" data-unchecked-value="F"{{#if litter.petparentconsent}} checked{{/if}} />
     {{translate 'I confirm I have the (written) consent of these new Pet Parents to pass on their contact details to PetShop.co.uk'}}
    </label>
   </div>
  </div>
  
 </fieldset>
 
	{{#if isInModal}}
		</div>
	{{/if}}
 
	<div class="{{#if isInModal}}modal-footer{{else}}form-actions{{/if}}">
		<button type="submit" class="breeders-litter-form-button-submit">
			{{translate 'Save Litter'}}
		</button>

		{{#unless pet.internalid}}
			<button type="reset" class="breeders-litter-form-button" data-action="reset">
				{{translate 'Reset'}}
			</button>
		{{else}}
			{{#if isInModal}}
				<button class="breeders-litter-form-button" data-dismiss="modal">
					{{translate 'Cancel'}}
				</button>
			{{else}}
				<a class="breeders-litter-form-button" href="/pets">
					{{translate 'Cancel'}}
				</a>
			{{/if}}
		{{/unless}}
  
	</div>
 
</form>

{{#unless isInModal}}
</section>
{{/unless}}
{{#if showBackToAccount}}
	<a href="/" class="pet-form-button-back">
		<i class="pet-form-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

{{#unless isInModal}}
<section class="pet-form">
{{/unless}}

	<header class="pet-form-header">
	 {{#unless isInModal}}
			<h2 class="pet-form-title">{{pageHeader}}</h2>
		{{/unless}}
		<p>{{translate 'Fill in the form below and click the Save Pet button.'}}</p>
	</header>

	<div class="pet-form-alert-placeholder" data-type="alert-placeholder"></div>
	<small class="pet-form-required">
		{{translate 'Required'}} <span class="pet-form-required-star">*</span>
	</small>

	<form action="#" class="pet-form-form" novalidate>
	
		{{#if isInModal}}
			<div class="modal-body">
		{{/if}}

	 <fieldset>
		
		<div class="pet-form-controls-group" data-validation="control-group" data-input="name">
			<label class="pet-form-label" for="{{manage}}name">
				{{translate 'Pet Name'}} <small class="pet-form-required-star">*</small>
			</label>
			<div class="pet-form-controls" data-validation="control">
				<input data-action="text" type="text" name="name" id="{{manage}}name" class="pet-form-input" value="{{pet.name}}" maxlength="300"/>
			</div>
		</div>

		<div class="pet-form-controls-group" data-validation="control-group" data-input="type">
			<label class="pet-form-label" for="{{manage}}type">
				{{translate 'Pet Type'}} <small class="pet-form-required-star">*</small>
			</label>
			<div class="pet-form-controls" data-validation="control">
				<select name="type" id="{{manage}}type" class="pet-form-select" data-type="pet-type">
				 <option value="">{{translate '-- Select --'}}</option>
					{{#each petTypesAndBreeds}}
						<option value="{{id}}"{{#if (eq id ../currentType)}} selected{{/if}}>{{name}}</option>
					{{/each}}
				</select>
			</div>
		</div>
  
  <div class="pet-form-controls-group" data-validation="control" data-input="pet-breed" data-view="Pets.BreedsDropdown"></div>
  
		<div class="pet-form-controls-group" data-validation="control-group" data-input="pet-age">
			<label class="pet-form-label" for="{{manage}}yearsold">
				{{translate 'Pet Age'}} <small class="pet-form-required-star">*</small>
			</label>
			<div class="pet-form-controls" data-validation="control">
				<input data-action="text" type="number" name="yearsold" id="{{manage}}yearsold" class="pet-form-input pet-form-input-age" value="{{pet.yearsold}}" min="0" max="100" placeholder="{{translate 'Years'}}" />
				<input data-action="text" type="number" name="monthsold" id="{{manage}}monthsold" class="pet-form-input pet-form-input-age" value="{{pet.monthsold}}" min="0" max="11" placeholder="{{translate 'Months'}}" />
			</div>
		</div>

		<div class="pet-form-controls-group" data-validation="control-group" data-input="gender">
			<label class="pet-form-label" for="{{manage}}gender">
				{{translate 'Pet Gender'}}
			</label>
			<div class="pet-form-controls" data-validation="control">
				<select name="gender" id="{{manage}}gender" class="pet-form-select" data-type="pet-gender">
				 <option value="">{{translate '-- Select --'}}</option>
					{{#each petGenders}}
						<option value="{{id}}"{{#if (eq id ../currentGender)}} selected{{/if}}>{{name}}</option>
					{{/each}}
				</select>
			</div>
		</div>
  
		<div class="pet-form-controls-group" data-validation="control-group" data-input="weight">
			<label class="pet-form-label" for="{{manage}}weight">
				{{translate 'Pet Weight'}} <small class="pet-form-required-star">*</small>
			</label>
			<div class="pet-form-controls" data-validation="control">
				<select name="weight" id="{{manage}}weight" class="pet-form-select" data-type="pet-weight">
				 <option value="">{{translate '-- Select --'}}</option>
					{{#each petWeights}}
						<option value="{{id}}"{{#if (eq id ../currentWeight)}} selected{{/if}}>{{name}}</option>
					{{/each}}
				</select>
			</div>
		</div>
  
  <!--
  <div class="pet-form-controls-group" data-validation="control-group" data-input="mainpet">
   <label class="pet-form-label" for="{{manage}}mainpet">
			 <input type="checkbox" id="{{manage}}mainpet" name="mainpet" value="T" data-unchecked-value="F"{{#if pet.mainpet}} checked{{/if}} />
				{{translate 'This is my main pet'}}
   </label>
  </div>
  
		<div class="pet-form-controls-group" data-validation="control-group" data-input="currentdryfood">
			<label class="pet-form-label" for="{{manage}}currentdryfood">
				{{translate 'What dry food do you currently feed?'}}
			</label>
			<div class="pet-form-controls" data-validation="control">
				<input data-action="text" type="text" name="currentdryfood" id="{{manage}}currentdryfood" class="pet-form-input" value="{{pet.currentdryfood}}" maxlength="300"/>
			</div>
		</div>

		<div class="pet-form-controls-group" data-validation="control-group" data-input="currentcannedfood">
			<label class="pet-form-label" for="{{manage}}currentcannedfood">
				{{translate 'What cans do you currently feed?'}}
			</label>
			<div class="pet-form-controls" data-validation="control">
				<input data-action="text" type="text" name="currentcannedfood" id="{{manage}}currentcannedfood" class="pet-form-input" value="{{pet.currentcannedfood}}" maxlength="300"/>
			</div>
		</div>
  -->
  
 </fieldset>
 
	{{#if isInModal}}
		</div>
	{{/if}}
 
	<div class="{{#if isInModal}}modal-footer{{else}}form-actions{{/if}}">
		<button type="submit" class="pet-form-button-submit">
			{{translate 'Save Pet'}}
		</button>

		{{#unless pet.internalid}}
			<button type="reset" class="pet-form-button" data-action="reset">
				{{translate 'Reset'}}
			</button>
		{{else}}
			{{#if isInModal}}
				<button class="pet-form-button" data-dismiss="modal">
					{{translate 'Cancel'}}
				</button>
			{{else}}
				<a class="pet-form-button" href="/pets">
					{{translate 'Cancel'}}
				</a>
			{{/if}}
		{{/unless}}
  
	</div>
 
 <div class="pet-form-deceased">
  <button type="button" class="pet-form-deceased-button" data-action="pet-deceased">
   {{translate '$(0) has crossed the rainbow bridge.' pet.name}}
  </button>
 </div>
 
</form>

{{#unless isInModal}}
</section>
{{/unless}}
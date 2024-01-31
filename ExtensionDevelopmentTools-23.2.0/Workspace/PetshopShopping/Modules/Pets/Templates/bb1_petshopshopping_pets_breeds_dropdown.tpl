{{#if hasTypeAndBreeds}}
	<div class="pet-form-controls-group" data-validation="control-group" data-input="pet-breed">
		<label class="pet-form-label" for="{{manage}}breed">
			{{translate 'Pet Breed'}} <small class="pet-form-required-star">*</small>
		</label>
		<div class="pet-form-controls" data-validation="control">
			<select name="breed" id="{{manage}}breed" class="pet-form-select {{selectClass}}" data-type="pet-breed">
				<option value="">{{translate '-- Select --'}}</option>
				{{#each petBreeds}}
					<option value="{{id}}"{{#if (eq id ../selectedBreed)}} selected{{/if}}>{{name}}</option>
				{{/each}}
			</select>
		</div>
	</div>
{{else}}
		<input type="hidden" id="{{manage}}breed" name="breed" value="{{selectedBreed}}" data-type="pet-breed">
{{/if}}
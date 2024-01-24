<div class="prescription-item-form-controls-group" data-validation="control-group" data-input="pet">
	<label class="prescription-item-form-label" for="pet">
		{{translate 'Choose the pet receiving the treatment'}}
	</label>
	<div class="prescription-item-form-controls" data-validation="control">
		<select name="pet" id="pet" class="prescription-item-form-select" data-type="pet">
			<option value="">
				{{translate '-- Select --'}}
			</option>
			<option value="create">
				{{translate '-- Create a new pet --'}}
			</option>
			{{#each pets}}
				<option value="{{internalid}}"{{#if (eq internalid ../selectedPet.internalid)}} selected{{/if}}>{{name}}</option>
			{{/each}}
		</select>
	</div>
	<p>{{translate 'Select \'Create a new pet\' to add more pets'}}</p>
</div>
{{#if hasPrescriptionItems}}
<div class="prescription-item-form">
  
 {{#if successMessage}}
  <div class="prescription-item-form-success">
	  <!--<button class="close" data-dismiss="alert">×</button>-->
   {{{successMessage}}}
  </div>
 {{/if}}
 
 {{#if moreItems}}
 
 <div class="row">
		<div class="col-xs-12">
			<h4 class="prescription-item-form-heading"><strong>{{translate 'One more thing! We need a bit more info on your pet before we can ship your pet meds:'}}</strong></h4>
			<h5 class="prescription-item-form-heading">{{translate '$(0)' model.itemname}}</h5>
			<p>{{translate 'Please fill out the form below so we know which of your pets are using the product. All fields are required.'}}</p>
		</div>
 </div>
 
 <div data-type="alert-placeholder"></div>
 
 <form action="" data-line-id="{{model.internalid}}">
  
  <fieldset>
   
   <div class="row">
   
    <div class="col-sm-6">
							
					<div data-view="Pets.Dropdown"></div>
					
    </div>
    
    <div class="col-sm-6">
				
					<div class="prescription-item-form-controls-group" data-validation="control-group" data-input="treatmentsallocated">
						<label class="prescription-item-form-label" for="treatmentsallocated">
							{{translate 'How many treatments are for this pet?'}}
						</label>
						<div class="prescription-item-form-controls" data-validation="control">
							<input data-action="text" type="number" name="treatmentsallocated" id="treatmentsallocated" class="prescription-item-form-input-xs" min="1" max="{{totalTreatmentsRemaining}}" value="{{totalTreatmentsRemaining}}" /> treatments out of a total <strong>{{totalTreatmentsRemaining}}</strong>
						</div>
      {{#if (eq treatmentType '1')}}
       <p>{{translate 'Dosage: &frac12 tablet/$(0)kg every 3 months' dosagePerItem}}</p>
      {{/if}}
						{{#if (eq treatmentType '2')}}
       <p>{{translate 'Dosage: 1 pipette/pet every month'}}</p>
      {{/if}}
					</div>

    </div>
    
   </div>

   <div class="row">
    
    <div class="col-sm-6">
				
					<div class="prescription-item-form-controls-group" data-validation="control-group" data-input="treatmentstartdateautocalc">
						<label class="prescription-item-form-label" for="treatmentstartdateautocalc">
							<input type="checkbox" name="treatmentstartdateautocalc" id="treatmentstartdateautocalc" value="T" data-unchecked-value="F" checked />
							{{translate 'I confirm that I plan to use this treatment as soon as I receive the order'}}
						</label>
					</div>

					<div class="prescription-item-form-controls-group prescription-item-form-treatmentstartdate" data-validation="control-group" data-input="treatmentstartdate">
						<label class="prescription-item-form-label" for="treatmentstartdate">
							{{translate 'When will you start using the treatment?'}}
						</label>
						<div class="prescription-item-form-controls" data-validation="control">
							<input data-action="text" type="text" name="treatmentstartdate" id="treatmentstartdate" class="prescription-item-form-input" placeholder="Enter date as dd/mm/yyyy" value="{{treatmentStartDate}}" />
						</div>
					</div>

    </div>
    
    {{#if (eq treatmentType '1')}}
    <div class="col-sm-6">
				
					<div class="prescription-item-form-controls-group" data-validation="control-group" data-input="petweight">
						<label class="prescription-item-form-label" for="petweight">
							{{translate 'How much do they weigh?'}}
						</label>
						<div class="prescription-item-form-controls" data-validation="control">
							<input data-action="text" type="text" name="petweight" id="petweight" class="prescription-item-form-input" placeholder="Enter weight in kg" value="{{petWeight}}" />
						</div>
					</div>

    </div>
    {{/if}}
    
   </div>

   {{#if (eq treatmentType '1')}}
   <div class="row">
    
    <div class="col-sm-12">
     
     <h3 class="alert-heading"><strong>{{translate 'To comply with Veterinary Medicine Regulations, please confirm the following:'}}</strong></h3>
     
     <ul>
      <li>{{translate 'I am not purchasing for resale and I am happy to be contacted if required'}}</li>
      <li>{{translate 'I confirm that I am aware of the relevant safety precautions relating to these products'}}</li>
      <li>{{translate 'I confirm that my pet receiving the treatment is in general good health'}}</li>
      <li>{{translate 'I will read the product packaging and literature before using, and I will use the product according to the manufacturer\'s datasheet'}}</li>
      <li>{{translate 'I can confirm that my pet is not pregnant or lactating'}}</li>
     </ul>
     
					<div class="prescription-item-form-controls-group" data-validation="control-group" data-input="isnotpregnant">
						<label class="prescription-item-form-label" for="isnotpregnant" data-validation="control">
							<input type="checkbox" id="isnotpregnant" name="isnotpregnant" value="T" data-unchecked-value="F"{{#if isnotpregnant}} checked{{/if}} />
       <strong style="color:black;">{{translate 'I understand and confirm the above statements are correct'}}</strong>
						</label>
					</div>
					
    </div>

   </div>
   {{/if}}

   <div class="form-actions">
    <button type="submit" class="prescription-item-form-button-submit">
     {{#if isNewModel}}{{translate 'Save Pet Details'}}{{else}}{{translate 'Update Pet Details'}}{{#if lastItem}}{{translate ' &amp; View Next Item'}}{{/if}}{{/if}}
    </button>
   </div>
  
  </fieldset>
  
 </form>
 
 {{else}}
		{{#if hasPrescriptionItems}}
		
		<div class="row">
			<div class="col-xs-12">
				<h3 class="prescription-item-form-heading"><strong>{{translate 'You have finished updating your pet\'s treatment details.'}}</strong></h3>
				<p>{{translate 'Thank you for taking the time to fill out the treatment details for your pets. You will receive treatment reminder emails on a monthly schedule based on the details you provided us with.'}}</p>
			</div>
		</div>
		
		{{/if}}
 {{/if}}
</div>
{{/if}}
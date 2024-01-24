{{#if showBackToAccount}}
	<a href="/" class="subscriptionorder-form-button-back">
		<i class="subscriptionorder-form-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="subscriptionorder-form">

	<header class="subscriptionorder-form-header">
		<h2 class="subscriptionorder-form-title">{{{pageHeader}}}</h2>
		<p>{{translate 'Fill in the form below and click the Save button.'}}</p>
	</header>

	<div class="subscriptionorder-form-alert-placeholder" data-type="alert-placeholder"></div>
	<small class="subscriptionorder-form-required">
		{{translate 'Required'}} <span class="subscriptionorder-form-required-star">*</span>
	</small>

	<form action="#" class="subscriptionorder-form-form" novalidate>
	
		{{#if isInModal}}
			<div class="modal-body">
		{{/if}}

	 <fieldset>
   
  <div class="row">
   
   <div class="col-sm-6">
   <div class="subscriptionorder-form-controls-group" data-validation="control-group" data-input="item">
    <label class="subscriptionorder-form-label" for="{{manage}}item">
     {{translate 'Item'}}
    </label>
    <div class="subscriptionorder-form-controls" data-validation="control">
     {{#if isNew}}
      <div data-view="ItemSearcher" class="subscriptionorder-form-itemsearcher"></div>
      <input type="hidden" name="item" id="{{manage}}item" class="subscriptionorder-form-input" value="{{item.item}}" maxlength="300" />
     {{else}}
      {{itemDetails._name}}
     {{/if}}
    </div>
   </div>
   </div>
   
   <div class="col-sm-6">
   {{#if itemDetails._thumbnail.url}}
   <p class="subscriptionorder-order-thumbnail">
    <a href="#" class="subscription-order-thumbnail-link">
     <img src="{{resizeImage itemDetails._thumbnail.url 'thumbnail'}}" alt="{{itemDetails._thumbnail.altname}}" />
    </a>
   </p>
   {{/if}}
   </div>
  
  </div>

		<div class="subscriptionorder-form-controls-group" data-validation="control-group" data-input="quantity">
			<label class="subscriptionorder-form-label" for="{{manage}}quantity">
				{{translate 'Quantity'}} <small class="subscriptionorder-form-required-star">*</small>
			</label>
			<div class="subscriptionorder-form-controls" data-validation="control">
				<input data-action="text" type="number" name="quantity" id="{{manage}}quantity" class="subscriptionorder-form-input" value="{{item.quantity}}" min="1" />
			</div>
		</div>

		<div class="subscriptionorder-form-controls-group" data-validation="control-group" data-input="orderschedule">
			<label class="subscriptionorder-form-label" for="{{manage}}orderschedule">
				{{translate 'Order Schedule'}} <small class="subscriptionorder-form-required-star">*</small>
			</label>
			<div class="subscriptionorder-form-controls" data-validation="control">
				<select name="orderschedule" id="{{manage}}orderschedule" class="subscriptionorder-form-select" data-type="orderschedule">
				 <option value="">{{translate '-- Select --'}}</option>
					{{#each orderSchedules}}
						<option value="{{id}}"{{#if (eq id ../selectedOrderSchedule)}} selected{{/if}}>{{name}}</option>
					{{/each}}
				</select>
			</div>
		</div>
  
  <div data-visibility="schedule-by-date"{{#unless canScheduleMonthly}} style="display:none;"{{/unless}}>
  
   <div class="subscriptionorder-form-controls-group" data-validation="control-group" data-input="scheduleforsetdate">
    <label class="subscriptionorder-form-label" for="{{manage}}scheduleforsetdate">
     <input type="checkbox" id="{{manage}}scheduleforsetdate" name="scheduleforsetdate" value="T" data-unchecked-value="F"{{#if scheduleForSetDate}} checked{{/if}} />
     {{translate 'Do you want your order to go through on a set day of the month?'}}
    </label>
   </div>

   <div class="subscriptionorder-form-controls-group" data-validation="control-group" data-input="scheduleddayofmonth">
    <label class="subscriptionorder-form-label" for="{{manage}}scheduleddayofmonth">
     {{translate 'Which day of the month?'}}
    </label>
    <div class="subscriptionorder-form-controls" data-validation="control">
     <select name="scheduleddayofmonth" id="{{manage}}scheduleddayofmonth" class="subscriptionorder-form-select" data-type="scheduleddayofmonth">
      {{#each daysOfMonth}}
       <option value="{{id}}"{{#if (eq id ../scheduledDayOfMonth)}} selected{{/if}}>{{name}}</option>
      {{/each}}
     </select>
    </div>
   </div>
   
		</div>

  <div class="subscriptionorder-form-controls-group" data-validation="control-group" data-input="nextorderdate">
   <label class="subscriptionorder-form-label" for="{{manage}}nextorderdate">
    {{#if isNew}}
     {{translate 'First Order Date'}}
    {{else}}
     {{translate 'Next Order Date'}}
    {{/if}} <small class="subscriptionorder-form-required-star">*</small>
   </label>
   <div class="subscriptionorder-form-controls" data-validation="control">
    <input data-action="text" type="text" name="nextorderdate" id="{{manage}}nextorderdate" class="subscriptionorder-form-input" value="{{item.nextorderdate}}" maxlength="300"/>
   </div>
   <p class="subscriptionorder-form-input-help">{{translate '(dd/mm/yyyy)'}}</p>
  </div>
  
  {{#unless isNew}}
  <div class="subscriptionorder-form-controls-group" data-validation="control-group" data-input="isinactive">
   <label class="subscriptionorder-form-label" for="{{manage}}isinactive">
			 <input type="checkbox" id="{{manage}}isinactive" name="isinactive" value="T" data-unchecked-value="F"{{#if item.isinactive}} checked{{/if}} />
				{{translate 'Inactive'}}
   </label>
  </div>
  {{/unless}}
  
 </fieldset>
 
	{{#if isInModal}}
		</div>
	{{/if}}
 
	<div class="{{#if isInModal}}modal-footer{{else}}form-actions{{/if}}">
		<button type="submit" class="subscriptionorder-form-button-submit">
			{{translate 'Save'}}
		</button>

		{{#unless item.internalid}}
			<button type="reset" class="subscriptionorder-form-button" data-action="reset">
				{{translate 'Reset'}}
			</button>
		{{else}}
			{{#if isInModal}}
				<button class="subscriptionorder-form-button" data-dismiss="modal">
					{{translate 'Cancel'}}
				</button>
			{{else}}
				<a class="subscriptionorder-form-button" href="/subscription-orders">
					{{translate 'Cancel'}}
				</a>
			{{/if}}
			
   {{#unless item.isinactive}}
   <button class="subscriptionorder-form-button" data-action="place-order">
				{{translate 'Need this item asap?'}}
			</button> 
   
			<button class="subscriptionorder-form-button" data-action="skip-next-order">
				{{translate 'Skip your next order'}}
			</button>
   {{/unless}}
		{{/unless}}
  
	</div>
 
</form>

</section>
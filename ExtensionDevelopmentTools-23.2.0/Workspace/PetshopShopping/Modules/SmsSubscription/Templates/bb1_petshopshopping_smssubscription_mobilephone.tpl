<div class="global-views-mobile-phone-controls-group" data-validation="control-group">
 <label class="global-views-mobile-phone-label" for="register-mobilephone">
  {{translate 'Mobile Number'}} {{#if isRequired}}<small class="global-views-mobile-phone-required">*</small>{{/if}}
 </label>
 <div class="global-views-mobile-phone-input-group">
  <div class="global-views-mobile-phone-input-group-btn">
   <button type="button" class="global-views-mobile-phone-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <img src="{{getAbsoluteUrl defaultCallingCode.thumbnailUrl}}" alt="{{defaultCallingCode.country}}" />
    <span class="global-views-mobile-phone-calling-code" data-calling-code="{{defaultCallingCode.callingCode}}">{{defaultCallingCode.callingCode}}</span> <span class="caret"></span>
    <input type="hidden" name="mobilephonecallingcode" id="register-mobilephone-callingcode" value="{{defaultCallingCode.callingCode}}">
   </button>
   <ul class="global-views-mobile-phone-dropdown-menu">
    {{#each callingCodes}}
    <li><a href="#" data-action="update-calling-code" data-calling-code="{{callingCode}}"><img src="{{getAbsoluteUrl thumbnailUrl}}" alt="{{country}}" /> {{callingCode}} {{country}}</a></li>
    {{/each}}
   </ul>
  </div>
  <div class="global-views-mobile-phone-controls" data-validation="control">
   <input type="tel" name="mobilephone" id="register-mobilephone" class="global-views-mobile-phone-input">
  </div>
 </div>
</div>
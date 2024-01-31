<div class="contact-form-container">
 <section class="contact-form">

  <header class="contact-form-header">
   <h2 class="contact-form-title">{{pageHeader}}</h2>
   <p>{{translate 'Fill in the form below and click the Send button.'}}</p>
  </header>

  <div class="contact-form-alert-placeholder" data-type="alert-placeholder"></div>
  <small class="contact-form-required">
   {{translate 'Required'}} <span class="contact-form-required-star">*</span>
  </small>

  <form action="#" class="contact-form-form" novalidate>
  
   {{#if isInModal}}
    <div class="modal-body">
   {{/if}}

   <fieldset>
    
    <div class="contact-form-controls-group" data-validation="control-group" data-input="fullname">
     <label class="contact-form-label" for="fullname">
      {{translate 'Full Name'}} <small class="contact-form-required-star">*</small>
     </label>
     <div class="contact-form-controls" data-validation="control">
      <input data-action="text" type="text" name="fullname" id="fullname" class="contact-form-input" value="" maxlength="300" />
     </div>
    </div>

    <div class="contact-form-controls-group" data-validation="control-group" data-input="email">
     <label class="contact-form-label" for="email">
      {{translate 'Email Address'}} <small class="contact-form-required-star">*</small>
     </label>
     <div class="contact-form-controls" data-validation="control">
      <input data-action="text" type="text" name="email" id="email" class="contact-form-input" value="" maxlength="300" />
     </div>
    </div>

    <div class="contact-form-controls-group" data-validation="control-group" data-input="message">
     <label class="contact-form-label" for="message">
      {{translate 'Message'}} <small class="contact-form-required-star">*</small>
     </label>
     <div class="contact-form-controls" data-validation="control">
      <textarea name="message" id="message" class="contact-form-textarea"></textarea>
     </div>
    </div>

   </fieldset>
   
   {{#if isInModal}}
    </div>
   {{/if}}
   
   <div class="{{#if isInModal}}modal-footer{{else}}form-actions{{/if}}">

    <button type="submit" class="contact-form-button-submit">
     {{translate 'Save'}}
    </button>

    <button type="reset" class="contact-form-button" data-action="reset">
     {{translate 'Reset'}}
    </button>
    
   </div>
   
  </form>

 </section>
</div>
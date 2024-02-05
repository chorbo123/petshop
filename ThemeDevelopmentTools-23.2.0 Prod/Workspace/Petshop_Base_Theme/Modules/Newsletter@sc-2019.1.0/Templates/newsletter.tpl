<div class="newsletter-subscription-container">
 <form class="newsletter-subscription-form" data-action="newsletter-subscribe" novalidate>

  <div data-validation="control-group">

   <h5 class="newsletter-subscription-form-label" for="login-email">{{translate 'Keep up-to-date with our Pawsome offers'}}</h5>

   <div class="newsletter-subscription-form-container {{#if showErrorMessage}}error{{/if}}" data-validation="control">
    
    <div class="newsletter-subscription-form-input-firstname">
     <input name="firstname" id="firstname" type="text" class="newsletter-subscription-form-input" placeholder="{{translate 'First name'}}">
    </div>
    
    <div class="newsletter-subscription-form-input-email">
     <input name="email" id="email" type="email" class="newsletter-subscription-form-input" placeholder="{{translate 'Email address'}}">
    </div>

    <div class="newsletter-subscription-form-button-subscribe-wrapper">
     <button type="submit" class="newsletter-subscription-form-button-subscribe">
      {{translate 'Subscribe!'}}
     </button>
    </div>

    <div class="newsletter-alert-placeholder" data-type="alert-placeholder" >
     {{#if isFeedback}}
     <div data-view="GlobalMessageFeedback"></div>
     {{/if}}
    </div>
   </div>
  </div>
 </form>
</div>


{{!----
Use the following context variables when customizing this template: 
	
	isFeedback (Boolean)
	model (Object)

----}}

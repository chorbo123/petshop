{{#unless inModal}}
	<h3>{{translate 'Submit Your Comments'}}</h3>
	<p>{{translate 'Fill in the form below and click Submit button.'}}</p>

	<a href="{{postUrl}}" class="back-btn">{{translate '&lt; Back to Post'}}</a>

	<hr class="divider-small">
{{/unless}}

<form action="" method="post">

 {{#if inModal}}
		<div class="modal-body">
	{{/if}}

 <fieldset>
 
  <div data-type="alert-placeholder"></div>
  
  <div class="control-group" data-input="name">
   <label class="control-label" for="{{manage}}name">
    {{translate 'Name'}}
    <small>
     {{translate '(required)'}}
    </small>
   </label>
   <div class="controls">
    <input type="text" class="input-xlarge" id="{{manage}}name" name="name" value="" />
   </div>
  </div>
  
  <div class="control-group" data-input="email">
   <label class="control-label" for="{{manage}}email">
    {{translate 'Email'}}
    <small>
     {{translate '(required)'}}
    </small>
   </label>
   <div class="controls">
    <input type="text" class="input-xlarge" id="{{manage}}email" name="email" value="" />
   </div>
  </div>
  
  <div class="control-group" data-input="comments">
   <label class="control-label" for="{{manage}}comments">
    {{translate 'Comments'}}
    <small>
     {{translate '(required)'}}
    </small>
   </label>
   <div class="controls">
    <textarea class="input-xlarge" id="{{manage}}comments" name="comments" rows="10" cols="30"></textarea>
   </div>
  </div>
  
  <div class="control-group recaptcha" data-input="recaptcha">
   <div class="controls">
    <div id="recaptcha-wrapper" class="recaptcha-wrapper"></div>
   </div>
  </div>

 </fieldset>
 
	{{#if inModal}}
		</div>
	{{/if}}
 
	<div class="{{#if inModal}}modal-footer{{else}}form-actions{{/if}}">
		<button type="submit" class="btn btn-primary">
			{{translate 'Submit'}}
		</button>

		{{#if inModal}}
			<button class="btn" data-dismiss="modal">
				{{translate 'Cancel'}}
			</button>
		{{/if}}

		{{#unless inModal}}
			<button type="reset" class="btn" data-action="reset">
				{{translate 'Reset'}}
			</button>
		{{/unless}}
	</div>
 
</form>

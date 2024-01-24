{{#if inModal}}
 <div class="modal-body">
{{/if}}

	<p>{{translate 'Thanks for taking the time to post your comments.'}}</p>

{{#unless inModal}}
	<a href="{{postUrl}}" class="back-btn">{{translate '&lt; Back to Post'}}</a>

	<hr class="divider-small">
{{/unless}}

{{#if inModal}}
 </div>
  
 <div class="{{#if inModal}}modal-footer{{else}}form-actions{{/if}}">
  {{#if inModal}}
   <button class="btn" data-dismiss="modal">
    {{translate 'Continue'}}
   </button>
  {{/if}}
 </div>
{{/if}}
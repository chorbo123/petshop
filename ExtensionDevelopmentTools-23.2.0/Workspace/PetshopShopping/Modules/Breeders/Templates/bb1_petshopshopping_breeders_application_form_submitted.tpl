<div class="breeders-form-container">
 <section class="breeders-form">
  {{#if inModal}}
   <div class="modal-body">
  {{/if}}

   <header class="breeders-form-header">
    <h2 class="breeders-form-title">{{pageHeader}}</h2>
    <p>{{translate 'Your application has been successfully submitted. We will get back to you as soon as possible.'}}</p>
   </header>

  {{#if inModal}}
   </div>
    
   <div class="{{#if inModal}}modal-footer{{else}}form-actions{{/if}}">
    {{#if inModal}}
     <button class="btn" data-dismiss="modal">
      {{translate 'Close'}}
     </button>
    {{/if}}
   </div>
  {{/if}}
 </section>
</div>
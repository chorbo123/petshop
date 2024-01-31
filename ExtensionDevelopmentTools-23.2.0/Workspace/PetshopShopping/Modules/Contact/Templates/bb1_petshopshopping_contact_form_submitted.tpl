<div class="contact-form-container">
 <section class="contact-form">
  {{#if inModal}}
   <div class="modal-body">
  {{/if}}

   <header class="contact-form-header">
    <h2 class="contact-form-title">{{pageHeader}}</h2>
    <p>{{translate 'Thanks for contacting us. We will get back to you as soon as possible.'}}</p>
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
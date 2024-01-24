<section itemscope itemtype="http://schema.org/Blog">

 <div data-view="SocialMedia.Links"></div>
 
 {{#if posts}}
 
  {{#if isFirstPage}}
   
   <div class="row">
   
    <div class="col-md-12">
     <div data-view="Posts.Featured"></div>
    </div>
   
   </div>
   
  {{/if}}

  <div data-view="Posts.ListNavigable"></div>
 
 {{/if}}

 <div data-view="SocialMedia.Links"></div>
 
</section>
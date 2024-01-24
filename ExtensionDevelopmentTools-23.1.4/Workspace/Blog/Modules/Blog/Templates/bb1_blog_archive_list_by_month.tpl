<section itemscope itemtype="http://schema.org/Blog">

 <div data-view="SocialMedia.Links"></div>
 
 <h3 class="archive-title"><strong>Archive:</strong> <em>{{model.archive}}</em></h3>
 
 {{#if posts}}
 
  <div data-view="Posts.ListNavigable"></div>
  
 {{/if}}

 <div data-view="SocialMedia.Links"></div>
 
</section>
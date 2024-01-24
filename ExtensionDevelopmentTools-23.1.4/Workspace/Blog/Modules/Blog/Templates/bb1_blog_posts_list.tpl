<section itemscope itemtype="http://schema.org/Blog">

 <div data-view="SocialMedia.Links"></div>
 
 {{model.image}}
 <h3 class="archive-title"><strong>Category:</strong> <em>{{model.category}}</em></h3>
 <p>{{model.description}}</p>
 
 {{#if posts}}
 
  <div data-view="Posts.ListNavigable"></div>
  
 {{/if}}

 <div data-view="SocialMedia.Links"></div>
 
</section>
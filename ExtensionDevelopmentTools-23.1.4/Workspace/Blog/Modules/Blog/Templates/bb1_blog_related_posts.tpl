{{#if posts.length}}
 <div class="related-articles">
  <h3>{{model.heading}}</h3>
  {{#each posts}}
   <%= blogRelatedPostsCell({
    post: post,
    view: view
   }) %>
  {{/each}}
 </div>
{{/if}}
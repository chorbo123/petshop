{{#if posts.length}}
 <ul>
  {{#each posts}}
   <%= blogLatestPostsCell({
    post: post,
    view: view
   }) %>
  {{/each}}
 </ul>
{{/if}}
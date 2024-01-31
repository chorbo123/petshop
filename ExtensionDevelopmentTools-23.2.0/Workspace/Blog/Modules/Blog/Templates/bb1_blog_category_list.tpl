{{#if categories.length}}
 
 <h4>Categories</h4>

 {{#each categories}}
  <p><a href="{{this.url}}">{{this.name}}</a></p>
 {{/each}}
  
{{/if}}
{{#if model.monthsArchived}}
 <div class="news-by-month">
  <h4>Articles by Month</h4>
  {{#each model.monthsArchived}}
   <p><a href="{{this.url}}">{{this.name}}</a></p>
  {{/each}}
 </div>
{{/if}}

{{#if model.yearsArchived}}
 <div class="news-by-year">
  <h4>Articles by Year</h4>
  {{#each model.yearsArchived}}
   <p><a href="{{this.url}}">{{this.name}}</a></p>
  {{/each}}
 </div>
{{/if}}
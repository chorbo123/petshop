<div class="faceted-navigation">
 <div class="well-header facet-list-header">
  <h2 class="facet-list-heading">{{translate 'Blog'}}</h2>
  <hr>
 </div>
</div>
 
{{#if blogRecentPosts}}
 <div class="well-facet faceted-navigation">

  <div class="well-header facet-list-header">
   <h2 class="facet-list-heading">{{blogRecentPosts.heading}}</h2>
  </div>
  
  <div class="well-facet-body">
   <div class="well-facet-section facet-well">
    <h3 class="heading uncollapsible"></h3>
    <div class="filters in">
     <ul class="nav nav-list">
      {{#each blogRecentPosts}}
       <li data-label="{{this.id}}">
        <a href="{{this.url}}" title="{{this.name}}">
         <span>{{this.name}}</span>
        </a>
       </li>
      {{/each}}
     </ul>
    </div>
   </div>
  </div>
  
 </div>
{{/if}}

{{#if blogCategories}}
 <div class="well-facet faceted-navigation">

  <div class="well-header facet-list-header">
   <h2 class="facet-list-heading">{{blogCategoriesHeading}}</h2>
  </div>
  
  <div class="well-facet-body">
   <div class="well-facet-section facet-well">
    <h3 class="heading uncollapsible"></h3>
    <div class="filters in">
     <ul class="nav nav-list">
      {{#each blogCategories}}
       <li data-label="{{this.id}}">
        <a href="{{this.url}}" title="{{this.name}}">
         <span>{{this.name}}</span>
        </a>
       </li>
      {{/each}}
      {{#if blogCategories.isMore}}
       <li data-label="more">
        <a href="{{categoryFolder}}">View more</a>
       </li>
      {{/if}}
     </ul>
    </div>
   </div>
  </div>
  
 </div>
{{/if}}

{{#if blogArchives}}
 <div class="well-facet faceted-navigation">

  <div class="well-header facet-list-header">
   <h2 class="facet-list-heading">{{blogArchivesHeading}}</h2>
  </div>
  
  <div class="well-facet-body">
   <div class="well-facet-section facet-well">
    <h3 class="heading uncollapsible"></h3>
    <div class="filters in">
     <ul class="nav nav-list">
      {{#each blogArchives}}
       <li data-label="{{this.id}}">
        <a href="{{this.url}}" title="{{this.name}}">
         <span>{{this.name}}</span>
        </a>
       </li>
      {{/each}}
      {{#if blogArchives.isMore}}
       <li data-label="more">
        <a href="{{archiveFolder}}">View more</a>
       </li>
      {{/if}}
     </ul>
    </div>
   </div>
  </div>
  
 </div>
{{/if}}

{{#if blogLinks}}
 <div class="well-facet faceted-navigation">

  <div class="well-header facet-list-header">
   <h2 class="facet-list-heading">{{blogLinks.heading}}</h2>
  </div>
  
  <div class="well-facet-body">
   <div class="well-facet-section facet-well">
    <h3 class="heading uncollapsible"></h3>
    <div class="filters in">
     <ul class="nav nav-list">
      {{#each blogLinks}}
       <li data-label="{{this.id}}">
        <a href="{{this.url}}" title="{{this.name}}">
         <span>{{this.name}}</span>
        </a>
       </li>
      {{/each}}
     </ul>
    </div>
   </div>
  </div>
  
 </div>
{{/if}}
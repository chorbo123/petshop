<nav class="header-menu-secondary-nav">

	<ul class="header-menu-level1">

		{{#each categories}}
			{{#if text}}
				<li {{#if categories}}class="categories-menu" data-toggle="categories-menu"{{/if}}>
					<a class="{{class}}" {{objectToAtrributes this}}>
					{{translate text}}
					</a>
					{{#if categories}}
      {{#ifEquals id 'header-menu-brands-anchor'}}
       <div class="header-menu-level-container banner">
        <div class="header-menu-dropdown-banner-links" data-cms-area="header_menu_dropdown_brands_index" data-cms-area-filters="global"></div>
        <div class="header-menu-dropdown-banner-content-container">
         <div id="header-dropdown-content-brands" class="header-menu-dropdown-banner-content">
          <div id="header-dropdown-content-brands-list" data-cms-area="header_menu_dropdown_brands_links" data-cms-area-filters="global"></div>
          <div id="header-dropdown-content-brands-banner" data-cms-area="header_menu_dropdown_brands_content" data-cms-area-filters="global"></div>
         </div>
        </div>
       </div>
      {{else ifEquals id 'header-menu-dogs-anchor'}}
       <div class="header-menu-level-container banner">
        <div class="header-menu-dropdown-banner-links" data-cms-area="header_menu_dropdown_dogs_links" data-cms-area-filters="global"></div>
        <div class="header-menu-dropdown-banner-content-container">
         <div id="header-dropdown-content-dogs" class="header-menu-dropdown-banner-content" data-cms-area="header_menu_dropdown_dogs_content" data-cms-area-filters="global"></div>
        </div>
       </div>
      {{else ifEquals id 'header-menu-cats-anchor'}}
       <div class="header-menu-level-container banner">
        <div class="header-menu-dropdown-banner-links" data-cms-area="header_menu_dropdown_cats_links" data-cms-area-filters="global"></div>
        <div class="header-menu-dropdown-banner-content-container">
         <div id="header-dropdown-content-cats" class="header-menu-dropdown-banner-content" data-cms-area="header_menu_dropdown_cats_content" data-cms-area-filters="global"></div>
        </div>
       </div>
      {{else ifEquals id 'header-menu-small-pets-anchor'}}
       <div class="header-menu-level-container banner">
        <div class="header-menu-dropdown-banner-links" data-cms-area="header_menu_dropdown_smallpets_links" data-cms-area-filters="global"></div>
        <div class="header-menu-dropdown-banner-content-container">
         <div id="header-dropdown-content-small-pets" class="header-menu-dropdown-banner-content" data-cms-area="header_menu_dropdown_smallpets_content" data-cms-area-filters="global"></div>
        </div>
       </div>
      {{else ifEquals id 'header-menu-birds-anchor'}}
       <div class="header-menu-level-container banner medium">
        <div class="header-menu-dropdown-banner-links" data-cms-area="header_menu_dropdown_birds_links" data-cms-area-filters="global"></div>
        <div class="header-menu-dropdown-banner-content-container">
         <div id="header-dropdown-content-birds" class="header-menu-dropdown-banner-content" data-cms-area="header_menu_dropdown_birds_content" data-cms-area-filters="global"></div>
        </div>
       </div>
      {{else ifEquals id 'header-menu-horse-anchor'}}
       <div class="header-menu-level-container banner small">
        <div class="header-menu-dropdown-banner-links" data-cms-area="header_menu_dropdown_horse_links" data-cms-area-filters="global"></div>
        <div class="header-menu-dropdown-banner-content-container">
         <div id="header-dropdown-content-horse" class="header-menu-dropdown-banner-content" data-cms-area="header_menu_dropdown_horse_content" data-cms-area-filters="global"></div>
        </div>
       </div>
      {{else ifEquals id 'header-menu-seasonal-anchor'}}
       <div class="header-menu-level-container banner small">
        <div class="header-menu-dropdown-banner-links" data-cms-area="header_menu_dropdown_seasonal_links" data-cms-area-filters="global"></div>
        <div class="header-menu-dropdown-banner-content-container">
         <div id="header-dropdown-content-seasonal" class="header-menu-dropdown-banner-content" data-cms-area="header_menu_dropdown_seasonal_content" data-cms-area-filters="global"></div>
        </div>
       </div>
      {{else}}
       <ul class="header-menu-level-container">
        <li>
         <ul class="header-menu-level2">
          {{#each categories}}
          <li>
           <a class="{{class}}" {{objectToAtrributes this}}>{{translate text}}</a>

           {{#if categories}}
           <ul class="header-menu-level3">
            {{#each categories}}
            <li>
             <a class="{{class}}" {{objectToAtrributes this}}>{{translate text}}</a>
            </li>
            {{/each}}
           </ul>
           {{/if}}
          </li>
          {{/each}}
         </ul>
        </li>
       </ul>
      {{/ifEquals}}
					{{/if}}
				</li>
			{{/if}}
		{{/each}}

	</ul>

</nav>




{{!----
Use the following context variables when customizing this template: 
	
	categories (Array)
	showExtendedMenu (Boolean)
	showLanguages (Boolean)
	showCurrencies (Boolean)

----}}

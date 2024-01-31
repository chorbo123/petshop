{{#if showBackToAccount}}
	<a href="/" class="product-list-lists-button-back">
		<i class="product-list-lists-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="product-list-lists">

 <div data-cms-area="{{cmsSectionId}}" data-cms-area-filters="global"></div>
 
	<div data-type="alert-placeholder" class="product-list-lists-message"></div>

	<header class="product-list-lists-header">
		<h2 class="product-list-lists-title">{{pageHeader}}</h2>
		<a class="product-list-lists-button-add" href="/breeder-programmes/{{application.urlComponent}}/new">{{translate 'Add A New Litter'}}</a>
	</header>

	{{#if hasLitters}}
		<div class="product-list-lists-wrapper">
			<table class="product-list-lists-details">
				<tbody data-view="Litters.List"></tbody>
			</table>

   {{#each litters}}  
    <h2 class="breeders-litter-list-heading">{{translate 'Litter $(0) - $(1)' litter litterDob}}</h2>
    
    <table class="breeders-litter-list-table">
    <tr>
    <th></th>
    <th>Email</th>
    <th>First name</th>
    <th class="breeders-litter-list-checkbox">Claimed free bag?</th>
    <th class="breeders-litter-list-checkbox">Claimed big bag?</th>
    <th class="breeders-litter-list-checkbox">Bottomless bowl?</th>
    </tr>
    {{#each petParents}}
    <tr data-id="{{rowindex}}">
    <td>{{name}}</td>
    <td>
     {{email}}
    </td>
    <td>
     {{firstName}}
    </td>
    <td class="breeders-litter-list-checkbox">
     <!--<input type="checkbox" name="firstpromoclaimed" value="T" data-unchecked-value="F"{{#if firstPromotionClaimed}} checked{{/if}} disabled="disabled" />-->
     {{#if firstPromotionClaimed}}Yes{{else}}No{{/if}}
    </td>
    <td class="breeders-litter-list-checkbox">
     <!--<input type="checkbox" name="secondpromoclaimed" value="T" data-unchecked-value="F"{{#if secondPromotionClaimed}} checked{{/if}} disabled="disabled" />-->
     {{#if secondPromotionClaimed}}Yes{{else}}No{{/if}}
    </td>
    <td class="breeders-litter-list-checkbox">
     <!--<input type="checkbox" name="subscribedtoblb" value="T" data-unchecked-value="F"{{#if bottomlessBowlSubscription}} checked{{/if}} disabled="disabled" />-->
     {{#if bottomlessBowlSubscription}}Yes{{else}}No{{/if}}
    </td>
    </tr>
    {{/each}}
    </table>
   {{/each}}
		</div>
	{{else}}
		<p>{{translate 'There are currently no existing litters associated with this programme.'}}</p>
	{{/if}}
</section>
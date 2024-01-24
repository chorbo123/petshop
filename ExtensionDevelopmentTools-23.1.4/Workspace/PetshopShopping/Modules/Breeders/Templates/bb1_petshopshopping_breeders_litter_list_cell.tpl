<tr class="product-list-list-details-wrapper" data-action="navigate" data-product-list-id="{{pet.internalid}}" data-id="{{pet.internalid}}">
	<td class="product-list-list-details-main">
		<h2 class="name no-margin-top">
			<a href="/pets/{{pet.internalid}}">{{pet.name}}</a>
		</h2>
		<p>
			<!--{{#if pet.mainpet}}
				{{translate '<strong>My main pet!</strong>'}}<br />
			{{/if}}-->
			{{translate '<strong>Type:</strong> $(0)' pet.type_text}}<br />
			{{#if pet.breed}}
				{{translate '<strong>Breed:</strong> $(0)' pet.breed_text}}<br />
			{{/if}}
			{{translate '<strong>Date Of Birth:</strong> $(0)' pet.dob}}<br />
		</p>
	</td>
	<td class="product-list-list-details-info">
		<p>
			{{translate '<strong>Gender:</strong> $(0)' pet.gender_text}}<br />
			{{translate '<strong>Weight:</strong> $(0)' pet.weight_text}}<br />
			<!--{{#if pet.currentdryfood}}
				{{translate '<strong>Current Dry Food:</strong> $(0)' pet.currentdryfood}}<br />
			{{/if}}
			{{#if pet.currentcannedfood}}
				{{translate '<strong>Current Canned Food:</strong> $(0)' pet.currentcannedfood}}<br />
			{{/if}}-->
		</p>
	</div>
</td>

<td class="product-list-list-details-actions">
	<div class="product-list-list-details-button-group">
		<button class="product-list-list-details-button-edit" data-action="edit-pet">Edit</button>
  <button class="product-list-list-details-button-expander" data-toggle="dropdown">
   <i></i>
  </button>
		<ul class="product-list-list-details-dropdown">
			<li><a href="#" data-action="delete-pet">Delete</a></li>
		</ul>
	</td>
</tr>
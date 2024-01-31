<tr data-id="{{petparent.internalid}}">
<td>{{translate 'Pet $(0)' petparent.internalid}}</td>
<td data-validation="control-group" data-input="email">
	<div data-validation="control">
  <input data-action="email" type="email" name="email" class="breeders-litter-form-input" value="{{petparent.email}}" />
 </div>
</td>
<td data-validation="control-group" data-input="firstname">
	<div data-validation="control">
 <input data-action="text" type="text" name="firstname" class="breeders-litter-form-input" value="{{petparent.firstname}}" />
 </div>
</td>
</tr>
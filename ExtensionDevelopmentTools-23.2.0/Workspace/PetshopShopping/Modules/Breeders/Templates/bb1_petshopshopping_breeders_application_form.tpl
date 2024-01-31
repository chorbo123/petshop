<div class="breeders-form-container">

 <div data-cms-area="{{cmsSectionId}}" data-cms-area-filters="global"></div>
 
 <section class="breeders-form">

  <header class="breeders-form-header">
   <h2 class="breeders-form-title">{{pageHeader}}</h2>
   <p>{{translate 'Fill in the form below and click the Submit button.'}}</p>
   <p>{{translate 'Please login first if you already have an existing account.'}}</p>
  </header>

  <div class="breeders-form-alert-placeholder" data-type="alert-placeholder"></div>
  <small class="breeders-form-required">
   {{translate 'Required'}} <span class="breeders-form-required-star">*</span>
  </small>

  <form action="#" class="breeders-form-form" novalidate>
  
   {{#if isInModal}}
    <div class="modal-body">
   {{/if}}

   <fieldset>
    
    <legend>Partner Programme</legend>
    
    <div class="breeders-form-controls-group" data-validation="control-group" data-input="breedertype">
     <label class="breeders-form-label" for="breedertype">
      {{translate 'Breeder/Partner Type/Profession'}} <small class="breeders-form-required-star">*</small>
     </label>
     <div class="breeders-form-controls" data-validation="control">
      <label class="breeders-form-label" for="breedertype_1">
       <input type="radio" id="breedertype_1" name="breedertype" class="breeders-form-radio" data-id="1" value="1" />
       Breeder – Kennelclub registered
      </label>
      <label class="breeders-form-label" for="breedertype_2">
       <input type="radio" id="breedertype_2" name="breedertype" class="breeders-form-radio" data-id="2" value="2" />
       Breeder – Non Kennelclub registered
      </label>
      <label class="breeders-form-label" for="breedertype_3">
       <input type="radio" id="breedertype_3" name="breedertype" class="breeders-form-radio" data-id="3" value="3" />
       Rescue centre
      </label>
     </div>
    </div>

   </fieldset>
   
   <fieldset>
    
    <legend>Account Details</legend>
    
    <div class="breeders-form-controls-group" data-validation="control-group" data-input="salutation">
     <label class="breeders-form-label" for="salutation">
      {{translate 'Title'}} <small class="breeders-form-required-star">*</small>
     </label>
     <div class="breeders-form-controls" data-validation="control">
      <select data-input="salutation" type="select" name="salutation" id="salutation" class="breeders-form-select">
       <option></option>
       {{#each titles}}
       <option data-id="{{internalId}}" value="{{internalId}}"{{#ifEquals internalId ../model.salutation}} selected{{/ifEquals}}>{{name}}</option>
       {{/each}}
      </select>
     </div>
    </div>

    <div class="row">
     
     <div class="col-sm-6">
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="firstname">
       <label class="breeders-form-label" for="firstname">
        {{translate 'First Name'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <input data-action="text" type="text" name="firstname" id="firstname" class="breeders-form-input" value="{{model.firstname}}" maxlength="300" />
       </div>
      </div>
     </div>

     <div class="col-sm-6">
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="lastname">
       <label class="breeders-form-label" for="lastname">
        {{translate 'Last Name'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <input data-action="text" type="text" name="lastname" id="lastname" class="breeders-form-input" value="{{model.lastname}}" maxlength="300" />
       </div>
      </div>
     </div>

    </div>
    
    <div class="row">
     <div class="col-sm-6">

      <div class="breeders-form-controls-group" data-validation="control-group" data-input="email">
       <label class="breeders-form-label" for="email">
        {{translate 'Email Address'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <input data-action="text" type="text" name="email" id="email" class="breeders-form-input" value="{{model.email}}" maxlength="300" />
       </div>
      </div>
      
     </div>
    </div>

   </fieldset>
   
   <fieldset>
    
    <legend>Breeders</legend>
    
    <div class="row">
     
     <div class="col-sm-6">
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="breederregistrationnumber">
       <label class="breeders-form-label" for="breederregistrationnumber">
        {{translate 'Breeder Registration Number'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <input data-action="text" type="text" name="breederregistrationnumber" id="breederregistrationnumber" class="breeders-form-input" value="{{model.breederregistrationnumber}}" maxlength="300" />
       </div>
      </div>
      
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="kennelname">
       <label class="breeders-form-label" for="kennelname">
        {{translate 'Kennel Name'}}
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <input data-action="text" type="text" name="kennelname" id="kennelname" class="breeders-form-input" value="{{model.kennelname}}" maxlength="300" />
       </div>
      </div>
      
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="breedername">
       <label class="breeders-form-label" for="breedername">
        {{translate 'Breeder Name'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <input data-action="text" type="text" name="breedername" id="breedername" class="breeders-form-input" value="{{model.breedername}}" maxlength="300" />
       </div>
      </div>
      
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="rescuecentrename">
       <label class="breeders-form-label" for="rescuecentrename">
        {{translate 'Rescue Centre Name'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <input data-action="text" type="text" name="rescuecentrename" id="rescuecentrename" class="breeders-form-input" value="{{model.rescuecentrename}}" maxlength="300" />
       </div>
      </div>
      
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="regcharitynumber">
       <label class="breeders-form-label" for="regcharitynumber">
        {{translate 'Registered Charity Number'}}
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <input data-action="text" type="text" name="regcharitynumber" id="regcharitynumber" class="breeders-form-input" value="{{model.regcharitynumber}}" maxlength="300" />
       </div>
      </div>
      
     </div>
      
     <div class="col-sm-6">
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="breeds">
       <label class="breeders-form-label" for="breeds">
        {{translate 'Breeds'}}
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <select type="select" name="breeds" id="breeds" class="breeders-form-select" size="4" multiple>
         {{#each animalBreeds}}
         <option data-id="{{internalId}}" value="{{internalId}}"{{#if isSelected}} selected{{/if}}>{{name}}</option>
         {{/each}}
        </select>
       </div>
      </div>
      
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="breedsother">
       <label class="breeders-form-label" for="breeds">
        {{translate 'Breeds (Other)'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <input data-action="text" type="text" name="breedsother" id="breedsother" class="breeders-form-input" value="{{model.breedsother}}" maxlength="300" />
       </div>
      </div>
     </div>
     
    </div>

    <div class="row">
     
     <div class="col-sm-6">
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="advertisingchannels">
       <label class="breeders-form-label" for="advertisingchannels">
        {{translate 'Where do you advertise your puppies/kittens?'}}
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <select type="select" name="advertisingchannels" id="advertisingchannels" class="breeders-form-select" size="4" multiple>
         {{#each advertisingChannels}}
         <option data-id="{{internalId}}" value="{{internalId}}"{{#if isSelected}} selected{{/if}}>{{name}}</option>
         {{/each}}
        </select>
       </div>
      </div>
      
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="advertisingchannelsother">
       <label class="breeders-form-label" for="breeds">
        {{translate 'Where do you advertise? (Other)'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <input data-action="text" type="text" name="advertisingchannelsother" id="advertisingchannelsother" class="breeders-form-input" value="{{model.advertisingchannelsother}}" maxlength="300" />
       </div>
      </div>
     </div>
    
     <div class="col-sm-6">
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="breederwebsite">
       <label class="breeders-form-label" for="breederwebsite">
        {{translate 'Website'}}
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <input data-action="text" type="text" name="breederwebsite" id="breederwebsite" class="breeders-form-input" value="{{model.breederwebsite}}" maxlength="300" />
       </div>
      </div>
     </div>
     
    </div>

    <div class="row">
     
     <div class="col-sm-6">
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="animaltype">
       <label class="breeders-form-label" for="animaltype">
        {{translate 'Type of Animal Bred'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <select type="select" name="animaltype" id="animaltype" class="breeders-form-select">
         <option value=""></option>
         {{#each animalTypes}}
         <option data-id="{{internalId}}" value="{{internalId}}"{{#if isSelected}} selected{{/if}}>{{name}}</option>
         {{/each}}
        </select>
       </div>
      </div>
     </div>

     <div class="col-sm-6">
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="numberoflittersperyear">
       <label class="breeders-form-label" for="numberoflittersperyear">
        {{translate 'Number of Litters Per Year'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <select data-action="select" type="select" name="numberoflittersperyear" id="numberoflittersperyear" class="breeders-form-select">
         <option value=""></option>
         {{#each numberOfLittersPerYear}}
         <option data-id="{{internalId}}" value="{{internalId}}"{{#if isSelected}} selected{{/if}}>{{name}}</option>
         {{/each}}
        </select>
       </div>
      </div>
      
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="numberofanimalsrehomedperyear">
       <label class="breeders-form-label" for="numberofanimalsrehomedperyear">
        {{translate 'Number of Animals Rehomed Per Year'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <select data-action="select" type="select" name="numberofanimalsrehomedperyear" id="numberofanimalsrehomedperyear" class="breeders-form-select">
         <option value=""></option>
         {{#each numberOfAnimalsRehomedPerYear}}
         <option data-id="{{internalId}}" value="{{internalId}}"{{#if isSelected}} selected{{/if}}>{{name}}</option>
         {{/each}}
        </select>
       </div>
      </div>
     </div>
    
    </div>

    <div class="row">
     
     <div class="col-sm-6">
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="numberofanimals">
       <label class="breeders-form-label" for="numberofanimals">
        {{translate 'Number of Animals'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <select data-action="select" type="select" name="numberofanimals" id="numberofanimals" class="breeders-form-select">
         <option value=""></option>
         {{#each numberOfAnimals}}
         <option data-id="{{internalId}}" value="{{internalId}}"{{#if isSelected}} selected{{/if}}>{{name}}</option>
         {{/each}}
        </select>
       </div>
      </div>
      
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="numberofcats">
       <label class="breeders-form-label" for="numberofcats">
        {{translate 'Number of Cats'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <select data-action="select" type="select" name="numberofcats" id="numberofcats" class="breeders-form-select">
         <option value=""></option>
         {{#each numberOfCats}}
         <option data-id="{{internalId}}" value="{{internalId}}"{{#if isSelected}} selected{{/if}}>{{name}}</option>
         {{/each}}
        </select>
       </div>
      </div>
      
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="numberofmaledogs">
       <label class="breeders-form-label" for="numberofmaledogs">
        {{translate 'Number of Male Dogs'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <select data-action="select" type="select" name="numberofmaledogs" id="numberofmaledogs" class="breeders-form-select">
         <option value=""></option>
         {{#each numberOfMaleDogs}}
         <option data-id="{{internalId}}" value="{{internalId}}"{{#if isSelected}} selected{{/if}}>{{name}}</option>
         {{/each}}
        </select>
       </div>
      </div>
     </div>
      
     <div class="col-sm-6">
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="numberoffemaledogs">
       <label class="breeders-form-label" for="numberoffemaledogs">
        {{translate 'Number of Female Dogs'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <select data-action="select" type="select" name="numberoffemaledogs" id="numberoffemaledogs" class="breeders-form-select">
         <option value=""></option>
         {{#each numberOfFemaleDogs}}
         <option data-id="{{internalId}}" value="{{internalId}}"{{#if isSelected}} selected{{/if}}>{{name}}</option>
         {{/each}}
        </select>
       </div>
      </div>
     </div>
     
    </div>

    <div class="row">
     
     <div class="col-sm-6">
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="feedbrand">
       <label class="breeders-form-label" for="feedbrand">
        {{translate 'What brand do you feed?'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <input data-action="text" type="text" name="feedbrand" id="feedbrand" class="breeders-form-input" value="{{model.feedbrand}}" maxlength="300" />
       </div>
      </div>
      
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="agreedtorefernewowners">
       <label class="breeders-form-label" for="agreedtorefernewowners" data-validation="control">
        <input type="checkbox" id="agreedtorefernewowners" name="agreedtorefernewowners" value="T" data-unchecked-value="F"{{#if item.agreedtorefernewowners}} checked{{/if}} />
        {{translate 'I agree to pass on puppy and kitten packs to new owners *'}}
       </label>
      </div>
     </div>
     
     <div class="col-sm-6">
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="leadsource">
       <label class="breeders-form-label" for="leadsource">
        {{translate 'Where did you hear about us?'}} <small class="breeders-form-required-star">*</small>
       </label>
       <div class="breeders-form-controls" data-validation="control">
        <textarea name="leadsource" id="leadsource" class="breeders-form-textarea"></textarea>
       </div>
      </div>
     </div>
     
    </div>

   </fieldset>
   
   <fieldset>
    
    <legend>Terms &amp; Conditions</legend>
    
    
    <div class="row">
     
     <div class="col-sm-6">
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="agreedtoterms">
       <label class="breeders-form-label" for="agreedtoterms" data-validation="control">
        <input type="checkbox" id="agreedtoterms" name="agreedtoterms" value="T" data-unchecked-value="F"{{#if item.agreedtoterms}} checked{{/if}} />
        {{translate 'Agree to terms &amp; conditions *'}}
       </label>
      </div>
     </div>
     
     <div class="col-sm-6">
      <div class="breeders-form-controls-group" data-validation="control-group" data-input="agreedtocommunications">
       <label class="breeders-form-label" for="agreedtocommunications" data-validation="control">
        <input type="checkbox" id="agreedtocommunications" name="agreedtocommunications" value="T" data-unchecked-value="F"{{#if item.agreedtocommunications}} checked{{/if}} />
        {{translate 'Agree to regular communication &amp; offers *'}}
       </label>
      </div>
     </div>
      
    </div>

   </fieldset>
   
   {{#if isInModal}}
    </div>
   {{/if}}
   
   <div class="{{#if isInModal}}modal-footer{{else}}form-actions{{/if}}">

    <button type="submit" class="breeders-form-button-submit">
     {{translate 'Submit'}}
    </button>

    <button type="reset" class="breeders-form-button" data-action="reset">
     {{translate 'Reset'}}
    </button>
    
   </div>
   
  </form>

 </section>
 
 <div data-cms-area="breeders_form_cms_area_bottom" data-cms-area-filters="path"></div>
 
</div>
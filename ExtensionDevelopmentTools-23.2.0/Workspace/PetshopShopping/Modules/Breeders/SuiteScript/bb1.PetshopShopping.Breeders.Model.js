// @module bb1.PetshopShopping.Breeders
define(
	'bb1.PetshopShopping.Breeders.Model',
	[
		'SC.Model',
  'Models.Init',
		'Application',
  'Configuration',
		'Utils',
		'underscore'
	],
	function (
		SCModel,
  ModelsInit,
		Application,
  Configuration,
		Utils,
		_
	)
 {
  'use strict';

  var bb1WebServicesUrl = nlapiResolveURL('SUITELET', 'customscript_bb1_wsc_webservices', 'customdeploy_bb1_wsc_webservices', true);

  var addParamsToUrl = function (baseUrl, params)
  {
   // We get the search options from the config file
   if (params && _.keys(params).length)
   {
    var paramString = Object.keys(params).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&')		
    ,	join_string = ~baseUrl.indexOf('?') ? '&' : '?';

    return baseUrl + join_string + paramString;
   }
   else
   {
    return baseUrl;
   }
  }

  function validateBreederFields (value, name, form)
  {
   if (value) return;
   
   switch(form.breedertype) {
    case '1':
     if (name == 'breederregistrationnumber')
      return 'Breeder Registration Number is required';
     if (name == 'numberoflittersperyear')
      return 'Number of Litters Per Year is required';
     if (name == 'animaltype')
      return 'Animal Type is required';
     break;
    case '2':
     if (name == 'breedername')
      return 'Breeder Registration Number is required';
     if (name == 'numberoflittersperyear')
      return 'Number of Litters Per Year is required';
     if (name == 'animaltype')
      return 'Animal Type is required';
     break;
    case '3':
     if (name == 'rescuecentrename')
      return 'Rescue Centre Name is required';
     if (name == 'numberofanimalsrehomedperyear')
      return 'Number of Animals Rehomed Per Year is required';
     if (name == 'breederwebsite')
      return 'Breeder Website is required';
     break;
   }
  }

  function validatePetParentConsent (value, name, form)
  {
   return value != 'T' ? 'Consent of the Pet Parents is required' : null;
  }

  function validateAnimalFields (value, name, form)
  {
   if (value) return;
   
   switch(form.animaltype) {
    case '1':
     if (name == 'numberofmaledogs')
      return 'Number of Male Dogs is required';
     if (name == 'numberoffemaledogs')
      return 'Number of Female Dogs is required';
     break;
    case '2':
     if (name == 'numberofcats')
      return 'Number of Cats is required';
     break;
   }
  }

  function validatePetParents(value, name, form)
  {
   var petParentsValid = false;
   
   //console.log('validatePetParents');
   //console.log(JSON.stringify(value));
   if (value && value.length)
    petParentsValid = _.reduce(value, function(isValid, petParent) {
     //console.log(isValid);
     //console.log(JSON.stringify(petParent));
     //console.log(validateEmail(petParent.email));
     //console.log(((!isValid || !!validateEmail(petParent.email) || !petParent.firstname) ? false : true).toString());
     return (!isValid || !!validateEmail(petParent.email) || !petParent.firstname) ? false : true;
    }, true);
    
   return !petParentsValid ? 'At least one valid Pet Parent is required' : null;
  }

  function validateEmail(value, name, form)
  {
   if (!value)
   {
    return 'Email Address is required';
   }
  }

  function validateLength(value, name)
  {
   var max_length = 4000;

   if (value && value.length > max_length)
   {
    return name + ' must be at most ' + max_length + ' characters';
   }
  }

  // @extends SCModel
  return SCModel.extend({

   name: 'bb1.PetshopShopping.Breeders',
   
   validation: {
    breederprogramme: { required: true, msg: 'Breeder Programme is required' },
    breedertype: { required: true, msg: 'Breeder Type is required' },
    salutation: { required: true, msg: 'Salutation is required' },
    firstname: { required: true, msg: 'First Name is required' },
    lastname: { required: true, msg: 'Last Name is required' },
    email: { required: true, pattern: 'email' },
    breederregistrationnumber: { fn: validateBreederFields },
    kennelname: { fn: validateBreederFields },
    breedername: { fn: validateBreederFields },
    rescuecentrename: { fn: validateBreederFields },
    regcharitynumber: { fn: validateBreederFields },
    //breeds: { required: true, msg: 'Breeds is required' },
    //advertisingchannels: { required: true, msg: 'Where do you advertise your puppies/kittens is required' },
    //breederwebsite: { required: true, msg: 'Breeder Website is required' },
    animaltype: { fn: validateBreederFields },
    numberofcats: { fn: validateAnimalFields },
    numberofmaledogs: { fn: validateAnimalFields },
    numberoffemaledogs: { fn: validateAnimalFields },
    agreedtorefernewowners: { required: true, msg: 'You must agree to refer new owners' },
    agreedtoterms: { required: true, msg: 'You must agree to the terms & conditions' },
    agreedtocommunications: { required: true, msg: 'You must agree to the communications' },
    leadsource: { required: true, msg: 'Where did you hear about us is required' },
    feedbrand: { required: true, msg: 'What brand do you feed is required' }
   },

   petParentValidation: {
    applicationid: { required: true, msg: 'Breeder Application ID is required' },
    numberofanimals: { required: true, msg: 'Number of Animals is required' },
    litterdob: { required: true, msg: 'Litter Date of Birth is required' },
    //petparentconsent: { acceptance: true, msg: 'Consent of the Pet Parents is required' },
    petparentconsent: { fn: validatePetParentConsent },
    petparents: { fn: validatePetParents }
   },
   
   createApplication: function (data)
   {
    try {
     console.log('createApplication data');
     console.log(JSON.stringify(data));
     
     this.validate(data);

     var customerId = nlapiGetUser();
     
     console.log(customerId);
     
     if (!customerId) {
      //var duplicateCustomerSearchResults = nlapiSearchDuplicate("customer", {email: data.email}) || {};
      var webSiteAccessId = Configuration.get('websiteAccess.internalId'),
          webServicesParms = {action: 'check-email-exists', email: data.email, website: webSiteAccessId},
          webServicesUrl = addParamsToUrl(bb1WebServicesUrl, webServicesParms),
          emailExists = JSON.parse(nlapiRequestURL(webServicesUrl).getBody() || '{}');
      
      console.log('emailExists response', JSON.stringify(emailExists));

      if (!emailExists.success)
       throw nlapiCreateError('EMAIL_CHECK_FAILED', emailExists.error);
      
      //if (duplicateCustomerSearchResults.length) {
      if (emailExists.emailExists) {
       customerId = emailExists.customerId;
       console.log('duplicate found');
       throw nlapiCreateError('EXISTING_CUSTOMER', 'You have an existing account, please login first. If you have forgotten your password you can use the \'Forgot password?\' link to reset your password.');
      }
      else {
       var password = Math.floor(Math.random()*1000000000000000000000).toFixed();
       var lead = nlapiCreateRecord("lead");
       lead.setFieldValue("firstname", data.firstname);
       lead.setFieldValue("lastname", data.lastname);
       lead.setFieldValue("email", data.email);
       lead.setFieldValue("salutation", data.salutation);
       lead.setFieldValue('subsidiary', ModelsInit.session.getShopperSubsidiary());
       lead.setFieldValue("giveaccess", "T");
       lead.setFieldValue("password", password);
       lead.setFieldValue("password2", password);
       lead.setFieldValue("custentity_bb1_websiteaccess", 1);
       lead.setFieldValue("assignedwebsite", 2);
       lead.setFieldValue("accessrole", 1010);
       data.agreedtocommunications == "T" ? lead.setFieldValue("globalsubscriptionstatus", 1) : lead.setFieldValue("globalsubscriptionstatus", 2)
       customerId = nlapiSubmitRecord(lead, false, true);
       console.log('new lead created');
      }
     }
     else {
      // check if an pending or approved application has already been submitted for this customer
      var filters = [
                     new nlobjSearchFilter("isinactive", null, "is", "F"),
                     new nlobjSearchFilter("custrecord_bb1_bpa_bpp", null, "anyof", data.breederprogramme),
                     //new nlobjSearchFilter("custrecord_bb1_bpa_approvalstatus", null, "anyof", ["@NONE@", "1", "2"]),
                     new nlobjSearchFilter("custrecord_bb1_bpa_customer", null, "anyof", customerId)
                    ],
          columns = this.getColumnsArray(),
          applications = Application.getAllSearchResults('customrecord_bb1_bpa', filters, columns) || [];
          
      if (applications.length) {
       console.log('application for this customer already exists');
       throw nlapiCreateError('EXISTING_APPLICATION', 'You have submitted a breeder application, please contact us if you are waiting on approval or it has been approved and you cannot access your application from you My Account page.');
      }
     }
     
     console.log(customerId);
     
     var advertisingchannels = typeof data.advertisingchannels == 'string' ? [data.advertisingchannels] : data.advertisingchannels;
     var breeds = typeof data.breeds == 'string' ? [data.breeds] : data.breeds;
     
     if (advertisingchannels && advertisingchannels.length && (advertisingChannelOtherIndex = advertisingchannels.indexOf('other')) != -1)
      advertisingchannels.splice(advertisingChannelOtherIndex, 1);
     
     if (breeds && breeds.length && (breedsOtherIndex = breeds.indexOf('other')) != -1)
      breeds.splice(breedsOtherIndex, 1);
     
     var application = nlapiCreateRecord("customrecord_bb1_bpa", {recordmode: "dynamic"});
     application.setFieldValue("custrecord_bb1_bpa_customer", customerId);
     application.setFieldValue("custrecord_bb1_bpa_bpp", data.breederprogramme);
     application.setFieldValue("custrecord_bb1_bpa_breedertype", data.breedertype);
     data.displayname && application.setFieldValue("custrecord_bb1_bpa_displayname", data.displayname);
     data.breederregistrationnumber && application.setFieldValue("custrecord_bb1_bpa_breederregnumber", data.breederregistrationnumber);
     data.kennelname && application.setFieldValue("custrecord_bb1_bpa_kennelname", data.kennelname);
     data.breedername && application.setFieldValue("custrecord_bb1_bpa_breedername", data.breedername);
     data.rescuecentrename && application.setFieldValue("custrecord_bb1_bpa_rescuecentrename", data.rescuecentrename);
     data.regcharitynumber && application.setFieldValue("custrecord_bb1_bpa_regcharitynumber", data.regcharitynumber);
     data.advertisingchannels && application.setFieldValues("custrecord_bb1_bpa_advertisingchannels", advertisingchannels);
     data.advertisingchannelsother && application.setFieldValue("custrecord_bb1_bpa_advertisingchanother", data.advertisingchannelsother);
     data.breederwebsite && application.setFieldValue("custrecord_bb1_bpa_breederwebsite", data.breederwebsite);
     data.animaltype && application.setFieldValue("custrecord_bb1_bpa_animaltype", data.animaltype);
     data.breeds && application.setFieldValues("custrecord_bb1_bpa_breeds", breeds);
     data.breedsother && application.setFieldValue("custrecord_bb1_bpa_breedsother", data.breedsother);
     data.numberoflittersperyear && application.setFieldValue("custrecord_bb1_bpa_numberlittersperyear", data.numberoflittersperyear);
     data.numberofanimalsrehomedperyear && application.setFieldValue("custrecord_bb1_bpa_animalsrehomedperyear", data.numberofanimalsrehomedperyear);
     data.numberofanimals && application.setFieldValue("custrecord_bb1_bpa_numberofanimals", data.numberofanimals);
     data.numberofcats && application.setFieldValue("custrecord_bb1_bpa_numberofcats", data.numberofcats);
     data.numberofmaledogs && application.setFieldValue("custrecord_bb1_bpa_numberofmaledogs", data.numberofmaledogs);
     data.numberoffemaledogs && application.setFieldValue("custrecord_bb1_bpa_numberoffemaledogs", data.numberoffemaledogs);
     data.leadsource && application.setFieldValue("custrecord_bb1_bpa_leadsource", data.leadsource);
     data.feedbrand && application.setFieldValue("custrecord_bb1_bpa_feedbrand", data.feedbrand);
     data.agreedtorefernewowners && application.setFieldValue("custrecord_bb1_bpa_aggreedtorefernewownr", data.agreedtorefernewowners == "T" ? "T" : "F");
     data.agreedtoterms && application.setFieldValue("custrecord_bb1_bpa_agreedtoterms", data.agreedtoterms == "T" ? "T" : "F");
     data.agreedtocommunications && application.setFieldValue("custrecord_bb1_bpa_agreedtocommunication", data.agreedtocommunications == "T" ? "T" : "F");
     data.internalid = nlapiSubmitRecord(application, true, true);
     
     return data;
    }
    catch (e) {
     console.log('error', JSON.stringify(e));
     throw e;
    }
   },
   
   createLitter: function (data)
   {
    try {
     console.log('createLitter data');
     console.log(JSON.stringify(data));
     
     if (!ModelsInit.session.isLoggedIn())
      throw unauthorizedError;

     var litterValidation = this.validation;
     this.validation = this.petParentValidation;
     this.validate(data);
     this.validation = litterValidation;
     
     var customerId = nlapiGetUser();
     var petParents = data.petparents || [];
     
     console.log(customerId);
     
     var webSiteAccessId = Configuration.get('websiteAccess.internalId');
    
     
     var filters = [
                    new nlobjSearchFilter("isinactive", null, "is", "F"),
                    new nlobjSearchFilter("custrecord_bb1_bpa_customer", "custrecord_bb1_bppr_bpa", "anyof", customerId),
                    new nlobjSearchFilter("custrecord_bb1_bpa_approvalstatus", "custrecord_bb1_bppr_bpa", "anyof", "2"),
                    new nlobjSearchFilter("custrecord_bb1_bppr_bpa", null, "anyof", data.applicationid),
                    new nlobjSearchFilter("custrecord_bb1_bppr_litter", null, "greaterthan", "0")
                   ],
         columns = [
                    new nlobjSearchColumn("custrecord_bb1_bppr_litter", null, "max")
                   ],
         maxLitterSearchResults = Application.getAllSearchResults('customrecord_bb1_bppr', filters, columns) || [],
         maxLitter = maxLitterSearchResults.length && parseInt(maxLitterSearchResults[0].getValue("custrecord_bb1_bppr_litter", null, "max")) || 0,
         nextLitter = maxLitter + 1;
     
     console.log('litter');
     console.log(nextLitter);
     
     for (var i=0; i < petParents.length; i++) {
      
      var petParent = petParents[i],
          webServicesParms = {action: 'check-email-exists', email: petParent.email, website: webSiteAccessId},
          webServicesUrl = addParamsToUrl(bb1WebServicesUrl, webServicesParms),
          emailExists = JSON.parse(nlapiRequestURL(webServicesUrl).getBody() || '{}'); // TODO: reduce to 1 request
      
      console.log('emailExists response', JSON.stringify(emailExists));

      var petParentId;
      
      if (!emailExists.success)
       throw nlapiCreateError('EMAIL_CHECK_FAILED', emailExists.error);
      
      if (emailExists.emailExists) {
       petParentId = emailExists.customerId;
       console.log('duplicate found');
      }
      else {
       var password = Math.floor(Math.random()*1000000000000000000000).toFixed();
       var lead = nlapiCreateRecord("lead", {recordmode: "dynamic"});
       //lead.setFieldValue("entityid", petParent.email);
       lead.setFieldValue("firstname", petParent.firstname);
       lead.setFieldValue("lastname", ".");
       lead.setFieldValue("email", petParent.email);
       lead.setFieldValue('subsidiary', ModelsInit.session.getShopperSubsidiary());
       lead.setFieldValue("giveaccess", "T");
       lead.setFieldValue("password", password);
       lead.setFieldValue("password2", password);
       lead.setFieldValue("custentity_bb1_websiteaccess", 1);
       lead.setFieldValue("assignedwebsite", 2);
       lead.setFieldValue("accessrole", 1010);
       petParentId = nlapiSubmitRecord(lead, true, true);
       console.log('new lead created');
      }
      
      var petParent = nlapiCreateRecord("customrecord_bb1_bppr", {recordmode: "dynamic"});
      petParent.setFieldValue("custrecord_bb1_bppr_bpa", data.applicationid);
      petParent.setFieldValue("custrecord_bb1_bppr_petparent", petParentId);
      petParent.setFieldValue("custrecord_bb1_bppr_litter", nextLitter);
      petParent.setFieldValue("custrecord_bb1_bppr_litterdob", data.litterdob);
      petParent.setFieldValue("custrecord_bb1_bppr_petparentconsent", data.petparentconsent == "T" ? "T" : "F");
      data.internalid = nlapiSubmitRecord(petParent, true, true);
      
      var pet = nlapiCreateRecord("customrecord_bb1_pet");
      pet.setFieldValue("custrecord_bb1_pet_customer", petParentId);
      pet.setFieldValue("custrecord_bb1_pet_name", "Your New Pet");
      //data.type && pet.setFieldValue("custrecord_bb1_pet_type", data.type);
      //data.breed && pet.setFieldValue("custrecord_bb1_pet_breed", data.breed);
      pet.setFieldValue("custrecord_bb1_pet_dob", data.litterdob);
      data.petId = nlapiSubmitRecord(pet, true, true);
      
     }
     
     return data;
    }
    catch (e) {
     console.log('error', JSON.stringify(e));
     throw e;
    }
   },
   
   get: function (id, applicationId)
   {
    'use strict';
    
    var urlComponent;
    var results = {};
    
    if (id && isNaN(id)) {
     urlComponent = id;
     id = null;
    }
   
    var customerId = nlapiGetUser(),
        filters = [new nlobjSearchFilter("isinactive", null, "is", "F")],
        columns = [
         new nlobjSearchColumn("name").setSort(),
         new nlobjSearchColumn("custrecord_bb1_bpp_brand"),
         new nlobjSearchColumn("custrecord_bb1_bpp_brandimage"),
         new nlobjSearchColumn("custrecord_bb1_bpp_urlcomponent")
        ];
        
    if (id)
     filters.push(new nlobjSearchFilter("internalid", null, "anyof", id));
     
    if (urlComponent)
     filters.push(new nlobjSearchFilter("custrecord_bb1_bpp_urlcomponent", null, "is", urlComponent));
     
    var programmes = this.searchHelper2(filters, columns) || [];
    
    if (programmes.length) {
     results.programmes = programmes;
     results.breederprogramme = programmes[0].internalId || undefined;
     results.breederprogrammename = programmes[0].name || undefined;
    }
    else if (id || urlComponent) {
     throw notFoundError;
    }
    
    if (ModelsInit.session.isLoggedIn()) {

     var customerId = nlapiGetUser(),
         filters = [new nlobjSearchFilter("isinactive", null, "is", "F"),
                    new nlobjSearchFilter("isinactive", "custrecord_bb1_bpa_bpp", "is", "F"),
                    new nlobjSearchFilter("custrecord_bb1_bpa_approvalstatus", null, "anyof", "2"),
                    new nlobjSearchFilter("custrecord_bb1_bpa_customer", null, "anyof", customerId)],
         columns = this.getColumnsArray();
         
     if (applicationId)
      filters.push(new nlobjSearchFilter("internalid", null, "anyof", applicationId));
      
     if (id)
      filters.push(new nlobjSearchFilter("custrecord_bb1_bpa_bpp", null, "anyof", id));
      
     if (urlComponent)
      filters.push(new nlobjSearchFilter("custrecord_bb1_bpp_urlcomponent", "custrecord_bb1_bpa_bpp", "is", urlComponent));
      
     var applications = this.searchHelper(filters, columns) || [];
      
     if (applications.length) {
      results.applications = applications;
      results.applicationid = applications[0].internalId || undefined;
     }
     else if (applicationId) {// || urlComponent) {
      throw notFoundError;
     }
     
     //var litters = this.getLitters(applicationId);
     var litters = this.getLitters(results.applicationid);
     
     if (litters)
      results.litters = litters;
     
    }
    
    _.extend(results, this.getFields());
    
    return results;
   },
   
   getFields: function ()
   {
    'use strict';
    
    return {
     animalTypes: this.getAnimalTypes(),
     animalBreeds: this.getAnimalBreeds(),
     advertisingChannels: this.getAdvertisingChannels(),
     //leadSources: this.getLeadSources(),
     titles: this.getTitles()
    };
   },
   
   getColumnsArray: function ()
   {
    'use strict';

    return [
     new nlobjSearchColumn("custrecord_bb1_bpa_bpp").setSort(),
     new nlobjSearchColumn("custrecord_bb1_bpa_breedertype"),
     new nlobjSearchColumn("custrecord_bb1_bpa_displayname"),
     new nlobjSearchColumn("custrecord_bb1_bpa_breederregnumber"),
     new nlobjSearchColumn("custrecord_bb1_bpa_kennelname"),
     new nlobjSearchColumn("custrecord_bb1_bpa_breedername"),
     new nlobjSearchColumn("custrecord_bb1_bpa_rescuecentrename"),
     new nlobjSearchColumn("custrecord_bb1_bpa_regcharitynumber"),
     new nlobjSearchColumn("custrecord_bb1_bpa_breederwebsite"),
     new nlobjSearchColumn("custrecord_bb1_bpa_numberlittersperyear"),
     new nlobjSearchColumn("custrecord_bb1_bpa_animaltype"),
     new nlobjSearchColumn("custrecord_bb1_bpa_numberofcats"),
     new nlobjSearchColumn("custrecord_bb1_bpa_numberofmaledogs"),
     new nlobjSearchColumn("custrecord_bb1_bpa_numberoffemaledogs"),
     new nlobjSearchColumn("custrecord_bb1_bpa_breeds"),
     new nlobjSearchColumn("custrecord_bb1_bpa_breedsother"),
     new nlobjSearchColumn("custrecord_bb1_bpa_advertisingchannels"),
     new nlobjSearchColumn("custrecord_bb1_bpa_advertisingchanother"),
     new nlobjSearchColumn("custrecord_bb1_bpa_agreedtoterms"),
     new nlobjSearchColumn("custrecord_bb1_bpa_agreedtocommunication"),
     new nlobjSearchColumn("custrecord_bb1_bpa_leadsource"),
     new nlobjSearchColumn("custrecord_bb1_bpp_brand", "custrecord_bb1_bpa_bpp"),
     new nlobjSearchColumn("custrecord_bb1_bpp_brandimage", "custrecord_bb1_bpa_bpp"),
     new nlobjSearchColumn("custrecord_bb1_bpp_urlcomponent", "custrecord_bb1_bpa_bpp"),
     new nlobjSearchColumn("custrecord_bb1_bpp_petparentfirstpromo", "custrecord_bb1_bpa_bpp"),
     new nlobjSearchColumn("custrecord_bb1_bpp_petparentsecondpromo", "custrecord_bb1_bpa_bpp"),
     new nlobjSearchColumn("custrecord_bb1_bpp_breederfirstpromo", "custrecord_bb1_bpa_bpp"),
     new nlobjSearchColumn("custrecord_bb1_bpp_breedersecondpromo", "custrecord_bb1_bpa_bpp"),
     new nlobjSearchColumn("custrecord_bb1_bpp_breederannualpromo", "custrecord_bb1_bpa_bpp"),
     new nlobjSearchColumn("lastmodified")
    ];
   },
   
   searchHelper2: function (filters, columns, page)
   {
    'use strict';
    
    var self = this,
        programmes = Application.getAllSearchResults('customrecord_bb1_bpp', filters, columns);

    return _.map(programmes, function (programme)
    {
     return {
      internalId: programme.getId(),
      name: programme.getValue('name'),
      brand: {
       id: programme.getValue('custrecord_bb1_bpp_brand'),
       name: programme.getText('custrecord_bb1_bpp_brand')
      },
      brandImageUrl: programme.getText('custrecord_bb1_bpp_brandimage'),
      urlComponent: programme.getValue('custrecord_bb1_bpp_urlcomponent')
     };
    });
   },
   
   searchHelper: function (filters, columns, page)
   {
    'use strict';
    
    var self = this,
        applications = Application.getAllSearchResults('customrecord_bb1_bpa', filters, columns);

    return _.map(applications, function (application)
    {
     var lastModified = nlapiStringToDate(application.getValue('lastmodified'));
     
     return {
      internalId: application.getId(),
      name: application.getText('custrecord_bb1_bpa_bpp'),
      breederProgramme: {
       id: application.getValue('custrecord_bb1_bpa_bpp'),
       name: application.getText('custrecord_bb1_bpa_bpp')
      },
      brandImageUrl: application.getText('custrecord_bb1_bpp_brandimage', 'custrecord_bb1_bpa_bpp'),
      urlComponent: application.getValue('custrecord_bb1_bpp_urlcomponent', 'custrecord_bb1_bpa_bpp'),
      lastModified: lastModified ? nlapiDateToString(lastModified, 'datetime') : ''
     };
    });
   },
   
   getLitters: function (id)
   {
    'use strict';
    
    //if (!id) return;

    var self = this,
        customerId = nlapiGetUser(),
        filters = [
                   new nlobjSearchFilter("isinactive", null, "is", "F"),
                   new nlobjSearchFilter("isinactive", "custrecord_bb1_bppr_bpa", "is", "F"),
                   new nlobjSearchFilter("custrecord_bb1_bpa_approvalstatus", "custrecord_bb1_bppr_bpa", "anyof", "2"),
                   new nlobjSearchFilter("custrecord_bb1_bpa_customer", "custrecord_bb1_bppr_bpa", "anyof", customerId)
                  ],
        columns = [
                   new nlobjSearchColumn("internalid").setSort(),
                   new nlobjSearchColumn("custrecord_bb1_bppr_bpa"),
                   new nlobjSearchColumn("custrecord_bb1_bpa_bpp", "custrecord_bb1_bppr_bpa"),
                   new nlobjSearchColumn("custrecord_bb1_bppr_petparent"),
                   new nlobjSearchColumn("email", "custrecord_bb1_bppr_petparent"),
                   new nlobjSearchColumn("firstname", "custrecord_bb1_bppr_petparent"),
                   new nlobjSearchColumn("custrecord_bb1_bppr_litter").setSort(),
                   new nlobjSearchColumn("custrecord_bb1_bppr_litterdob"),
                   new nlobjSearchColumn("custrecord_bb1_bppr_pparentcodeclaimed_1"),
                   new nlobjSearchColumn("custrecord_bb1_bppr_pparentcodeclaimed_2"),
                   new nlobjSearchColumn("custrecord_bb1_bppr_breederccodeidsent_1"),
                   new nlobjSearchColumn("custrecord_bb1_bppr_breederccodesent_1"),
                   new nlobjSearchColumn("custrecord_bb1_bppr_breedercodeclaimed_1"),
                   new nlobjSearchColumn("custrecord_bb1_bppr_breederccodeidsent_2"),
                   new nlobjSearchColumn("custrecord_bb1_bppr_breederccodesent_2"),
                   new nlobjSearchColumn("custrecord_bb1_bppr_breedercodeclaimed_2"),
                   new nlobjSearchColumn("custrecord_bb1_bppr_blbsubscription"),
                   new nlobjSearchColumn("custrecord_bb1_bppr_bpp"),
                   new nlobjSearchColumn("custrecord_bb1_bpp_brand", "custrecord_bb1_bppr_bpp"),
                   new nlobjSearchColumn("custrecord_bb1_bpp_petparentfirstpromo", "custrecord_bb1_bppr_bpp"),
                   new nlobjSearchColumn("custrecord_bb1_bpp_petparentsecondpromo", "custrecord_bb1_bppr_bpp"),
                   new nlobjSearchColumn("custrecord_bb1_bpp_breederfirstpromo", "custrecord_bb1_bppr_bpp"),
                   new nlobjSearchColumn("custrecord_bb1_bpp_breedersecondpromo", "custrecord_bb1_bppr_bpp"),
                   new nlobjSearchColumn("custrecord_bb1_bpp_breederannualpromo", "custrecord_bb1_bppr_bpp"),
                  ];
                  
    if (id)
     filters.push(new nlobjSearchFilter("custrecord_bb1_bppr_bpa", null, "anyof", id));
        
    var litterSearchResults = Application.getAllSearchResults('customrecord_bb1_bppr', filters, columns),
        litters = [],
        petParents,
        previousLitter,
        rowIndex;

    _.each(litterSearchResults, function (litter)
    {
     var currentLitter = litter.getValue('custrecord_bb1_bppr_litter');
     
     if (currentLitter !== previousLitter) {
      previousLitter = currentLitter;
      petParents = [];
      rowIndex = 1;
      
      litters.push({
       litter: currentLitter,
       litterDob: litter.getValue('custrecord_bb1_bppr_litterdob'),
       petParents: petParents
      });
     }
     
     var petParent = {
      internalId: litter.getId(),
      name: 'Pet ' + rowIndex,
      petParent: litter.getValue('custrecord_bb1_bppr_petparent'),
      email: litter.getValue('email', 'custrecord_bb1_bppr_petparent'),
      firstName: litter.getValue('firstname', 'custrecord_bb1_bppr_petparent'),
      firstPromotionClaimed: litter.getValue('custrecord_bb1_bppr_pparentcodeclaimed_1') == 'T',
      secondPromotionClaimed: litter.getValue('custrecord_bb1_bppr_pparentcodeclaimed_2') == 'T',
      breederCouponCodeIdSent1: litter.getValue('custrecord_bb1_bppr_breederccodeidsent_1'),
      breederCouponCodeSent1: litter.getValue('custrecord_bb1_bppr_breederccodesent_1'),
      breederCouponCodeClaimed1: litter.getValue('custrecord_bb1_bppr_breedercodeclaimed_1') == 'T',
      breederCouponCodeIdSent2: litter.getValue('custrecord_bb1_bppr_breederccodeidsent_2'),
      breederCouponCodeSent2: litter.getValue('custrecord_bb1_bppr_breederccodesent_2'),
      breederCouponCodeClaimed2: litter.getValue('custrecord_bb1_bppr_breedercodeclaimed_2') == 'T',
      bottomlessBowlSubscription: litter.getValue('custrecord_bb1_bppr_blbsubscription') == 'T',
      breederProgramme: {
       id: litter.getValue('custrecord_bb1_bppr_bpp'),
       name: litter.getText('custrecord_bb1_bppr_bpp'),
       brandName: litter.getText('custrecord_bb1_bpp_brand', 'custrecord_bb1_bppr_bpp'),
       petParentPromoCode1: litter.getValue('custrecord_bb1_bpp_petparentfirstpromo', 'custrecord_bb1_bppr_bpp'),
       petParentPromoCode2: litter.getValue('custrecord_bb1_bpp_petparentsecondpromo', 'custrecord_bb1_bppr_bpp'),
       breederPromoCode1: litter.getValue('custrecord_bb1_bpp_breederfirstpromo', 'custrecord_bb1_bppr_bpp'),
       breederPromoCode2: litter.getValue('custrecord_bb1_bpp_breedersecondpromo', 'custrecord_bb1_bppr_bpp'),
       breederPromoCodeAnnual: litter.getValue('custrecord_bb1_bpp_breederannualpromo', 'custrecord_bb1_bppr_bpp')
      }
     };
     
     petParents.push(petParent);
     rowIndex++;
    });
    
    return litters;
   },
   
   getAnimalTypes: function ()
   {
    'use strict';
    
    var self = this,
        filters = [new nlobjSearchFilter('isinactive', null, 'is', 'F')],
        columns = [new nlobjSearchColumn('name')],
        results = Application.getAllSearchResults('customrecord_bb1_pet_typeanimals', filters, columns);

    return _.map(results, function (result)
    {
     return {
      internalId: result.getId(),
      name: result.getValue('name')
     };
    });
   },

   getAnimalBreeds: function ()
   {
    'use strict';
    
    var self = this,
        filters = [new nlobjSearchFilter('isinactive', null, 'is', 'F')],
        columns = [
                   new nlobjSearchColumn('name'),
                   new nlobjSearchColumn('custrecord_bb1_pet_breedof')
                  ],
        results = Application.getAllSearchResults('customrecord_bb1_pet_type_breed', filters, columns);

    var data =  _.map(results, function (result)
    {
     return {
      internalId: result.getId(),
      name: result.getValue('name'),
      animalType: result.getValue('custrecord_bb1_pet_breedof')
     };
    })
    
    data.push({
     internalId: 'other',
     name: 'Other'
    });
    
    return data;
   },

   getAdvertisingChannels: function ()
   {
    'use strict';

    var self = this,
        filters = [new nlobjSearchFilter('isinactive', null, 'is', 'F')],
        columns = [
                   new nlobjSearchColumn('internalid'),
                   new nlobjSearchColumn('name')
                  ],
        results = Application.getAllSearchResults('customrecord_bb1_bpac', filters, columns);

    var data = _.map(results, function (result)
    {
     return {
      internalId: result.getId(),
      name: result.getValue('name')
     };
    });
    
    data.push({
     internalId: 'other',
     name: 'Other'
    });
    
    return data;
   },

   getLeadSources: function ()
   {
    'use strict';

    return [
     {
      internalId: 'Test',
      name: 'Test'
     }
    ];
   },

   getTitles: function ()
   {
    'use strict';

    return [
     {
      internalId: 'Mr',
      name: 'Mr'
     },
     {
      internalId: 'Ms',
      name: 'Ms'
     },
     {
      internalId: 'Mrs',
      name: 'Mrs'
     }
    ];
   }

  });

 }
);

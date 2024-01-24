// @module bb1.PetshopShopping.NewsletterSignup
define(
	'bb1.PetshopShopping.NewsletterSignup',
	[
  'Newsletter.ServiceController',
  'Newsletter.Model',
  'Models.Init',
  'Configuration',
		'Application',
		'Utils',
		'underscore'
	],
	function (
  NewsletterServiceController,
  NewsletterModel,
  ModelsInit,
  Configuration,
		Application,
		Utils,
		_
	)
 {
  'use strict';
  
  _.extend(NewsletterServiceController, {
   
   post: function ()
			{
    console.log('NewsletterServiceController.post() override', JSON.stringify(this.data));
				return NewsletterModel.subscribe(this.data);
			}
   
  });
  
  _.extend(NewsletterModel, {
   
   subscribe: function subscribe (data)
   {

    console.log('NewsletterServiceController.subscribe() override', JSON.stringify(data));
    this.validate(data);

    var searchFilter = new nlobjSearchFilter('email', null, 'is', data.email)
    ,	searchColumnSubscriptionStatus = new nlobjSearchColumn('globalsubscriptionstatus')
    ,	customers = nlapiSearchRecord('customer', null, [searchFilter], [searchColumnSubscriptionStatus])

    //Searching by 'customer' returns 'customer' and 'lead' records alltogether,
    //so we group the records by recordtype: i.e.: 'customer' and 'lead' groups.
    ,	records = _.groupBy(customers, function (customer)
     {
      return customer.getRecordType();
     });

    //If there's NOT any customer or lead with this email, we set up a lead with globalsubscriptionstatus = 1
    if (!records.customer && !records.lead)
    {
     return this.createSubscription(data);
    }
    else
    {
     return records.customer ? this.updateSubscription(records.customer) : this.updateSubscription(records.lead);
    }
   },

   // @method createSubscription Create a new 'lead' record with globalsubscriptionstatus = 1 (Soft Opt-In)
   // @parameter {String} email
   // @returns {subscriptionDone} Custom object with confirmation of lead record creation
  	createSubscription: function createSubscription (data)
   {
    console.log('NewsletterServiceController.createSubscription() override', JSON.stringify(data));
    var record = nlapiCreateRecord('lead');
    record.setFieldValue('entityid', data.email);
    record.setFieldValue('firstname', data.firstname || Configuration.get('newsletter.genericFirstName'));
    record.setFieldValue('lastname', '.'); //Configuration.get('newsletter.genericLastName'));
    record.setFieldValue('email', data.email);
    record.setFieldValue('subsidiary', ModelsInit.session.getShopperSubsidiary());
    //record.setFieldValue('companyname', Configuration.get('newsletter.companyName'));
    record.setFieldValue('globalsubscriptionstatus', 1);
    nlapiSubmitRecord(record);
    return this.subscriptionDone;
   }
  });
  
 }
);

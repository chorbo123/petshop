// @module bb1.PetshopShopping.SubscriptionOrders
define(
	'bb1.PetshopShopping.SubscriptionOrders.Settings.Model',
	[
		'SC.Model',
		'Application',
		'Models.Init',
		'SiteSettings.Model',
		'Utils',
		'underscore'
	],
	function (
		SCModel,
		Application,
		ModelsInit,
		SiteSettings,
		Utils,
		_
	)
 {
  'use strict';

  // @extends SCModel
  return SCModel.extend({

   name: 'bb1.PetshopShopping.SubscriptionOrders.Settings',

   get: function ()
   {
    'use strict';

    var result = {};
    
    result.orderSchedules = this.getOrderSchedules();
    result.petNames = this.getPetNames();
    
    return result;
   },
   
   getOrderSchedules: function ()
   {
    var orderScheduleFilters = [new nlobjSearchFilter("isinactive", null, "is", "F")],
        orderScheduleColumns = [new nlobjSearchColumn("internalid").setSort(),
                                new nlobjSearchColumn("name"),
                                new nlobjSearchColumn("custrecord_bb1_blbi_os_scheduleindays")],
        orderScheduleResults = Application.getAllSearchResults("customrecord_bb1_blbi_orderschedule", orderScheduleFilters, orderScheduleColumns);

    return _.map(orderScheduleResults, function (orderSchedule) {
     return {id: orderSchedule.getId(),
             name: orderSchedule.getValue("name"),
             scheduleindays: orderSchedule.getValue("custrecord_bb1_blbi_os_scheduleindays")};
    });
   },
   
   getPetNames: function ()
   {
    var customerId = nlapiGetUser(),
        petNameFilters = [new nlobjSearchFilter('isinactive', null, 'is', 'F'), new nlobjSearchFilter('custrecord_bb1_pet_deceased', null, 'is', 'F'), new nlobjSearchFilter('custrecord_bb1_pet_customer', null, 'anyof', customerId)],
        petNameColumns = [new nlobjSearchColumn('custrecord_bb1_pet_name').setSort()],
        petNameResults = Application.getAllSearchResults('customrecord_bb1_pet', petNameFilters, petNameColumns) || [];
        
    if (petNameResults.length == 1) {
     var petNames = petNameResults[0].getValue('custrecord_bb1_pet_name');
    }
    else {
     var petNames = _.reduce(petNameResults, function (memo, petNameResult, index) {
      var petName = petNameResult.getValue('custrecord_bb1_pet_name');
      
      if (index == petNameResults.length - 1)
       return memo + petName;
      else if (index == petNameResults.length - 2)
       return memo + petName + ' & ';
      else
       return memo + petName + ', ';
     }, '');
    }
    
    return petNames || '';
   }

  });

 }
);

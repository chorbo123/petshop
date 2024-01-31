// @module bb1.PetshopShopping.Prescriptions
define(
	'bb1.PetshopShopping.Prescriptions.Order.Model',
	[
		'bb1.PetshopShopping.Pets.Model',
		'SC.Model',
		'Application',
		'Profile.Model',
		'StoreItem.Model',
		'Models.Init',
		'SiteSettings.Model',
		'Utils',
		'underscore'
	],
	function (
  PetsModel,
		SCModel,
		Application,
		Profile,
		StoreItem,
		ModelsInit,
		SiteSettings,
		Utils,
		_
	)
{
	'use strict';

	// @extends SCModel
	return SCModel.extend({

		name: 'bb1.PetshopShopping.Prescriptions.Order',
			
		get: function (id)
		{
			'use strict';

			//if (!id)
			//	throw notFoundError;
			
			if (!ModelsInit.session.isLoggedIn2())
				throw unauthorizedError;

   var result = {};

			try {
			
   if (id) {
    var customerId = nlapiGetUser(),
        filters = [new nlobjSearchFilter("mainline", null, "is", "F"),
                   //new nlobjSearchFilter("taxline", null, "is", "F"),
                   //new nlobjSearchFilter("cogs", null, "is", "F"),
                   new nlobjSearchFilter("memorized", null, "is", "F"),
                   new nlobjSearchFilter("entity", null, "anyof", customerId),
                   new nlobjSearchFilter("internalid", null, "anyof", id),
                   new nlobjSearchFilter("custitem_bb1_psi_treatmenttype", "item", "noneof", "@NONE@")],
        columns = this.getColumnsArray();
        
    result = {internalid: id};

    result.prescriptionItems = this.searchHelper(filters, columns, "all");
    
    //if (!result.prescriptionItems.length)
    // return result;
   }
			
			result.pets = (PetsModel.get() || {}).pets;
			
			}
			catch(e) {
    var errorMessage = e && e.getDetails ? e.getDetails : e;
				nlapiLogExecution("DEBUG", "error occurred in PrescriptionOrder.get", errorMessage);
				return {errorCode: e.getCode && e.getCode() || '', errorMessage: errorMessage};
			}
			
			return result;
		},
		
		getColumnsArray: function ()
		{
			'use strict';

			return [
				new nlobjSearchColumn("line").setSort(),
				new nlobjSearchColumn("item"),
				new nlobjSearchColumn("quantity"),
				new nlobjSearchColumn("storedisplayname", "item"),
				new nlobjSearchColumn("custitem_bb1_psi_treatmenttype", "item"),
				new nlobjSearchColumn("custitem_bb1_psi_itemsperpack", "item"),
				new nlobjSearchColumn("custitem_bb1_psi_weightpertablet", "item")
			];
		},
		
		searchHelper: function (filters, columns, page)
		{
			'use strict';
			
			var self = this,
							result = Application.getAllSearchResults('salesorder', filters, columns);

			return _.map(result, function (item)
			{
				var lineId = item.getValue('line'),
								quantity = parseInt(item.getValue('quantity')) || 1,
								itemsPerPack = parseInt(item.getValue('custitem_bb1_psi_itemsperpack', 'item')) || 1,
								totalTreatments = quantity * itemsPerPack,
								newItem = {
									internalid: lineId,
									salesorder: item.getId(),
									line: lineId,
									item: item.getValue('item'),
									itemname: item.getValue('storedisplayname', 'item'),
									treatmenttype: item.getValue('custitem_bb1_psi_treatmenttype', 'item'),
									itemsperpack: itemsPerPack,
									dosageperitem: item.getValue('custitem_bb1_psi_weightpertablet', 'item'),
									totaltreatments: totalTreatments
								};
				
				return newItem;
			});
		}

 });

});

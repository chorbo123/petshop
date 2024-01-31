// @module bb1.PetshopShopping.SmsSubscription
define(
	'bb1.PetshopShopping.SmsSubscription',
	[
  'Account.Model',
  'LiveOrder.Model',
  'Application',
  'Configuration',
		'Utils',
		'Models.Init',
  'StoreItem.Model',

		'underscore'
	],
	function (
  AccountModel,
  LiveOrderModel,
		Application,
  Configuration,
		Utils,
  ModelsInit,
  StoreItem,

 	_
	)
 {
  'use strict';
  
  function getMobilePhoneFields() {
   
   var customFields = ModelsInit.customer.getCustomFieldValues() || {};
   var orderCustomFields = ModelsInit.order.getCustomFieldValues() || {};
   var fullMobilePhone = (_.findWhere(customFields, {'name': 'custentity_bb1_mobilephone'}) || {}).value || '';
   var smsSubscribe = (_.findWhere(customFields, {'name': 'custentity_bb1_smsoptin'}) || {}).value || '';
   var smsTransSubscribe = (_.findWhere(orderCustomFields, {'name': 'custbody_bb1_smstransoptin'}) || {}).value || '';
   var mobilePhone = '';
   var mobilePhoneCallingCode = '';
   
   //console.log('getMobilePhoneFields - fullMobilePhone/smsSubscribe/smsTransSubscribe', fullMobilePhone + '/' + smsSubscribe + '/' + smsTransSubscribe);
   
   var callingCodes = Configuration.get('countryCallingCodes.callingCodes') || [];
   
   _.each(callingCodes, function(callingCode) {
    var callingCodeLength = callingCode.callingCode.length;
    var callingCodeToTest = fullMobilePhone.substr(0, callingCodeLength);
    if (callingCode.callingCode == callingCodeToTest) {
     mobilePhoneCallingCode = callingCode.callingCode;
     mobilePhone = fullMobilePhone.substr(callingCodeLength);
     return false;
    }
   });
   
   return {
    mobilephonecallingcode: mobilePhoneCallingCode,
    mobilephone: mobilePhone,
    fullmobilephone: fullMobilePhone,
    smssubscribe: smsTransSubscribe == 'T'
   };
   
  }
  
  Application.on('after:Account.register', function(model, result, data) {

   //console.log('after:Account.register - data', JSON.stringify(data));
   //console.log('after:Account.register - mobilePhone no string casting', data.mobilephone && data.mobilephonecallingcode ? data.mobilephonecallingcode + data.mobilephone : '');
   
   var mobilePhone = data.mobilephone && data.mobilephonecallingcode ? String(data.mobilephonecallingcode + data.mobilephone) : '';
   
   //console.log('after:Account.register - mobilePhone cast', mobilePhone);
   
   ModelsInit.customer.updateProfile({
    /*phoneinfo: {
     phone: mobilePhone //data.mobilephone && data.mobilephonecallingcode ? data.mobilephonecallingcode + data.mobilephone : ''
     //altphone: data.mobilephone ? data.mobilephone : data.mobilephone,
     //mobilephone: data.mobilephone ? data.mobilephone : ''
    },*/
    customfields: {
     custentity_bb1_mobilephone: mobilePhone,
     custentity_bb1_smsoptin: (data.smssubscribe && data.smssubscribe !== 'F') ? 'T' : 'F'
    }
   });

  });

  Application.on('after:LiveOrder.get', function (model, result)
  {
   
   _.extend(result, getMobilePhoneFields());
   
   //console.log('after:Account.register - data', JSON.stringify(result));
   
  });
  
  Application.on('before:LiveOrder.update', function (model, data)
  {
   //console.log('before:LiveOrder.update data', JSON.stringify(data));
   var mobilePhoneFields = getMobilePhoneFields();
   var mobilePhone = data.mobilephone && data.mobilephonecallingcode ? String(data.mobilephonecallingcode + data.mobilephone) : '';
  
   if (model.isSecure) {
    //console.log('before:LiveOrder.update set custbody_bb1_smstransoptin', (data.smssubscribe && data.smssubscribe !== 'F') ? 'T' : 'F');
    ModelsInit.order.setCustomFieldValues({'custbody_bb1_smstransoptin': (data.smssubscribe && data.smssubscribe !== 'F') ? 'T' : 'F'});
   }
   
   if (mobilePhoneFields.fullmobilephone != mobilePhone || mobilePhoneFields.smssubscribe != data.smssubscribe) {
    
    ModelsInit.customer.updateProfile({
     /*phoneinfo: {
      phone: mobilePhone //data.mobilephone && data.mobilephonecallingcode ? data.mobilephonecallingcode + data.mobilephone : ''
      //altphone: data.mobilephone ? data.mobilephone : data.mobilephone,
      //mobilephone: data.mobilephone ? data.mobilephone : ''
     },*/
     customfields: {
      custentity_bb1_mobilephone: mobilePhone
      //custentity_bb1_smsoptin: (data.smssubscribe && data.smssubscribe !== 'F') ? 'T' : 'F'
     }
    });

   }
  });
  
  Application.on('after:LiveOrder.confirmationCreateResult', function (model, result, placed_order)
  {
   //console.log('after:LiveOrder.confirmationCreateResult result', JSON.stringify(result));
   
   var itemIds = [];
   var itemTypeLookup = {};
   
			for (i = 1; i <= placed_order.getLineItemCount('item'); i++)
			{
    var itemId = placed_order.getLineItemValue('item', 'item', i);
    var itemType = placed_order.getLineItemValue('item', 'itemtype', i);
				itemIds.push({id: itemId, type: itemType});
				itemTypeLookup[itemId] = itemType;
			}

   //console.log('after:LiveOrder.confirmationCreateResult after itemIds', JSON.stringify(itemIds));
   //console.log('after:LiveOrder.confirmationCreateResult after itemTypeLookup', JSON.stringify(itemTypeLookup));
   
			/*_.each(result.lines, function (line)
			{
				itemIds.push(line.item.id);
			});*/

			StoreItem.preloadItems(itemIds);

			_.each(result.lines, function (line)
			{
				line.item = StoreItem.get(line.item.internalid, itemTypeLookup[line.item.internalid]);
    line.options = model.parseLineOptionsFromSuiteScript(line.options);
			});

   //console.log('after:LiveOrder.confirmationCreateResult after result', JSON.stringify(result));
   
  });
  
 }
);

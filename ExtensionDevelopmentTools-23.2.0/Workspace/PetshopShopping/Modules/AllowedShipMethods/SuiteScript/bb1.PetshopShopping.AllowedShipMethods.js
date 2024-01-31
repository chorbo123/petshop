// @module bb1.PetshopShopping.AllowedShipMethods
define(
	'bb1.PetshopShopping.AllowedShipMethods',
	[
  'LiveOrder.Model',
  'Application',
  'Configuration',
		'Utils',
		'Models.Init',

		'underscore'
	],
	function (
  LiveOrderModel,
		Application,
  Configuration,
		Utils,
  ModelsInit,

 	_
	)
 {
  'use strict';
  
  Application.on('after:LiveOrder.getShipMethods', function (model, shipmethods, order_fields)
  {
   //console.log('LiveOrder.getShipMethods order_fields.shipmethods.length', order_fields && order_fields.shipmethods && order_fields.shipmethods.length);
   
   //console.log('LiveOrder.getShipMethods allowedShipMethods', JSON.stringify(allowedShipMethods));
   
   //console.log('allowedShipMethods', JSON.stringify(allowedShipMethods));
  
   try {
      
    var allowedShipMethods = Configuration.get('allowedShipMethods') || [];
    var shipMethodWeightLimits = Configuration.get('shipMethodWeightLimits') || [];
    var filteredShipMethods = allowedShipMethods.slice();
    var shipMethodWeightLimitsLookup = {};
    
       //console.log('shipMethodWeightLimits: ', JSON.stringify(shipMethodWeightLimits));
    _.each(shipMethodWeightLimits, function(weightLimit) {
     shipMethodWeightLimitsLookup[weightLimit.internalId.toString()] = weightLimit;
    });
    
       //console.log('shipMethodWeightLimitsLookup: ', JSON.stringify(shipMethodWeightLimitsLookup));
       
    //this.checkSaturdayShippingAllowed(filteredShipMethods);
    // check if any cart items locations are not warehouse or insufficient quantity
    
    var warehouseLocationId = Configuration.get('warehouseLocationId') || '';
    var saturdayShipMethodId = Configuration.get('saturdayShipMethodId') || '';
    var cartInStockAtWarehouse = true;
    var cartWeight = 0;
    var lines = model.getLines(order_fields);
    
    for (var i=0; i < lines.length; i++) {
     var line = lines[i] || {};
     var item = line.item || {};
     var quantityAvailableDetail = item.quantityavailable_detail || {};
     var quantityAvailableLocations = quantityAvailableDetail.locations || [];
     var quantityAvailableAtWarehouse = 0;
     var lineWeight = (item.weight / (item.weightunit != 'kg' ? 1000 : 1)) * line.quantity;
     
     cartWeight += lineWeight || 0;
     
     for (var j=0; j < quantityAvailableLocations.length; j++) {
      var quantityAvailableLocation = quantityAvailableLocations[j];
      
      if (quantityAvailableLocation.internalid == warehouseLocationId) {
       quantityAvailableAtWarehouse = quantityAvailableLocation.quantityavailable;
      }
     }
     
     //console.log('line='+i, 'lineWeight='+lineWeight);
     //console.log('line='+i, 'line.quantity='+line.quantity+', quantityAvailableAtWarehouse='+quantityAvailableAtWarehouse);
     
     if (quantityAvailableAtWarehouse < line.quantity) {
      cartInStockAtWarehouse = false;
     }
    }
     //console.log('cartWeight=',cartWeight);
    
    if (!cartInStockAtWarehouse)
     filteredShipMethods.splice(filteredShipMethods.indexOf(saturdayShipMethodId), 1);
    
    //console.log('cartInStockAtWarehouse='+cartInStockAtWarehouse, JSON.stringify(filteredShipMethods));
    
    var websiteAccessId = Configuration.get('websiteAccess.internalId') || '';
    
    //console.log('LiveOrder.getShipMethods websiteAccessId', websiteAccessId);
    
    var shipaddress = order_fields && order_fields.shipaddress || '';
    
    //console.log('LiveOrder.getShipMethods shipaddressid', shipaddress);
    
    //var address_book = ModelsInit.session.isLoggedIn2() && model.isSecure ? ModelsInit.customer.getAddressBook() : [];

    //console.log('LiveOrder.getShipMethods JSON.stringify(address_book)', JSON.stringify(address_book));
    //address_book = _.object(_.pluck(address_book, 'internalid'), address_book);
    
    //var shipaddress = address_book[shipaddressid] || {};
    var country = shipaddress.country || '';
    var postcode = shipaddress.zip || '';
    var countries = ModelsInit.session.getCountries() || [];
    var countryName = (_.findWhere(countries, {code: country}) || {}).name || '';
    var dummyRec = nlapiCreateRecord('customrecord_bb1_sp');
    
    dummyRec.setFieldText('custrecord_bb1_sp_countries', countryName);
    
    var countryId = dummyRec.getFieldValue('custrecord_bb1_sp_countries');
    
    //console.log('LiveOrder.getShipMethods countryId/country/countryName/postcode', countryId + '/' + country + '/' + countryName + '/' + postcode);
    
    if (countryId) {
     var filters = [
                    ['isinactive', 'is', 'F'], 'and',
                    ['custrecord_bb1_po_website', 'anyof', websiteAccessId], 'and',
                    ['custrecord_bb1_sp_countries', 'anyof', countryId]/*, 'and',
                    [
                     [
                      ['custrecord_bb1_sp_postcodeouters', 'anyof', '1'], 'and',
                      ['custrecord_bb1_sp_excludepostcodes', 'is', 'F']
                     ], 'or',
                     [
                      ['formulanumeric:REGEXP_INSTR(\''+postcode+'\', \'^(REPLACE({custrecord_bb1_sp_postcodeouters}, \',\', \')|(\'))*\')', 'equalto', '1'], 'and',
                      ['custrecord_bb1_sp_excludepostcodes', 'is', 'F']
                     ], 'or',
                     [
                      ['formulanumeric:REGEXP_INSTR(\''+postcode+'\', \'^(REPLACE({custrecord_bb1_sp_postcodeouters}, \',\', \')|(\'))*\')', 'notequalto', '1'], 'and',
                      ['custrecord_bb1_sp_excludepostcodes', 'is', 'T']
                     ]
                    ]*/
                   ];
     var columns = [new nlobjSearchColumn("custrecord_bb1_sp_countries"),
                    new nlobjSearchColumn("custrecord_bb1_sp_postcodeouters"),
                    new nlobjSearchColumn("custrecord_bb1_sp_excludepostcodes"),
                    new nlobjSearchColumn("custrecord_bb1_sp_shippingmethod")];
     var shippingPostcodeSearchResults = nlapiSearchRecord("customrecord_bb1_sp", null, filters, columns) || [];
     
     for (var i=0, l=shippingPostcodeSearchResults.length; i < l; i++) {
      var shippingPostcodeSearchResult = shippingPostcodeSearchResults[i];
      var shipMethodId = shippingPostcodeSearchResult.getValue('custrecord_bb1_sp_shippingmethod');
      var allowedShipMethodIndex = filteredShipMethods.indexOf(shipMethodId);
      
      if (allowedShipMethodIndex != -1) {
       var postcodeOuters = shippingPostcodeSearchResult.getText('custrecord_bb1_sp_postcodeouters').split(/,/) || [];
       //var postcodeOutersRegex = new RegExp('^('+postcodeOuters.join(')|(')+').*', 'i');
       var postcodeOutersRegex = new RegExp('^'+postcodeOuters.join('|^')+'.*', 'i');
       var excludePostcodes = shippingPostcodeSearchResult.getValue('custrecord_bb1_sp_excludepostcodes') == 'T';
       var shipMethodWeightLimit = shipMethodWeightLimitsLookup[shipMethodId.toString()] || {};
       var minWeight = parseFloat(shipMethodWeightLimit.minWeight, 10) || 0;
       var maxWeight = parseFloat(shipMethodWeightLimit.maxWeight, 10) || Infinity;
       
       //console.log('shipMethodWeightLimit: ', JSON.stringify(shipMethodWeightLimit));
       //console.log('cartWeight/minWeight/maxWeight/minWeight <= cartWeight && cartWeight <= maxWeight: ', cartWeight + '/' + minWeight + '/' + maxWeight + '/' + (minWeight <= cartWeight && cartWeight <= maxWeight));
       //console.log('postcodeOutersRegex: ', postcodeOutersRegex.toString());
       
       if (((postcodeOutersRegex.test('All Postcodes') && !excludePostcodes) ||
            (postcode && postcodeOutersRegex.test(postcode) && !excludePostcodes) ||
            (postcode && !postcodeOutersRegex.test(postcode) && excludePostcodes)) &&
           (minWeight <= cartWeight && cartWeight <= maxWeight)) {
        //filteredShipMethods.push(shipMethodId);
        // leave it 
        //console.log('postcode match - leaving : ', shipMethodId);
       }
       else {
        filteredShipMethods.splice(allowedShipMethodIndex, 1);
        //console.log('Removing shipmethod id:', shipMethodId);
       }
      }
      else {
       //console.log('Offline - not added - shipmethod id:', shipMethodId);
      }
     }
    }
    
    //console.log('filteredShipMethods', JSON.stringify(filteredShipMethods));
    
   }
   catch (e) {
    //console.log('error thrown', e && e.getDetails ? e.getDetails() : e);
   }
   
   shipmethods = shipmethods || [];
   
   shipmethodsClone = shipmethods.slice(0);
   
   shipmethods.length = 0;
   
   _.each(shipmethodsClone, function (shipmethod)
   {
    if (filteredShipMethods.indexOf(shipmethod.internalid) != -1)
     shipmethods.push(shipmethod);
   });

   //console.log('LiveOrder.getShipMethods shipmethods', JSON.stringify(shipmethods));
  });
  
 }
);

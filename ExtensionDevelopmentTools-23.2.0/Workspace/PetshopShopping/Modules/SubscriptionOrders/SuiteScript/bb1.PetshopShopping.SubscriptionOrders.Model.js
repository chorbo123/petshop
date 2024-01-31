// @module bb1.PetshopShopping.SubscriptionOrders
define(
	'bb1.PetshopShopping.SubscriptionOrders.Model',
	[
  'bb1.PetshopShopping.SubscriptionOrders.Settings.Model',
		'SC.Model',
		'Application',
		'CreditCard.Model',
		'Profile.Model',
		'StoreItem.Model',
		'Models.Init',
		'SiteSettings.Model',
  'Configuration',
		'Utils',
		'underscore'
	],
	function (
  SubscriptionOrdersSettingsModel,
		SCModel,
		Application,
  CreditCardModel,
		Profile,
		StoreItem,
		ModelsInit,
		SiteSettings,
  Configuration,
		Utils,
		_
	)
 {
  'use strict';

  _.validateNextOrderDate = function (value, valName, form) {
   var newDate = value && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value) && nlapiStringToDate(value, 'date'),
       today = new Date(),
       selectedOrderSchedule = form.orderschedule,
       scheduleForSetDate = form.scheduleforsetdate === 'T',
       scheduledDayOfMonth = parseInt(form.scheduleddayofmonth),
       subscriptionOrderSettings = SubscriptionOrdersSettingsModel.get() || {},
       orderSchedules = subscriptionOrderSettings.orderSchedules || {},
       orderScheduleInDays = (_.findWhere(orderSchedules, {id: selectedOrderSchedule}) || {}).scheduleindays || 1,
       canScheduleMonthly = orderScheduleInDays % 28 === 0,
       lastDateOfMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
       
   if (!newDate || newDate.getTime() <= today.getTime())
    return 'Valid Next Order Date is required';
   else if (canScheduleMonthly && scheduleForSetDate && newDate.getDate() !== Math.min(scheduledDayOfMonth, lastDateOfMonth))
    return 'Next Order Date must be on the selected Day of Month';
  };

  _.validateItem = function (value, valName, form) {
   return !form.internalid && !value ? _('Item is required').translate() : null;
  }
  
  // @extends SCModel
  return SCModel.extend({

   name: 'bb1.PetshopShopping.SubscriptionOrders',
   
   validation: {
    //internalid: { required: true, msg: 'Internal ID is required' },
    item: { fn: _.validateItem },
    quantity: { required: true, msg: 'Quantity is required' },
    orderschedule: { required: true, msg: 'Order Schedule is required' },
    nextorderdate: { fn: _.validateNextOrderDate }
   },
   
   countryCodeNames: {"AF":"Afghanistan","AX":"Aland Islands","AL":"Albania","DZ":"Algeria","AS":"American Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarctica","AG":"Antigua and Barbuda","AR":"Argentina","AM":"Armenia","AW":"Aruba","AU":"Australia","AT":"Austria","AZ":"Azerbaijan","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BY":"Belarus","BE":"Belgium","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BQ":"Bonaire, Saint Eustatius and Saba","BA":"Bosnia and Herzegovina","BW":"Botswana","BV":"Bouvet Island","BR":"Brazil","IO":"British Indian Ocean Territory","BN":"Brunei Darussalam","BG":"Bulgaria","BF":"Burkina Faso","BI":"Burundi","KH":"Cambodia","CM":"Cameroon","CA":"Canada","IC":"Canary Islands","CV":"Cape Verde","KY":"Cayman Islands","CF":"Central African Republic","EA":"Ceuta and Melilla","TD":"Chad","CL":"Chile","CN":"China","CX":"Christmas Island","CC":"Cocos (Keeling) Islands","CO":"Colombia","KM":"Comoros","CD":"Congo, Democratic Republic of","CG":"Congo, Republic of","CK":"Cook Islands","CR":"Costa Rica","CI":"Cote d'Ivoire","HR":"Croatia/Hrvatska","CU":"Cuba","CW":"Curaçao","CY":"Cyprus","CZ":"Czech Republic","DK":"Denmark","DJ":"Djibouti","DM":"Dominica","DO":"Dominican Republic","TL":"East Timor","EC":"Ecuador","EG":"Egypt","SV":"El Salvador","GQ":"Equatorial Guinea","ER":"Eritrea","EE":"Estonia","ET":"Ethiopia","FK":"Falkland Islands","FO":"Faroe Islands","FJ":"Fiji","FI":"Finland","FR":"France","GF":"French Guiana","PF":"French Polynesia","TF":"French Southern Territories","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GL":"Greenland","GD":"Grenada","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GG":"Guernsey","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HM":"Heard and McDonald Islands","VA":"Holy See (City Vatican State)","HN":"Honduras","HK":"Hong Kong","HU":"Hungary","IS":"Iceland","IN":"India","ID":"Indonesia","IR":"Iran (Islamic Republic of)","IQ":"Iraq","IE":"Ireland","IM":"Isle of Man","IL":"Israel","IT":"Italy","JM":"Jamaica","JP":"Japan","JE":"Jersey","JO":"Jordan","KZ":"Kazakhstan","KE":"Kenya","KI":"Kiribati","KP":"Korea, Democratic People's Republic","KR":"Korea, Republic of","XK":"Kosovo","KW":"Kuwait","KG":"Kyrgyzstan","LA":"Lao People's Democratic Republic","LV":"Latvia","LB":"Lebanon","LS":"Lesotho","LR":"Liberia","LY":"Libya","LI":"Liechtenstein","LT":"Lithuania","LU":"Luxembourg","MO":"Macau","MK":"Macedonia","MG":"Madagascar","MW":"Malawi","MY":"Malaysia","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall Islands","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","MX":"Mexico","FM":"Micronesia, Federal State of","MD":"Moldova, Republic of","MC":"Monaco","MN":"Mongolia","ME":"Montenegro","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","MM":"Myanmar (Burma)","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","AN":"Netherlands Antilles (Deprecated)","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","NF":"Norfolk Island","MP":"Northern Mariana Islands","NO":"Norway","OM":"Oman","PK":"Pakistan","PW":"Palau","PA":"Panama","PG":"Papua New Guinea","PY":"Paraguay","PE":"Peru","PH":"Philippines","PN":"Pitcairn Island","PL":"Poland","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","RE":"Reunion Island","RO":"Romania","RU":"Russian Federation","RW":"Rwanda","BL":"Saint Barthélemy","SH":"Saint Helena","KN":"Saint Kitts and Nevis","LC":"Saint Lucia","MF":"Saint Martin","VC":"Saint Vincent and the Grenadines","WS":"Samoa","SM":"San Marino","ST":"Sao Tome and Principe","SA":"Saudi Arabia","SN":"Senegal","RS":"Serbia","CS":"Serbia and Montenegro (Deprecated)","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SX":"Sint Maarten","SK":"Slovak Republic","SI":"Slovenia","SB":"Solomon Islands","SO":"Somalia","ZA":"South Africa","GS":"South Georgia","SS":"South Sudan","ES":"Spain","LK":"Sri Lanka","PM":"St. Pierre and Miquelon","PS":"State of Palestine","SD":"Sudan","SR":"Suriname","SJ":"Svalbard and Jan Mayen Islands","SZ":"Swaziland","SE":"Sweden","CH":"Switzerland","SY":"Syrian Arab Republic","TW":"Taiwan","TJ":"Tajikistan","TZ":"Tanzania","TH":"Thailand","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad and Tobago","TN":"Tunisia","TR":"Turkey","TM":"Turkmenistan","TC":"Turks and Caicos Islands","TV":"Tuvalu","UG":"Uganda","UA":"Ukraine","AE":"United Arab Emirates","GB":"United Kingdom","US":"United States","UY":"Uruguay","UM":"US Minor Outlying Islands","UZ":"Uzbekistan","VU":"Vanuatu","VE":"Venezuela","VN":"Vietnam","VG":"Virgin Islands (British)","VI":"Virgin Islands (USA)","WF":"Wallis and Futuna","EH":"Western Sahara","YE":"Yemen","ZM":"Zambia","ZW":"Zimbabwe"},

   get: function (id)
   {
    'use strict';

    if (!ModelsInit.session.isLoggedIn())
     throw unauthorizedError;

    var customerId = nlapiGetUser(),
        filters = [new nlobjSearchFilter("custrecord_bb1_blbi_customer", null, "anyof", customerId)],
        columns = this.getColumnsArray();
        
    if (id)
     filters.push(new nlobjSearchFilter("internalid", null, "anyof", id));
     
    var result = this.searchHelper(filters, columns, "all");
    
    if (id) {
     if (result.records.length) {
      record = result.records[0];
      record.orders = this.getOrdersForItem(id);
      return record;
     }
     else {
      throw notFoundError;
     }
    }
    
    result.petNames = this.getPetNames();
    
    return result;
   },
   
   getColumnsArray: function ()
   {
    'use strict';

    return [
     new nlobjSearchColumn("custrecord_bb1_blbi_customer"),
     new nlobjSearchColumn("isinactive").setSort(),
     new nlobjSearchColumn("internalid").setSort(true),
     new nlobjSearchColumn("custrecord_bb1_blbi_item"),
     new nlobjSearchColumn("custrecord_bb1_blbi_quantity"),
     new nlobjSearchColumn("custrecord_bb1_blbi_orderschedule"),
     new nlobjSearchColumn("custrecord_bb1_blbi_scheduleforsetdate"),
     new nlobjSearchColumn("custrecord_bb1_blbi_scheduleddayofmonth"),
     new nlobjSearchColumn("custrecord_bb1_blbi_startdate"),
     new nlobjSearchColumn("custrecord_bb1_blbi_lastdateordered"),
     new nlobjSearchColumn("custrecord_bb1_blbi_nextorderdate"),
     new nlobjSearchColumn("custrecord_bb1_blbi_createdfrom"),
     new nlobjSearchColumn("type", "custrecord_bb1_blbi_item"),
     new nlobjSearchColumn("parent", "custrecord_bb1_blbi_item"),
     new nlobjSearchColumn("storedisplaythumbnail", "custrecord_bb1_blbi_item"),
     new nlobjSearchColumn("storedisplayimage", "custrecord_bb1_blbi_item"),
     new nlobjSearchColumn("thumbnailurl", "custrecord_bb1_blbi_item"),
     new nlobjSearchColumn("imageurl", "custrecord_bb1_blbi_item"),
     new nlobjSearchColumn("lastmodified")
    ];
   },
   
   searchHelper: function (filters, columns, page)
   {
    'use strict';
    
    var self = this,
        include_store_item = true
        storeItemReferences = [],
        result = page == "all" ? {records: Application.getAllSearchResults('customrecord_bb1_blbi', filters, columns)} : Application.getPaginatedSearchResults({
         record_type: 'customrecord_bb1_blbi',
         filters: filters,
         columns: columns,
         page: page
        });

    result.records = _.map(result.records, function (item) //result.items
    {
     var current_record_id = item.getId(),
         itemId = item.getValue('custrecord_bb1_blbi_item'),
         itemName = item.getText('custrecord_bb1_blbi_item'),
         itemType = item.getValue('type', 'custrecord_bb1_blbi_item'),
         itemMatrixParent = item.getValue('parent', 'custrecord_bb1_blbi_item'),
         startDate = nlapiStringToDate(item.getValue('custrecord_bb1_blbi_startdate')),
         lastOrderDate = nlapiStringToDate(item.getValue('custrecord_bb1_blbi_lastdateordered')),
         nextOrderDate = nlapiStringToDate(item.getValue('custrecord_bb1_blbi_nextorderdate')),
         lastModified = nlapiStringToDate(item.getValue('lastmodified')),
         item = {
          internalid: current_record_id,
          item: itemId,
          item_text: itemName,
          itemtype: itemType,
          itemparent: itemMatrixParent,
          quantity: item.getValue('custrecord_bb1_blbi_quantity'),
          orderschedule: item.getValue('custrecord_bb1_blbi_orderschedule'),
          orderschedule_text: item.getText('custrecord_bb1_blbi_orderschedule'),
          scheduleforsetdate: item.getValue('custrecord_bb1_blbi_scheduleforsetdate') == 'T',
          scheduleddayofmonth: item.getValue('custrecord_bb1_blbi_scheduleddayofmonth'),
          startdate: startDate ? nlapiDateToString(startDate, 'date') : '',
          lastdateordered: lastOrderDate ? nlapiDateToString(lastOrderDate, 'date') : '',
          nextorderdate: nextOrderDate ? nlapiDateToString(nextOrderDate, 'date') : '',
          createdfrom: item.getValue('custrecord_bb1_blbi_createdfrom'),
          createdfrom_text: item.getText('custrecord_bb1_blbi_createdfrom'),
          storedisplaythumbnail: item.getValue("storedisplaythumbnail", "custrecord_bb1_blbi_item"),
          storedisplaythumbnail_text: item.getText("storedisplaythumbnail", "custrecord_bb1_blbi_item"),
          storedisplayimage: item.getValue("storedisplayimage", "custrecord_bb1_blbi_item"),
          storedisplayimage_text: item.getText("storedisplayimage", "custrecord_bb1_blbi_item"),
          isinactive: item.getValue('isinactive') == 'T',
          thumbnailurl: item.getValue('thumbnailurl', "custrecord_bb1_blbi_item"),
          imageurl: item.getValue('imageurl', "custrecord_bb1_blbi_item"),
          lastmodified: lastModified ? nlapiDateToString(lastModified, 'datetime') : ''
         },
         storeItemReference = {
          id: itemId,
          internalid: itemId,
          type: itemType,
          matrix_parent: itemMatrixParent,
          itemid: itemName
         };

     storeItemReferences.push(storeItemReference);
     return item;
    });

    //delete result.records;
    
    StoreItem && StoreItem.preloadItems(storeItemReferences);

    _(result.records).each(function (blb_item) //result.items
    {
     var store_item = StoreItem ? StoreItem.get(blb_item.item, blb_item.itemtype) : null;

     if (!store_item)
      return true;
     
     blb_item.item_details = JSON.parse(JSON.stringify(store_item)); //_.extend({}, store_item);
     
     var quantity = parseFloat(blb_item.quantity, 10);
     var onlineCustomerPrice = blb_item.item_details.onlinecustomerprice_detail;
     var priceSchedules = onlineCustomerPrice.priceschedule || [];
     //console.log('quantity', quantity);
     //console.log('priceSchedules', JSON.stringify(priceSchedules));
     if (priceSchedules.length) {
      var priceSchedule = _.find(priceSchedules, function(schedule) { return (schedule.minimumquantity <= quantity) && (quantity < (schedule.maximumquantity || Infinity)); });
     //console.log('priceSchedule', JSON.stringify(priceSchedule));
      if (priceSchedule) {
       //console.log('update onlineCustomerPrice', priceSchedule.price);
       onlineCustomerPrice.onlinecustomerprice = priceSchedule.price;
       onlineCustomerPrice.onlinecustomerprice_formatted = priceSchedule.price_formatted;
      }
     }
     
     delete onlineCustomerPrice.priceschedule;
     
     //console.log('blb_item.item_details.custitem_bb1_bb_discountrate', blb_item.item_details.custitem_bb1_bb_discountrate);
     if (blb_item.item_details.custitem_bb1_bb_discountrate) {
      //console.log('in disc', blb_item.item_details.custitem_bb1_bb_discountrate);
      onlineCustomerPrice.onlinecustomerprice *= 1 + (blb_item.item_details.custitem_bb1_bb_discountrate / 100);
      onlineCustomerPrice.onlinecustomerprice_formatted = Utils.formatCurrency(onlineCustomerPrice.onlinecustomerprice);
      //console.log('new onlineCustomerPrice', JSON.stringify(onlineCustomerPrice));
     }
     
     //blb_item.item_details = store_item; 
    });

    return result;
   },
   
   update: function (data)
   {
    'use strict';
    
    if (data.placeorder)
     return this.placeOrder(data);
    else if (data.skipnextorder)
     return this.skipNextOrder(data);
    
    //console.log('update');
    //console.log(JSON.stringify(data));
    
    if (!ModelsInit.session.isLoggedIn())
     throw unauthorizedError;

    if (!data.internalid)
     throw notFoundError;
    
    this.validate(data);

    var customerId = nlapiGetUser();
    
    var blbItemRec = nlapiLoadRecord("customrecord_bb1_blbi", data.internalid);
    blbItemRec.setFieldValue("custrecord_bb1_blbi_quantity", data.quantity);
    blbItemRec.setFieldValue("custrecord_bb1_blbi_orderschedule", data.orderschedule);
    blbItemRec.setFieldValue("custrecord_bb1_blbi_scheduleforsetdate", data.scheduleforsetdate);
    blbItemRec.setFieldValue("custrecord_bb1_blbi_scheduleddayofmonth", data.scheduleddayofmonth);
    blbItemRec.setFieldValue("custrecord_bb1_blbi_nextorderdate", data.nextorderdate);
    blbItemRec.setFieldValue("isinactive", data.isinactive == "T" ? "T" : "F");
    data.internalid = nlapiSubmitRecord(blbItemRec, true, true);
    
    //console.log('update');
    
    return this.get();
   },
   
   create: function (data)
   {
    'use strict';
    
    //console.log('create');
    //console.log(JSON.stringify(data));
    
    if (!ModelsInit.session.isLoggedIn())
     throw unauthorizedError;

    this.validate(data);

    var customerId = nlapiGetUser();
    
    var blbItemRec = nlapiCreateRecord("customrecord_bb1_blbi");
    blbItemRec.setFieldValue("custrecord_bb1_blbi_customer", customerId);
    blbItemRec.setFieldValue("custrecord_bb1_blbi_item", data.item);
    blbItemRec.setFieldValue("custrecord_bb1_blbi_quantity", data.quantity);
    blbItemRec.setFieldValue("custrecord_bb1_blbi_orderschedule", data.orderschedule);
    blbItemRec.setFieldValue("custrecord_bb1_blbi_scheduleforsetdate", data.scheduleforsetdate);
    blbItemRec.setFieldValue("custrecord_bb1_blbi_scheduleddayofmonth", data.scheduleddayofmonth);
    blbItemRec.setFieldValue("custrecord_bb1_blbi_nextorderdate", data.nextorderdate);
    blbItemRec.setFieldValue("custrecord_bb1_blbi_firstorderforitem", this.isRepeatOrder(data) ? "F" : "T");
    data.internalid = nlapiSubmitRecord(blbItemRec, true, true);
    
    //console.log('created');
    
    return data;
   },
   
   isRepeatOrder: function (data)
   {
    'use strict';
    
    if (!data.item) return false;
    
    var customerId = nlapiGetUser();
    var salesOrderFilters = [new nlobjSearchFilter("entity", null, "is", customerId),
                             new nlobjSearchFilter("voided", null, "is", "F"),
                             new nlobjSearchFilter("mainline", null, "is", "F"),
                             new nlobjSearchFilter("cogs", null, "is", "F"),
                             new nlobjSearchFilter("memorized", null, "is", "F"),
                             //new nlobjSearchFilter("datecreated", null, "before", creationDate),
                             new nlobjSearchFilter("item", null, "anyof", data.item),
                             new nlobjSearchFilter("custcol_bb1_blbi_orderschedule", null, "noneof", "@NONE@")],
        salesOrderColumns = [new nlobjSearchColumn("item").setSort()],
        salesOrderResults = nlapiSearchRecord("salesorder", null, salesOrderFilters, salesOrderColumns) || [];
    
    var blbItemFilters = [new nlobjSearchFilter("custrecord_bb1_blbi_customer", null, "is", customerId),
                          new nlobjSearchFilter("custrecord_bb1_blbi_item", null, "anyof", data.item)],
        blbItemResults = nlapiSearchRecord("customrecord_bb1_blbi", null, blbItemFilters) || [];
    
    return !!salesOrderResults.length || !!blbItemResults.length;
    /*for (var i=0, l=salesOrderResults.length; i < l; i++) {
     var itemId = salesOrderResults[i].getValue('item');
     repeatOrder[itemId] = true;
    }*/
    
   },
   
   skipNextOrder: function (data)
   {
    'use strict';
    
    console.log('skip Next Order');
    //console.log(JSON.stringify(data));
    
    if (!ModelsInit.session.isLoggedIn())
     throw unauthorizedError;

    if (!data.internalid)
     throw notFoundError;
    
    var customerId = nlapiGetUser();
    //var customerRec = nlapiLoadRecord("customer", customerId); // 5 units
    var blbItemId = data.internalid,
        blbItemRec = nlapiLoadRecord("customrecord_bb1_blbi", data.internalid),
        orderScheduleId = blbItemRec.getFieldValue("custrecord_bb1_blbi_orderschedule"),
        orderScheduleInDays = parseInt(nlapiLookupField("customrecord_bb1_blbi_orderschedule", orderScheduleId, "custrecord_bb1_blbi_os_scheduleindays"), 10),
        scheduleforSetDate = (blbItemRec.getFieldValue("custrecord_bb1_blbi_scheduleforsetdate") == "T") && (orderScheduleInDays % 28 == 0),
        scheduledDayOfMonth = parseInt(blbItemRec.getFieldValue("custrecord_bb1_blbi_scheduleddayofmonth"), 10),
        lastOrderDateText = blbItemRec.getFieldValue("custrecord_bb1_blbi_lastdateordered"),
        nextOrderDateText = blbItemRec.getFieldValue("custrecord_bb1_blbi_nextorderdate"),
        nextOrderDate = nlapiStringToDate(nextOrderDateText),
        newNextOrderDateText = this.getNewOrderDate(orderScheduleInDays, nextOrderDate, scheduleforSetDate, scheduledDayOfMonth);
    
    blbItemRec.setFieldValue("custrecord_bb1_blbi_nextorderdate", newNextOrderDateText);
    nlapiSubmitRecord(blbItemRec, false, true);
    
    console.log('skipped Next Order');
    
    data.nextorderdate = newNextOrderDateText;
    
    delete data.item_details;
    
    return data;
   },
   
   placeOrder: function (data)
   {
    'use strict';
    
    console.log('placeorder');
    console.log(JSON.stringify(data));
    
    if (!ModelsInit.session.isLoggedIn())
     throw unauthorizedError;

    if (!data.internalid)
     throw notFoundError;
    
    var customerId = nlapiGetUser();
    //var customerRec = nlapiLoadRecord("customer", customerId); // 5 units
    var blbItemId = data.internalid;
    
  var blbItemFilters = [new nlobjSearchFilter("internalid", null, "anyof", blbItemId)],
      blbItemColumns = [new nlobjSearchColumn("custrecord_bb1_blbi_customer").setSort(),
                        new nlobjSearchColumn("custrecord_bb1_blbi_item").setSort(),
                        new nlobjSearchColumn("custrecord_bb1_blbi_orderschedule"),
                        new nlobjSearchColumn("custrecord_bb1_blbi_os_scheduleindays", "custrecord_bb1_blbi_orderschedule"),
                        new nlobjSearchColumn("custrecord_bb1_blbi_nextorderdate"),
                        new nlobjSearchColumn("custrecord_bb1_blbi_lastdateordered"),
                        new nlobjSearchColumn("custrecord_bb1_blbi_quantity"),
                        new nlobjSearchColumn("displayname", "custrecord_bb1_blbi_item"),
                        new nlobjSearchColumn("storedisplayname", "custrecord_bb1_blbi_item"),
                        new nlobjSearchColumn("custitem_bb1_psi_itemsperpack", "custrecord_bb1_blbi_item"),
                        new nlobjSearchColumn("custitem_bb1_psi_weightpertablet", "custrecord_bb1_blbi_item"),
                        new nlobjSearchColumn("custrecord_bb1_blbi_createdfrom"),
                        new nlobjSearchColumn("email", "custrecord_bb1_blbi_customer"),
                        new nlobjSearchColumn("terms", "custrecord_bb1_blbi_customer"),
                        new nlobjSearchColumn("custentity_bb1_websiteaccess", "custrecord_bb1_blbi_customer"),
                        new nlobjSearchColumn("formuladate").setFormula("{today}")],
      blbItemResults = nlapiSearchRecord("customrecord_bb1_blbi", null, blbItemFilters, blbItemColumns) || [], // 10 units
      blbItemResult = blbItemResults.length && blbItemResults[0],
      currentOrderDate = blbItemResult && nlapiStringToDate(blbItemResult.getValue("custrecord_bb1_blbi_nextorderdate")) || new Date,
      currentOrderDateText = nlapiDateToString(currentOrderDate),
      customerId,
      salesOrderRec,
      shippingWeight = 0,
      orderTotal = 0,
      lineItemIds = [],
      allPetsUsingRxJson = [],
      daysToShip = 4,
      blbItemsCompleted = [],
      blbItemsOnOrder = [];
  
  if (!blbItemResult) throw notFoundError;
  
    var blbItemRec = nlapiLoadRecord("customrecord_bb1_blbi", blbItemId),
        customerName = blbItemRec.getFieldValue("custrecord_bb1_blbi_customer"), //customerRec.getFieldValue("name"),
        //emailRecipient = customerRec.getFieldValue("email"),
        //websiteAccessId = customerRec.getFieldValue("custentity_bb1_websiteaccess"),
        //webSiteId = websiteAccessId == 2 ? 2 : 1,
        itemId = blbItemResult.getValue("custrecord_bb1_blbi_item"),
        itemName = blbItemResult.getValue("storedisplayname", "custrecord_bb1_blbi_item") || 
                   blbItemResult.getValue("displayname", "custrecord_bb1_blbi_item") || 
                   blbItemResult.getText("custrecord_bb1_blbi_item"),
        quantity = parseFloat(blbItemResult.getValue("custrecord_bb1_blbi_quantity")) || 1,
        dosagePerItem = parseFloat(blbItemResult.getValue("custitem_bb1_psi_weightpertablet", "custrecord_bb1_blbi_item")) || 1,
        itemsPerPack = parseInt(blbItemResult.getValue("custitem_bb1_psi_itemsperpack", "custrecord_bb1_blbi_item")) || 1,
        totalTreatments = quantity * itemsPerPack,
        orderSchedule = blbItemResult.getValue("custrecord_bb1_blbi_orderschedule"),
        orderScheduleText = blbItemResult.getText("custrecord_bb1_blbi_orderschedule"),
        orderScheduleInDays = parseInt(blbItemResult.getValue("custrecord_bb1_blbi_os_scheduleindays", "custrecord_bb1_blbi_orderschedule")),
        scheduleforSetDate = (blbItemResult.getValue("custrecord_bb1_blbi_scheduleforsetdate") == "T") && (orderScheduleInDays % 28 == 0),
        scheduledDayOfMonth = parseInt(blbItemResult.getValue("custrecord_bb1_blbi_scheduleddayofmonth")),
        lastOrderDateText = blbItemResult.getValue("custrecord_bb1_blbi_lastdateordered"),
        todaysDateText = blbItemResult.getValue("formuladate"),
        todaysDate = nlapiStringToDate(todaysDateText),
        newNextOrderDateText = this.getNewOrderDate(orderScheduleInDays, todaysDate, scheduleforSetDate, scheduledDayOfMonth),
        salesOrderCreatedFrom = blbItemResult.getValue("custrecord_bb1_blbi_createdfrom"),
        petIsNotPregnant,
        petsUsingPrescription,
        petsUsingRxJson;
      
    nlapiLogExecution('DEBUG', 'blbItemId/customerName/todaysDateText', blbItemId + '/' + customerName + '/' + todaysDateText);
    nlapiLogExecution('DEBUG', 'orderScheduleInDays/scheduleforSetDate/scheduledDayOfMonth/newNextOrderDateText', orderScheduleInDays + '/' + scheduleforSetDate + '/' + scheduledDayOfMonth + '/' + newNextOrderDateText);
    
    try {
     if (salesOrderCreatedFrom) {
      var origSalesOrderRec = nlapiLoadRecord('salesorder', salesOrderCreatedFrom); // 10 units
      
      for (var j=1; j <= origSalesOrderRec.getLineItemCount('item'); j++) {
       var lineBlbItemId = origSalesOrderRec.getLineItemValue('item', 'custcol_bb1_blbi_blbi', j);
       if (blbItemId == lineBlbItemId) {
        var origLineQuantity = origSalesOrderRec.getLineItemValue('item', 'quantity', j);
        petIsNotPregnant = origSalesOrderRec.getLineItemValue('item', 'custcol_bb1_psi_petisnotpregnant', j);
        petsUsingPrescription = origSalesOrderRec.getLineItemValue('item', 'custcol_bb1_psi_petsusingprescription', j);
        petsUsingRxJson = origSalesOrderRec.getLineItemValue('item', 'custcol_bb1_psi_petsusingrxjson', j);
        if (petsUsingRxJson) {
         var petsUsingRx = JSON.parse(petsUsingRxJson) || [];
         var treamentsRemaining = totalTreatments;
         var petsWithRx = [];
         var petWeightLookup = {};
         
         for (var k=0; k < petsUsingRx.length; k++)
         {
          var petsUsingRxDetail = petsUsingRx[k];
          
          if (petsUsingRxDetail.treatmenttype != '1')
           continue;
          
          var petsId = petsUsingRxDetail.pet;
          
          if (petsWithRx.indexOf(petsId) == -1)
           petsWithRx.push(petsId);
         }
              
         nlapiLogExecution('DEBUG', 'petsWithRx', JSON.stringify(petsWithRx));
         
         if (petsWithRx.length)
         {
          var petFilters = [new nlobjSearchFilter("internalid", null, "anyof", petsWithRx)],
              petColumns = [new nlobjSearchColumn("custrecord_bb1_pet_weight_kg")],
              petResults = nlapiSearchRecord("customrecord_bb1_pet", null, petFilters, petColumns) || []; // 10 units
          
          for (var k=0; k < petResults.length; k++)
          {
           var petResult = petResults[k];
           petWeightLookup[petResult.getId()] = parseFloat(petResult.getValue("custrecord_bb1_pet_weight_kg")) || 0;
          }
         }
                      
         nlapiLogExecution('DEBUG', 'petWeightLookup', JSON.stringify(petWeightLookup));
         

         for (var k=0; k < petsUsingRx.length; k++)
         {
          var petsRx = petsUsingRx[k];
          
          var treatmentStartDate = todaysDateText && nlapiStringToDate(todaysDateText) || '',
              treatmentEndDate;
          
          treatmentStartDate.setDate(treatmentStartDate.getDate() + daysToShip);
          
          petsRx.treatmentstartdate = nlapiDateToString(treatmentStartDate);
          petsRx.treatmentstartdateautocalc = 'T';
          
          if (origLineQuantity != quantity)
          { 
           nlapiLogExecution('DEBUG', 'Quantity has changed from original sales order: original/current/totalTreatments/%/test', origLineQuantity + '/' + quantity + '/' + totalTreatments + '/' + (petsRx.treatmentsallocated / petsRx.totaltreatments) + '/' + Math.min(Math.ceil(totalTreatments * (petsRx.treatmentsallocated / petsRx.totaltreatments)), treamentsRemaining));
         
           if (k == petsUsingRx.length - 1)
            petsRx.treatmentsallocated = treamentsRemaining;
           else
            petsRx.treatmentsallocated = Math.min(Math.ceil(totalTreatments * (petsRx.treatmentsallocated / petsRx.totaltreatments)), treamentsRemaining);
           
           if (petsRx.treatmentsallocated > 0 && petsRx.treatmentsallocated < 1)
            petsRx.treatmentsallocated = Math.min(treamentsRemaining, 1);
           
           treamentsRemaining -= petsRx.treatmentsallocated;
           
           nlapiLogExecution('DEBUG', 'Quantity has changed from original sales order: petsRx.treatmentsallocated/treamentsRemaining', petsRx.treatmentsallocated + '/' + treamentsRemaining);
         
          }
          
          petsRx.totaltreatments = totalTreatments;
          
          switch (petsRx.treatmenttype) {
           case '1':
            petsRx.dosageperitem = dosagePerItem;
            petsRx.petweight = petWeightLookup[petsRx.pet] || 0;
            petsRx.dosageRequired = Math.ceil((petsRx.petweight / petsRx.dosageperitem) * 2) / 2;
            petsRx.treatmentsDelivered = Math.floor(petsRx.treatmentsallocated / petsRx.dosageRequired);
            petsRx.monthsPerTreatment = 3;
            petsRx.monthsTreated = petsRx.treatmentsDelivered * petsRx.monthsPerTreatment;
            
            if (treatmentStartDate)
             treatmentEndDate = nlapiAddMonths(treatmentStartDate, petsRx.monthsTreated);
            
            /*if (!petsRx.treatmentsDelivered)
             throw {
                    status: 500
                   ,	code: 'NOT_ENOUGH_ALLOCATED'
                   ,	message: 'You have not allocated enough of this item for a single treatment. Please allocate more of the item or choose a pet with lower weight.'
                   };*/
             
            petsRx.wormtreatmentenddate = petsRx.nextwormingreminder = treatmentEndDate && nlapiDateToString(treatmentEndDate) || '';
            break;
           case '2':
            var nextFleaReminderDate = treatmentStartDate && nlapiAddMonths(treatmentStartDate, petsRx.treatmentsallocated);
            petsRx.fleatreatmentenddate = petsRx.nextfleareminder = nextFleaReminderDate && nlapiDateToString(nextFleaReminderDate) || '';
            break;
          }
   
         }
         
         allPetsUsingRxJson = allPetsUsingRxJson.concat(petsUsingRx);
         petsUsingRxJson = JSON.stringify(petsUsingRx);
        }
        break;
       }
      }
     }
    }
    catch(e) {
     nlapiLogExecution('ERROR', 'Could not load original sales order for prescription details. blbItemId/salesOrderCreatedFrom', blbItemId + '/' + salesOrderCreatedFrom);
    }
    
    var salesOrderRec = nlapiCreateRecord('salesorder', {recordmode: 'dynamic', entity: customerId}); // 10 units
   
    var billAddressId = salesOrderRec.getFieldValue("billaddress"),
        shipAddressId = salesOrderRec.getFieldValue("shipaddress"),
        shipMethodId = salesOrderRec.getFieldValue("shipmethod"),
        shippingCountryCode = salesOrderRec.getFieldValue("shipcountry"),
        shippingCountry = this.countryCodeNames[shippingCountryCode],
        shippingPostcode = salesOrderRec.getFieldValue("shipzip"),
        creditCardId = "",
        credit_card = null,
        termsId = blbItemResult.getValue("terms", "custrecord_bb1_blbi_customer"), //customerRec.getFieldValue("terms"),
        webSiteId = Configuration.get('websiteAccess.internalId');
    var profileFieldId = 'creditcardprocessor';
        
    salesOrderRec.setFieldValue("custbody_bb1_orderplacedon", webSiteId);
    
    nlapiLogExecution('DEBUG', 'shipMethodId', shipMethodId);
    
    //var paymentMehtods = PaymentMethodModel.list();
    credit_card = (CreditCardModel.getDefault() || {});
    creditCardId = (CreditCardModel.getDefault() || {}).internalid;
    
    nlapiLogExecution('DEBUG', 'creditCardId/termsId', creditCardId + '/' + termsId);
    /*for (var j=1, m=customerRec.getLineItemCount("creditcards"); j <= m; j++) {
     if (customerRec.getLineItemValue("creditcards", "ccdefault", j) == "T") {
      creditCardId = customerRec.getLineItemValue("creditcards", "internalid", j);
      break;
     }
    }*/
    
    if (!billAddressId)
     throw nlapiCreateError("NO_DEFAULT_BILL_ADDRESS", "No default billing address is set on this customer account.");
     
    if (!shipAddressId)
     throw nlapiCreateError("NO_DEFAULT_SHIP_ADDRESS", "No default shipping address is set on this customer account.");
     
    //if (!shipMethodId)
    // throw nlapiCreateError("NO_DEFAULT_SHIP_METHOD", "No default shipping method is set on this customer account.");
   
    if (termsId) {
     salesOrderRec.setFieldValue("paymentmethod", "");
     salesOrderRec.setFieldValue("terms", termsId);
    }
    else if (creditCardId) {
     var paymentInstrumentsEnabled = ModelsInit.context.getSetting('FEATURE', 'PAYMENTINSTRUMENTS') === 'T';
     if (paymentInstrumentsEnabled)
     {
         salesOrderRec.setFieldValue("paymentoption", creditCardId);
         profileFieldId = 'paymentprocessingprofile';
     }
     else
     {
        salesOrderRec.setFieldValue("creditcard", creditCardId);
     }

     // The below is in-keeping with how standard SCA does it
     try
     {
        salesOrderRec.setFieldValue('paymentmethod', credit_card.paymentmethod.internalid);
     }
     catch (err)
     {
     }
     salesOrderRec.setFieldValue("getauth", "T");

        // Determine if customer requires WorldPay Business (ID:1) or WorldPay Access (ID:Script parameter)
        var context = nlapiGetContext();
        var customerId = nlapiGetUser();
        var initialCreditCardProcessor = '';
        var worldPayBusiness = '1';
        var worldPayBusinessECOM = '2';
        var adyenInitialPetShopECOM = '';
        var adyenInitialVetShopECOM = '';
        var adyenRecurringPetShopECOM = '';
        var adyenRecurringVetShopECOM = '';
        var adyenInitialPetShopMOTO = '';
        var adyenInitialVetShopMOTO = '';
        var adyenRecurringPetShopMOTO = '';
        var adyenRecurringVetShopMOTO = '';

        // Get initial processor from Suitelet, as Shopper role won't have permissions to search Transactions
        var suiteletUrl = nlapiResolveURL('SUITELET', 'customscript_cat_initial_bottomless_b_sl', 'customdeploy_cat_initial_bottomless_b_sl', 'external')
        var processorRequest = nlapiRequestURL(suiteletUrl + '&customerid=' + customerId + '&websiteid=' + webSiteId);
        initialCreditCardProcessor = JSON.parse(processorRequest.getBody()).initialCreditCardProcessor;

        adyenInitialPetShopECOM = context.getSetting('SCRIPT', 'custscript_cat_ini_worldpayaccess_ppp_ps');
        adyenInitialVetShopECOM = context.getSetting('SCRIPT', 'custscript_cat_ini_worldpayaccess_ppp_vs');
        adyenRecurringPetShopECOM = context.getSetting('SCRIPT', 'custscript_cat_blb_worldpayaccess_ppp_ps');
        adyenRecurringVetShopECOM = context.getSetting('SCRIPT', 'custscript_cat_blb_worldpayaccess_ppp_vs');
        adyenInitialPetShopMOTO = context.getSetting('SCRIPT', 'custscript_cat_ini_adyen_ppp_ps_moto');
        adyenInitialVetShopMOTO = context.getSetting('SCRIPT', 'custscript_cat_ini_adyen_ppp_vs_moto');
        adyenRecurringPetShopMOTO = context.getSetting('SCRIPT', 'custscript_cat_blb_adyen_ppp_ps_moto');
        adyenRecurringVetShopMOTO = context.getSetting('SCRIPT', 'custscript_cat_blb_adyen_ppp_vs_moto');

        if (initialCreditCardProcessor == adyenInitialPetShopECOM)
        {
            salesOrderRec.setFieldValue(profileFieldId, adyenRecurringPetShopECOM);
        }
        else if (initialCreditCardProcessor == adyenInitialVetShopECOM)
        {
            salesOrderRec.setFieldValue(profileFieldId, adyenRecurringVetShopECOM);
        }
        else if (initialCreditCardProcessor == adyenInitialPetShopMOTO)
        {
            salesOrderRec.setFieldValue(profileFieldId, adyenRecurringPetShopMOTO);
        }
        else if (initialCreditCardProcessor == adyenInitialVetShopMOTO)
        {
            salesOrderRec.setFieldValue(profileFieldId, adyenRecurringVetShopMOTO);
        }
        else if (initialCreditCardProcessor && credit_card.paymentmethod.internalid != '6') // Must be WorldPay MOTO (not for AMEX)
        {
            salesOrderRec.setFieldValue(profileFieldId, worldPayBusiness);
        }
        else if (initialCreditCardProcessor) // Must be WorldPay
        {
            salesOrderRec.setFieldValue(profileFieldId, worldPayBusinessECOM); // WorldPay ECOM (for AMEX)
        }
        else // initialCreditCardProcessor is empty, so try put it through as an initial Adyen MOTO payment
        {
            switch (Number(webSiteId))
            {
            case 2: // VetShop.co.uk
                salesOrderRec.setFieldValue(profileFieldId, adyenInitialVetShopMOTO);
                break;
            default: // PetShop.co.uk
                salesOrderRec.setFieldValue(profileFieldId, adyenInitialPetShopMOTO);
                break;
            }
        }
    }
    else {
     throw nlapiCreateError("NO_DEFAULT_PAYMENT_METHOD", "No default credit card or terms are set on this customer acount.");
    }
     
    salesOrderRec.setFieldValue("department", webSiteId == 2 ? 6 : 2);
    //salesOrderRec.setFieldValue("custbody_bb1_bb_ordertype", 1);
    salesOrderRec.setFieldValue("memo", "Bottomless Bowl Order");
    salesOrderRec.setFieldValue("tobeemailed", "T");
    salesOrderRec.setFieldValue("orderstatus", "B");
    
    salesOrderRec.selectNewLineItem("item");
    
    salesOrderRec.setCurrentLineItemValue("item", "item", itemId);
    
    salesOrderRec.setCurrentLineItemValue("item", "quantity", quantity);
    /*try {
     salesOrderRec.setCurrentLineItemValue("item", "price", webSiteId == 2 ? 4 : 5);
    }
    catch (e) {
     var message = e && e.getDetails ? e.getCode() + ": " + e.getDetails() : e;
     //nlapiLogExecution("DEBUG", "Item '" + itemName + "' has no Online Price level so leaving as Base Price.", message);
    }*/
    
    salesOrderRec.setCurrentLineItemValue("item", "custcol_bb1_blbi_orderschedule", orderSchedule);
    
    data.originalItemRate = salesOrderRec.getCurrentLineItemValue("item", "rate");
    data.discountRate = salesOrderRec.getCurrentLineItemValue("item", "custcol_bb1_blbi_discount");
    data.discountedItemRate = data.originalItemRate * (1 - Math.abs(data.discountRate / 100));
    salesOrderRec.setCurrentLineItemValue("item", "rate", data.discountedItemRate);
    
    data.orderTotal = parseFloat(salesOrderRec.getFieldValue('total'), 10) || 0;
    data.orderTotalFormatted = Utils.formatCurrency(data.orderTotal);
   
   
    salesOrderRec.setCurrentLineItemValue("item", "custcol_bb1_blbi_blbi", blbItemId);
    petIsNotPregnant && salesOrderRec.setCurrentLineItemValue("item", "custcol_bb1_psi_petisnotpregnant", petIsNotPregnant);
    try {
     petsUsingPrescription && salesOrderRec.setCurrentLineItemValue("item", "custcol_bb1_psi_petsusingprescription", petsUsingPrescription);
    }
    catch (e) {
     var message = e && e.getDetails ? e.getCode() + ": " + e.getDetails() : e;
     nlapiLogExecution("DEBUG", "Error setting custcol_bb1_psi_petsusingprescription on Item '" + itemName + "'.", message);
     if (e.getCode() == 'INVALID_KEY_OR_REF') {
      nlapiLogExecution("DEBUG", "Invalid key. Attempting to active pet and retry", petsUsingPrescription);
      
      try {
       nlapiSubmitField('customrecord_bb1_pet', petsUsingPrescription, 'isinactive', 'F'); // 10 units // TODO: Make reset inactive to after processed?
       salesOrderRec.setCurrentLineItemValue("item", "custcol_bb1_psi_petsusingprescription", petsUsingPrescription);
      }
      catch (e) {
       var message = e && e.getDetails ? e.getCode() + ": " + e.getDetails() : e;
       nlapiLogExecution("DEBUG", "Error setting custcol_bb1_psi_petsusingprescription on Item a second time. Skipping field.'" + itemName + "'.", message);
      }
     }
    }
    petsUsingRxJson && salesOrderRec.setCurrentLineItemValue("item", "custcol_bb1_psi_petsusingrxjson", petsUsingRxJson);
    
    var total = parseFloat(salesOrderRec.getCurrentLineItemValue("item", "amount")) || 0;
    orderTotal += total;
    var weight = parseFloat(salesOrderRec.getCurrentLineItemValue("item", "custcol_bb1_weight")) || 0;
    var weightUnit = salesOrderRec.getCurrentLineItemValue("item", "custcol_bb1_weightunits");
    shippingWeight += quantity * weight / (weightUnit == 'kg' ? 1 : 1000);
    
    salesOrderRec.commitLineItem("item");
       
    nlapiLogExecution('DEBUG', 'commitLineItem', salesOrderRec.getLineItemCount("item"));
    nlapiLogExecution('DEBUG', 'discount', salesOrderRec.getFieldValue("discountitem"));
    nlapiLogExecution('DEBUG', 'promocode', salesOrderRec.getFieldValue("promocode"));

    var overrideShipMethods = ['41837', '43870', '41931', '44392', '41179'];
    var defaultShipMethod = salesOrderRec.getFieldValue('shipmethod');
    
    if (overrideShipMethods.indexOf(defaultShipMethod) == -1) {
    
     var orderTotal = parseFloat(salesOrderRec.getFieldValue('subtotal')) || 0;
     
     var availableShipMethods = this.getAvailableShippingMethods(webSiteId, shippingCountryCode, shippingPostcode, orderTotal, shippingWeight) || []; // 22 units
     
     nlapiLogExecution('DEBUG', 'customerId/shippingWeight/orderTotal', customerId + '/' + shippingWeight + '/' + orderTotal);
     nlapiLogExecution('DEBUG', 'webSiteId/shippingCountryCode/shippingPostcode', webSiteId + '/' + shippingCountryCode + '/' + shippingPostcode);
     nlapiLogExecution('DEBUG', 'availableShipMethods', JSON.stringify(availableShipMethods));
     
     var cheapestShippingId = null,
         cheapestShippingCost = Infinity;
         
     if (availableShipMethods.length) {
      // go through each and find cheapest to set as.
      
      for (var j=0; j < availableShipMethods.length; j++) {
       salesOrderRec.setFieldValue("shipmethod", availableShipMethods[j]);
       var shippingCost = parseFloat(salesOrderRec.getFieldValue("shippingcost"));
        nlapiLogExecution('DEBUG', 'check shipping method', availableShipMethods[j] + '/' + shippingCost);
       if (shippingCost < cheapestShippingCost) {
        cheapestShippingCost = shippingCost;
        cheapestShippingId = availableShipMethods[j];
        nlapiLogExecution('DEBUG', 'new cheapest shipping method', cheapestShippingId + '/' + cheapestShippingCost);
       }
      }
     }
     
     nlapiLogExecution('DEBUG', 'shipMethodId/shipMethodName/cheapestShippingId', salesOrderRec.getFieldValue("shipmethod") + '/' + salesOrderRec.getFieldText("shipmethod") + '/' + cheapestShippingId);
     
     if (cheapestShippingId) {
      salesOrderRec.setFieldValue("shipmethod", cheapestShippingId);
      //salesOrderRec.setFieldValue("shipmethod", "");
      //salesOrderRec.setFieldValue("shipmethod", cheapestShippingId);
      nlapiLogExecution('DEBUG', 'new shipmethod set to: ', salesOrderRec.getFieldText("shipmethod"));
     }
     else {
      salesOrderRec.setFieldValue("shipmethod", "");
      throw nlapiCreateError("NO_SHIP_METHOD", "No shipping method available for the selected site, country and postcode.");
     }
     
    }

   data.placedOrderId = nlapiSubmitRecord(salesOrderRec, true, true); // 20 units
    
   //try {
    nlapiSubmitField("customrecord_bb1_blbi", blbItemId, ["custrecord_bb1_blbi_lastdateordered", "custrecord_bb1_blbi_nextorderdate"], [todaysDateText, newNextOrderDateText]); // 2 units
   /*}
   catch (e) {
    var title = "Error while updating the next order date of bottomless bowl order for " + blbItemOnOrder.customerId,
        message = e && e.getDetails ? e.getCode() + ": " + e.getDetails() : e,
    nlapiLogExecution("ERROR", title, message);
   }*/
   
    console.log('placed immediate order');
    
    delete data.item_details;
    
    return data;
   },
   
   getAvailableShippingMethods: function(webSiteId, countryCode, postcode, total, weight) {
 
    var country = this.countryCodeNames[countryCode];
    
    //console.log('LiveOrder.getShipMethods order_fields.shipmethods.length', order_fields && order_fields.shipmethods && order_fields.shipmethods.length);
    var petshopAllowedShipMethods = ["41556","41557","41558","41559","41560","41561","41563","41564","41565","41566","41567","41569","41570","41571","41572","41573","41574","41575","41576","41577","41578","41579","41580","41581","41582","41584","11252","3","11250","43564","42000","11251","11253","4","2","41179","42746","11249","43526","45410","43521","46069","46077","46071","45413","42010"];
    var vetshopAllowedShipMethods = ["43879","43880","43878","43881","43882","43883","43884","43885","43886","43888","43890","43898","43899","43900","43901","43902","43903","43904","43906","43907","43908","43909","43910","43911","43912","43913","43872","43877","43875","46078","46070","46073","45414","46075"];

    var allowedShipMethods = webSiteId == 2 ? vetshopAllowedShipMethods : petshopAllowedShipMethods;
    
    //console.log('LiveOrder.getShipMethods allowedShipMethods', JSON.stringify(allowedShipMethods));
    
     var filteredShipMethods = []; //allowedShipMethods.slice();
     
     try {
      
      //nlapiLogExecution('DEBUG', 'LiveOrder.getShipMethods webSiteId', webSiteId);
      
      var dummyRec = nlapiCreateRecord('customrecord_bb1_sp'); // 2 units
      
      dummyRec.setFieldText('custrecord_bb1_sp_countries', country);
      
      var countryId = dummyRec.getFieldValue('custrecord_bb1_sp_countries');
      
      //var countryId = countryInternalIdLookup[countryCode];
      
      //nlapiLogExecution('DEBUG', 'LiveOrder.getShipMethods countryId/country/countryCode/postcode/total/weight', countryId + '/' + country + '/' + countryCode + '/' + postcode + '/' + total + '/' + weight);
      
      //nlapiLogExecution('DEBUG', 'countryCode', countryCode);
      
      if (countryCode) {
       
   var webServicesUrl = nlapiResolveURL('SUITELET', 'customscript_bb1_wsc_webservices', 'customdeploy_bb1_wsc_webservices', true);

  function addParamsToUrl(baseUrl, params)
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
  };

    //console.log('bb1.PetshopShopping.RecentlyPurchasedItems.Model.search this.webServicesUrl', this.webServicesUrl);
    // fetch items
    var webServicesParms = {'action': 'get-shipping-methods', 'countryCode': countryCode, 'orderTotal': total, 'orderWeight': weight},
        webServicesUrl = addParamsToUrl(webServicesUrl, webServicesParms);
        
    //console.log('bb1.PetshopShopping.RecentlyPurchasedItems.Model.search webServicesUrl', webServicesUrl);
    var response = nlapiRequestURL(webServicesUrl, null, {'Content-Type': 'application/json'}, 'GET');
    
    filteredShipMethods = JSON.parse(response.getBody() || '{}');
    
     /*
       var shippingItemFilters = [
                                  ['isinactive', 'is', 'F'], 'and',
                                  ['isonline', 'is', 'T'], 'and',
                                  //['internalid', 'anyOf', allowedShipMethods], 'and',
                                  ['internalid', 'noneOf', ['41803', '41837', '43870']], 'and', // not collect
                                  [
                                   [
                                    ['limitedtocountries', 'anyof', countryCode], 'and',
                                    ['excludedforcountries', 'is', 'F']
                                   ], 'or',
                                   [
                                    ['limitedtocountries', 'noneof', countryCode], 'and',
                                    ['excludedforcountries', 'is', 'T']
                                   ]
                                  ], 'and',
                                  //[
                                   [
                                    ['limitwebsitevisibilitybytotal', 'is', 'F'], 'or',
                                    [
                                     [
                                      ['websitevisibilitybytotaltype', 'is', 'UNDER'], 'and',
                                      ['websitevisibilitytotallimit', 'greaterThan', total]
                                     ], 'or',
                                     [
                                      ['websitevisibilitybytotaltype', 'is', 'OVER'], 'and',
                                      ['websitevisibilitytotallimit', 'lessThanOrEqualTo', total]
                                     ]
                                    ]
                                   ], 'and',
                                   [
                                    ['limitwebsitevisibilitybyweight', 'is', 'F'], 'or',
                                    [
                                     [
                                      ['websitevisibilitybyweighttype', 'is', 'UNDER'], 'and',
                                      ['websitevisibilityweightunit', 'is', '3'], 'and',
                                      ['websitevisibilityweightlimit', 'greaterThan', weight]
                                     ], 'or',
                                     [
                                      ['websitevisibilitybyweighttype', 'is', 'UNDER'], 'and',
                                      ['websitevisibilityweightunit', 'is', '4'], 'and',
                                      ['websitevisibilityweightlimit', 'greaterThan', weight * 1000]
                                     ], 'or',
                                     [
                                      ['websitevisibilitybyweighttype', 'is', 'OVER'], 'and',
                                      ['websitevisibilityweightunit', 'is', '3'], 'and',
                                      ['websitevisibilityweightlimit', 'lessThanOrEqualTo', weight]
                                     ], 'or',
                                     [
                                      ['websitevisibilitybyweighttype', 'is', 'OVER'], 'and',
                                      ['websitevisibilityweightunit', 'is', '4'], 'and',
                                      ['websitevisibilityweightlimit', 'lessThanOrEqualTo', weight * 1000]
                                     ]
                                    ]
                                   ]
                                  //]
                                 ];
       var shippingItemSearchResults = nlapiSearchRecord("shipitem", null, shippingItemFilters) || []; // 10 units
       
       for (var i=0, l=shippingItemSearchResults.length; i < l; i++) {
        var shippingItemSearchResult = shippingItemSearchResults[i];
        filteredShipMethods.push(shippingItemSearchResult.getId());
       }*/
      }
      
      //nlapiLogExecution('DEBUG', 'filteredShipMethods', JSON.stringify(filteredShipMethods));
      
      if (countryId) {
       var filters = [
                      ['isinactive', 'is', 'F'], 'and',
                      //['custrecord_bb1_sp_shippingmethod.isinactive', 'is', 'F'], 'and',
                      //['custrecord_bb1_sp_shippingmethod.isonline', 'is', 'T'], 'and',
                      ['custrecord_bb1_sp_shippingmethod', 'anyOf', filteredShipMethods], 'and',
                      //['custrecord_bb1_sp_shippingmethod', 'noneOf', ['41803', '41837', '43870']], 'and', // not collect
                      ['custrecord_bb1_po_website', 'anyof', webSiteId], 'and',
                      ['custrecord_bb1_sp_countries', 'anyof', countryId]
                     ];
       var columns = [new nlobjSearchColumn("custrecord_bb1_sp_countries"),
                      new nlobjSearchColumn("custrecord_bb1_sp_postcodeouters"),
                      new nlobjSearchColumn("custrecord_bb1_sp_excludepostcodes"),
                      new nlobjSearchColumn("custrecord_bb1_sp_shippingmethod")];
       var shippingPostcodeSearchResults = nlapiSearchRecord("customrecord_bb1_sp", null, filters, columns) || []; // 10 units
       
       filteredShipMethods = [];
       
         //nlapiLogExecution('DEBUG', 'shippingPostcodeSearchResults.length', shippingPostcodeSearchResults.length);
         
       for (var i=0, l=shippingPostcodeSearchResults.length; i < l; i++) {
        var shippingPostcodeSearchResult = shippingPostcodeSearchResults[i];
        var shipMethodId = shippingPostcodeSearchResult.getValue('custrecord_bb1_sp_shippingmethod');
        //var allowedShipMethodIndex = filteredShipMethods.indexOf(shipMethodId);
        
        //if (allowedShipMethodIndex != -1) {
         var postcodeOuters = shippingPostcodeSearchResult.getText('custrecord_bb1_sp_postcodeouters').split(/,/) || [];
         var postcodeOutersRegex = new RegExp('^'+postcodeOuters.join('|^')+'.*', 'i');
         var excludePostcodes = shippingPostcodeSearchResult.getValue('custrecord_bb1_sp_excludepostcodes') == 'T';
         
         //nlapiLogExecution('DEBUG', 'postcodeOutersRegex: ', postcodeOutersRegex.toString());
         
         if ((postcodeOutersRegex.test('All Postcodes') && !excludePostcodes) ||
             (postcode && postcodeOutersRegex.test(postcode) && !excludePostcodes) ||
             (postcode && !postcodeOutersRegex.test(postcode) && excludePostcodes)) {
          //nlapiLogExecution('DEBUG', 'postcode match - leaving : ', shipMethodId);
          filteredShipMethods.push(shipMethodId);
         }
         else {
          //filteredShipMethods.splice(allowedShipMethodIndex, 1);
          //nlapiLogExecution('DEBUG', 'Removing shipmethod id:', shipMethodId);
         }
        //}
        //else {
         //console.log('Offline - not added - shipmethod id:', shipMethodId);
       // }
       }
       
      }
      //console.log('filteredShipMethods', JSON.stringify(filteredShipMethods));
      
     }
     catch (e) {
      //console.log('error thrown', e && e.getDetails ? e.getDetails() : e);
     }
     
     //nlapiLogExecution('DEBUG', 'filteredShipMethods unsorted', JSON.stringify(filteredShipMethods));
     
    var shipMethodPriority = ["42000","43877","46077","46078"];
    
    filteredShipMethods.sort(function(a, b) {
     
     var aShipMethodPriority = shipMethodPriority.indexOf(a);
     var bShipMethodPriority = shipMethodPriority.indexOf(b);
     
     if (aShipMethodPriority == -1 && bShipMethodPriority == -1)
      return parseFloat(a) < parseFloat(b) ? -1 : 1;
     else if (aShipMethodPriority == -1 || (bShipMethodPriority != -1 && aShipMethodPriority > bShipMethodPriority))
      return 1;
     else
      return -1;
    });
    
    //nlapiLogExecution('DEBUG', 'filteredShipMethods sorted', JSON.stringify(filteredShipMethods));
    
    return filteredShipMethods;
    //console.log('LiveOrder.getShipMethods shipmethods', JSON.stringify(shipmethods));
   },
   
   getNewOrderDate: function (orderScheduleInDays, lastDateOrdered, scheduleforSetDate, scheduledDayOfMonth) {

    var today = lastDateOrdered; //nlapiStringToDate(lastDateOrdered); //nlapiDateToString(new Date(), "date"));
    
    if (scheduleforSetDate && scheduledDayOfMonth) {
     var orderScheduleInMonths = parseInt(orderScheduleInDays / 28);
     var nextOrderDate = nlapiAddMonths(today, orderScheduleInMonths);
     var lastDateOfMonth = new Date(nextOrderDate.getFullYear(), nextOrderDate.getMonth() + 1, 0).getDate();
     //nlapiLogExecution("ERROR", "orderScheduleInDays/orderScheduleInMonths/nextOrderDate/lastDateOfMonth/Math.min(scheduledDayOfMonth, lastDateOfMonth)", orderScheduleInDays + '/' + orderScheduleInMonths + '/' + nextOrderDate + '/' + lastDateOfMonth + '/' + Math.min(scheduledDayOfMonth, lastDateOfMonth));
     nextOrderDate.setDate(Math.min(scheduledDayOfMonth, lastDateOfMonth));
    }
    else {
     var nextOrderDate = nlapiAddDays(lastDateOrdered, orderScheduleInDays);
     
     while (nextOrderDate.getTime() <= today.getTime())
      nextOrderDate = nlapiAddDays(nextOrderDate, orderScheduleInDays);
    }
    
    return nlapiDateToString(nextOrderDate, "date");
     
   },

   getProductName: function (item)
   {
    'use strict';

    if (!item)
    {
     return '';
    }

    // If its a matrix child it will use the name of the parent
    if (item && item.matrix_parent && item.matrix_parent.internalid)
    {
     return item.matrix_parent.storedisplayname2 || item.matrix_parent.displayname;
    }

    // Otherways return its own name
    return item.storedisplayname2 || item.displayname;
   },
   
   getOrdersForItem: function (id)
   {
    var salesOrderFilters = [new nlobjSearchFilter("voided", null, "is", "F"),
                             new nlobjSearchFilter("mainline", null, "is", "F"),
                             new nlobjSearchFilter("custcol_bb1_blbi_blbi", null, "anyof", id)],
        salesOrderColumns = [new nlobjSearchColumn("internalid", null, "group").setSort(true),
                             new nlobjSearchColumn("trandate", null, "group").setSort(true),
                             new nlobjSearchColumn("tranid", null, "group"),
                             new nlobjSearchColumn("totalamount", null, "group"),
                             new nlobjSearchColumn("status", null, "group"),
                             new nlobjSearchColumn("trackingnumbers", null, "group")],
        salesOrderResults = Application.getAllSearchResults("salesorder", salesOrderFilters, salesOrderColumns);

    return _.map(_.first(salesOrderResults, 20), function (salesOrder) {
     var trackingNumbers = salesOrder.getValue("trackingnumbers", null, "group");
     trackingNumbers = trackingNumbers != "- None -" ? trackingNumbers.split("<BR>") : "";
     return {internalid: salesOrder.getValue("internalid", null, "group"),
             order_number: salesOrder.getValue("tranid", null, "group"),
             date: salesOrder.getValue("trandate", null, "group"),
             summary: {
              total: salesOrder.getValue("totalamount", null, "group"),
              total_formatted: salesOrder.getValue("totalamount", null, "group")
             },
             status: salesOrder.getText("status", null, "group"),
             trackingnumbers: trackingNumbers};
             
    });
   },
   
   getPetNames: function ()
   {
    var customerId = nlapiGetUser(),
        petNameFilters = [
                          new nlobjSearchFilter('isinactive', null, 'is', 'F'),
                          new nlobjSearchFilter('custrecord_bb1_pet_deceased', null, 'is', 'F'),
                          new nlobjSearchFilter('custrecord_bb1_pet_customer', null, 'anyof', customerId)
                         ],
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

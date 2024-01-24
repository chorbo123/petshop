// @module bb1.PetshopShopping.BrandReferral.ShareCode
define(
	'bb1.PetshopShopping.BrandReferral.ShareCode.Model',
	[
		'SC.Model',
		'Application',
		'Models.Init',
		'Configuration',
		'Utils',
		'underscore'
	],
	function (
		SCModel,
		Application,
		ModelsInit,
		Configuration,
		Utils,
		_
	)
 {
  'use strict';

  // @extends SCModel
  return SCModel.extend({

   name: 'bb1.PetshopShopping.BrandReferral.ShareCode',
   
   validation: {
    internalId: { required: true, msg: 'Share Code is required' },
    firstname: { required: true, msg: 'First Name is required' },
    email: { required: true, pattern: 'email', msg: 'Valid Email is required' }
   },

   // @method get
   // @returns {BrandReferral.ShareCode.Model.Data}
   get: function (id, data)
   {
    'use strict';
    
    var customerId = nlapiGetUser();
    var referralShareCodeFilters = [
                                    ['isinactive', 'is', 'F'], 'and',
                                    ['custrecord_bb1_brpsc_referrer', 'anyof', customerId]
                                   ];
    var referralShareCodeColumns = this.getColumnsArray();
    
    if (id)
     referralShareCodeFilters.push('and', ['internalid', 'anyof', id]);
     
    var referralShareCodes = this.searchHelper(referralShareCodeFilters, referralShareCodeColumns) || [];
    
    if (id && referralShareCodes.length) {
     var referralShareCode = referralShareCodes[0];
     
     this.renderPromotionMessage(referralShareCode, data);
     
     return referralShareCode;
    }
    
    return referralShareCodes;
   },
   
   getColumnsArray: function ()
   {
    'use strict';

    return [
     new nlobjSearchColumn('name').setSort(),
     new nlobjSearchColumn('custrecord_bb1_brpsc_brp'),
     new nlobjSearchColumn('custrecord_bb1_brpsc_referrer'),
     new nlobjSearchColumn('custrecord_bb1_brp_brand', 'custrecord_bb1_brpsc_brp'),
     new nlobjSearchColumn('custrecord_bb1_brp_refereepromomsgtitle', 'custrecord_bb1_brpsc_brp'),
     new nlobjSearchColumn('custrecord_bb1_brp_refereepromomessage', 'custrecord_bb1_brpsc_brp')
    ];
   },
   
   searchHelper: function (referralShareCodeFilters, referralShareCodeColumns)
   {
    'use strict';
    
    var referralShareCodeSearchResults = Application.getAllSearchResults('customrecord_bb1_brpsc', referralShareCodeFilters, referralShareCodeColumns);

    return _.map(referralShareCodeSearchResults, function (referralShareCodeSearchResult)
    {
     var referralShareCodeId = referralShareCodeSearchResult.getId();
     
     var referralShareCode = {
      internalId: referralShareCodeId,
      code: referralShareCodeSearchResult.getValue('name'),
      refereePromoMessageTitle: referralShareCodeSearchResult.getValue('custrecord_bb1_brp_refereepromomsgtitle', 'custrecord_bb1_brpsc_brp'),
      refereePromoMessage: referralShareCodeSearchResult.getValue('custrecord_bb1_brp_refereepromomessage', 'custrecord_bb1_brpsc_brp'),
      brand: {
       internalId: referralShareCodeSearchResult.getValue('custrecord_bb1_brp_brand', 'custrecord_bb1_brpsc_brp'),
       name: referralShareCodeSearchResult.getText('custrecord_bb1_brp_brand', 'custrecord_bb1_brpsc_brp'),
      },
      brandReferralProgramme: {
       internalId: referralShareCodeSearchResult.getValue('custrecord_bb1_brpsc_brp'),
       name: referralShareCodeSearchResult.getText('custrecord_bb1_brpsc_brp'),
      }
     };
     
     return referralShareCode;
    });
   },
   
   sendShareCode: function (data)
   {
    'use strict';

    if (!ModelsInit.session.isLoggedIn())
     throw unauthorizedError;

    this.validate(data);
    
    var shareCodeId = data.internalId;
    var shareCode = this.get(shareCodeId, data);
    var customerId = nlapiGetUser();
    
    var emailAuthor = 80525;
    var emailRecipient = data.email; //"mmostratos@bluebridgeone.com";
    var emailBcc = null;
    var emailReplyTo = null;
    var emailSubject = shareCode.refereePromoMessageTitle;
    var emailBody = shareCode.refereePromoMessage;
    var attachToRecords = {entity: customerId, recordtype: 'customrecord_bb1_brpsc', record: shareCodeId};
    
    nlapiSendEmail(emailAuthor, emailRecipient, emailSubject, emailBody, null, emailBcc, attachToRecords, null, null, null, emailReplyTo);
    
    return data;
   },

   renderPromotionMessage: function (shareCode, data)
   {
    if (!shareCode.internalId) return;
    
    var customerId = nlapiGetUser();
    var messageTemplate = shareCode.refereePromoMessage; //'<p>New message sent from <b>' + data.fullname + '</b> at email adress <b>' + data.email + '</b></p><blockquote>' + this.encodeHtmlFromMessage(data.message) + '</blockquote>';
    
    var shareCodeRec = nlapiLoadRecord('customrecord_bb1_brpsc', shareCode.internalId);
    var customerRec = nlapiLoadRecord('customer', customerId);
    var templateRenderer = nlapiCreateTemplateRenderer();
    
    if (data) {
     shareCodeRec.setFieldValue('custpage_bb1_brpsc_referee_firstname', data.firstname);
     shareCodeRec.setFieldValue('custpage_bb1_brpsc_referee_email', data.email);
    }
    else {
     messageTemplate = messageTemplate.replace(/\${customrecord\.custpage_bb1_brpsc_referee_firstname}/gi, '{{firstname}}');
     messageTemplate = messageTemplate.replace(/\${customrecord\.custpage_bb1_brpsc_referee_email}/gi, '{{email}}');
    }
    
    templateRenderer.setTemplate(messageTemplate);
    templateRenderer.addRecord('customrecord', shareCodeRec);
    templateRenderer.addRecord('customer', customerRec);
    
    shareCode.refereePromoMessage = templateRenderer.renderToString();
   },
   
   stripHtmlFromMessage: function (message)
   {
    return message.replace(/<br\s*[\/]?>/gi, '\n').replace(/<(?:.|\n)*?>/gm, '');
   },
   
   encodeHtmlFromMessage: function (message)
   {
    return message.replace(/\r\n|\n|\r/gi, '<br>');
   }

  });

 }
);

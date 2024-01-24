// @module bb1.PetshopShopping.Case
define(
	'bb1.PetshopShopping.Case',
	[
  'Case.Model',
  'Application',
  'Configuration',
		'Utils',
		'SC.Model',
		'Models.Init',

		'underscore'
	],
	function (
  CaseModel,
		Application,
  Configuration,
		Utils,
		SCModel,
  ModelsInit,

 	_
	)
 {
  'use strict';
  
  Application.on('after:Case.getNew', function (model, result)
  {
   var caseRecord = nlapiCreateRecord('supportcase');
			var salesOrderField = caseRecord.getField('custevent_cat_salesorder');
			var salesOrderOptions = salesOrderField.getSelectOptions();
			var salesOrderOptionValues = [];

			_(salesOrderOptions).each(function (salesOrderOption) {
				var salesOrderOptionValue = {
					id: salesOrderOption.id
				,	text: salesOrderOption.text.replace(/Sales Order #/i, '')
				};

				salesOrderOptionValues.push(salesOrderOptionValue);
			});
   
   salesOrderOptionValues = _.sortBy(salesOrderOptionValues, function(salesOrderOptionValue) {
    return parseFloat(salesOrderOptionValue.id, 10);
   }).reverse();
   
   result.salesorders = salesOrderOptionValues;
   //result.salesorder = caseRecord.getFieldValue('custevent_cat_salesorder');
  });
  
  Application.on('after:Case.getColumnsArray', function (model, result)
  {
   result.push(new nlobjSearchColumn('custevent_cat_salesorder'));
  });
  
  /*Application.on('after:Case.searchHelper', function (model, result, case_record)
  {
			_.each(result.records, function (case_record)
			{
				// @class Case.Model.Attributes
				var current_record_id = case_record.getId()
				,	created_date = nlapiStringToDate(case_record.getValue('createddate'))
				,	last_message_date = nlapiStringToDate(case_record.getValue('lastmessagedate'))
				,	support_case = {
						//@property {String} internalid
						internalid: current_record_id

						//@property {String} caseNumber
					,	caseNumber: case_record.getValue('casenumber')

						//@property {String} title
					,	title: case_record.getValue('title')

						// @property {Array<String, Case.Model.Attributes.Message>} grouped_messages
						// @class Case.Model.Attributes.Message
							// @property {String} author
							// @property {String} text
							// @property {String} messageDate
							// @property {String} initialDate
						// @class Case.Model.Attributes
					,	grouped_messages: []

						// @property {Case.Model.Attributes.Status} status
						// @class Case.Model.Attributes.Status
							// @property {String} id
							// @property {String} text
						// @class Case.Model.Attributes
					,	status: {
							id: case_record.getValue('status')
						,	name: case_record.getText('status')
						}

						// @property {Case.Model.Attributes.Origin} origin
						// @class Case.Model.Attributes.Origin
							// @property {String} id
							// @property {String} text
						// @class Case.Model.Attributes
					,	origin: {
							id: case_record.getValue('origin')
						,	name: case_record.getText('origin')
						}

						// @property {Case.Model.Attributes.Category} category
						// @class Case.Model.Attributes.Category
							// @property {String} id
							// @property {String} text
						// @class Case.Model.Attributes
					,	category: {
							id: case_record.getValue('category')
						,	name: case_record.getText('category')
						}

						// @property {Case.Model.Attributes.Company} company
						// @class Case.Model.Attributes.Company
							// @property {String} id
							// @property {String} text
						// @class Case.Model.Attributes
					,	company: {
							id: case_record.getValue('company')
						,	name: case_record.getText('company')
						}

						// @property {Case.Model.Attributes.Priority} priority
						// @class Case.Model.Attributes.Priority
							// @property {String} id
							// @property {String} text
						// @class Case.Model.Attributes
					,	priority: {
							id: case_record.getValue('priority')
						,	name: case_record.getText('priority')
						}
						//@property {String} createdDate
					,	createdDate: nlapiDateToString(created_date ? created_date : self.dummy_date, 'date')

						//@property {String} lastMessageDate
					,	lastMessageDate: nlapiDateToString(last_message_date ? last_message_date : self.dummy_date, 'date')

						//@property {String} email
					,	email: case_record.getValue('email')
     
					};
     
    case_record.salesorder = {
     id: case_record.getValue('custevent_cat_salesorder')
    ,	name: case_record.getText('custevent_cat_salesorder')
    };

				return support_case;
			});
  });*/
  
  
  if (CaseModel) {
   _.extend(CaseModel, {
    
    searchHelper: function (filters, columns, page, join_messages)
    {
     var self = this
     ,	result = Application.getPaginatedSearchResults({
       record_type: 'supportcase'
      ,	filters: filters
      ,	columns: columns
      ,	page: page
      });

     result.records = _.map(result.records, function (case_record)
     {
      // @class Case.Model.Attributes
      var current_record_id = case_record.getId()
      ,	created_date = nlapiStringToDate(case_record.getValue('createddate'))
      ,	last_message_date = nlapiStringToDate(case_record.getValue('lastmessagedate'))
      ,	support_case = {
        //@property {String} internalid
        internalid: current_record_id

        //@property {String} caseNumber
       ,	caseNumber: case_record.getValue('casenumber')

        //@property {String} title
       ,	title: case_record.getValue('title')

        // @property {Array<String, Case.Model.Attributes.Message>} grouped_messages
        // @class Case.Model.Attributes.Message
         // @property {String} author
         // @property {String} text
         // @property {String} messageDate
         // @property {String} initialDate
        // @class Case.Model.Attributes
       ,	grouped_messages: []

        // @property {Case.Model.Attributes.Status} status
        // @class Case.Model.Attributes.Status
         // @property {String} id
         // @property {String} text
        // @class Case.Model.Attributes
       ,	status: {
         id: case_record.getValue('status')
        ,	name: case_record.getText('status')
        }

        // @property {Case.Model.Attributes.Origin} origin
        // @class Case.Model.Attributes.Origin
         // @property {String} id
         // @property {String} text
        // @class Case.Model.Attributes
       ,	origin: {
         id: case_record.getValue('origin')
        ,	name: case_record.getText('origin')
        }

        // @property {Case.Model.Attributes.Category} category
        // @class Case.Model.Attributes.Category
         // @property {String} id
         // @property {String} text
        // @class Case.Model.Attributes
       ,	category: {
         id: case_record.getValue('category')
        ,	name: case_record.getText('category')
        }

        // @property {Case.Model.Attributes.Company} company
        // @class Case.Model.Attributes.Company
         // @property {String} id
         // @property {String} text
        // @class Case.Model.Attributes
       ,	company: {
         id: case_record.getValue('company')
        ,	name: case_record.getText('company')
        }

        // @property {Case.Model.Attributes.Priority} priority
        // @class Case.Model.Attributes.Priority
         // @property {String} id
         // @property {String} text
        // @class Case.Model.Attributes
       ,	priority: {
         id: case_record.getValue('priority')
        ,	name: case_record.getText('priority')
        }
        //@property {String} createdDate
       ,	createdDate: nlapiDateToString(created_date ? created_date : self.dummy_date, 'date')

        //@property {String} lastMessageDate
       ,	lastMessageDate: nlapiDateToString(last_message_date ? last_message_date : self.dummy_date, 'date')

        //@property {String} email
       ,	email: case_record.getValue('email')
       
       , salesorder: {
         id: case_record.getValue('custevent_cat_salesorder')
        ,	name: case_record.getText('custevent_cat_salesorder').replace(/Sales Order #/i, '')
        }
       };

      if (join_messages)
      {
       self.appendMessagesToCase(support_case);
      }

      return support_case;
     });

     // @class Case.Model
     return result;
    },
  
    create: function (customerId, data)
    {
     //console.log('CaseModel.create override');
     customerId = customerId || nlapiGetUser() + '';

     var newCaseRecord = nlapiCreateRecord('supportcase');

     data.title && newCaseRecord.setFieldValue('title', Utils.sanitizeString(data.title));
     data.message && newCaseRecord.setFieldValue('incomingmessage', Utils.sanitizeString(data.message));
     data.category && newCaseRecord.setFieldValue('category', data.category);
     data.salesorder && newCaseRecord.setFieldValue('custevent_cat_salesorder', data.salesorder);
     data.email && newCaseRecord.setFieldValue('email', data.email);
     customerId && newCaseRecord.setFieldValue('company', customerId);

     var default_values = this.configuration.defaultValues;

     newCaseRecord.setFieldValue('status', default_values.statusStart.id); // Not Started
     newCaseRecord.setFieldValue('origin', default_values.origin.id); // Web

     return nlapiSubmitRecord(newCaseRecord);
    }
   
   });
  }
  
 }
);

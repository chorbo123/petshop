// @module bb1.PetshopShopping.ProductReviews
define(
	'bb1.PetshopShopping.ProductReviews',
	[
  'ProductReviews.Model',
  'Application',
  'Configuration',
		'Utils',
		'SC.Model',
		'Models.Init',

		'underscore'
	],
	function (
  ProductReviewsModel,
		Application,
  Configuration,
		Utils,
		SCModel,
  ModelsInit,

 	_
	)
{
	'use strict';
	
 ProductReviewsModel.create = function (data)
 {
  console.log('Override ProductReviewsModel.prototype.create()');
  if (this.loginRequired && !ModelsInit.session.isLoggedIn2())
  {
   throw unauthorizedError;
  }

  var review = nlapiCreateRecord('customrecord_ns_pr_review');
  
  if (ModelsInit.session.isLoggedIn2())
  {
   review.setFieldValue('custrecord_ns_prr_writer', nlapiGetUser() + '');	
  }
 
  var webSiteAccessId = Configuration.get('websiteAccess.internalId');
  review.setFieldValue('custrecord_ns_prr_website', webSiteAccessId);

  console.log('Set custrecord_ns_prr_website to ', webSiteAccessId);
  
  if (data.writer)
  {
   data.writer.name && review.setFieldValue('custrecord_ns_prr_writer_name', Utils.sanitizeString(data.writer.name));
   data.writer.id && review.setFieldValue('custrecord_ns_prr_writer', data.writer.id);
  }
  data.rating && review.setFieldValue('custrecord_ns_prr_rating', data.rating);
  data.title && review.setFieldValue('name', Utils.sanitizeString(data.title));
  
  if (data.text)
  {
   var sanitized_text = Utils.sanitizeString(data.text);

   review.setFieldValue('custrecord_ns_prr_text', sanitized_text);
   data.text = sanitized_text.replace(/\n/g, '<br>');
  }
   
  data.itemid && review.setFieldValue('custrecord_ns_prr_item_id', data.itemid);

  var review_id = nlapiSubmitRecord(review);

  _.each(data.rating_per_attribute, function (rating, name)
  {
   var review_attribute = nlapiCreateRecord('customrecord_ns_pr_attribute_rating');

   review_attribute.setFieldValue('custrecord_ns_prar_item', data.itemid);
   review_attribute.setFieldValue('custrecord_ns_prar_review', review_id);
   review_attribute.setFieldValue('custrecord_ns_prar_rating', rating);
   review_attribute.setFieldText('custrecord_ns_prar_attribute', name);

   nlapiSubmitRecord(review_attribute);
  });

  return data;
 };

 ProductReviewsModel.search = function (filters, order, page, records_per_page)
 {
  var review_filters = [
    // only approved reviews
    new nlobjSearchFilter('custrecord_ns_prr_status', null, 'is', this.approvedStatus)
    // and not inactive
   ,	new nlobjSearchFilter('isinactive', null, 'is', 'F')
   ]
  ,	review_columns = {}
  ,	result = {};

  // Creates the filters for the given arguments
  if (filters.itemid)
  {
   review_filters.push(
    new nlobjSearchFilter('custrecord_ns_prr_item', null, 'anyof', filters.itemid.split(","))
   );
  }

  // Only by verified buyer
  if (filters.writer)
  {
   review_filters.push(
    new nlobjSearchFilter('custrecord_ns_prr_writer', null, 'equalto', filters.writer)
   );
  }

  // only by a rating
  if (filters.rating)
  {
   review_filters.push(
    new nlobjSearchFilter('custrecord_ns_prr_rating', null, 'equalto', filters.rating)
   );
  }

  if (filters.q)
  {
   review_filters.push(
    new nlobjSearchFilter('custrecord_ns_prr_text', null, 'contains', filters.q)
   );
  }

  // Selects the columns
  review_columns = {
   internalid: new nlobjSearchColumn('internalid')
  ,	title: new nlobjSearchColumn('name')
  ,	text: new nlobjSearchColumn('custrecord_ns_prr_text')
  ,	itemid: new nlobjSearchColumn('custrecord_ns_prr_item_id')
  ,	rating: new nlobjSearchColumn('custrecord_ns_prr_rating')
  ,	isVerified: new nlobjSearchColumn('custrecord_ns_prr_verified')
  ,	useful_count: new nlobjSearchColumn('custrecord_ns_prr_useful_count')
  ,	not_useful_count: new nlobjSearchColumn('custrecord_ns_prr_not_useful_count')
  ,	writer: new nlobjSearchColumn('custrecord_ns_prr_writer')
  ,	writer_name: new nlobjSearchColumn('custrecord_ns_prr_writer_name')
  ,	created_on: new nlobjSearchColumn('created')
  };

  var custom_created_field_exists = Utils.recordTypeHasField('customrecord_ns_pr_review','custrecord_ns_prr_creation_date');

  if (custom_created_field_exists === true)
  {
   review_columns.custom_created_on = new nlobjSearchColumn('custrecord_ns_prr_creation_date');
  }

  // Sets the sort order
  var order_tokens = order && order.split(':') || []
  ,	sort_column = order_tokens[0] || 'created'
  ,	sort_direction = order_tokens[1] || 'ASC';

  review_columns[sort_column] && review_columns[sort_column].setSort(sort_direction === 'DESC');

  // Makes the request and format the response
  result = Application.getPaginatedSearchResults({
   record_type: 'customrecord_ns_pr_review'
  ,	filters: review_filters
  ,	columns: _.values(review_columns)
  ,	page: parseInt(page, 10) || 1
  ,	results_per_page: parseInt(records_per_page, 10) || this.resultsPerPage
  });

  var reviews_by_id = {}
  ,	review_ids = [];

  _.each(result.records, function (review)
  {
   review_ids.push(review.getId());

   reviews_by_id[review.getId()] = {
    internalid: review.getId()
   ,	title: review.getValue('name')
   ,	text: review.getValue('custrecord_ns_prr_text') ? review.getValue('custrecord_ns_prr_text').replace(/\n/g, '<br>') : ''
   ,	itemid: review.getValue('custrecord_ns_prr_item_id')
   ,	rating: review.getValue('custrecord_ns_prr_rating')
   ,	useful_count: review.getValue('custrecord_ns_prr_useful_count')
   ,	not_useful_count: review.getValue('custrecord_ns_prr_not_useful_count')
   ,	isVerified: review.getValue('custrecord_ns_prr_verified') === 'T'
   ,	created_on: review.getValue('custrecord_ns_prr_creation_date') || review.getValue('created')
   ,	writer: {
     id: review.getValue('custrecord_ns_prr_writer')
    ,	name: review.getValue('custrecord_ns_prr_writer_name') || review.getText('custrecord_ns_prr_writer')
    }
   ,	rating_per_attribute: {}
   };
  });

  if (review_ids.length)
  {
   /// Loads Attribute Rating
   var attribute_filters = [
     new nlobjSearchFilter('custrecord_ns_prar_review', null, 'anyof', review_ids)
    ]

   ,	attribute_columns = [
     new nlobjSearchColumn('custrecord_ns_prar_attribute')
    ,	new nlobjSearchColumn('custrecord_ns_prar_rating')
    ,	new nlobjSearchColumn('custrecord_ns_prar_review')
    ]

   ,	ratings_per_attribute = Application.getAllSearchResults('customrecord_ns_pr_attribute_rating', attribute_filters, attribute_columns);

   _.each(ratings_per_attribute, function (rating_per_attribute)
   {
    var review_id = rating_per_attribute.getValue('custrecord_ns_prar_review')
    ,	attribute_name = rating_per_attribute.getText('custrecord_ns_prar_attribute')
    ,	rating = rating_per_attribute.getValue('custrecord_ns_prar_rating');

    if (reviews_by_id[review_id])
    {
     reviews_by_id[review_id].rating_per_attribute[attribute_name] = rating;
    }
   });
  }

  result.records = _.values(reviews_by_id);

  return result;
 };

 
});

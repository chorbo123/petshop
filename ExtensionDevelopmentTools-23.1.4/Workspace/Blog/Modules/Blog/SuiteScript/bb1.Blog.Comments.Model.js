// @module bb1.Blog
define(
	'bb1.Blog.Comments.Model',
	[
  'Application',
		'Utils',
		'SC.Model',
  'Configuration',

		'underscore'
	],
	function (
		Application,
		Utils,
		SCModel,
  Configuration,

		_
	)
{
	'use strict';

	return SCModel.extend({
		name: 'bb1.Blog.Comment',

  // model validation
  validation: {
   name: {required: true, msg: 'Name is required'},
   email: {required: true,	pattern: 'email', msg: 'Valid Email is required'},
   comments: {required: true, msg: 'Comments is required'},
   internalid: {required: true, msg: 'Article is required'},
   "g-recaptcha-response": {required: true, msg: 'Captcha response is required'}
  },

  get: function (id)
  {
   'use strict';

   var blogSiteId = Configuration.BlueBridgeBlog.blog_site,
       filters = [new nlobjSearchFilter("isinactive", null, "is", "F"),
                  new nlobjSearchFilter("isinactive", "custrecord_bb1_wbcm_article", "is", "F"),
                  new nlobjSearchFilter("custrecord_bb1_wba_blogsite", "custrecord_bb1_wbcm_article", "anyof", blogSiteId),
                  new nlobjSearchFilter("custrecord_bb1_wbcm_status", null, "anyOf", 2)],
       columns = this.getColumnsArray();
       
   if (isNaN(id))
    filters.push(new nlobjSearchFilter("custrecord_bb1_wba_urlcomponent", "custrecord_bb1_wbcm_article", "is", id));
   else
    filters.push(new nlobjSearchFilter("custrecord_bb1_wbcm_article", null, "anyof", id));
       
   var result = this.searchHelper(filters, columns, "all");
   
   return result.comments;
  },
  
  getColumnsArray: function ()
  {
   'use strict';

   return [
    new nlobjSearchColumn("custrecord_bb1_wbcm_article"),
    new nlobjSearchColumn("custrecord_bb1_wbcm_comment"),
    new nlobjSearchColumn("custrecord_bb1_wbcm_dateposted").setSort(),
    new nlobjSearchColumn("custrecord_bb1_wbcm_submittedby_email"),
    new nlobjSearchColumn("custrecord_bb1_wbcm_submittedby_name"),
    new nlobjSearchColumn("custrecord_bb1_wbcm_submittedby_customer"),
    new nlobjSearchColumn("custrecord_bb1_wbcm_submittedby_contact"),
    new nlobjSearchColumn("custrecord_bb1_wbcm_replytocomment"),
    new nlobjSearchColumn("lastmodified"),
    new nlobjSearchColumn("firstname","custrecord_bb1_wbcm_submittedby_contact"),
    new nlobjSearchColumn("lastname","custrecord_bb1_wbcm_submittedby_contact")
   ];
  },
  
  searchHelper: function (filters, columns, page)
  {
   'use strict';
   
   var self = this,
       result = page == "all" ? {records: Application.getAllSearchResults('customrecord_bb1_wbcm', filters, columns)} : Application.getPaginatedSearchResults({
        record_type: 'customrecord_bb1_wbcm',
        filters: filters,
        columns: columns,
        page: page
       }),
       commentLookup = {};

   result.comments = [];
   
   _.each(result.records, function (comment)
   {
    var current_record_id = comment.getId(),
        date_posted = nlapiStringToDate(comment.getValue('custrecord_bb1_wbcm_dateposted')),
        last_modified = nlapiStringToDate(comment.getValue('lastmodified')),
        reply_to_comment = nlapiStringToDate(comment.getValue('custrecord_bb1_wbcm_replytocomment')),
        parentComment = commentLookup[reply_to_comment],
        clean_comment = {
         internalid: current_record_id,
         comment: comment.getValue('custrecord_bb1_wbcm_comment'),
         replyto: reply_to_comment,
         source: comment.getValue('custrecord_bb1_wbcm_submittedby_name'),
         dateposted: date_posted ? nlapiDateToString(date_posted, 'date') : "",
         timeposted: date_posted ? nlapiDateToString(date_posted, 'timeofday') : "",
         lastmodified: last_modified ? nlapiDateToString(last_modified, 'datetime') : ""
        };
    
    commentLookup[current_record_id] = clean_comment;
    
    if (parentComment) {
     if (!parentComment.replies)
      parentComment.replies = [];
     parentComment.replies.push(clean_comment);
    }
    else {
     result.comments.push(clean_comment);
    }
   });

   /*result.comments = _.map(result.records, function (comment)
   {
    var current_record_id = comment.getId(),
        date_posted = nlapiStringToDate(comment.getValue('custrecord_bb1_wbcm_dateposted')),
        last_modified = nlapiStringToDate(comment.getValue('lastmodified')),
        comment = {
         internalid: current_record_id,
         comment: comment.getValue('custrecord_bb1_wbcm_comment'),
         replyto: comment.getValue('custrecord_bb1_wbcm_replytocomment'),
         source: comment.getValue('custrecord_bb1_wbcm_submittedby_name'),
         dateposted: date_posted ? nlapiDateToString(date_posted, 'date') : "",
         timeposted: date_posted ? nlapiDateToString(date_posted, 'timeofday') : "",
         lastmodified: last_modified ? nlapiDateToString(last_modified, 'datetime') : ""
        };
    
    return comment;
   });*/

   delete result.records;
   
   return result;
  }
  
 });
});

// @module bb1.Blog
define(
	'bb1.Blog.Posts.Model',
	[
  'bb1.Blog.Comments.Model',
  'Application',
		'Utils',
		'SC.Model',
  'Configuration',
 
		'underscore'
	],
	function (
  BlogCommentsModel,
		Application,
		Utils,
		SCModel,
  Configuration,

		_
	)
{
	'use strict';

	return SCModel.extend({
 
		name: 'bb1.Blog.Posts',

  // model validation
  validation: {
   name: {required: true, msg: 'Name is required'},
   email: {required: true,	pattern: 'email', msg: 'Valid Email is required'},
   comments: {required: true, msg: 'Comments is required'},
   internalid: {required: true, msg: 'Article is required'},
   "g-recaptcha-response": this.validateRecaptchaResponse
  },

  validateRecaptchaResponse: function (value, attr, computedState)
  {
   var blogSettings = require('BlogSettings.Model').get(),
       recaptchaSiteKey = blogSettings.recaptchaSiteKey;
       
   if (!_.isEmpty(recaptchaSiteKey) && _.isEmpty(value)) {
    return 'Captcha response is required';
   }
  },
   
  get: function (id)
  {
   'use strict';

   var blogSiteId = Configuration.BlueBridgeBlog.blog_site;
   
   var filters = [new nlobjSearchFilter("isinactive", null, "is", "F"),
                  new nlobjSearchFilter("custrecord_bb1_wba_blogsite", null, "anyof", blogSiteId)],
       columns = this.getColumnsArray();
       
   if (isNaN(id))
    filters.push(new nlobjSearchFilter("custrecord_bb1_wba_urlcomponent", null, "is", id));
   else
    filters.push(new nlobjSearchFilter("internalid", null, "anyof", id));
       
   var result = this.searchHelper(filters, columns, 1);
   
   if (result.posts.length > 0) {
    var response = result.posts[0];
    //response.blogSettings = this.getBlogSettings(blogSiteId);
    //response.recentPostsLinks = this.getRecentPostsLinks(blogSiteId, response.blogSettings && response.blogSettings.latestBlogsCount);
    //response.categoryLinks = this.getCategoryLinks(blogSiteId);
    //response.archiveLinks = this.getArchiveLinks(blogSiteId);
    response.comments = BlogCommentsModel.get(id);
    
    return response;
   }
   else
    throw notFoundError;
  },
  
  search: function (list_header_data)
  {
   'use strict';

   var blogSiteId = Configuration.BlueBridgeBlog.blog_site;
   
   list_header_data = _.extend({}, list_header_data);
   
   var filters = [new nlobjSearchFilter("isinactive", null, "is", "F"),
                  new nlobjSearchFilter("custrecord_bb1_wba_blogsite", null, "anyof", blogSiteId)],
       columns = this.getColumnsArray();
      
   if (list_header_data.category) {
   
    var wbacFilters = [new nlobjSearchFilter("isinactive", null, "is", "F"),
                       new nlobjSearchFilter("custrecord_bb1_wba_blogsite", "custrecord_bb1_wbac_article", "anyof", blogSiteId),
                       new nlobjSearchFilter("custrecord_bb1_wbc_urlcomponent", "custrecord_bb1_wbac_category", "is", list_header_data.category)],
        wbacColumns = [new nlobjSearchColumn("custrecord_bb1_wbac_article")],
        wbacResult = Application.getAllSearchResults('customrecord_bb1_wbac', wbacFilters, wbacColumns);
                 
    var postsInCategory = _.map(wbacResult, function (blog_post)
    {
     return blog_post.getValue("custrecord_bb1_wbac_article");
    });
    
    filters.push(new nlobjSearchFilter("internalid", null, "anyof", postsInCategory));
    
   }
   
   if (list_header_data.archive) {
   
    var startDate = this.getStartDateFromArchiveLabel(list_header_data.archive),
        endDate = this.getEndDateFromArchiveLabel(list_header_data.archive);
        
    if (!startDate || !endDate)
     throw nlapiCreateError('APP_ERR_UNKNOWN_BLOG_ARCHIVE', 'The blog archive ' + list_header_data.archive + ' is not a valid date');
     
    filters.push(new nlobjSearchFilter("custrecord_bb1_wba_dateposted", null, "within", nlapiDateToString(startDate), nlapiDateToString(endDate)));
    
   }
   
   if (list_header_data.search) {
    
    filters.push(new nlobjSearchFilter("custrecord_bb1_wba_searchkeywords", null, "haskeywords", list_header_data.search.split(/\s+/)));
    
   }
   
   this.setSortOrder(list_header_data.sort, list_header_data.order, columns);
   
   var result = this.searchHelper(filters, columns, list_header_data.page, list_header_data.resultsperpage);
   
   return result;
  },
  
  getPaginatedSearchResultsWithFrontPageFeature: function (options)
  {
   'use strict';

   options = options || {};

   var results_per_page = options.results_per_page || Configuration.BlueBridgeBlog.results_per_page
   ,	page = options.page || 1
   ,	columns = options.columns || []
   ,	filters = options.filters || []
   ,	record_type = options.record_type
   ,	range_start = (page * results_per_page) - results_per_page
   ,	range_end = page * results_per_page
   ,	do_real_count = _.any(columns, function (column)
    {
     return column.getSummary();
    });
   
   if (page === 1) { // return 1 extra item on the first page
    range_end++;
    results_per_page++;
   }
   else { // offset by 1 on all other pages
    range_start++;
    range_end++;
   }
   
   var	result = {
     page: page
    ,	recordsPerPage: results_per_page
    ,	records: []
    };

   if (!do_real_count || options.column_count)
   {
    var column_count = options.column_count || new nlobjSearchColumn('internalid', null, 'count')
    ,	count_result = nlapiSearchRecord(record_type, null, filters, [column_count]);

    result.totalRecordsFound = parseInt(count_result[0].getValue(column_count), 10);
   }

   if (do_real_count || (result.totalRecordsFound > 0 && result.totalRecordsFound > range_start))
   {
    var search = nlapiCreateSearch(record_type, filters, columns).runSearch();
    result.records = search.getResults(range_start, range_end);

    if (do_real_count && !options.column_count)
    {
     result.totalRecordsFound = search.getResults(0, 1000).length;
    }
   }

   return result;
  },
  
  searchHelper: function (filters, columns, page, resultsPerPage)
  {
   'use strict';
   
   var self = this,
       result = page == "all" ? {records: Application.getAllSearchResults('customrecord_bb1_wba', filters, columns)} : this.getPaginatedSearchResultsWithFrontPageFeature({
        record_type: 'customrecord_bb1_wba',
        filters: filters,
        columns: columns,
        page: page,
        results_per_page: resultsPerPage
       });

   result.posts = _.map(result.records, function (blog_post)
   {
    var current_record_id = blog_post.getId(),
        date_posted = nlapiStringToDate(blog_post.getValue('custrecord_bb1_wba_dateposted')),
        last_modified = nlapiStringToDate(blog_post.getValue('lastmodified')),
        sanitised_blog_post = {
         internalid: current_record_id,
         heading: blog_post.getValue('custrecord_bb1_wba_heading'),
         source: blog_post.getValue('custrecord_bb1_wba_source'),
         summary: blog_post.getValue('custrecord_bb1_wba_summary'),
         contents: blog_post.getValue('custrecord_bb1_wba_contents'),
         image: blog_post.getText('custrecord_bb1_wba_image1'),
         pagetitle: blog_post.getValue('custrecord_bb1_wba_pagetitle'),
         metataghtml: blog_post.getValue('custrecord_bb1_wba_metataghtml'),
         dateposted: date_posted ? nlapiDateToString(date_posted, 'datetime') : "",
         lastmodified: last_modified ? nlapiDateToString(last_modified, 'datetime') : "",
         url: blog_post.getValue('custrecord_bb1_wba_urlcomponent')
        };
    
    if (result.records.length == 1) {
     try {
      var pdfattachmentId = blog_post.getValue('custrecord_bb1_wba_pdfattachment1'),
          pdfFile = nlapiLoadFile(pdfattachmentId);
      sanitised_blog_post.pdfattachmentname = blog_post.getText('custrecord_bb1_wba_pdfattachment1');
      sanitised_blog_post.pdfattachment = pdfFile.getUrl();
     }
     catch (e) {
      console.warn("Error occurred while trying to get the PDF attachment URL", e && e.getCode ? e.getCode() + ": " + e.getDetails() : e);
     }
    }
    return sanitised_blog_post;
   });

   delete result.records;
   
   return result;
  },
  
  create: function (data)
  {
   'use strict';

   this.validate(data);

   var context = nlapiGetContext(),
       userid = nlapiGetUser(),
       contactid = context.getContact(),
       siteId = Configuration.BlueBridgeBlog.blog_site,
       site = nlapiLoadRecord("customrecord_bb1_wbs", siteId);
   
   data.customerid = data.userid = userid;
   data.contactid = contactid;
   
   if (!site)
    throw nlapiCreateError("SITE_NOT_FOUND", "Specified site not found");
    
   var allowComments = site.getFieldValue("custrecord_bb1_wbs_allowcomments") == "T",
       searchDuplicatesForNewLeads = site.getFieldValue("custrecord_bb1_wbs_searchduplicateleads") == "T",
       loginToComment = site.getFieldValue("custrecord_bb1_wbs_logintocomment") == "T",
       recaptchaSiteKey = site.getFieldValue("custrecord_bb1_wbs_recaptchasitekey"),
       recaptchaSecretKey = site.getFieldValue("custrecord_bb1_wbs_recaptchasecretkey") || '';
   
   if (!allowComments)
    throw nlapiCreateError("COMMENTS_NOT_ALLOWED", "Specified site does not allow user comments to be submitted.");
    
   if (loginToComment && !session.isLoggedIn())
    throw unauthorizedError; //"You must login first before you can submit comments.";

   if (recaptchaSiteKey) {
    
    var recaptchaVerifyUrl = "https://www.google.com/recaptcha/api/siteverify",
        clientIpAddress = request.getHeader("NS-CLIENT-IP"),
        parms = {
         secret: recaptchaSecretKey,
         //remoteip: clientIpAddress,
         response: data["g-recaptcha-response"]
        },
        recaptchaResponse = JSON.parse(nlapiRequestURL(recaptchaVerifyUrl, parms).getBody());
        
    if (!recaptchaResponse || !recaptchaResponse.success)
     throw nlapiCreateError("RECAPTCHA_FAILED", "Failed to verify reCAPTCHA response");

   }
   
   var name_tokens = data.name.split(/\s/);
   data.lastname = name_tokens.pop();
   data.firstname = name_tokens.join(" ");
   
   if (name_tokens.length == 0) {
    var tmp = data.firstname;
    data.firstname = data.lastname;
    data.lastname = tmp;
   }
   
   /*if (_.isEmpty(data.contactid) && !_.isEmpty(userid) && userid != -4) { // If logged in as customer (not contact), search for existing contact details or create a new contact
   
    var dupefields = {"email" : data.email, "firstname" : data.firstname, "lastname": data.lastname};
    
    dupefields.company = data.customerid = userid;
     
    var dupes = nlapiSearchDuplicate("contact", dupefields);
    
    if (dupes && dupes.length > 0) {
     data.contactid = dupes[0].getId();
     data.customerid = nlapiLookupField("contact", data.contactid, "company");
    }
    else {
     var contact = nlapiCreateRecord("contact");
     contact.setFieldValue("entityid", data.name); // make sure entityid is unique
     contact.setFieldValue("company", data.customerid);
     contact.setFieldValue("firstname", data.firstname);
     contact.setFieldValue("lastname", data.lastname);
     contact.setFieldValue("email", data.email);
     //contact.setFieldValue("custentity_bb1_website", website);
     data.contactid = nlapiSubmitRecord(contact, true, true);
    }
    
   }
   else if (searchDuplicatesForNewLeads && (_.isEmpty(userid) || userid == -4)) { // If not logged in search for duplicate lead or create a new lead
   
    var dupefields = {"email" : data.email, "firstname" : data.firstname, "lastname": data.lastname};
     
    var dupes = nlapiSearchDuplicate("customer", dupefields);
    
    if (dupes && dupes.length > 0) {
     data.contactid = data.customerid = dupes[0].getId();
    }
    
   }
   
   if (_.isEmpty(data.customerid)) {
    
    var filters = [new nlobjSearchFilter("entityid", null, "startswith", data.name)];
    var existingCustomers = nlapiSearchRecord("customer", null, filters);
    
    var entityId = data.name;
    if (existingCustomers && existingCustomers.length)
     entityId += " " + (existingCustomers.length+1);
     
    var lead = nlapiCreateRecord("lead");
    lead.setFieldValue("entityid", entityId); // make sure entityid is unique
    lead.setFieldValue("isperson", "T");
    lead.setFieldValue("firstname", data.firstname);
    lead.setFieldValue("lastname", data.lastname);
    lead.setFieldValue("email", data.email);
    data.website && lead.setFieldValue("website", data.website);
    data.customerid = nlapiSubmitRecord(lead, true, true);
    
   }*/
   
   // Create the Blog Comment record
   var wbcm = nlapiCreateRecord("customrecord_bb1_wbcm");
   wbcm.setFieldValue("custrecord_bb1_wbcm_article", data.internalid);
   wbcm.setFieldValue("custrecord_bb1_wbcm_submittedby_name", data.name);
   wbcm.setFieldValue("custrecord_bb1_wbcm_submittedby_email", data.email);
   wbcm.setFieldValue("custrecord_bb1_wbcm_comment", this.sanitize(data.comments));
   wbcm.setFieldValue("custrecord_bb1_wbcm_status", "1"); // pending approval
   data.commentid && wbcm.setFieldValue("custrecord_bb1_wbcm_replytocomment", data.commentid);
   data.customerid && wbcm.setFieldValue("custrecord_bb1_wbcm_submittedby_customer", data.customerid);
   data.contactid && wbcm.setFieldValue("custrecord_bb1_wbcm_submittedby_contact", data.contactid);
   data.wbcmid = nlapiSubmitRecord(wbcm, true, true);
   
   return data;
  },

  // Sanitize html input
  sanitize: function (text)
  {
   'use strict';
   return text ? text.replace(/<br>/g, '\n').replace(/</g, '&lt;').replace(/\>/g, '&gt;') : '';
  },

  getColumnsArray: function ()
  {
   'use strict';

   return [
    new nlobjSearchColumn("custrecord_bb1_wba_heading"),
    new nlobjSearchColumn("custrecord_bb1_wba_summary"),
    new nlobjSearchColumn("custrecord_bb1_wba_contents"),
    new nlobjSearchColumn("custrecord_bb1_wba_dateposted"),
    new nlobjSearchColumn("custrecord_bb1_wba_image1"),
    new nlobjSearchColumn("custrecord_bb1_wba_pdfattachment1"),
    new nlobjSearchColumn("custrecord_bb1_wba_source"),
    new nlobjSearchColumn("custrecord_bb1_wba_pagetitle"),
    new nlobjSearchColumn("custrecord_bb1_wba_metataghtml"),
    new nlobjSearchColumn("lastmodified"),
    new nlobjSearchColumn("custrecord_bb1_wba_urlcomponent"),
    new nlobjSearchColumn("custrecord_bb1_wba_htmlurl01"),
    new nlobjSearchColumn("lastmodified")
   ];
  },
  
  setSortOrder: function (sort, order, columns) 
  {
   'use strict';

   switch (sort)
   {
    case 'postedDate':
     columns[3].setSort(order > 0);
     break;
    default:
     columns[3].setSort(true);
   }
   
   return columns;
  },
  
  getStartDateFromArchiveLabel: function (label) {
  
   if (!label) return "";
   
   var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug","Sep", "Oct", "Nov", "Dec"],
       dateRegex = new RegExp("^(" + months.join("|") + ")-([1-9][0-9]{3})$");
   
   if (!dateRegex.test(label)) return "";
   
   var dateTokens = dateRegex.exec(label),
       month = months.indexOf(dateTokens[1]),
       year = dateTokens[2],
       date = new Date(year, month, 1);
   
   return date;
   
  },
  
  getEndDateFromArchiveLabel: function (label) {
  
   var endDate = this.getStartDateFromArchiveLabel(label);
   
   if (!endDate) return "";
   
   endDate.setMonth(endDate.getMonth() + 1, 0);
       
   return endDate;
   
  }

	});
});
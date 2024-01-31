// @module bb1.Blog
define(
	'bb1.Blog.Settings.Model',
	[
  'Application',
  'Configuration',
		'Utils',
		'SC.Model',

		'underscore'
	],
	function (
		Application,
  Configuration,
		Utils,
		SCModel,

		_
	)
{
	'use strict';

	return SCModel.extend({
		name: 'bb1.Blog.Settings',

  get: function ()
  {
   'use strict';

   var result = _.extend({}, Configuration.BlueBridgeBlog);
   
   result.blogSettings = this.getBlogSettings();
   result.recentPostsLinks = this.getRecentPostsLinks(result.blogSettings && result.blogSettings.latestBlogsCount);
   result.categoryLinks = this.getCategoryLinks();
   result.archiveLinks = this.getArchiveLinks();
   
   return result;
  },
  
  getBlogSettings: function ()
  {
   'use strict';

   var blogSiteId = Configuration.BlueBridgeBlog.blog_site,
       filters = [new nlobjSearchFilter("isinactive", null, "is", "F"),
                  new nlobjSearchFilter("custrecord_bb1_wbs_scasite", null, "is", "T"),
                  new nlobjSearchFilter("internalid", null, "anyof", blogSiteId)],
       columns = [new nlobjSearchColumn("custrecord_bb1_wbs_sitename"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_blogrootfolder"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_pagetitlepostpend"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_bloglandingpagetitle"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_defaultmetatagshtml"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_recaptchasitekey"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_bloglandingblogcount"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_latestblogsheading"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_latestblogscount"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_relatedblogsheading"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_relatedblogscount"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_articlesrssfeedurl"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_commentsrssfeedurl"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_allowcomments"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_logintocomment"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_createleadsforcomment"),
                  new nlobjSearchColumn("custrecord_bb1_wbs_searchduplicateleads")];

   var results = Application.getAllSearchResults('customrecord_bb1_wbs', filters, columns);

   if (!results.length)
    throw notFoundError;
   
   var settings = results[0],
       settingsSanitised = {
        siteName: settings.getValue('custrecord_bb1_wbs_sitename'),
        blogRootFolder: settings.getValue('custrecord_bb1_wbs_blogrootfolder'),
        pageTitlePostpend: settings.getValue('custrecord_bb1_wbs_pagetitlepostpend'),
        landingPageTitle: settings.getValue('custrecord_bb1_wbs_bloglandingpagetitle'),
        defaultMetaTagsHtml: settings.getValue('custrecord_bb1_wbs_defaultmetatagshtml'),
        recaptchaSiteKey: settings.getValue('custrecord_bb1_wbs_recaptchasitekey'),
        blogLandingBlogCount: settings.getValue('custrecord_bb1_wbs_bloglandingblogcount'),
        latestBlogsHeading: settings.getValue('custrecord_bb1_wbs_latestblogsheading'),
        latestBlogsCount: settings.getValue('custrecord_bb1_wbs_latestblogscount'),
        relatedBlogsHeading: settings.getValue('custrecord_bb1_wbs_relatedblogsheading'),
        relatedblogsCount: settings.getValue('custrecord_bb1_wbs_relatedblogscount'),
        articlesRssFeedUrl: settings.getValue('custrecord_bb1_wbs_articlesrssfeedurl'),
        commentsRssFeedUrl: settings.getValue('custrecord_bb1_wbs_commentsrssfeedurl'),
        allowComments: settings.getValue('custrecord_bb1_wbs_allowcomments') == "T",
        loginToComment: settings.getValue('custrecord_bb1_wbs_logintocomment') == "T",
        createLeadsForComment: settings.getValue('custrecord_bb1_wbs_createleadsforcomment') == "T",
        searchDuplicateLeads: settings.getValue('custrecord_bb1_wbs_searchduplicateleads') == "T"
       };
   
   return settingsSanitised;
   
  },
  
  getRecentPostsLinks: function (postCount)
  {
   var blogSiteId = Configuration.BlueBridgeBlog.blog_site,
       recentPostsFilters = [new nlobjSearchFilter("isinactive", null, "is", "F"),
                             new nlobjSearchFilter("custrecord_bb1_wba_blogsite", null, "anyof", blogSiteId)],
       recentPostsColumns = [new nlobjSearchColumn("custrecord_bb1_wba_heading"),
                             new nlobjSearchColumn("custrecord_bb1_wba_urlcomponent"),
                             new nlobjSearchColumn("custrecord_bb1_wba_dateposted").setSort(true)],
       recentPostsResult = Application.getAllSearchResults('customrecord_bb1_wba', recentPostsFilters, recentPostsColumns);
                
   return _.map(_.first(recentPostsResult || [], postCount || Infinity), function (recentPost)
   {
    var name = recentPost.getValue("custrecord_bb1_wba_heading"),
        urlComponent = recentPost.getValue("custrecord_bb1_wba_urlcomponent");
        
    return {id: urlComponent,
            name: name,
            url: urlComponent
           };
   });
  },

  getCategoryLinks: function ()
  {
   var blogSiteId = Configuration.BlueBridgeBlog.blog_site,
       wbcFilters = [new nlobjSearchFilter("isinactive", null, "is", "F"),
                     new nlobjSearchFilter("custrecord_bb1_wbc_blogsite", null, "anyof", blogSiteId)],
       wbcColumns = [new nlobjSearchColumn("name"),
                     new nlobjSearchColumn("custrecord_bb1_wbc_description"),
                     new nlobjSearchColumn("custrecord_bb1_wbc_image"),
                     new nlobjSearchColumn("custrecord_bb1_wbc_urlcomponent"),
                     new nlobjSearchColumn("custrecord_bb1_wbc_pagetitle"),
                     new nlobjSearchColumn("custrecord_bb1_wbc_metataghtml"),
                     new nlobjSearchColumn("custrecord_bb1_wbc_rank").setSort()],
       wbcResult = Application.getAllSearchResults('customrecord_bb1_wbc', wbcFilters, wbcColumns);
                
   return _.map(wbcResult || [], function (blog_post)
   {
    return {id: blog_post.getValue("name").toLowerCase().replace(/[^a-z0-9]+/gi, "-"),
            name: blog_post.getValue("name"),
            description: blog_post.getValue("custrecord_bb1_wbc_description"),
            image: blog_post.getText("custrecord_bb1_wbc_image"),
            url: blog_post.getValue("custrecord_bb1_wbc_urlcomponent"),
            pagetitle: blog_post.getValue("custrecord_bb1_wbc_pagetitle"),
            metataghtml: blog_post.getValue("custrecord_bb1_wbc_metataghtml")
           };
   });
  },

  getArchiveLinks: function ()
  {
   var blogSiteId = Configuration.BlueBridgeBlog.blog_site,
       archiveFilters = [new nlobjSearchFilter("isinactive", null, "is", "F"),
                         new nlobjSearchFilter("custrecord_bb1_wba_blogsite", null, "anyof", blogSiteId)],
       archiveColumns = [new nlobjSearchColumn("formulatext", null, "group").setFormula("TO_CHAR({custrecord_bb1_wba_dateposted}, 'Mon-YYYY')"),
                         new nlobjSearchColumn("formulatext", null, "group").setFormula("TO_CHAR({custrecord_bb1_wba_dateposted}, 'Month YYYY')"),
                         new nlobjSearchColumn("formulanumeric", null, "group").setFormula("TO_CHAR({custrecord_bb1_wba_dateposted}, 'YYYY')").setSort(true),
                         new nlobjSearchColumn("formulanumeric", null, "group").setFormula("TO_CHAR({custrecord_bb1_wba_dateposted}, 'MM')").setSort(true)],
       archiveResult = Application.getAllSearchResults('customrecord_bb1_wba', archiveFilters, archiveColumns);
                
   return _.map(archiveResult || [], function (archive)
   {
    var name = archive.getValue(archiveColumns[1]),
        urlComponent = archive.getValue(archiveColumns[0]);
        
    return {id: name.toLowerCase().replace(/[^a-z0-9]+/gi, "-"),
            name: name,
            url: urlComponent
           };
   });
  }
  
 });
});
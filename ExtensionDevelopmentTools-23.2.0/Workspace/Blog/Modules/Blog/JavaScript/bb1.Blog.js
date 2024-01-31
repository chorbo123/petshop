// @module bb1.Blog
define(
	'bb1.Blog'
,	[
		'bb1.Blog.Views',
  'bb1.Blog.Models',
  'bb1.Blog.Router',
  'bb1.Blog.Collections'
	]
,	function (
		BlogViews,
  BlogModels,
  BlogRouter,
  BlogCollections
	)
{
	'use strict';

	//@class bb1.Blog @extends ApplicationModule
 return {
  Views: BlogViews,
  Models: BlogModels,
  Router: BlogRouter,
  Collections: BlogCollections,
  mountToApp: function (application)
  {
   // if blogTemplates bootstrapped then add blog templates and recompile macros
   if (SC.blogTemplates) {
    SC.blogTemplates.macros = SC.templates.macros.concat(SC.blogTemplates.macros);
    _.extend(SC.templates, SC.blogTemplates);
    SC.compileMacros(SC.templates.macros);
   }
   
   var Layout = application.getLayout();

   _.extend(Layout, {

    getBlogLinks: function () {
    
     var blogSettings = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings || {},
         links = [{id: "allPosts", name: "All posts", url: blogSettings.articlesRssFeedUrl, target: ""},
                  {id: "allComments", name: "All comments", url: blogSettings.commentsRssFeedUrl, target: ""}];
     
     links.heading = "RSS";
     
     return links;
     
    },

    getBlogRecentPosts: function () {
    
     var links = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.recentPostsLinks || {};
     
     links.heading = "Recent Posts";
     
     return links;
     
    },

    getBlogCategories: function () {
    
     var links = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.categoryLinks || {};
     
     links.heading = "Categories";
     
     return links;
     
    },

    getBlogArchives: function () {
    
     var links = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.archiveLinks || {};
     
     links.heading = "Archives";
     
     return links;
     
    }

   });
   
   // add base url to links
   if (SC.ENVIRONMENT.blogSettings) {
    
    var rootFolder = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings.blogRootFolder || 'blog',
        categoryFolder = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings.blogCategoryFolder || 'category',
        archiveFolder = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings.blogArchiveFolder || 'archive';
    
    _.each(SC.ENVIRONMENT.blogSettings.recentPostsLinks, function(link) {
     link.url = '/' + rootFolder + '/' + link.url;
    });
    
    _.each(SC.ENVIRONMENT.blogSettings.categoryLinks, function(link) {
     link.url = '/' + rootFolder + '/' + categoryFolder + '/' + link.url;
    });
    
    _.each(SC.ENVIRONMENT.blogSettings.archiveLinks, function(link) {
     link.url = '/' + rootFolder + '/' + archiveFolder + '/' + link.url;
    });
    
   }
   
   // Initializes the router
   return new BlogRouter(application);
  }
  
 };
});
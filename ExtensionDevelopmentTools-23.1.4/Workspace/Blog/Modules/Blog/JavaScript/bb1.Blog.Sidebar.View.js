// @module bb1.Blog
define(
	'bb1.Blog.Sidebar.View',
	[
		'SC.Configuration',
  
		'bb1_blog_sidebar.tpl',
 
		'underscore',
		'Backbone'
	],
	function (

		Configuration,
  
		bb1_blog_sidebar_tpl,

		_,
		Backbone
	)
{
	'use strict';

	// @class bb1.Blog.Sidebar.View @extends Backbone.View
	return Backbone.View.extend({

		// @property {Function} template
		template: bb1_blog_sidebar_tpl,

		// @method initialize
		initialize: function (options)
		{
			this.application = options.application;
		},

		// @method getContext @return bb1.Blog.Sidebar.View.Context
		getContext: function ()
		{
			// @class bb1.Blog.Sidebar.View
   var layout = this.application.getLayout(),
       blogLinks = layout.getBlogLinks() || [],
       blogRecentPosts = layout.getBlogRecentPosts() || [],
       blogCategories = layout.getBlogCategories() || [],
       blogArchives = layout.getBlogArchives() || [],
       blogCategoriesHeading = blogCategories.heading,
       blogArchivesHeading = blogArchives.heading,
       categoryFolder = blogCategories.length && _.initial(_.first(blogCategories).url.split('/')).join('/'),
       archiveFolder = blogArchives.length && _.initial(_.first(blogArchives).url.split('/')).join('/');
   
			return {
					//@property {Object[]} blogLinks
					blogLinks: blogLinks,
					//@property {Object[]} blogRecentPosts
					blogRecentPosts: blogRecentPosts,
					//@property {String} blogCategoriesHeading
					blogCategoriesHeading: blogCategoriesHeading,
					//@property {Object[]} blogCategories
					blogCategories: _.first(blogCategories, 6),
					//@property {String} blogArchivesHeading
					blogArchivesHeading: blogArchivesHeading,
					//@property {Object[]} blogArchives
					blogArchives: _.first(blogArchives, 6),
					//@property {String} categoryFolder
					categoryFolder: categoryFolder,
					//@property {String} archiveFolder
					archiveFolder: archiveFolder
			};
			// @class bb1.Blog.Sidebar.View
		}
	});

});

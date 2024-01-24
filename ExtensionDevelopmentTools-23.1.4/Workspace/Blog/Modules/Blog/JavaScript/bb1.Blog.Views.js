// @module bb1.Blog
define(
	'bb1.Blog.Views',
	[
  'bb1.Blog.Sidebar.View',
  'bb1.Blog.Home.ListCell.View',
  'bb1.Blog.Posts.ListCell.View',
  'bb1.Blog.Archive.ListCell.View',
  'bb1.Blog.Comments.ListCell.View',
  'bb1.Blog.SocialMediaLinks.View',
  
  'Backbone.CompositeView',
  'Backbone.CollectionView',
  'GlobalViews.Breadcrumb.View',
		'Utilities.ResizeImage',

		'bb1_blog_archive_home.tpl',
		'bb1_blog_archive_list_by_month.tpl',
		'bb1_blog_archive_list_by_year.tpl',
		'bb1_blog_archive_list_cell.tpl',
		'bb1_blog_category_list.tpl',
		'bb1_blog_comments_form.tpl',
		'bb1_blog_comments_form_submitted.tpl',
		'bb1_blog_comments_list_cell.tpl',
		'bb1_blog_container.tpl',
		'bb1_blog_home.tpl',
		'bb1_blog_home_list_cell.tpl',
		'bb1_blog_latest_posts.tpl',
		'bb1_blog_latest_posts_cell.tpl',
		'bb1_blog_post.tpl',
		'bb1_blog_posts_list.tpl',
		'bb1_blog_posts_list_cell.tpl',
		'bb1_blog_related_posts.tpl',
		'bb1_blog_related_posts_cell.tpl',
		'bb1_blog_sidebar.tpl',
		'bb1_blog_social_media_links.tpl',

		'backbone_collection_view_cell.tpl',
		'backbone_collection_view_row.tpl',

		'Backbone',
		'jQuery',
		'underscore',
		'Utils'
	],
	function (
  BlogSidebarView,
  BlogHomeListCellView,
  BlogPostsListCellView,
  BlogArchiveListCellView,
  BlogCommentsListCellView,
  BlogSocialMediaLinksView,
  
  BackboneCompositeView,
  BackboneCollectionView,
  GlobalViewsBreadcrumbView,
		resizeImage,
  
		bb1_blog_archive_home_tpl,
		bb1_blog_archive_list_by_month_tpl,
		bb1_blog_archive_list_by_year_tpl,
		bb1_blog_archive_list_cell_tpl,
		bb1_blog_category_list_tpl,
		bb1_blog_comments_form_tpl,
		bb1_blog_comments_form_submitted_tpl,
		bb1_blog_comments_list_cell_tpl,
		bb1_blog_container_tpl,
		bb1_blog_home_tpl,
		bb1_blog_home_list_cell_tpl,
		bb1_blog_latest_posts_tpl,
		bb1_blog_latest_posts_cell_tpl,
		bb1_blog_post_tpl,
		bb1_blog_posts_list_tpl,
		bb1_blog_posts_list_cell_tpl,
		bb1_blog_related_posts_tpl,
		bb1_blog_related_posts_cell_tpl,
		bb1_blog_sidebar_tpl,
		bb1_blog_social_media_links_tpl,

  backbone_collection_view_cell_tpl,
  backbone_collection_view_row_tpl,
  
		Backbone,
		jQuery,
		_,
		Utils
	)
{
	'use strict';

	// @lass bb1.Blog.Views @extends Backbone.View
 
 var librariesLoaded;
 
 function showContent(paths)
 {
  var layout = this.options.application.getLayout();
  
  return layout.showContent(this).done(function(view) {
   //updateCrumbtrail(paths, view.options.application);
   loadSocialMediaLibraries().then(function() {
    FB && FB.XFBML && jQuery(".fb-like").each(function() { FB.XFBML.parse(this.parentNode); });
    twttr && twttr.widgets && twttr.widgets.load();
    gapi && gapi.plusone && jQuery(".g-plusone").each(function() { gapi.plusone.render(this); });
   });
  });
 }

 function wrapView(view)
 {
  if (view.inModal) return;
  
  var application = view.options.application,
      container = new Backbone.View(),
      sidebar = new BlogSidebarView({application: application});
  container.application = sidebar.application = application;
  container.template = bb1_blog_container_tpl;
  container.render();
  sidebar.render();
  container.$('[data-type="blog-sidebar"]').append(sidebar.$el);
  container.$('[data-type="blog-content"]').append(view.$el.contents().clone());
  view.$el.empty().append(container.$el.contents());
 }

 function updateCrumbtrail(pages)
 {
  pages = pages || [];
  
  if (!_.isArray(pages))
  {
   pages = [pages];
  }

  pages.unshift({
   href: '#'
  , 'data-touchpoint': 'home'
  , 'data-hashtag': '#' + SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings.blogRootFolder || 'blog'
  , text: _('Blog').translate()
  });

  return pages;
 }
    
 function updateMetaTags(metaTagHtml)
 {
  if (_.isEmpty(metaTagHtml)) return;
  
  var $head = jQuery('head'),
      $metaTags = jQuery(metaTagHtml);

  $metaTags.filter("meta").each(function() {
   var $this = jQuery(this),
       metaTagName = $this.attr("name").toLowerCase();
   $head.find('meta[name="' + metaTagName + '"]').remove();
   $this.appendTo($head);
  });
 }

 function cleanMetaTags(metaTags)
 {
  return getMetaTags(metaTags).each(function() {
   var $this = jQuery(this),
       metaTagName = jQuery.trim($this.attr("name").toLowerCase());
   $this.attr("name", metaTagName)
  }).parent().html();
 }

 function getMetaTags(metaTags)
 {
  return jQuery('<head/>').html(jQuery.trim(metaTags)).children('meta');
 }

 function getMetaKeywords(metaTags)
 {
  return getMetaTags(metaTags).filter('[name="keywords"]').attr('content') || '';
 }

 function getMetaDescription(metaTags, pageTitle)
 {
  var options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
      page = options.page  > 1 ? ' Page ' + options.page : '',
      description = getMetaTags(metaTags).filter('[name="description"]').attr('content');

  return description ? description + page : pageTitle || '';
 }
 
 function loadFacebookLibrary()
 {
  return jQuery.getScript('//connect.facebook.net/en_US/sdk.js');
 }
 
 function loadTwitterLibrary()
 {
  return jQuery.getScript('https://platform.twitter.com/widgets.js');
 }
 
 function loadGooglePlusLibrary()
 {
  return jQuery.getScript('https://apis.google.com/js/platform.js');
 }
 
 function loadSocialMediaLibraries()
 {
  if (!librariesLoaded) {
   window.fbAsyncInit = function() {
    FB.init({
     xfbml      : false,
     version    : 'v2.4'
    });
   };
  }
  
  return librariesLoaded || (
   librariesLoaded = jQuery.when(
    loadFacebookLibrary(),
    loadTwitterLibrary(),
    loadGooglePlusLibrary()
   ).then(function() {
    FB && FB.init({
     xfbml: false,
     version: 'v2.4'
    });
   })
  );
 }
 
 var Views = {};

 // Blog details
 Views.Details = Backbone.View.extend({

  template: bb1_blog_post_tpl,
  page_header: _('Blog Post').translate(),
  title: _('Blog Post').translate(),
  attributes: {'class': 'BlogDetailsView'},

  initialize: function (options)
  {
   this.application = options.application;
   BackboneCompositeView.add(this);
   this.on('afterViewRender', function(view) {
    wrapView(view);
   });
   loadSocialMediaLibraries();
  },

  showContent: function (paths)
  {
   var self = this,
       settings = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings,
       defaultMetaTagsHtml = settings && settings.defaultMetaTagsHtml || '';
       
   self.page_header = self.model.get('heading') || '';
   self.title = self.model.get('pagetitle');
   self.metaTags = cleanMetaTags(self.model.get('metataghtml') || defaultMetaTagsHtml);
   self.metaKeywords = getMetaKeywords(self.metaTags);
   self.metaDescription = getMetaDescription(self.metaTags, self.title);
   this.breadcrumbPages = updateCrumbtrail(paths);
   return showContent.apply(self);
  },
  
		getBreadcrumbPages: function ()
		{
			return this.breadcrumbPages || [];
		},

  // @property {Object} childViews
  childViews: {
				'Comments.List': function ()
				{
     var displayOption = _.extend({comment_list_columns: 1}, this.application.getConfig('blogDisplayOptions') || {});
     
					return new BackboneCollectionView({
							collection: this.model.get('comments'),
							viewsPerRow: displayOption.comment_list_columns,
       cellTemplate: backbone_collection_view_cell_tpl,
       rowTemplate: backbone_collection_view_row_tpl,
							childView: BlogCommentsListCellView,
							childViewOptions: {
        postUrl: this.options.baseUrl + "/" + this.model.get('url')
							}
					});
				},
				'SocialMedia.Links' : function ()
				{
					return new BlogSocialMediaLinksView({ application: this.application });
				}
		},
  
		// @method getContext @return {bb1.Blog.Views.Details.Context}
		getContext: function ()
		{
			var model = this.model,
       dateTimePosted = model.get("dateposted") || "",
       datePosted = dateTimePosted.replace(/^(\d+\/\d+\/\d+).*/, "$1"),
       comments = model.get("comments"),
       commentCount = comments && comments.length;

			// @class bb1.Blog.Views.Details.Context
			return {
					//@property {bb1.BlogHome.Model} model
					model: model,
					//@property {String} postId
					postId: model.get("internalid"),
					//@property {String} pageHeader
					pageHeader: this.page_header,
					//@property {String} pageTitle
					postHeading: model.get("heading"),
					//@property {String} postSummary
					postSummary: model.get("summary").replace(/<[^>]+>/g, "").replace(/"/g, "'"),
					//@property {String} dateTimePosted
     dateTimePosted: dateTimePosted,
					//@property {String} datePosted
     datePosted: datePosted,
					//@property {String} postUrl
     postUrl: this.options.baseUrl + "/" + model.get("url"),
					//@property {bb1.BlogComment.Collection} comments
     comments: comments,
					//@property {Number} commentCount
     commentCount: commentCount,
					//@property {Number} moreThanOneComment
     moreThanOneComment: commentCount > 1,
					//@property {String} siteName
     siteName: SC.ENVIRONMENT.siteSettings.displayname,
					//@property {String} documentOrigin
     documentOrigin: document.location.origin,
					//@property {bb1.BlogSettings.Model} blogSettings
     blogSettings: SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings
			};
			// @class bb1.Blog.Views.Details
		}
  
 });

 // Blog post list
 Views.List = Backbone.View.extend({

  template: bb1_blog_posts_list_tpl,
  page_header: _('Blog Posts').translate(),
  title: _('Blog Posts').translate(),
  attributes: { 'class': 'BlogListView' },

  initialize: function (options)
  {
   this.application = options.application;
   BackboneCompositeView.add(this);
   this.on('afterViewRender', function(view) {
    wrapView(view);
   });
   loadSocialMediaLibraries();
  },

  showContent: function (paths)
  {
   var self = this,
       settings = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings,
       defaultMetaTagsHtml = settings && settings.defaultMetaTagsHtml || '',
       options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
       page = options.page  > 1 ? ' Page ' + options.page : '';

   self.page_header = self.model.get('category') || self.page_header;
   self.title = (self.page_header || self.title) + page;
   self.metaTags = cleanMetaTags(defaultMetaTagsHtml);
   self.metaKeywords = getMetaKeywords(self.metaTags);
   self.metaDescription = getMetaDescription(self.metaTags, self.title);
   this.breadcrumbPages = updateCrumbtrail(paths);
   return showContent.apply(self);
  },
  
		getBreadcrumbPages: function ()
		{
			return this.breadcrumbPages || [];
		},

		getPath: function ()
		{
			var canonical = window.location.protocol + '//' + window.location.hostname + '/' + Backbone.history.fragment,
			   	index_of_query = canonical.indexOf('?');

			// !~ means: indexOf == -1
			return !~index_of_query ? canonical : canonical.substring(0, index_of_query);
		},

		getCanonical: function ()
		{
			var canonical_url = this.getPath(),
			   	options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
			   	current_page = options.page || 1;

			if (current_page > 1)
			{
				canonical_url += '?page=' + current_page;
			}

			return canonical_url;
		},

		getRelPrev: function ()
		{
			var previous_page_url = this.getPath(),
			   	options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
			   	current_page = options.page || 1;

			if (current_page > 1)
			{
				if (current_page === 2)
				{
					return previous_page_url;
				}

				if (current_page > 2)
				{
					return previous_page_url += '?page=' + (current_page - 1);
				}
			}

			return null;
		},

		getRelNext: function ()
		{
			var next_page_url = this.getPath(),
			   	options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
			   	current_page = options.page || 1;

			if (current_page < this.totalPages)
			{
				return next_page_url += '?page='+ (current_page + 1);
			}

			return null;
		},
  
  // @property {Object} childViews
  childViews: {
				'Posts.ListNavigable': function ()
				{
     var displayOption = _.extend({list_page_columns: 2}, this.application.getConfig('blogDisplayOptions') || {});
     
					return new BackboneCollectionView({
							collection: this.model.get('posts'),
							viewsPerRow: displayOption.list_page_columns,
       cellTemplate: backbone_collection_view_cell_tpl,
       rowTemplate: backbone_collection_view_row_tpl,
							childView: BlogPostsListCellView,
							childViewOptions: {
        baseUrl: this.options.baseUrl
							}
					});
				},
				'SocialMedia.Links' : function ()
				{
					return new BlogSocialMediaLinksView({ application: this.application });
				}
		},
  
		// @method getContext @return {bb1.Blog.Views.List.Context}
		getContext: function ()
		{
			var model = this.model,
       posts = model.get('posts'),
       page = model.get('page') || 1,
       recordsPerPage = model.get('recordsPerPage') || 20,
       totalRecordsFound = model.get('totalRecordsFound') || 0

			// @class bb1.Blog.Views.List.Context
			return {
					//@property {bb1.BlogHome.Model} model
					model: model,
					//@property {String} pageHeader
					pageHeader: this.page_header,
					//@property {String} pageTitle
					pageTitle: model.get('pagetitle'),
					//@property {bb1.BlogPost.Collection} posts
					posts: posts,
					//@property {Number} currentPage
     currentPage: page,
					//@property {Number} recordsPerPage
     recordsPerPage: recordsPerPage,
					//@property {Number} totalRecordsFound
     totalRecordsFound: totalRecordsFound,
					//@property {Number} totalPages
     totalPages: Math.ceil(totalRecordsFound / recordsPerPage)
			};
			// @class bb1.Blog.Views.List
		}
  
 });

 // Blog landing page
 Views.Home = Backbone.View.extend({

  template: bb1_blog_home_tpl,
  page_header: _('Blog').translate(),
  title: _('Blog').translate(),
  attributes: { 'class': 'BlogHomeView' },

  initialize: function (options)
  {
   this.application = options.application;
   BackboneCompositeView.add(this);
   this.on('afterViewRender', function(view) {
    wrapView(view);
   });
   loadSocialMediaLibraries();
  },

  showContent: function (paths)
  {
   var self = this,
       settings = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings,
       landingPageTitle = settings && settings.landingPageTitle,
       defaultMetaTagsHtml = settings && settings.defaultMetaTagsHtml || '',
       options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
       page = options.page  > 1 ? ' Page ' + options.page : '';
       
   self.title = (landingPageTitle || self.title) + page;
   self.metaTags = cleanMetaTags(defaultMetaTagsHtml);
   self.metaKeywords = getMetaKeywords(self.metaTags);
   self.metaDescription = getMetaDescription(self.metaTags, self.title);
   this.breadcrumbPages = updateCrumbtrail(paths);
   return showContent.apply(self);
  },
  
		getBreadcrumbPages: function ()
		{
			return this.breadcrumbPages || [];
		},

		getPath: function ()
		{
			var canonical = window.location.protocol + '//' + window.location.hostname + '/' + Backbone.history.fragment,
			   	index_of_query = canonical.indexOf('?');

			// !~ means: indexOf == -1
			return !~index_of_query ? canonical : canonical.substring(0, index_of_query);
		},

		getCanonical: function ()
		{
			var canonical_url = this.getPath(),
			   	options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
			   	current_page = options.page || 1;

			if (current_page > 1)
			{
				canonical_url += '?page=' + current_page;
			}

			return canonical_url;
		},

		getRelPrev: function ()
		{
			var previous_page_url = this.getPath(),
			   	options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
			   	current_page = options.page || 1;

			if (current_page > 1)
			{
				if (current_page === 2)
				{
					return previous_page_url;
				}

				if (current_page > 2)
				{
					return previous_page_url += '?page=' + (current_page - 1);
				}
			}

			return null;
		},

		getRelNext: function ()
		{
			var next_page_url = this.getPath(),
			   	options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
			   	current_page = options.page || 1;

			if (current_page < this.totalPages)
			{
				return next_page_url += '?page='+ (current_page + 1);
			}

			return null;
		},
  
  // @property {Object} childViews
  childViews: {
				'Posts.Featured': function ()
				{
					return new BlogHomeListCellView({
       model: _.first(this.model.get('posts').models),
       baseUrl: this.options.baseUrl
     });
				},
				'Posts.ListNavigable': function ()
				{
     var displayOption = _.extend({home_page_columns: 2}, this.application.getConfig('blogDisplayOptions') || {}),
         currentPage = this.model.get('page') || 1,
         posts = currentPage == 1 ? _.rest(this.model.get('posts').models) : this.model.get('posts').models;
     
					return new BackboneCollectionView({
							collection: posts,
							viewsPerRow: displayOption.home_page_columns,
       cellTemplate: backbone_collection_view_cell_tpl,
       rowTemplate: backbone_collection_view_row_tpl,
							childView: BlogHomeListCellView,
							childViewOptions: {
								application: this.application,
        baseUrl: this.options.baseUrl
							}
					});
				},
				'SocialMedia.Links' : function ()
				{
					return new BlogSocialMediaLinksView({ application: this.application });
				}
		},
  
		// @method getContext @return {bb1.Blog.Views.Home.Context}
		getContext: function ()
		{
			var model = this.model,
       posts = model.get('posts'),
       page = model.get('page') || 1,
       recordsPerPage = model.get('recordsPerPage') || 20,
       totalRecordsFound = model.get('totalRecordsFound') || 0

			// @class bb1.Blog.Views.Home.Context
			return {
					//@property {bb1.BlogHome.Model} model
					model: model,
					//@property {String} pageHeader
					isFirstPage: page == 1,
					//@property {String} pageHeader
					pageHeader: this.page_header,
					//@property {String} pageTitle
					pageTitle: model.get('pagetitle'),
					//@property {bb1.BlogPost.Collection} posts
					posts: posts,
					//@property {Number} currentPage
     currentPage: page,
					//@property {Number} recordsPerPage
     recordsPerPage: recordsPerPage,
					//@property {Number} totalRecordsFound
     totalRecordsFound: totalRecordsFound,
					//@property {Number} totalPages
     totalPages: Math.ceil(totalRecordsFound / recordsPerPage)
			};
			// @class bb1.Blog.Views.Home
		}
  
 });

 // Blog category list page
 Views.CategoryList = Backbone.View.extend({

  template: bb1_blog_category_list_tpl,
  page_header: _('Category').translate(),
  title: _('Category').translate(),
  attributes: { 'class': 'BlogCategoryListView' },

  initialize: function (options)
  {
   this.application = options.application;
   BackboneCompositeView.add(this);
   this.on('afterViewRender', function(view) {
    wrapView(view);
   });
  },

  showContent: function (paths)
  {
   var self = this,
       settings = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings,
       defaultMetaTagsHtml = settings && settings.defaultMetaTagsHtml || '';
       
   self.metaTags = cleanMetaTags(defaultMetaTagsHtml);
   self.metaKeywords = getMetaKeywords(self.metaTags);
   self.metaDescription = getMetaDescription(self.metaTags, self.title);
   this.breadcrumbPages = updateCrumbtrail(paths);
   return showContent.apply(self);
  },
  
		getBreadcrumbPages: function ()
		{
			return this.breadcrumbPages || [];
		},

		// @method getContext @return {bb1.Blog.Views.List.Context}
		getContext: function ()
		{
			var model = this.model;

			// @class bb1.Blog.Views.List.Context
			return {
					//@property {bb1.BlogHome.Model} model
					model: model,
					//@property {String} categories
					categories: model.get('categories')
			};
			// @class bb1.Blog.Views.List
		}
  
 });

 // Blog archive landing page
 Views.ArchiveHome = Backbone.View.extend({

  template: bb1_blog_archive_home_tpl,
  page_header: _('Archive').translate(),
  title: _('Archive').translate(),
  attributes: { 'class': 'BlogArchiveHomeView' },

  initialize: function (options)
  {
   this.application = options.application;
   this.on('afterViewRender', function(view) {
    wrapView(view);
   });
  },

  showContent: function (paths)
  {
   var self = this,
       settings = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings,
       defaultMetaTagsHtml = settings && settings.defaultMetaTagsHtml || '';
       
   self.metaTags = cleanMetaTags(defaultMetaTagsHtml);
   self.metaKeywords = getMetaKeywords(self.metaTags);
   self.metaDescription = getMetaDescription(self.metaTags, self.title);
   this.breadcrumbPages = updateCrumbtrail(paths);
   return showContent.apply(self);
  },
  
		getBreadcrumbPages: function ()
		{
			return this.breadcrumbPages || [];
		},

		// @method getContext @return {bb1.Blog.Views.ArchiveHome.Context}
		getContext: function ()
		{
			var model = this.model,
       posts = model.get('posts'),
       page = model.get('page') || 1,
       recordsPerPage = model.get('recordsPerPage') || 20,
       totalRecordsFound = model.get('totalRecordsFound') || 0

			// @class bb1.Blog.Views.ArchiveHome.Context
			return {
					//@property {BlogArchive.Model} model
					model: model
			};
			// @class bb1.Blog.Views.ArchiveHome
		}
  
 });

 // Blog archive list by month page
 Views.ArchiveListByMonth = Backbone.View.extend({

  template: bb1_blog_archive_list_by_month_tpl,
  page_header: _('Posts For Month').translate(),
  title: _('Posts For Month').translate(),
  attributes: { 'class': 'BlogArchiveListView' },

  initialize: function (options)
  {
   this.application = options.application;
   BackboneCompositeView.add(this);
   this.on('afterViewRender', function(view) {
    wrapView(view);
   });
   loadSocialMediaLibraries();
  },

  showContent: function (paths)
  {
   var self = this,
       settings = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings,
       defaultMetaTagsHtml = settings && settings.defaultMetaTagsHtml || '',
       options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
       page = options.page  > 1 ? ' Page ' + options.page : '';
       
   self.page_header = self.model.get('archive') || self.page_header;
   self.title = (self.page_header || self.title) + page;
   self.metaTags = cleanMetaTags(defaultMetaTagsHtml);
   self.metaKeywords = getMetaKeywords(self.metaTags);
   self.metaDescription = getMetaDescription(self.metaTags, self.title);
   this.breadcrumbPages = updateCrumbtrail(paths);
   return showContent.apply(self);
  },
  
		getBreadcrumbPages: function ()
		{
			return this.breadcrumbPages || [];
		},

		getPath: function ()
		{
			var canonical = window.location.protocol + '//' + window.location.hostname + '/' + Backbone.history.fragment,
			   	index_of_query = canonical.indexOf('?');

			// !~ means: indexOf == -1
			return !~index_of_query ? canonical : canonical.substring(0, index_of_query);
		},

		getCanonical: function ()
		{
			var canonical_url = this.getPath(),
			   	options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
			   	current_page = options.page || 1;

			if (current_page > 1)
			{
				canonical_url += '?page=' + current_page;
			}

			return canonical_url;
		},

		getRelPrev: function ()
		{
			var previous_page_url = this.getPath(),
			   	options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
			   	current_page = options.page || 1;

			if (current_page > 1)
			{
				if (current_page === 2)
				{
					return previous_page_url;
				}

				if (current_page > 2)
				{
					return previous_page_url += '?page=' + (current_page - 1);
				}
			}

			return null;
		},

		getRelNext: function ()
		{
			var next_page_url = this.getPath(),
			   	options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
			   	current_page = options.page || 1;

			if (current_page < this.totalPages)
			{
				return next_page_url += '?page='+ (current_page + 1);
			}

			return null;
		},
  
  // @property {Object} childViews
  childViews: {
				'Posts.ListNavigable': function ()
				{
     var displayOption = _.extend({list_page_columns: 2}, this.application.getConfig('blogDisplayOptions') || {});
     
					return new BackboneCollectionView({
							collection: this.model.get('posts'),
							viewsPerRow: displayOption.list_page_columns,
       cellTemplate: backbone_collection_view_cell_tpl,
       rowTemplate: backbone_collection_view_row_tpl,
							childView: BlogArchiveListCellView,
							childViewOptions: {
        baseUrl: this.options.baseUrl
							}
					});
				},
				'SocialMedia.Links' : function ()
				{
					return new BlogSocialMediaLinksView({ application: this.application });
				}
		},
  
		// @method getContext @return {bb1.Blog.Views.List.Context}
		getContext: function ()
		{
			var model = this.model,
       posts = model.get('posts'),
       page = model.get('page') || 1,
       recordsPerPage = model.get('recordsPerPage') || 20,
       totalRecordsFound = model.get('totalRecordsFound') || 0

			// @class bb1.Blog.Views.List.Context
			return {
					//@property {bb1.BlogHome.Model} model
					model: model,
					//@property {String} pageHeader
					pageHeader: this.page_header,
					//@property {String} pageTitle
					pageTitle: model.get('pagetitle'),
					//@property {BlogPost.Collection} posts
					posts: posts,
					//@property {Number} currentPage
     currentPage: page,
					//@property {Number} recordsPerPage
     recordsPerPage: recordsPerPage,
					//@property {Number} totalRecordsFound
     totalRecordsFound: totalRecordsFound,
					//@property {Number} totalPages
     totalPages: Math.ceil(totalRecordsFound / recordsPerPage)
			};
			// @class bb1.Blog.Views.List
		}
  
 });

 // Blog archive list by year page
 Views.ArchiveListByYear = Backbone.View.extend({

  template: bb1_blog_archive_list_by_year_tpl,
  page_header: _('Posts For Year').translate(),
  title: _('Posts For Year').translate(),
  attributes: { 'class': 'BlogArchiveListView' },
  events: { 'click [data-action="remove"]': 'remove' },

  initialize: function (options)
  {
   this.application = options.application;
   BackboneCompositeView.add(this);
   this.on('afterViewRender', function(view) {
    wrapView(view);
   });
   loadSocialMediaLibraries();
  },

  showContent: function (paths)
  {
   var self = this,
       settings = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings,
       defaultMetaTagsHtml = settings && settings.defaultMetaTagsHtml || '',
       options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
       page = options.page  > 1 ? ' Page ' + options.page : '';
       
   self.page_header = self.model.get('category') || self.page_header;
   self.title = (self.page_header || self.title) + page;
   self.metaTags = cleanMetaTags(defaultMetaTagsHtml);
   self.metaKeywords = getMetaKeywords(self.metaTags);
   self.metaDescription = getMetaDescription(self.metaTags, self.title);
   this.breadcrumbPages = updateCrumbtrail(paths);
   return showContent.apply(self);
  },
  
		getBreadcrumbPages: function ()
		{
			return this.breadcrumbPages || [];
		},

		getPath: function ()
		{
			var canonical = window.location.protocol + '//' + window.location.hostname + '/' + Backbone.history.fragment,
			   	index_of_query = canonical.indexOf('?');

			// !~ means: indexOf == -1
			return !~index_of_query ? canonical : canonical.substring(0, index_of_query);
		},

		getCanonical: function ()
		{
			var canonical_url = this.getPath(),
			   	options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
			   	current_page = options.page || 1;

			if (current_page > 1)
			{
				canonical_url += '?page=' + current_page;
			}

			return canonical_url;
		},

		getRelPrev: function ()
		{
			var previous_page_url = this.getPath(),
			   	options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
			   	current_page = options.page || 1;

			if (current_page > 1)
			{
				if (current_page === 2)
				{
					return previous_page_url;
				}

				if (current_page > 2)
				{
					return previous_page_url += '?page=' + (current_page - 1);
				}
			}

			return null;
		},

		getRelNext: function ()
		{
			var next_page_url = this.getPath(),
			   	options = SC.Utils.parseUrlOptions(Backbone.history.fragment),
			   	current_page = options.page || 1;

			if (current_page < this.totalPages)
			{
				return next_page_url += '?page='+ (current_page + 1);
			}

			return null;
		},
  
  // @property {Object} childViews
  childViews: {
				'Posts.ListNavigable': function ()
				{
     var displayOption = _.extend({list_page_columns: 2}, this.application.getConfig('blogDisplayOptions') || {});
     
					return new BackboneCollectionView({
							collection: this.model.get('posts'),
							viewsPerRow: displayOption.list_page_columns,
       cellTemplate: backbone_collection_view_cell_tpl,
       rowTemplate: backbone_collection_view_row_tpl,
							childView: BlogArchiveListCellView,
							childViewOptions: {
        baseUrl: this.options.baseUrl
							}
					});
				},
				'SocialMedia.Links' : function ()
				{
					return new BlogSocialMediaLinksView({ application: this.application });
				}
		},
  
		// @method getContext @return {bb1.Blog.Views.List.Context}
		getContext: function ()
		{
			var model = this.model,
       posts = model.get('posts'),
       page = model.get('page') || 1,
       recordsPerPage = model.get('recordsPerPage') || 20,
       totalRecordsFound = model.get('totalRecordsFound') || 0

			// @class Cart.Detailed.View.Context
			return {
					//@property {bb1.BlogHome.Model} model
					model: model,
					//@property {String} pageHeader
					pageHeader: this.page_header,
					//@property {String} pageTitle
					pageTitle: model.get('pagetitle'),
					//@property {bb1.BlogPost.Collection} posts
					posts: posts,
					//@property {Number} currentPage
     currentPage: page,
					//@property {Number} recordsPerPage
     recordsPerPage: recordsPerPage,
					//@property {Number} totalRecordsFound
     totalRecordsFound: totalRecordsFound,
					//@property {Number} totalPages
     totalPages: Math.ceil(totalRecordsFound / recordsPerPage)
			};
			// @class bb1.Blog.Views.List
		}
  
 });

 // Blog comments form
 Views.CommentsForm = Backbone.View.extend({

  template: bb1_blog_comments_form_tpl,
  page_header: _('Submit Your Comments').translate(),
  title: _('Submit Your Comments').translate(),
  attributes: { 'class': 'BlogCommentFormView' },
  
  recaptchaPromise: jQuery.Deferred(),

  events: {
   'submit form': 'saveForm',
   'click [data-action="reset"]': 'resetForm'
  },

  initialize: function (options)
  {
   var self = this;
   this.application = options.application;
   this.on('afterViewRender', function(view) {
    wrapView(view);
   });
   
   window.bb1BlogRecaptchaCallback = function () {
    self.recaptchaPromise.resolve();
   };
   
   this.loadLibraries();
  },

  showContent: function (paths)
  {
   var self = this,
       settings = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings,
       recaptchaSiteKey = settings && settings.recaptchaSiteKey || '',
       defaultMetaTagsHtml = settings && settings.defaultMetaTagsHtml || '';
       
   self.metaTags = cleanMetaTags(defaultMetaTagsHtml);
   self.metaKeywords = getMetaKeywords(self.metaTags);
   self.metaDescription = getMetaDescription(self.metaTags, self.title);
   this.breadcrumbPages = updateCrumbtrail(paths);
   return showContent.apply(self).then(function() {
    if (!_.isEmpty(recaptchaSiteKey)) {
     self.recaptchaPromise.then(function () {
      window.grecaptcha.render(self.$('.recaptcha-wrapper').attr("id"), {
       'sitekey' : recaptchaSiteKey
      });
     });
    }
   });
  },

		getBreadcrumbPages: function ()
		{
			return this.breadcrumbPages || [];
		},

  resetForm: function (e)
  {
   e.preventDefault();
   this.showContent();
  },

  initRecaptchaLibrary: function() {
   window.grecaptcha.render(this.$('.recaptcha-wrapper').attr("id"), {
    'sitekey' : '6LdX5QQTAAAAANkboqJF8iX1UW8xSAwI34nPzF0R'
   });
  },
  
  loadRecaptchaLibrary: function ()
  {
   return jQuery.getScript('https://www.google.com/recaptcha/api.js?onload=bb1BlogRecaptchaCallback&render=explicit');
  },
  
  loadLibraries: function ()
  {
   var settings = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings,
       recaptchaSiteKey = settings && settings.recaptchaSiteKey || '';
       
   return this.librariesLoaded || (
    this.librariesLoaded = jQuery.when(
     (!_.isEmpty(recaptchaSiteKey) ? this.loadRecaptchaLibrary() : jQuery.Deferred().resolve())
    )
   );
  },
  
		// @method getContext @return {bb1.Blog.Views.CommentsForm.Context}
		getContext: function ()
		{
			// @class Cart.Detailed.View.Context
			return {
					//@property {bb1.BlogHome.Model} model
					model: this.model,
					//@property {String} inModal
					inModal: this.inModal,
					//@property {String} manage
					manage: this.options.manage ? options.manage + '-' : '',
					//@property {String} postUrl
					postUrl: this.options.baseUrl + "/" + this.model.get("url")
			};
			// @class bb1.Blog.Views.CommentsForm
		}

 });

 // Blog comments submitted
 Views.CommentsSubmitted = Backbone.View.extend({

  template: bb1_blog_comments_form_submitted_tpl,
  page_header: _('Comments Submitted').translate(),
  title: _('Comments Submitted').translate(),
  attributes: { 'class': 'BlogCommentSubmittedView' },

  initialize: function (options)
  {
   this.application = options.application;
   this.on('afterViewRender', function(view) {
    wrapView(view);
   });
  },

  showContent: function (paths)
  {
   var self = this,
       settings = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings,
       defaultMetaTagsHtml = settings && settings.defaultMetaTagsHtml || '';
       
   self.metaTags = cleanMetaTags(defaultMetaTagsHtml);
   self.metaKeywords = getMetaKeywords(self.metaTags);
   self.metaDescription = getMetaDescription(self.metaTags, self.title);
   this.breadcrumbPages = updateCrumbtrail(paths);
   return showContent.apply(self);
  },
  
		getBreadcrumbPages: function ()
		{
			return this.breadcrumbPages || [];
		},

		// @method getContext @return {bb1.Blog.Views.CommentsSubmitted.Context}
		getContext: function ()
		{
			// @class Cart.Detailed.View.Context
			return {
					//@property {bb1.BlogHome.Model} model
					model: this.model,
					//@property {String} inModal
					inModal: this.inModal,
					//@property {String} manage
					manage: this.options.manage ? this.options.manage + '-' : '',
					//@property {String} postUrl
					postUrl: this.options.baseUrl
			};
			// @class Blog.Views.CommentsSubmitted
		}
  
 });

 // Blog latest posts
 Views.LatestPosts = Backbone.View.extend({

  template: bb1_blog_latest_posts_tpl,
  page_header: _('Latest Posts').translate(),
  title: _('Latest Posts').translate(),
  attributes: { 'class': 'BlogLatestListView' },

  initialize: function (options)
  {
   this.application = options.application;
   this.on('afterViewRender', function(view) {
    wrapView(view);
   });
  },

  showContent: function (paths)
  {
   var self = this,
       settings = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings,
       defaultMetaTagsHtml = settings && settings.defaultMetaTagsHtml || '';
       
   self.metaTags = cleanMetaTags(defaultMetaTagsHtml);
   self.metaKeywords = getMetaKeywords(self.metaTags);
   self.metaDescription = getMetaDescription(self.metaTags, self.title);
   this.breadcrumbPages = updateCrumbtrail(paths);
   return showContent.apply(self);
  },
  
		getBreadcrumbPages: function ()
		{
			return this.breadcrumbPages || [];
		},

 });

 // Blog related posts
 Views.RelatedPosts = Backbone.View.extend({

  template: bb1_blog_related_posts_tpl,
  page_header: _('Related Posts').translate(),
  title: _('Related Posts').translate(),
  attributes: { 'class': 'BlogRelatedListView' },

  initialize: function (options)
  {
   this.application = options.application;
   this.on('afterViewRender', function(view) {
    wrapView(view);
   });
  },

  showContent: function (paths)
  {
   var self = this,
       settings = SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings,
       defaultMetaTagsHtml = settings && settings.defaultMetaTagsHtml || '';
       
   self.metaTags = cleanMetaTags(defaultMetaTagsHtml);
   self.metaKeywords = getMetaKeywords(self.metaTags);
   self.metaDescription = getMetaDescription(self.metaTags, self.title);
   this.breadcrumbPages = updateCrumbtrail(paths);
   return showContent.apply(self);
  },
  
		getBreadcrumbPages: function ()
		{
			return this.breadcrumbPages || [];
		},

 });

 return Views;
});

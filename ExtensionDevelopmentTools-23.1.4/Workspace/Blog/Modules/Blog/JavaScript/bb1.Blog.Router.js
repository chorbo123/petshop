// @module bb1.Blog
define(
	'bb1.Blog.Router'
,	[
		'bb1.Blog.Views',
  'bb1.Blog.Models',
  'bb1.Blog.Collections',
  
  'Backbone',
		'jQuery',
		'underscore',
		'Utils'
	]
,	function (
		BlogViews,
  BlogModels,
  BlogCollections,
  
  Backbone,
  jQuery,
  _,
  Utils
	)
{
	'use strict';

	// @lass bb1.Blog.Router @extends Backbone.Router
 return Backbone.Router.extend({
  
  rootFolder: SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings.blogRootFolder || 'blog',
  
  categoryFolder: SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings.blogCategoryFolder || 'category',
  
  archiveFolder: SC.ENVIRONMENT.blogSettings && SC.ENVIRONMENT.blogSettings.blogSettings.blogArchiveFolder || 'archive',
  
  customRoutes: [
   ['^{root_folder}\/([^/?]+)\/reply-submitted([?].+)?$', 'blogReplySubmitted'],
   ['^{root_folder}\/([^/?]+)\/reply\/([^/?]+)([?].+)?$', 'blogReplyToCommentForm'],
   ['^{root_folder}\/([^/?]+)\/reply([?].+)?$', 'blogReplyForm'],
   ['^{root_folder}\/([^/?]+)([?].+)?$', 'blogDetail'],
   ['^{root_folder}\/search\/([^/?]+)([?].+)?$', 'blogPostsByQuery'],
   ['^{root_folder}\/{archive_folder}\/([^/?]+)([?].+)?$', 'blogPostsByArchive'],
   ['^{root_folder}\/{archive_folder}([?].+)?$', 'blogArchiveHome'],
   ['^{root_folder}\/{category_folder}\/([^/?]+)([?].+)?$', 'blogPostsByCategory'],
   ['^{root_folder}\/{category_folder}([?].+)?$', 'blogCategoryList'],
   ['^{root_folder}([?].+)?$', 'blogHome']
  ],
  
  initialize: function (application)
  {
   var self = this;
   this.application = application;

   _.each(this.customRoutes, function(route) {
    var routeUrl = route[0];
    if (/{root_folder}/.test(routeUrl)) {
     routeUrl = routeUrl.replace(/{root_folder}/g, self.rootFolder);
    }
    if (/{category_folder}/.test(routeUrl)) {
     routeUrl = routeUrl.replace(/{category_folder}/g, self.categoryFolder);
    }
    if (/{archive_folder}/.test(routeUrl)) {
     routeUrl = routeUrl.replace(/{archive_folder}/g, self.archiveFolder);
    }
    if (/^\^/.test(routeUrl)) {
     routeUrl = new RegExp(routeUrl);
    }
    route[0] = routeUrl;
    self.route.apply(self, route);
   });
  },
  
  blogHome: function (params)
  {
   var options = null;

   if (params)
   {
    options = SC.Utils.parseUrlOptions(params);
   }
   
   var self = this,
       application = this.application,
       model = new BlogModels.Post(),
       collection = new BlogCollections.Post(),
       view = new BlogViews.Home({
        model: model,
        baseUrl: '/' + this.rootFolder,
        application: this.application,
        urlOptions: options
       });

   model.fetch({
    data: _.extend({resultsperpage: 10}, options),
    killerId: this.application.killerId
   }).then(function (data) {
    collection.set(data.posts);
    model.set({posts: collection});
    view.showContent().then(function (view) {
     view.$('.pagination .hidden').removeClass("hidden");
    });
   });
  },

  blogDetail: function (url, params)
  {
   var self = this,
       collection = new BlogCollections.Comment(),
       model = new BlogModels.Post(),
       view = new BlogViews.Details({
        application: this.application,
        baseUrl: '/' + this.rootFolder,
        model: model
       }),
       parms = isNaN(url) ? {url: url} : {internalid: url};

   model.fetch({
    data: parms,
    killerId: this.application.killerId
   }).then(function (data) {
    collection.set(data.comments);
    model.set({comments: collection});
    view.showContent(
    [
     {
      text: model.get('heading'),
      href: '/' + self.rootFolder + '/' + url
     }
    ]);
   });
  },

  blogCategoryList: function (params)
  {
   var self = this,
       application = this.application,
       layout = application.getLayout(),
       categories = layout.getBlogCategories(),
       model = new Backbone.Model(),
       collection = new Backbone.Collection(),
       view = new BlogViews.CategoryList({
        model: model,
        baseUrl: '/' + self.rootFolder + '/' + self.categoryFolder,
        application: application
       });
       
   collection.set(categories);
   model.set({categories: collection});
   view.showContent(
   [
    {
     text: 'Categories',
     href: '/' + self.rootFolder + '/' + self.categoryFolder
    }
   ]);
   
  },

  blogArchiveHome: function (params)
  {
   var self = this,
       application = this.application,
       layout = application.getLayout(),
       archives = layout.getBlogArchives(),
       model = new Backbone.Model(),
       collection = new Backbone.Collection(),
       view = new BlogViews.ArchiveHome({
        model: model,
        baseUrl: '/' + self.rootFolder + '/' + self.archiveFolder,
        application: application
       });
       
   collection.set(archives);
   model.set({monthsArchived: collection});
   view.showContent(
   [
    {
     text: 'Archives',
     href: '/' + self.rootFolder + '/' + self.archiveFolder
    }
   ]);
   
  },

  blogReplyForm: function (url, params)
  {
   this.blogReplyToCommentForm(url, null, params);
  },
  
  blogReplyToCommentForm: function (url, commentid, params)
  {
   var self = this,
       collection = new BlogCollections.Comment(),
       model = new BlogModels.Post(),
       view = new BlogViews.CommentsForm({
        application: this.application,
        baseUrl: '/' + this.rootFolder,
        model: model
       }),
       parms = isNaN(url) ? {url: url} : {internalid: url};

   model.fetch({
    data: parms,
    killerId: this.application.killerId
   }).then(function (data) {
    collection.set(data.comments);
    model.set({comments: collection, commentid: commentid});
    view.model.on('reset destroy change add', function () {
     if (view.inModal && view.$containerModal)
     {
      view.$containerModal.modal('hide');
      view.destroy();
      var commentsSubmittedView = new BlogViews.CommentsSubmitted({
       application: self.application,
       baseUrl: '/' + self.rootFolder + '/' + url + (!_.isEmpty(commentid) ? '#comment-' + commentid : '')
      });
      commentsSubmittedView.showInModal();
     }
     else
     {
      Backbone.history.navigate('#' + self.rootFolder + '/' + url + '/reply-submitted', {trigger: true});
     }
    }, view);
    view.showContent(
    [
     {
      text: model.get('heading'),
      href: '/' + self.rootFolder + '/' + url + (!_.isEmpty(commentid) ? '#comment-' + commentid : '')
     },
     {
      text: 'Reply',
      href: '/' + self.rootFolder + '/' + url + '/reply' + (!_.isEmpty(commentid) ? '/' + commentid : '')
     }
    ]);
   });
  },
  
  blogReplySubmitted: function (url, params)
  {
   var self = this,
       model = new BlogModels.Post(),
       view = new BlogViews.CommentsSubmitted({
        application: this.application,
        baseUrl: '/' + this.rootFolder + '/' + url,
        model: model
       }),
       parms = isNaN(url) ? {url: url} : {internalid: url};

   model.fetch({
    data: parms,
    killerId: this.application.killerId
   }).then(function (data) {
    view.showContent(
    [
     {
      text: model.get('heading'),
      href: '/' + self.rootFolder + '/' + url
     },
     {
      text: 'Reply Submitted',
      href: '/' + self.rootFolder + '/' + url + '/reply-submitted'
     }
    ]);
   });
  },
  
  blogPostsByQuery: function (query, params)
  {
   var options = null;

   if (params)
   {
    options = SC.Utils.parseUrlOptions(params);
   }
   
   var self = this,
       application = this.application,
       model = new BlogModels.Post(),
       collection = new BlogCollections.Post(),
       view = new BlogViews.List({
        model: model,
        baseUrl: '/' + this.rootFolder,
        application: this.application,
        urlOptions: options
       });

   model.fetch({
    data: _.extend({search: query}, options),
    killerId: this.application.killerId
   }).then(function (data) {
    collection.set(data.posts);
    model.set({query: query, posts: collection});
    view.showContent(
    [
     {
      text: 'Search results for &quot;' + query + '&quot;',
      href: '/' + self.rootFolder + '/search/' + query
     }
    ]);
   });
  },
  
  blogPostsByCategory: function (url, params)
  {
   var options = null;

   if (params)
   {
    options = SC.Utils.parseUrlOptions(params);
   }
   
   var self = this,
       baseUrlPath = '/' + self.rootFolder + '/' + self.categoryFolder,
       fullUrlPath = baseUrlPath + '/' + url,
       application = this.application,
       model = new BlogModels.Post(),
       collection = new BlogCollections.Post(),
       view = new BlogViews.List({
        model: model,
        baseUrl: '/' + this.rootFolder,
        application: this.application,
        urlOptions: options
       }),
       categoryName = (_.findWhere(application.getLayout().getBlogCategories(), {url: fullUrlPath}) || {}).name || '';
       
   model.fetch({
    data: _.extend({category: url}, options),
    killerId: this.application.killerId
   }).then(function (data) {
    collection.set(data.posts);
    model.set({category: categoryName, posts: collection});
    view.showContent(
    [
     {
      text: 'Categories',
      href: baseUrlPath
     },
     {
      text: categoryName || url,
      href: fullUrlPath
     }
    ]);
   });
  },
  
  blogPostsByArchive: function (url, params)
  {
   var options = null;

   if (params)
   {
    options = SC.Utils.parseUrlOptions(params);
   }
   
   var self = this,
       baseUrlPath = '/' + self.rootFolder + '/' + self.archiveFolder,
       fullUrlPath = baseUrlPath + '/' + url,
       application = this.application,
       model = new BlogModels.Post(),
       collection = new BlogCollections.Post(),
       view = new BlogViews.ArchiveListByMonth({
        model: model,
        baseUrl: '/' + this.rootFolder,
        application: this.application,
        urlOptions: options
       }),
       archiveName = (_.findWhere(application.getLayout().getBlogArchives(), {url: fullUrlPath}) || {}).name || '';

   model.fetch({
    data: _.extend({archive: url}, options),
    killerId: this.application.killerId
   }).then(function (data) {
    collection.set(data.posts);
    model.set({archive: archiveName, posts: collection});
    view.showContent(
    [
     {
      text: 'Archives',
      href: baseUrlPath
     },
     {
      text: archiveName || url,
      href: fullUrlPath
     }
    ]);
   });
  }
  
 });
});

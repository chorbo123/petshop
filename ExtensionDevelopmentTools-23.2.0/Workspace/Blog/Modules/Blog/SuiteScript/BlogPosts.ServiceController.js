// @module bb1.Blog
define(
	'bb1.Blog.Posts.ServiceController',
	[
		'ServiceController',
		'Models.Init',
		'bb1.Blog.Posts.Model'
	],
	function(
		ServiceController,
		ModelsInit,
		BlogPostsModel
	)
	{
		'use strict';
  
  try {
   // @class bb1.Blog.Posts.ServiceController Manage blog posts requests
   // @extend ServiceController
   return ServiceController.extend({

    // @property {String} name Mandatory for all ssp-libraries model
    name: 'bb1.Blog.Posts.ServiceController',

    // @method get The call to BlogPosts.Service.ss with http method 'get' is managed by this function
    // @return {bb1.Blog.Posts.Model.Data}
    get: function ()
    {
     var id = this.request.getParameter('internalid'),
         url = this.request.getParameter('url');
         
     if (id || url)
     {
      return BlogPostsModel.get(id || url); //, {cache: response.CACHE_DURATION_LONG});
     }
     else
     {
      var list_header_data = {
           category: this.request.getParameter('category'),
           archive: this.request.getParameter('archive'),
           search: this.request.getParameter('search'),
           order: this.request.getParameter('order'),
           sort: this.request.getParameter('sort'),
           from: this.request.getParameter('from'),
           to: this.request.getParameter('to'),
           page: this.request.getParameter('page'),
           resultsperpage: this.request.getParameter('resultsperpage')
          };

      return BlogPostsModel.search(list_header_data) || []; //, {cache: response.CACHE_DURATION_LONG});
     }
    }

   });
  }
		catch (e)
		{
			console.warn('bb1.Blog.Posts.Model.Service.ss' + e.name, e);
			this.sendError(e);
		}
  
	}
);
// @module bb1.Blog
define(
	'bb1.Blog.Comments.ServiceController',
	[
		'ServiceController',
		'Models.Init',
		'bb1.Blog.Comments.Model'
	],
	function(
		ServiceController,
		ModelsInit,
		BlogCommentsModel
	)
	{
		'use strict';
  
  try {
   // @class bb1.Blog.Comments.ServiceController Manage blog comment requests
   // @extend ServiceController
   return ServiceController.extend({

    // @property {String} name Mandatory for all ssp-libraries model
    name: 'bb1.Blog.Comments.ServiceController',

    // @method get The call to BlogComments.Service.ss with http method 'get' is managed by this function
    // @return {bb1.Blog.Comments.Model.Data}
    get: function ()
    {
     var id = this.request.getParameter('internalid'),
         url = this.request.getParameter('url');

     if (id || url)
     {
      return BlogCommentsModel.get(id || url); //, {cache: response.CACHE_DURATION_LONG});
     }
     else
     {
      this.sendError(notFoundError);
     }
    },

    // @method put The call to BlogComments.Service.ss with http method 'put' is managed by this function
    // @return {bb1.Blog.Comments.Model.Data}
    put: function()
    {
     //var data = JSON.parse(request.getBody() || '{}')
     return BlogCommentsModel.create(this.data); //, {cache: response.CACHE_DURATION_LONG});
    }
    
   });
  }
		catch (e)
		{
			console.warn('bb1.Blog.Comments.Model.Service.ss' + e.name, e);
			this.sendError(e);
		}
  
	}
);

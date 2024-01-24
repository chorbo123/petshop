// @module bb1.Blog
define(
	'bb1.Blog.Settings.ServiceController',
	[
		'ServiceController',
		'Models.Init',
		'bb1.Blog.Settings.Model'
	],
	function(
		ServiceController,
		ModelsInit,
		BlogSettingsModel
	)
	{
		'use strict';
  
  try {
   // @class bb1.Blog.Settings.ServiceController Manage blog settings requests
   // @extend ServiceController
   return ServiceController.extend({

    // @property {String} name Mandatory for all ssp-libraries model
    name: 'bb1.Blog.Settings.ServiceController',

    // @method get The call to BlogSettings.Service.ss with http method 'get' is managed by this function
    // @return {bb1.Blog.Settings.Model.Data}
    get: function ()
    {
     return BlogSettingsModel.get(); // {cache: response.CACHE_DURATION_LONG});
    }

   });
  }
		catch (e)
		{
			console.warn('bb1.Blog.Settings.Model.Service.ss' + e.name, e);
			this.sendError(e);
		}
  
	}
);

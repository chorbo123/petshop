// @module bb1.Blog
define(
	'bb1.Blog',
	[
  'bb1.Blog.Settings.Model',
  'Configuration',
		'Utils',
		'underscore'
	],
	function (
		BlogSettingsModel,
  Configuration,
		Utils,
		_
	)
 {
  'use strict';

  Configuration.BlueBridgeBlog = {
   blog_site: 1,
   results_per_page: 10
  };

  var Application = require("Application"); // workaround for Extension Manager obfuscating Application module properties
  
  Application.getEnvironment = _.wrap(Application.getEnvironment, function(originalGetEnvironment) {
   
   var environment = originalGetEnvironment.apply(this, _.rest(arguments));
   
   _.extend(environment, {
    
    blogSettings: BlogSettingsModel.get()
    
   });
   
   return environment;
   
  });
 
 }
);
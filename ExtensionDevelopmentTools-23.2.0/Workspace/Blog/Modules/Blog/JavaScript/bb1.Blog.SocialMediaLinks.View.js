// @module bb1.Blog
define(
	'bb1.Blog.SocialMediaLinks.View',
	[
		'SC.Configuration',
  
		'bb1_blog_social_media_links.tpl',
 
		'underscore',
		'Backbone'
	],
	function (
		Configuration,
  
		bb1_blog_social_media_links_tpl,

		_,
		Backbone
	)
{
	'use strict';

	// @class bb1.Blog.SocialMediaLinks.View @extends Backbone.View
	return Backbone.View.extend({

		// @property {Function} template
		template: bb1_blog_social_media_links_tpl,

		// @method initialize
		initialize: function (options)
		{
			this.application = options.application;
		},

		// @method getContext @return bb1.Blog.SocialMediaLinks.View.Context
		getContext: function ()
		{
			// @class bb1.Blog.SocialMediaLinks.View
			return {
					// @property {Application} application
					application: this.application

			};
			// @class bb1.Blog.SocialMediaLinks.View
		}
	});

});
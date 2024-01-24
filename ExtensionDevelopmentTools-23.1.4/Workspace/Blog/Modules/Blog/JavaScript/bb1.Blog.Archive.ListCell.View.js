// @module bb1.Blog
define(
	'bb1.Blog.Archive.ListCell.View',
	[
		'SC.Configuration',
  
		'bb1_blog_archive_list_cell.tpl',
 
		'underscore',
		'Backbone'
	],
	function (
		Configuration,
  
		bb1_blog_archive_list_cell_tpl,

		_,
		Backbone
	)
{
	'use strict';

	// @class bb1.Blog.Archive.ListCell.View @extends Backbone.View
	return Backbone.View.extend({

		// @property {Function} template
		template: bb1_blog_archive_list_cell_tpl,

		// @method initialize
		initialize: function (options)
		{
			this.model = options.model;
		},

		// @method getContext @return bb1.Blog.Archive.ListCell.View.Context
		getContext: function ()
		{
			// @class bb1.Blog.Archive.ListCell.View
   var post = this.model,
       dateTimePosted = post.get("dateposted") || "";
   
			return {
					//@property {bb1.BlogPost.Model} post
					post: post,
     postUrl: this.options.baseUrl + "/" + post.get("url"),
     dateTimePosted: dateTimePosted,
     datePosted: dateTimePosted.replace(/^(\d+\/\d+\/\d+).*/, "$1")
			};
			// @class bb1.Blog.Archive.ListCell.View
		}
	});

});

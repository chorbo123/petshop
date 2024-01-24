// @module bb1.Blog
define(
	'bb1.Blog.Home.ListCell.View',
	[
		'SC.Configuration',
  
		'bb1_blog_home_list_cell.tpl',
 
		'underscore',
		'Backbone'
	],
	function (

		Configuration,
  
		bb1_blog_home_list_cell_tpl,

		_,
		Backbone
	)
{
	'use strict';

	// @class bb1.Blog.Home.ListCell.View @extends Backbone.View
	return Backbone.View.extend({

		// @property {Function} template
		template: bb1_blog_home_list_cell_tpl,

		// @method initialize
		initialize: function (options)
		{
			this.model = options.model;
		},

		// @method getContext @return bb1.Blog.Home.ListCell.View.Context
		getContext: function ()
		{
			// @class bb1.Blog.Home.ListCell.View
   var post = this.model || new Backbone.Model(),
       dateTimePosted = post.get("dateposted") || "";
   
			return {
					//@property {bb1.BlogPost.Model} post
					post: post,
     postId: post.get("internalid"),
     postUrl: this.options.baseUrl + "/" + post.get("url"),
     postHeading: post.get("heading"),
     postImageUrl: post.get("image"),
     dateTimePosted: dateTimePosted,
     datePosted: dateTimePosted.replace(/^(\d+\/\d+\/\d+).*/, "$1")
			};
			// @class bb1.Blog.Home.ListCell.View
		}
	});

});

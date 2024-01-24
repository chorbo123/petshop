// @module bb1.Blog
define(
	'bb1.Blog.Comments.ListCell.View',
	[
		'SC.Configuration',
  
		'bb1_blog_comments_list_cell.tpl',
 
		'underscore',
		'Backbone'
	],
	function (
		Configuration,
  
		bb1_blog_comments_list_cell_tpl,

		_,
		Backbone
	)
{
	'use strict';

	// @class bb1.Blog.Comments.ListCell.View @extends Backbone.View
	return Backbone.View.extend({

		// @property {Function} template
		template: bb1_blog_comments_list_cell_tpl,

		// @method initialize
		initialize: function (options)
		{
			this.model = options.model;
		},

		// @method getContext @return bb1.Blog.Comments.ListCell.View.Context
		getContext: function ()
		{
			// @class bb1.Blog.Comments.ListCell.View
   var model = this.model;
        
			return {
					//@property {bb1.BlogPost.Model} post
					model: model,
     postUrl: this.options.postUrl
			};
			// @class bb1.Blog.Comments.ListCell.View
		}
	});

});

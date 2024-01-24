// @module bb1.Blog.Models
define(
	'bb1.Blog.Models',
 [
  'Backbone',
		'underscore',
		'Utils'
 ],
	function (
  Backbone,
		_,
  Utils
 )
{
	'use strict';

	// @lass bb1.Blog.Models @extends Backbone.Model
 
 var Models = {};

 // Blog post
 Models.Post = Backbone.Model.extend(
 {
  urlRoot: Utils.getAbsoluteUrl('extensions/bb1/Blog/1.0.0/services/BlogPosts.Service.ss'),
  
  validation: {
   name: { required: true, msg: _('Name is required').translate() },
   email: { required: true, pattern: 'email', msg: _('Valid Email is required').translate() },
   comments: { required: true, msg: _('Comments are required').translate() }
  }
 });
 
 // Blog comment
 Models.Comment = Backbone.Model.extend(
 {
  urlRoot: Utils.getAbsoluteUrl('extensions/bb1/Blog/1.0.0/services/BlogComments.Service.ss'),
  
  validation: {
   name: { required: true, msg: _('Name is required').translate() },
   email: { required: true, pattern: 'email', msg: _('Valid Email is required').translate() },
   comments: { required: true, msg: _('Comments are required').translate() }
  }
 });
 
 // Blog settings
 Models.Settings = Backbone.Model.extend(
 {
  urlRoot: Utils.getAbsoluteUrl('extensions/bb1/Blog/1.0.0/services/BlogSettings.Service.ss'),
 });
 
 return Models;
 
});

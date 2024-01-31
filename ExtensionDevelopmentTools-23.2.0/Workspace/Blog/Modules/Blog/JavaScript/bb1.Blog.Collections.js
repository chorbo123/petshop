// @module bb1.Blog
define(
	'bb1.Blog.Collections',
 [
  'bb1.Blog.Models',
  
  'Backbone',
		'underscore',
  'Utils'
 ],
	function (
  BlogModels,
  
  Backbone,
		_,
  Utils
 )
{
	'use strict';

	// @lass bb1.Blog.Collections @extends Backbone.Collection
 
 var Collections = {};

 // Blog post
 Collections.Post = Backbone.Collection.extend(
 {
  model: BlogModels.Post,
  url: Utils.getAbsoluteUrl('extensions/bb1/Blog/1.0.0/services/BlogPosts.Service.ss')
 });
 
 // Blog comment
 Collections.Comment = Backbone.Collection.extend(
 {
  model: BlogModels.Comment,
  url: Utils.getAbsoluteUrl('extensions/bb1/Blog/1.0.0/services/BlogComments.Service.ss')
 });
 
 // Blog settings
 Collections.Settings = Backbone.Collection.extend(
 {
  model: BlogModels.Settings,
  url: Utils.getAbsoluteUrl('extensions/bb1/Blog/1.0.0/services/BlogSettings.Service.ss')
 });
 
 return Collections;
 
});

// @module bb1.PetshopShopping.ProductDetails
define(
	'bb1.PetshopShopping.ProductDetails.EstimatedDelivery.Model',
 [
	 'Backbone',
		'underscore'
	],
	function (
		Backbone,
		_
	)
 {
  'use strict';

  // @class bb1.PetshopShopping.ProductDetails.EstimatedDelivery.Model @extends Backbone.Model
  return Backbone.Model.extend({
   
   url: '/app/site/hosting/scriptlet.nl?script=445&deploy=1&compid=3934951&h=68f7566a463eb221a8b1&action=estimate-delivery-dates',
   
  });
  
 }
);

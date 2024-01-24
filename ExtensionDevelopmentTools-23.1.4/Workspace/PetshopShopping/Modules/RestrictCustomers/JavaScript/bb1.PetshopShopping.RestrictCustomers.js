// @module bb1.PetshopShopping.RestrictCustomers
define(
	'bb1.PetshopShopping.RestrictCustomers',
	[
  'Session',
  'Profile.Model',
  'SC.Configuration',
  
  'underscore'
	],
	function(
  Session,
  ProfileModel,
  Configuration,
  
  _
	)
 {
  'use strict';

  return  {
   mountToApp: function (application)
   {
    
    var profile = ProfileModel.getInstance();
    
    /*profile.on('sync', function(profile) {
     console.log('ProfileModel sync test');
     console.log(arguments);
     //if (profile)
     // document.location = 'http://www.petshop.co.uk/';
    });*/
    
    application.getUser().done(function (profile) {
     //console.log('ProfileModel getUser promise test');
     //console.log(arguments);
     var websiteId = Configuration.get('websiteAccess.internalId');
     
     //if (profile.get('isRecognized') == 'T' && profile.get('websiteAccess') != websiteId) {
     if (profile.get('loggedOffForRestrictedAccess')) {
     //console.log('redirecting to vetshop.co.uk');
      window.location.href = 'https://www.vetshop.co.uk/';
     }
    });
   }
  };
  
 }
);

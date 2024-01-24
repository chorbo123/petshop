//@module bb1.PetshopShopping.Profile
define(
 'bb1.PetshopShopping.Profile',
 [
  'Transaction.Line.Model',
  'ProductLine.Common',
  //'MyAccount.Profile',
  'Profile.Model',
  'Session',
  'SC.Configuration',
  
  'Backbone',
  'underscore',
  'Utils'
 ],
 function (
  TransactionLineModel,
  ProductLineCommon,
  //MyAccountProfile,
  ProfileModel,
  Session,
  Configuration,
  
  Backbone,
  _,
  Utils
 )
{
 'use strict';
 
 /*MyAccountProfile.MenuItems = [
  {
   id: 'settings'
  ,	name: _('Your Profile').translate()
  ,	index: 6
  ,	children:
   [
    {
     id: 'profileinformation'
    ,	name: _('Profile Information').translate()
    ,	url: 'profileinformation'
    ,	index: 1
    }
   ,	{
     id: 'emailpreferences'
    ,	name: _('Contact Preferences').translate()
    ,	url: 'emailpreferences'
    ,	index: 2
    }
   ,	{
     id: 'updateyourpassword'
    ,	name: _('Update your Password').translate()
    ,	url: 'updateyourpassword'
    ,	index: 5
    }
   ]
  }
 ];*/

  TransactionLineModel.prototype.getVisibleOptions = ProductLineCommon.getVisibleOptions = _.wrap(ProductLineCommon.getVisibleOptions, function(originalGetVisibleOptions)
  {
   //console.log('ProductLineCommon.getVisibleOptions wrapped');
   //var results = originalGetVisibleOptions.apply(this, _.rest(arguments));
   var collection;
   //if(Configuration.get('ItemOptions.showOnlyTheListedOptions'))
   //{
    collection = this.get('options')
     .filter(function(option)
     {
      return _.find(Configuration.get('ItemOptions.optionsConfiguration'), function(optionConfiguration)
       {
        var cartOptionId = option.get('cartOptionId');
        return optionConfiguration.cartOptionId === cartOptionId && !(cartOptionId == 'custcol_bb1_cop_brand' || cartOptionId == 'custcol_bb1_cop_freeitem');
       });
     });
   //}
   //else
   //{
   // collection = this.get('options').models;
   //}

   return _.sortBy(collection, function(option){return option.get('index');});
   //return results;
  });
  
 return {

  mountToApp: function (container)
  {
   
  }

 };
 
});

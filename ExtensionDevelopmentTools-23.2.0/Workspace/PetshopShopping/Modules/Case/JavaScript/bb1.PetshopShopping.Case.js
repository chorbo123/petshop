// @module bb1.PetshopShopping.Case
define(
	'bb1.PetshopShopping.Case',
	[
  'Case',
  'Case.Create.View',
  'Profile.Model',
  'SC.Configuration',
  
  'underscore'
	],
	function(
  Case,
  CaseCreateView,
  ProfileModel,
  Configuration,
  
  _
	)
 {
  'use strict';
  
  Case.MenuItems = function ()
  {
   if (!SC && SC.ENVIRONMENT && SC.ENVIRONMENT.casesManagementEnabled)
   {
    return undefined;
   }

   return {
    id:  'cases'
   ,	name: _('Your Support Cases').translate()
   ,	index: 4
   ,	children:  [
     {
      parent: 'cases'
     ,	id: 'cases_all'
     ,	name: _('My Support Cases').translate()
     ,	url: 'cases'
     ,	index: 2
     }
    ,	{
      parent: 'cases'
     ,	id: 'newcase'
     ,	name: _('Submit a New Case').translate()
     ,	url: 'newcase'
     ,	index: 1
     }
    ]
   ,	permission: 'lists.listCase.2'
   };
  };
  
  CaseCreateView.prototype.getContext = _.wrap(CaseCreateView.prototype.getContext, function(originalGetContext)
		{
			var context = originalGetContext.apply(this, _.rest(arguments));
   
			return _.extend(context, {
				// @property {Array<Object{text:String,id:Number}>} salesorders
				salesorders: this.fields.get('salesorders')
			});
		});
  
  return  {
   mountToApp: function (application)
   {
    
   }
  };
  
 }
);

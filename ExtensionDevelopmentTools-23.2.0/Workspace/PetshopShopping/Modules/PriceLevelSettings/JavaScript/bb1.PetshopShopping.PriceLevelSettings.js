define(
	'bb1.PetshopShopping.PriceLevelSettings',
	[
  'Session',
  'Profile.Model',
  'SC.Configuration',
  'ItemsKeyMapping',
  
  'underscore'
	],
	function(
  Session,
  ProfileModel,
  Configuration,
  ItemsKeyMapping,
  
  _
	)
 {
  'use strict';

  return  {
   mountToApp: function (application)
   {
    
    _.extend(Session, {
     
     getSearchApiParams: _.wrap(Session.getSearchApiParams, function (originalGetSearchApiParams)
     {
      var result = originalGetSearchApiParams.apply(this, _.rest(arguments)),
          profile = ProfileModel.getInstance();
      
      result.pricelevel = SC.ENVIRONMENT.currentPriceLevel ? SC.ENVIRONMENT.currentPriceLevel : SC.ENVIRONMENT.siteSettings.defaultpricelevel;
      
      if (result.pricelevel != '5' && profile.get('isRecognized') !== 'T')
       result.fields = 'pricelevel' + result.pricelevel + ',pricelevel' + result.pricelevel + '_formatted';
      
      return result;
     })
     
    });
    
    
    ItemsKeyMapping.getKeyMapping = _.wrap(ItemsKeyMapping.getKeyMapping, function (originalGetKeyMapping, configuration)
    {
     var result = originalGetKeyMapping.apply(this, _.rest(arguments));
      
     _.extend(result, {
      
      _price: function (item)
      {
       return (item.get('_priceDetails') && item.get('_priceDetails').onlinecustomerprice) || '';
      },

      _price_formatted: function (item)
      {
       return (item.get('_priceDetails') && item.get('_priceDetails').onlinecustomerprice_formatted) || '';
      },

      _priceDetails: function (item)
      {
       //console.log('_priceDetails');
       //console.log(item);
       var profile = ProfileModel.getInstance(),
           pricelevel = SC.ENVIRONMENT.currentPriceLevel ? SC.ENVIRONMENT.currentPriceLevel : SC.ENVIRONMENT.siteSettings.defaultpricelevel,
           priceLevelPrice = item.get('pricelevel' + pricelevel) || '',
           priceLevelPriceFormatted = item.get('pricelevel' + pricelevel + '_formatted') || '';
      
       //console.log(pricelevel);
       //console.log(priceLevelPrice);
       //console.log(priceLevelPriceFormatted);
       //console.log(profile.get('isRecognized'));
       
       if (pricelevel != '5' && profile.get('isRecognized') !== 'T' && priceLevelPrice) {
        //console.log('defaulted pricing to wholesale');
        return {onlinecustomerprice: priceLevelPrice, onlinecustomerprice_formatted: priceLevelPriceFormatted};
       }
       
       return item.get('onlinecustomerprice_detail');
      }
      
     });
     
     return result;
    });
     
   }
  };
  
 }
);

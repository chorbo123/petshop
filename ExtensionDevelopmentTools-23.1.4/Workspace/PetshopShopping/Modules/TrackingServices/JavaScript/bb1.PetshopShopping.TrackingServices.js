// @module bb1.PetshopShopping.TrackingServices
define(
 'bb1.PetshopShopping.TrackingServices',
	[
  'TrackingServices',
  'underscore'
 ],
	function (
  TrackingServices,
  _
 )
 {
  'use strict';

  var parse = function (string)
  {
   if (!string)
   {
    return '';
   }

   return _.isString(string) ? string.replace(/<BR>/i, ',').replace('	', '').replace('-', '').toUpperCase() : string + '';
  };
  
  _.extend(TrackingServices.services, {
   
   DPD: {
    name: 'DPD',
    url: 'http://www.dpd.co.uk/service/tracking?parcel=',
    validate: function (numbers)
    {
     numbers = parse(numbers);

     if (numbers.length !== 14)
      return false;

     return true;
    }
   },
   
   Yodel: {
    name: 'Yodel',
    url: 'http://www.yodel.co.uk/tracking/',
    validate: function (numbers)
    {
     numbers = parse(numbers);

     if (numbers.substring(0, 7) !== 'JD00022' || numbers.length !== 18)
     {
      return false;
     }

     return true;
    }
   },
   
   Hermes: {
    name: 'Hermes',
    url: 'https://www.hermesworld.com/en/our-services/distribution/parcel-delivery/parcel-tracking/?trackingNo=',
    validate: function (numbers)
    {
     numbers = parse(numbers);

     if (numbers.length !== 16)
     {
      return false;
     }

     return true;
    }
   }
   
  });
  
 }
);


function service(request, response)
{
	'use strict';
	try 
	{
		require('bb1.PetshopShopping.Promotions.BottomlessBowlItems.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('bb1.PetshopShopping.Promotions.BottomlessBowlItems.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}
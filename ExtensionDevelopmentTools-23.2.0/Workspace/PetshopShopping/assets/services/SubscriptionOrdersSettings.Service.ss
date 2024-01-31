
function service(request, response)
{
	'use strict';
	try 
	{
		require('bb1.PetshopShopping.SubscriptionOrdersSettings.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('bb1.PetshopShopping.SubscriptionOrdersSettings.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}
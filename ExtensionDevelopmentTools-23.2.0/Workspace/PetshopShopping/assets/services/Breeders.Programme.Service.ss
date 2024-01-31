
function service(request, response)
{
	'use strict';
	try 
	{
		require('bb1.PetshopShopping.Breeders.Programme.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('bb1.PetshopShopping.Breeders.Programme.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}

function service(request, response)
{
	'use strict';
	try 
	{
		require('PetShop.PetShopMobile.BestSellers.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('PetShop.PetShopMobile.BestSellers.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}
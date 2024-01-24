
function service(request, response)
{
	'use strict';
	try 
	{
		require('PetShop.EmailDetection.EmailDetection.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('PetShop.EmailDetection.EmailDetection.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}
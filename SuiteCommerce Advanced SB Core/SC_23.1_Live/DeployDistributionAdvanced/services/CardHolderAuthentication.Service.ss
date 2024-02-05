function service(request, response)
{
	'use strict';
	try 
	{
		require('CardHolderAuthentication.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('CardHolderAuthentication.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}
function service(request, response)
{
	'use strict';
	try 
	{
		require('PaymentInstrumentACH.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('PaymentInstrumentACH.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}
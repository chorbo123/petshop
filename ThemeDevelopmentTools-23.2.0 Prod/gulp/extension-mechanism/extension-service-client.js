/* jshint esversion: 8 */
'use strict';

const RequestHelper = require('./client-script/RequestHelper');

const SERVICE_NAME = 'EXTENSION_SERVICE';
const REQUEST_TIMEOUT = 120;

module.exports = {
	searchExtensions(query)
	{
		query = query || {};
		query.service_name = SERVICE_NAME;

		const options = {
			query: query,
			timeout: REQUEST_TIMEOUT,
			method: 'GET',
			data: null
		};

		return RequestHelper.request(options);
	},

	getTargets(query)
	{
		query = query || {};
		query.operation = 'get_targets';
		query.service_name = SERVICE_NAME;

		const options = {
			query: query,
			timeout: REQUEST_TIMEOUT,
			method: 'GET',
			data: null
		};

		return RequestHelper.request(options);
	},

	createExtension(extension_data)
	{
		const options = {
			timeout: REQUEST_TIMEOUT,
			method: 'POST',
			data: {
				extension: extension_data,
				operation: 'create_extension',
				service_name: SERVICE_NAME
			}
		};

		return RequestHelper.request(options);
	},

	updateExtension(extension_data)
	{
		const options = {
			timeout: REQUEST_TIMEOUT,
			method: 'PUT',
			data: {
				extension: extension_data,
				operation: 'update_extension',
				service_name: SERVICE_NAME
			}
		};

		return RequestHelper.request(options);
	},

	reActivate(activation_key, update = false) {
		const {website, domain, subsidiary, location} = activation_key;

		const options = {
			timeout: REQUEST_TIMEOUT,
			method: 'PUT',
			data: {
				operation: 're_activate',
				service_name: SERVICE_NAME,
				website,
				domain,
				subsidiary,
				location,
				update
			}
		};

		return RequestHelper.request(options);
	},

	getActivationJob(activation_job_id) {
		const options = {
			timeout: REQUEST_TIMEOUT,
			method: 'GET',
			query: {
				operation: 'get_activation_job',
				service_name: SERVICE_NAME,
				activation_job_id
			}
		};

		return RequestHelper.request(options);
	}
};

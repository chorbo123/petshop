/* jshint esversion: 8 */
'use strict';

const {log, color, colorText} = require('ns-logs');
const path = require('path');
const _ = require('underscore');

const ExtensionServiceClient = require('./extension-service-client');

const extension_record_helper = {
    async search(data) {
		const query_params = {
			name: data.name,
			vendor: data.vendor,
			version: data.version,
			method: 'GET'
		};

		return await ExtensionServiceClient.searchExtensions(query_params);
	},

	async searchExtensions(data) {
		const query_params = {
            name: data.manifest.name,
			vendor: data.manifest.vendor,
			version: data.manifest.version,
		};

		const response = await this.search(query_params);
		const extensions = response.result.extensions;

		if(extensions.length < 0 || extensions.length > 1)
		{
			return Promise.reject('There are no extensions or several extensions for the filters given');
		}

		if(extensions.length === 0)
		{
			data.create_new_record = true;
			data.extension_record = {
				name: data.manifest.name,
				fantasy_name: data.manifest.fantasyName,
				vendor: data.manifest.vendor,
				type: data.manifest.type,
				targets: data.manifest.target,
				target_version: data.manifest.target_version,
				version: data.manifest.version,
				description: data.manifest.description
			};
		}
		else
		{
			data.extension_record = extensions[0];
			data.has_bundle = !!extensions[0].bundle_id;
		}

		return data;
	},

	async getTargets(data)
	{
		const query_params = {
            name: data.manifest.name,
			vendor: data.manifest.vendor,
			version: data.manifest.version,
			method: 'GET'
		};

		const response = await ExtensionServiceClient.getTargets(query_params);
		return response.result.available_targets;
	},

	async checkExtensionBundle(data, cb)
	{
		log(colorText(color.GREEN, 'Checking if ' + data.manifest.name + ' is a published ' + data.manifest.type + '...'));

		try {
			const response = await extension_record_helper.searchExtensions(data);
			if (response.create_new_record) {
				const {manifest} = response;
				log(colorText(color.GREEN, 'No Extension record found for ' +
					manifest.name + ' - ' + manifest.version + ' Vendor ' + manifest.vendor +
					'. Preparing to create a new ' + manifest.type + '...'));
			}

			response.targets = await extension_record_helper.getTargets(response);
			cb(null, response);
		} catch(error) {
			cb(error);
		}
	},

	async checkExistingExtension(data, cb)
	{
		const {new_extension, extension_record, create_new_record} = data;
		if(new_extension &&
			((extension_record.name !== new_extension.name ||
			extension_record.version !== new_extension.version ||
			extension_record.vendor !== new_extension.vendor) ||
			create_new_record))
		{
			const query_params = {
                name: new_extension.name,
				vendor: new_extension.vendor,
				version: new_extension.version,
				method: 'GET'
			};

			try{
				const response = await ExtensionServiceClient.searchExtensions(query_params);
				const extensions = response.result.extensions;
				if(extensions.length > 0)
				{
					const folder = path.join(data.new_extension.name, data.new_extension.vendor, data.new_extension.version);
					log(colorText(color.YELLOW, 'Warning: This deploy will override the content of the extension folder ' + folder + ' and record ' + extensions[0].extension_id));
				}
				cb(null, data);
			} catch(error) {
				cb(error);
			}
			return;
		}

		cb(null, data);
	},

	async updateExtensionRecord(data, cb)
	{
        const promises = [];
		const {record_operation, new_extension, manifest, manifest_file_id, new_manifest, extension_record} = data;

		if(record_operation && extension_record_helper.extensionChanged(data))
		{
			switch(record_operation)
			{
				case 'create':
					log(colorText(color.GREEN, 'Creating new ' + manifest.type + ' record: ' + new_manifest.vendor + ' - ' + new_manifest.name + ' - ' + new_manifest.version));

					promises.push(ExtensionServiceClient.createExtension({
						name: new_extension.name,
						fantasy_name: new_extension.fantasy_name,
						type: manifest.type,
						sub_type: manifest.sub_type,
						targets: new_extension.targets,
						target_version: new_extension.target_version,
						description: new_extension.description,
						vendor: new_extension.vendor,
						version: new_extension.version,
						manifest_id: manifest_file_id
					})
					.then(function(response)
					{
						data.deploy_result = response.header.status.code;
						log(colorText(color.GREEN, 'New ' + manifest.type + ' record created successfully with id ' + response.result.extension_id));
						data.extension_record.extension_id = response.result.extension_id;
					}));
					break;

				case 'update':
					data.new_extension = new_extension || {};

					log(colorText(color.GREEN, 'Updating ' + manifest.type + ' record: ' + new_manifest.vendor + ' - ' + new_manifest.name + ' - ' + new_manifest.version));

					promises.push(ExtensionServiceClient.updateExtension({
						extension_id: extension_record.extension_id,
						sub_type: manifest.sub_type,
						name: data.new_extension.name,
						fantasy_name: data.new_manifest.fantasyName,
						targets: data.new_manifest.targets,
						target_version: data.new_manifest.target_version,
						description: data.new_manifest.description,
						vendor: data.new_extension.vendor,
						version: data.new_extension.version,
						manifest_id: data.manifest_file_id
					})
					.then(function(response)
					{
						data.deploy_result = response.header.status.code;
						log(colorText(color.GREEN, manifest.type + ' record updated successfully.'));
					}));
					break;
				default:
					cb(new Error('Invalid record  operation ' + record_operation));
					break;
			}

			try {
				await Promise.all(promises);
				cb(null, data);
			} catch(error) {
				const errorMsg = (error.error && error.error.message) || error;
				cb(new Error('Error updating or creating Extension Record\n\n' + JSON.stringify(errorMsg)));
			}
			return;
		}

		cb(null, data);
	},

	extensionChanged(data)
	{
		const {new_extension, create_new_record, extension_record, manifest_file_id} = data;
		return (new_extension && create_new_record) ||
			extension_record.manifest_id !== manifest_file_id ||
			(new_extension &&
			(extension_record.vendor !== new_extension.vendor ||
			extension_record.name !== new_extension.name ||
			extension_record.fantasy_name !== new_extension.fantasy_name ||
			extension_record.version !== new_extension.version ||
			extension_record.description !== new_extension.description ||
			extension_record.sub_type !== new_extension.sub_type ||
			!_.isEqual(_.pluck(extension_record.targets, 'target_id'), new_extension.targets)||
			!_.isEqual(extension_record.target_version, new_extension.target_version)));
	},

	async reActivate(data, cb) {
		const {credentials, async, update} = data;
		const {website, domain, subsidiary, location} = credentials;

		const activation_key = {
			website,
			domain,
			subsidiary,
			location
		};

		const activation_key_string = _.compact(activation_key).join('-');

		log(colorText(color.GREEN, `Re-activating ${activation_key_string} ${update ? 'and updating' : ''}`));

		try {
			const response = await ExtensionServiceClient.reActivate(activation_key, update);
			const {job_id} = response.result;

			if(async) {
				cb();
				return;
			}

			log(colorText(color.YELLOW, `Waiting for activation...`));

			const hasFinished = async () => {
				const {result} = await ExtensionServiceClient.getActivationJob(job_id);
				const {state} = result;

				if(!['DONE', 'ERROR'].includes(state)) {
					setTimeout(hasFinished, 15 * 1000);
					return;
				}

				log(colorText(state === 'ERROR' ? color.RED : color.GREEN, `Re-activation finished with status ${state}`));
				cb();
			};

			hasFinished();
		} catch (error) {
			const errorMsg = (error.error && error.error.message) || error;
			cb(new Error(`Re-activation failed.\n${errorMsg}`));
		}
	}
};

module.exports = extension_record_helper;
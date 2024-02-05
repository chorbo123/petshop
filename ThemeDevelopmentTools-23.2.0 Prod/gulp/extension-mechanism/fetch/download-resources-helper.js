'use strict';

const configs = require('../configurations').getConfigs(),
	_ = require('underscore');

var ResourcePromisesHelper = require('./resource-promises-helper'),
	RecordHelper = require('../extension-record-helper'),
	FileServiceClient = require('../client-script/FileServiceClient');

var DownloadResourcesHelper = {
	getManifestFilePromises: async function getManifestFilePromises(manifest) {
        const result = await RecordHelper.searchExtensions({manifest: manifest});

        //Get the manifest in order to use its path updated since the one that comes in the activationManifest may be old (generated before a SCEM push)
        const file_service_client = FileServiceClient.getInstance();
        const manifest_file = await file_service_client.getFiles([result.extension_record.manifest_id]);
        manifest.path = manifest_file[0].path;

		// Use manifest just downloaded because when fetching Base Theme for fallback themes
		// may not be local manifests
		const parsed_manifest = JSON.parse(manifest_file[0].content);
		parsed_manifest.path = manifest.path;
		parsed_manifest.is_fallback = manifest.is_fallback;

		return this.downloadFiles(parsed_manifest);
	},

	downloadFiles: function downloadFiles(manifest) {
		var allowed_resources = configs.application.application_manifest.extensible_resources,
			file_promises = [];

		_.each(manifest, function(resource_data, resource) {
			if(_.contains(allowed_resources, resource)) {
				var message_finished = 'Finished downloading ' + resource + ' of ' + manifest.type + ': ' +  manifest.name + '...',
					resource_promises;

				switch(resource) {
					case 'templates':
					case 'sass':
						resource_promises = ResourcePromisesHelper.getFilesPromisesForResource({
                            manifest,
							resource,
							message_finished
                        });

						file_promises.push(resource_promises);
						break;

					case 'assets':
						resource_promises = ResourcePromisesHelper.getAssetFilesPromises({
                            manifest,
							resource,
							message_finished
                        });

						file_promises.push(resource_promises);
						break;

					case 'skins':
						resource_promises = ResourcePromisesHelper.getSkinFilesPromises({
                            manifest,
							resource,
							message_finished
                        });

						file_promises.push(resource_promises);
						break;
				}
			}
		});

		return file_promises;
	}
};

module.exports = DownloadResourcesHelper;

'use strict';

var FileServiceClient = require('./FileServiceClient'),
	_ = require('underscore');

var ManifestHelper = (function(){
	var file_service_client = FileServiceClient.getInstance();
	
	var getFilePath = function getFilePath(manifest, resource, file) {
		var folder = !_.isEmpty(manifest[resource].folder) ? manifest[resource].folder + '/' : '';
		if(!_.isNaN(parseInt(file))) {
			return file;
		}
		if (!_.isUndefined(folder) && file) {
			return (manifest.path ? manifest.path + '/' : '') + folder + file;
		}

		throw new Error('Invalid file path format:\npath ' + manifest.path + '\nfolder: ' + folder + '\nfile: ' + file);
	};

	var manifest_helper = {
		getResourceFiles: async function getResourceFiles(manifests, resource_type) {
			const isFallbackTheme = (manifest) => manifest.sub_type === 'fallback';

			const files_to_download = _.reduce(
				manifests,
				function(files, manifest) {
					const resource = manifest[resource_type];
					const is_fallback = isFallbackTheme(manifest);
					let to_add = [];

					if(!resource) {
						return files;
					}

					switch(resource_type) {
						case 'javascript':
						case 'templates':
							if(is_fallback) {
								to_add = resource;
								break;
							}

							_.each(resource.application || {}, function(data) {
								to_add = _.union(to_add, data.files);
							});
						break;

						case 'skins':
							to_add = _.isArray(resource) ? _.pluck(resource, 'file') : [];
						break;

					default:
						if(resource_type === 'sass' && is_fallback) {
							to_add = resource;
							break;
						}

						to_add = _.isArray(resource.files) ? resource.files : [];
						break;
					}

					return _.union(files, to_add.map((file) => getFilePath(manifest, resource_type, file)));
				},
				[]
			);

			return file_service_client.getFiles(files_to_download);
		}
	};

	return {
		getInstance: function () {
			this.instance = this.instance || manifest_helper;
			return this.instance;
		}
	};

})();

module.exports = ManifestHelper;

'use strict';

var {log, colorText, color} = require('ns-logs'),
	configs = require('../configurations').getConfigs(),
	_ = require('underscore');

var ConversionTool = require('../conversion-tool'),
	FileCabinet = require('../../library/file-cabinet'),
	ManifestHelper = require('../client-script/ManifestHelper').getInstance();

var resource_promises_helper = {
	getSkinFilesPromises: async function(options) {
		let files = await ManifestHelper.getResourceFiles([options.manifest], 'skins');
		files = files.map(function(file) {
			file.resourceType = options.resource;
			return file;
		});

		ConversionTool.extensionToModules(options.manifest, files);
		log(colorText(color.GREEN, options.message_finished));

		return files;
	},

	getFilesPromisesForResource: async function (options) {
		let files = await ManifestHelper.getResourceFiles([options.manifest], options.resource);
		files = files.map(function(file) {
			if(['sass', 'templates'].includes(options.resource) && file.type === 'MISCBINARY') {
				file.content = FileCabinet.base64decode(file.content);
			}

			file.resourceType = options.resource;
			return file;
		});

		ConversionTool.extensionToModules(options.manifest, files);
		log(colorText(color.GREEN, options.message_finished));

		return files;
	},

	getAssetFilesPromises: async function (options) {
		var assets = {files: []},
			manifest_assets_aux = options.manifest.assets;

		_.each(options.manifest.assets, function(assets_entry) {
			var files = _.map(assets_entry.files, function(file) {
				return 'assets/' + file;
			});
			assets.files = assets.files.concat(files);
		});

		options.manifest.assets = assets;

		let files = await ManifestHelper.getResourceFiles([options.manifest], options.resource);
		options.manifest.assets = manifest_assets_aux;

		files = files.map(function(file) {
			if(!file.file.endsWith('.ss')) {
				file.content = FileCabinet.base64decode(file.content);
			}

			file.resourceType = options.resource;
			return file;
		});

		//do not download services if theme mode
		if(!configs.extensionMode) {
			files = _.reject(files, (file) => file.file.endsWith('.ss'));
		}

		ConversionTool.extensionToModules(options.manifest, files);
		log(colorText(color.GREEN, options.message_finished));

		return files;
	}
};

module.exports = resource_promises_helper;

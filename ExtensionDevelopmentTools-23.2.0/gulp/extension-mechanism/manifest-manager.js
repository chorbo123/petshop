'use strict';

var fs = require('fs')
,	{log, colorText, color} = require('ns-logs')
,	configs = require('./configurations').getConfigs()
,	map = require('map-stream')
,	path = require('path')
,	_ = require('underscore');

module.exports = {

	addManifest: function(manifestPath)
	{
		if(!fs.existsSync(manifestPath))
		{
			throw new Error('Manifest ' + manifestPath + ' does not exists');
		}

		var manifest = JSON.parse(fs.readFileSync(manifestPath).toString());
		manifest.local_folder = path.parse(manifestPath).dir;

		this.manifests = this.manifests || [];
		this.manifests.push(manifest);

		this.manifests = _.sortBy(this.manifests, function(manifest)
		{
			//TODO add priority un gulp fetch
			return manifest.type && manifest.type === 'theme' ? -1 : 0;
		});
	}

,	updateManifest: function updateManifest(manifestPath)
	{
		if(!fs.existsSync(manifestPath))
		{
			throw new Error('Manifest ' + manifestPath + ' does not exists');
		}

		var updated_manifest = JSON.parse(fs.readFileSync(manifestPath).toString());
		updated_manifest.local_folder = path.parse(manifestPath).dir;

		this.manifests = this.manifests || [];

		_.each(this.manifests, function(manifest)
		{
			if(manifest.name === updated_manifest.name &&
				manifest.vendor === updated_manifest.vendor)
			{
				manifest = updated_manifest;
			}
		});

		return updated_manifest;
	}

,	findManifest: function findManifest(file_path)
	{
		return _.find(this.manifests, function(manifest)
		{
			var manifest_name_regex = new RegExp(configs.folders.source.source_path + '\/([^\/]*)\/')
			,	manifest_path = file_path.match(manifest_name_regex) && file_path.match(manifest_name_regex)[1];

			return (manifest_path && manifest_path === manifest.name) ||
				 (manifest_path && manifest_path === manifest.name.replace(/[^\w\-\_@0-9]/gi, ''));
		});
	}

,	getExtensionManifests: function getExtensionManifests()
	{
		return _.where(this.manifests || [], {type: 'extension'});
	}

,	getManifestByName: function getManifestByName(name)
	{
		return _.findWhere(this.manifests || [], {name});
	}

,	getThemeManifest: function getThemeManifest() {
		const theme_manifest = (this.manifests || []).filter(({type, is_fallback}) => type === 'theme' && !is_fallback);

		if(!theme_manifest || theme_manifest.length !== 1) {
			throw new Error('Theme not found');
		}
		return _.first(theme_manifest);
	}

,	getActivationId: function getActivationId()
	{
		var first_manifest = _.first(this.manifests || []);
		return first_manifest ? first_manifest.activation_id : null;
	},

	handleOverrides: function handleOverrides(){
		const {override, sub_type, sass, templates} = this.getThemeManifest();
		const is_fallback = sub_type === 'fallback';
		const {theme_path, base_theme_path} = configs.folders;

		let theme_folder = path.resolve(theme_path);
		let overrides = override;

		if(!overrides && is_fallback) {
			const base_theme = this.getBaseThemeManifest();
			overrides = base_theme.override || [];
			theme_folder = path.resolve(base_theme_path);
		}

		const base_path = path.resolve(configs.folders.source.source_path);
		const extensions_folder = configs.extensionMode ? base_path : path.resolve(configs.folders.source.extras_path);

		return map(function(file, cb) {
			if(is_fallback) {
				const to_fallback = [...sass, ...templates].find(file_path => path.resolve(base_theme_path, file_path) === file.path)
				if(to_fallback) {
					file.contents = Buffer.from(fs.readFileSync(path.resolve(theme_path, to_fallback)));
					cb(null, file);
					return;
				}
			}

			var is_source = overrides.find((override) => path.join(theme_folder, override.src) === file.path);

			if(is_source) {
				cb();
				return;
			}

			var is_dst = overrides.find((override) => {
				if(configs.extensionMode) {
					//in ext devtools the extensions are directly under workspace
					var ext_vendor = override.dst.split('/')[0];
					override.dst = override.dst.replace(ext_vendor, '');
				}

				return path.join(extensions_folder, override.dst) === file.path;
			});

			if(is_dst) {
				var src_file = path.join(theme_folder, is_dst.src);

				log(colorText(color.YELLOW, 'Overriding... ')+ path.relative(base_path, file.path) + '\n\t\t' + colorText(color.YELLOW, 'with ')+ path.relative(base_path, src_file));

				file.contents = Buffer.from(fs.readFileSync(src_file));
			}

			cb(null, file);
		});
	}

	// sass
,	getSassBasicEntryPoints: function getSassBasicEntryPoints() {
		const files = [];

		this.manifests.forEach((manifest) => {
			const {sub_type, sass, name, type} = manifest;

			if((type === 'theme' && sub_type === 'fallback') || !sass) {
				return;
			}

			_.each(sass.entry_points, (entry_point) => {
				const folder = !_.isEmpty(sass.folder) ? path.join(name, sass.folder) : name;
				files.push(path.join(folder, entry_point));
			});
		});

		return files;
	}

,	getSassEntryPoints: function getSassEntryPoints()
	{
		var self = this;
		var files = {};

		_.each(this.manifests, function(manifest)
		{
			if(manifest.sass)
			{
				_.each(manifest.sass.entry_points, function(entry_points, app)
				{
					var folder = !_.isEmpty(manifest.sass.folder) ? path.join(manifest.name, manifest.sass.folder) : manifest.name;

					//in theme mode the extras extensions are inside the vendor folder
					if(!configs.extensionMode && manifest.type === 'extension')
					{
						folder = !_.isEmpty(manifest.sass.folder) ? path.join(manifest.name, manifest.sass.folder) : path.join(manifest.vendor, manifest.name);
					}

					files[app] = files[app] || [];
					files[app] = files[app].concat(self._absolutize([entry_points], folder, true));
				});
			}
		});

		var meta_entry_points = {};
		_.each(files, function(entry_points, app)
		{
			var meta_entry_point = '';
			_.each(entry_points, function(entry_point)
			{
				var file_path = path.parse(entry_point).dir;
				var file_name = path.basename(entry_point, '.scss');

				meta_entry_point += '@import "' + path.join('tmp', file_path, file_name).replace(/\\/g, '/') + '"; ';
			});

			meta_entry_points[app] = meta_entry_point;
		});

		return meta_entry_points;
	}

,	_absolutize: function _absolutize(files, local_folder, absolute) {
		if(absolute) {
			files = files.map((file)=>
			{
				return path.join(local_folder, file);
			});
		}
		return files;
	}

	// templates
,	getApplicationTemplates: function getApplicationTemplates(application) {
		this.templates_extension = this.templates_extension || {};

		const files = this.manifests.map((manifest) => {
			try {
				const {templates, type, sub_type} = manifest;
				let {local_folder, vendor, name, version} = manifest;
				const is_theme = type === 'theme';

				if(is_theme && sub_type === 'fallback'){
					return [];
				}

				const tpl_files = templates.application[application].files;
				const folder = !_.isEmpty(templates.folder) ? path.join(local_folder, templates.folder) : local_folder;

				return tpl_files.map((file_path) => {
					const abs_path = path.join(folder, file_path);
					this.templates_extension[path.resolve(abs_path)] = [
						'extensions',
						vendor,
						name,
						version,
						''
					].join('/');

					return abs_path;
				});

			} catch(error) {
				return [];
			}
		});

		return _.union(...files);
	},

	getTemplateExtensionPath: function getTemplateExtensionPath(tpl_path) {
		this.templates_extension = this.templates_extension || {};

		tpl_path = tpl_path.replace(/\.js$/, '.tpl');
		return this.templates_extension[tpl_path];
	},

	getBaseThemeManifest() {
		const {base_theme_path} = configs.folders;
		if(base_theme_path) {
			return this.getManifestByName(path.basename(base_theme_path));
		}
	},

	getTemplateApplications: function getTemplateApplications() {
		let theme_manifest = this.getThemeManifest();
		if(theme_manifest.sub_type === 'fallback') {
			theme_manifest = this.getBaseThemeManifest();
		}

		return _.keys(theme_manifest.templates.application);
	}

,	getJsFilesForManifest: function getJsFilesForManifest(manifest_name)
	{
		var manifest = _.where(this.manifests || [], { type: 'extension', name: manifest_name});

		if(!manifest || manifest.length !== 1)
		{
			throw new Error('Manifest for ' + manifest_name + ' not found or several manifests found.');
		}

		manifest = _.first(manifest);
		var app_manifest = configs.application.application_manifest;

		if(!app_manifest)
		{
			throw new Error('No Application Manifest found to get valid applications');
		}

		var entry_points = app_manifest.application
		, js_files = []
		;

		_.each(entry_points, function(application)
		{
			if(manifest.javascript && manifest.javascript.application && manifest.javascript.application[application])
			{
				js_files = js_files.concat(manifest.javascript.application[application].files);
			}
		});

		return js_files;
	}

,	getAssetFilesForManifest: function getAssetFilesForManifest(manifest_name)
	{
		var manifest = _.where(this.manifests || [], { name: manifest_name});

		if(!manifest || manifest.length !== 1)
		{
			throw new Error('Manifest for ' + manifest_name + ' not found or several manifests found.');
		}

		manifest = _.first(manifest);
		var assets_files = [];

		_.each(manifest.assets || [], function(asset_obj, key)
		{
			if(asset_obj.files.length)
			{
				var key_files = _.each(asset_obj.files || [], function(file)
				{
					return 'assets/ ' + file;
				});

				assets_files = assets_files.concat(key_files);
			}


		});

		return assets_files;
	}
};

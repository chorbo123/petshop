const gulp = require('gulp');
const async = require('ns-async');
const args = require('ns-args').argv();
const map = require('map-stream');
const path = require('path');
const configs = require('../configurations').getConfigs();
const _ = require('underscore');

// It's needed add an extra Sass file as a dependency of MyAccount when 'styleguide' task is called.
// This action is required only to build the Styleguide site.
const styleguide = args._.indexOf('styleguide') !== -1;
const local_folders = _.map(configs.folders.source, function(folder) {
	return path.join(folder, '**/*.scss');
});

function generateEntryPoints(cb) {
	try {
		const manifest_manager = require('../manifest-manager');
		const entryPoints = manifest_manager.getSassBasicEntryPoints();

		const isEntryPoint = (file) => entryPoints.find((entry_point) => file.includes(entry_point.replace(/\\/g, path.sep)));

		let {vendor, name, version, sub_type, assets, local_folder} = manifest_manager.getThemeManifest();
		const theme_folders = [local_folder];

		// If fallback theme does not have assets then use Base Theme ones
		if(sub_type === 'fallback') {
			const base_theme = manifest_manager.getBaseThemeManifest();
			theme_folders.push(base_theme.local_folder);

			if(!assets) {
				vendor = base_theme.vendor;
				name = base_theme.name;
				version = base_theme.version;
			}
		}

		const theme_path = [
			'..',
			'extensions',
			vendor,
			name,
			version,
			''
		].join('/');

		gulp.src(local_folders, {follow: true, base: process.cwd(), allowEmpty: true})
			.pipe(manifest_manager.handleOverrides())
			.pipe(map(function (file, cb) {
				const entry_point = isEntryPoint(file.path);
				if (entry_point) {
					const is_from_theme = theme_folders.find(folder => file.path.includes(folder));
					const ext_name = entry_point.split(path.sep)[0];
					const manifest = manifest_manager.getManifestByName(ext_name);
					const assets_paths = is_from_theme ? theme_path : [
						'..',
						'extensions',
						manifest.vendor,
						manifest.name,
						manifest.version,
						''
					].join('/');

					var content = '@function getExtensionAssetsPath($asset){\n';
					content += '@return \'' + assets_paths + '\' + $asset;\n';
					content += '}\n\n';

					content += '@function getThemeAssetsPath($asset){\n';
					content += '@return \'' + theme_path + '\' + $asset;\n';
					content += '}\n\n';

					var file_content = content + file.contents.toString();

					if (styleguide && path.basename(file.path) === 'myaccount.scss') {
						file_content += '@import "../../../../gulp/library/sc5-styleguide/lib/app/css-suitecommerce/_styleguide.scss"';
					}

					file.contents = Buffer.from(file_content);
				}

				const folder = configs.extensionMode ? configs.folders.theme : configs.folders.extensions;
				file.path = file.path.replace(path.normalize(folder), '');
				file.base = path.join(file.base, _.find(configs.folders.source, (folder) => file.path.includes(folder)));

				cb(null, file);
			}))
			.pipe(gulp.dest('tmp', { mode: 0o700 }))
			.on('end', cb)
			.on('error', cb);
	}
	catch (error)
	{
		cb(error);
	}
}

function compileEntryPoints(gulpDone)
{
	var manifest_manager = require('../manifest-manager'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass')(require('node-sass'));

	var gfile = require('gulp-file');

	var entryPoints = manifest_manager.getSassEntryPoints();

	async.each(_.keys(entryPoints), (entryPoint, cb)=>
	{
		var entrypoint_value = entryPoints[entryPoint];
		gfile(entryPoint + '.scss', entrypoint_value, {src: true})
			.pipe(sourcemaps.init())
			.pipe(sass.sync())
			.pipe(map(function(file, cb)
			{
				var file_content = file.contents.toString();
				file_content = file_content.replace(/:\s*\"\\(\\f.*?)\"/ig, ':\"$1\"');

				file.contents = Buffer.from(file_content);
				cb(null, file);
			}))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(path.join(configs.folders.output, 'css')))
			.on('error', cb)
			.on('end', cb);
	}, gulpDone);
}

module.exports = {
	generateEntryPoints: generateEntryPoints,
	compileEntryPoints: compileEntryPoints,
	local_folders: local_folders
};

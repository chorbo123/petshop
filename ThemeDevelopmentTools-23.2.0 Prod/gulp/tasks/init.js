'use strict';

const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const {log, colorText, color} = require('ns-logs');
const configurations = require('../extension-mechanism/configurations');
const args = require('ns-args').argv();
const _ = require('underscore');
const manifest_manager = require('../extension-mechanism/manifest-manager');
const RecordHelper = require('../extension-mechanism/extension-record-helper');
const ExtMechanismInquirer = require('../extension-mechanism/credentials-inquirer');
const DownloadResourcesHelper = require('../extension-mechanism/fetch/download-resources-helper');

const config = configurations.getConfigs();

function registerExtrasExtensions() {
    const extensions_path = config.folders.source.extras_path;
    const {base_theme_path = '/'} = config.folders;

    _.each(fs.readdirSync(extensions_path), function(vendor_folder) {
        vendor_folder = path.join(extensions_path, vendor_folder);

        if(path.normalize(base_theme_path) === vendor_folder) {
            // Ignore Base Theme folder
            return;
        }

        _.each(fs.readdirSync(vendor_folder), function(ext_folder) {
            const ext_path = path.join(vendor_folder, ext_folder);

            if(fs.statSync(ext_path).isDirectory()) {
                try {
                    registerManifest(ext_path);
                } catch(error) {
                    logInfo(ext_path + '/manifest.json does not exist. Ignoring ' + ext_path);
                }
            }
        });
    });
}

function registerWorkspaceExtensions() {
    const new_extensions_path = [];
    const extensions_path = config.folders.source.source_path;

    !fs.existsSync(extensions_path) && fs.mkdirSync(extensions_path, 0o744);

    _.each(fs.readdirSync(extensions_path), function(ext_folder) {
        const is_theme_extra_dir = config.folders.source.extras_path && config.folders.source.extras_path.includes(ext_folder);
        const ext_path = path.join(extensions_path, ext_folder);

        if(!is_theme_extra_dir && fs.statSync(ext_path).isDirectory()) {
            try {
                registerManifest(ext_path);
                new_extensions_path.push(ext_path);
            } catch(error) {
                logInfo(`${path.join(ext_path, 'manifest.json')} does not exist or is malformed. Ignoring ${ext_path}`);
            }
        }
    });

    return new_extensions_path;
}

function registerManifest(manifest_path) {
    manifest_manager.addManifest(path.join(manifest_path, 'manifest.json'));
}

function _isSkipCompilation() {
    return args['skip-compilation'];
}

function logInfo(msg) {
    log(colorText(color.YELLOW, msg));
}

function loadApplicationManifest() {
    const app_manifest_path = path.join(config.folders.application_manifest, 'application_manifest.json');
    if (fs.existsSync(app_manifest_path)) {
        config.application.application_manifest = JSON.parse(fs.readFileSync(app_manifest_path).toString());
    }
}

async function initFallbackTheme() {
    const {base_theme_path} = config.folders;
    const theme = manifest_manager.getThemeManifest();

    await new Promise( (resolve, reject)=>{
        ExtMechanismInquirer.getCredentials(null, (err) => err ? reject(err) : resolve());
    });

    if (theme.sub_type === 'fallback' && (!base_theme_path || !fs.existsSync(base_theme_path)) && !_isSkipCompilation()) {
        logInfo(`Base Theme is required for "fallback" themes. Downloading it...`);

        const {result} = await RecordHelper.search({
            vendor: 'SuiteCommerce',
            name: 'Suite_Commerce_Base_Theme'
        });

        const semver = require('semver');
        const {target_version} = theme;
        const theme_target = target_version.SCS || target_version.SCA;
        const extensions = result.extensions
            .filter(({version}) => !theme_target || semver.satisfies(_.unescape(version), _.unescape(theme_target)))
            .sort((a, b) => semver.gtr(a.version, b.version) ? -1 : 1);

        if(!extensions.length) {
            throw new Error(`Base Theme that satisfies ${theme.name} theme target ${theme_target} is required to be installed in your account`);
        }

        const [base_theme] = extensions;
        config.folders.base_theme_path = config.folders.source.extras_path + '/' + base_theme.name;

        base_theme.is_fallback = true;
        base_theme.type = base_theme.type.toLowerCase();
        config.application.application_manifest = _.isEmpty(config.application.application_manifest) ? {extensible_resources: ['templates', 'sass', 'assets', 'skins']} : config.application.application_manifest;

        logInfo(`Downloading ${base_theme.vendor}.${base_theme.name} ${base_theme.version}...`);

        await Promise.all(await DownloadResourcesHelper.getManifestFilePromises(base_theme));
    }

    if (config.folders.base_theme_path) {
        registerManifest(config.folders.base_theme_path);
    }
}

gulp.task('init', async function() {
    const task_name = config.extensionMode ? 'extension' : 'theme';
    const {is_scis} = config.credentials;

    loadApplicationManifest();

    const {source_path, extras_path} = config.folders.source;
    if(!fs.existsSync(source_path) || !fs.readdirSync(source_path).length) {
        // If there's no Workspace, or it's empty then fail
        throw new Error(`${source_path} is empty. You need to execute gulp ${task_name}:fetch first.`);
    }
    !fs.existsSync(extras_path) && fs.mkdirSync(extras_path, {recursive: true});

    //add all the manifests
    if (!is_scis) {
        let {theme_path} = config.folders;
        if (!theme_path) {
            logInfo('There is no theme_path configured');
            theme_path = config.extensionMode ? config.folders.source.extras_path : config.folders.source.source_path;
            theme_path = path.join(theme_path, '*', 'manifest.json');

            const glob = require('glob').sync;
            theme_path = glob(theme_path);
            theme_path = theme_path.length ? path.dirname(theme_path[0]) : null;

            theme_path && logInfo(`Looking for a theme in ${theme_path}`);
            config.folders.theme_path = theme_path;
        }

        if (theme_path && fs.statSync(theme_path).isDirectory()) {
            config.folders.overrides_path = theme_path + '/' + config.folders.overrides;

            logInfo(`Configuring ${theme_path} as theme`);
            registerManifest(theme_path);

            await initFallbackTheme();
        }

        //no skip compilation option, or you are in theme or scis and is required to do a fetch
        if (!config.folders.theme_path && (!_isSkipCompilation() || !config.extensionMode)) {
            throw new Error('You need to run gulp ' + task_name + ':fetch before to get the initial setup files. Aborting.');
        }
    }

    if (!config.extensionMode) {
        registerExtrasExtensions();
        //run overrides task only in the theme tools
        const overrides = require('../extension-mechanism/overrides');
        overrides.updateOverrides();
    } else {
        //update extension paths
        config.folders.extensions_path = registerWorkspaceExtensions().map((path) => path.replace('\\', '/'));
    }

    configurations.saveConfigs();
});

'use strict';

const async = require('ns-async');
const fs = require('fs');
const {log, color, colorText} = require('ns-logs');
const PluginError = require('../CustomError');
const inquirer = require('inquirer');
const configurations = require('../configurations');
const _ = require('underscore');

const ExtMechanismInquirer = require('../credentials-inquirer');
const FileCabinet = require('../../library/file-cabinet');
const ConversionTool = require('../conversion-tool');
const DownloadResourcesHelper = require('./download-resources-helper');
const configs = configurations.getConfigs();

function fetch(done) {
    var waterfall = [
        function passInitialData(first_cb) {
            first_cb(null, done);
        },
        ExtMechanismInquirer.getCredentials,
        searchActivationManifest,
        downloadActivationManifest,
        inquirerExtensions,
        prepareWorkspace,
        downloadActiveExtensions
    ];

    async.waterfall(waterfall, function (err) {
        if (err) {
            var error = (err.error && err.error.message) || err;

            if(error === 'ETIMEDOUT') {
                error = 'Network Error. Please check your Internet Connection.';
            }

            var task_name = configs.extensionMode ? 'extension:fetch' : 'theme:fetch';
            done(new PluginError('gulp ' + task_name, error));
            return;
        }

        done(null);
    });
}

function searchActivationManifest(fetch_data, cb)
{
    var credentials = configs.credentials;
    FileCabinet.setCredentials(credentials);

    var activation_key = _.compact([
        credentials.domain,
        credentials.subsidiary,
        credentials.location
    ]).join('-');

    log(colorText(color.GREEN, 'Looking for Activation Manifest for ' + activation_key + '...'));

    FileCabinet.searchFile(
        {
            name: 'activationManifest-' + activation_key + '.json'
            ,	folder: credentials.ssp_folder
        }
        ,	function searchActivationManifestDone(err, response)
        {
            if(err)
            {
                return cb(err);
            }

            if(response.records.length > 0)
            {
                response = response.records[0];
                fetch_data.activation_manifest = {
                    internalId: response.internalId
                    ,	fileType: response.fileType
                    ,	url: response.url
                    ,	name: response.name
                    ,	textFileEncoding: response.textFileEncoding
                };

                cb(null, fetch_data);
            }
            else
            {
                cb(new Error('Sorry. Could not find a valid activation for this combination: ' +
                    '\n\tDomain: ' + credentials.domain + '.' +
                    (credentials.subsidiary ? '\n\tSubsidiary id: ' + credentials.subsidiary + '.': '') +
                    (credentials.location ? '\n\tLocation id: ' + credentials.location + '.': '') +
                    '\nPlesae go to Setup > SuiteCommerce Advanced > Extension Management and execute an activation first.'));
            }

        }
    );
}

function downloadActivationManifest(fetch_data, cb) {
    log(colorText(color.GREEN, 'Downloading Activation Manifest...'));

    FileCabinet.getFileContents(
        fetch_data.activation_manifest.internalId,
        function(err, response) {
            if(err) {
                return cb(err);
            }
            fetch_data.activation_manifest.content = JSON.parse(response);

            configs.applicationactivation_manifest = fetch_data.activation_manifest.content;
            cb(null, fetch_data);
        });
}

function inquirerExtensions(fetch_data, cb) {
    if(!configs.extensionMode || configs.fetchConfig.extension) {
        return 	cb(null, fetch_data);
    }

    var activation_manifest = _.where(fetch_data.activation_manifest.content, {type: 'extension'}),
        questions = [{
            type: 'checkbox',
            name: 'extensions_to_fetch',
            message: 'Extensions to fetch',
            default: [],
            choices: []
        }];

    questions[0].choices = _.map(activation_manifest, function(extension) {
        return {value: extension.name, name: extension.name + ' - ' + extension.version};
    });

    if(!questions[0].choices.length){
        log(colorText(color.YELLOW, 'There are no extensions to fetch...'));
        return cb(null, fetch_data);
    }

    inquirer.prompt(questions)
        .then(function(answers) {
            answers = answers.extensions_to_fetch;
            if(answers.length) {
                configs.fetchConfig.extension = answers.join(',');
            }
            cb(null, fetch_data);
        });

}

async function prepareWorkspace(fetch_data, cb) {
    function continueCreatingDirs(overwrite_ext) {
        ConversionTool.createWorkspaceFolders(overwrite_ext);
        ExtMechanismInquirer.writeApplicationManifest();
        cb(null, fetch_data);
    }

    if(configs.extensionMode && configs.folders.extensions_path && configs.folders.extensions_path.length > 0 && configs.fetchConfig.extension) {
        const conflict_ext = [];
        const no_conflict_ext = [];
        const overwrite_ext = [];

        configs.fetchConfig.extension
            .split(',')
            .forEach((ext_name) => {
                const ext_path = configs.folders.source.source_path + '/' + ext_name;

                if(fs.existsSync(ext_path) && _.contains(configs.folders.extensions_path, ext_path)) {
                    conflict_ext.push(ext_path);
                    return;
                }
                no_conflict_ext.push(ext_path);
            });

        if(conflict_ext.length) {
            const overwrite_questions = conflict_ext.map((ext_name, i) => {
                const name = ext_name.replace(configs.folders.source.source_path + '/', '');

                return  {
                    type: 'confirm',
                    name: 'confirm_' + i,
                    message: name + ' is already in your workspace. Do you wish to overwrite it?'
                };
            });

            const answers = await inquirer.prompt(overwrite_questions);
            _.each(answers, function(answer, index) {
                if(answer) {
                    index = parseInt(index.replace('confirm_', ''), 10);
                    overwrite_ext.push(conflict_ext[index]);
                }
            });

            configs.fetchConfig.overwrite_ext = _.union(overwrite_ext, no_conflict_ext);
            continueCreatingDirs(overwrite_ext);
            return;
        }
    }

    continueCreatingDirs();
}

async function downloadActiveExtensions(fetch_data, cb) {
    const get_manifests_promises = [];
    const activation_manifest = fetch_data.activation_manifest.content;

    try {
        if(configs.extensionMode && configs.fetchConfig.extension) {
            const fetchExtension = configs.fetchConfig.extension.split(',');
            const ext_actives = _.pluck(activation_manifest, 'name');

            const ext_not_actives = _.filter(fetchExtension, function(manifest_name) {
                return !_.contains(ext_actives, manifest_name);
            });
            const extension_actives = _.difference(fetchExtension, ext_not_actives);

            if(ext_not_actives && ext_not_actives.length) {
                const ext_actives_msg = extension_actives.length ? ' and ' + extension_actives.join(',') : '';

                log(colorText(color.YELLOW, 'The extension/s ' + ext_not_actives.join(',') + ' is not currently active ' +
                        'for the domain ' + fetch_data.credentials.domain + '\n' +
                        '\tYou need to activate it first to start working locally with it.\n' +
                        '\tFetching only active theme' + ext_actives_msg + '...'));
            }
        }

        const download = (manifest) => get_manifests_promises.push(DownloadResourcesHelper.getManifestFilePromises(manifest));

        _.each(activation_manifest, function(manifest) {
            const overwrite_ext = configs.fetchConfig && configs.fetchConfig.overwrite_ext;
            const ext_name = configs.folders.source.source_path + '/' + manifest.name;
            const isTheme = manifest.type === 'theme';

            if(isTheme) {
                ConversionTool.updateConfigPaths(manifest);
            }

            if(!overwrite_ext || _.contains(overwrite_ext, ext_name) || isTheme) {
                download(manifest);
                if(isTheme && manifest.sub_type === 'fallback') {
                    manifest.base_theme_manifest.is_fallback = true;
                    download(manifest.base_theme_manifest);
                }
            }
        });

        const file_promises = await Promise.all(get_manifests_promises);
        await Promise.all(file_promises.flat());
        cb(null, fetch_data);
    } catch(error) {
        let error_msg = (error.error && error.error.message) || error;

        if(_.isString(error_msg) && error_msg.includes('That record does not exist. path:')) {
            error_msg = error_msg.replace('That record does not exist. path:', 'File not found: ');
        }
        cb(new Error('Could not download all the extension files\n\n' + JSON.stringify(error_msg)));
    }
}

module.exports = {
    fetch: fetch
};

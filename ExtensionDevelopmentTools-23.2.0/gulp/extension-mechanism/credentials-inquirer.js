/* jshint esversion: 8 */
/* jshint node: true */
/*
	@module credentials_inquirer

	Deals with all the details of getting the credentials from the user to deploy,
	also all the details to get the activation data: domain, subsidiary location and the app_manifest.json file.
*/

const async = require('ns-async');
const fs = require('fs');
const {log, color, colorText} = require('ns-logs');
const PluginError = require('../extension-mechanism/CustomError');
const  inquirer = require('inquirer');
const path = require('path');
const _ = require('underscore');
const nsArgs = require('ns-args');
const args = nsArgs.argv();

const ui = require('../ns-deploy/ui');
const net = require('../ns-deploy/net');
const WebsiteService = require('./website-service');

var configurations = require('./configurations');
var configs = configurations.getConfigs();

const application_manifest_path = path.join(configs.folders.application_manifest, 'application_manifest.json');
const nsdeploy_path = configs.nsdeployPath;

//the only way to identify if we need to ask for subsidiary and location
const SCIS_NAME = 'SCIS';

function alphabeticSort(a, b)
{
    return a.name.localeCompare(b.name);
}

/*
    @method writeCredentials writes the usual deploy credentials in the file .nsdeploy
    and the application manifest and other configuration data relevant to the extension mechanism
    inside the extension_mechanism folder.
*/
function writeCredentials(fetch_data, cb)
{
    var credentials_to_save = _.extend({}, fetch_data.credentials);

    delete credentials_to_save.token;
    delete credentials_to_save.account;
    delete credentials_to_save.key;
    delete credentials_to_save.secret;

    fs.writeFileSync(nsdeploy_path, JSON.stringify({credentials: credentials_to_save }, null, 4));

    configs.credentials = fetch_data.credentials;

    if(fetch_data.application_manifest)
    {
        configs.application.application_manifest = fetch_data.application_manifest;
    }

    cb(null, fetch_data);
}

function transformCredentials(fetch_data, cb)
{
    if(fetch_data.credentials)
    {
        _.extend(fetch_data.credentials, fetch_data.info);
        configs.credentials = fetch_data.credentials;
    }

    delete fetch_data.info;
    delete fetch_data.options;

    cb(null, fetch_data);
}

async function selectWebsite(fetch_data, cb)
{
    if(!fetch_data.websites)
    {
        cb(new Error('You must have installed in your account the Extension Mechanism Bundle.\nError trying to request available websites and domains.'));
        return;
    }

    let {website} = fetch_data.credentials;
    if(!website) {
        const answers = await inquirer.prompt([{
            type: 'list',
            name: 'website',
            message: 'Choose your website',
            choices: _.map(fetch_data.websites, (ws) => ({
                name: ws.name,
                value: ws.website_id
            })).sort(alphabeticSort)
        }]);

        website = answers.website;
    }

    if(!fetch_data.websites[website]) {
        cb(new Error('Invalid website ' + website));
        return;
    }

    log(colorText(color.YELLOW, 'Website ' + website));

    fetch_data.credentials.website = website;
    cb(null, fetch_data);
}

async function selectDomain(fetch_data, cb)
{
    var domains = fetch_data.websites[fetch_data.credentials.website].domains;

    let {domain} = fetch_data.credentials;
    if(!domain){
        log(colorText(color.YELLOW, 'Select the correct options to identify the corresponding activation...'));

        const answers = await inquirer.prompt([{
            type: 'list',
            name: 'domain',
            message: 'Choose your domain',
            choices: domains.map((domain) => ({
                name: domain.domain,
                value: domain.domain
            })).sort(alphabeticSort)
        }]);

        domain = answers.domain;
    }

    const domain_data = _.find(domains, data => data.domain === domain);
    if(!domain_data) {
        cb(new Error('Invalid domain ' + domain));
        return;
    }

    log(colorText(color.YELLOW, 'Domain ' + domain));

    fetch_data.credentials.domain = domain;
    fetch_data.credentials.webapp_id = domain_data.app_id;
    fetch_data.credentials.ssp_folder = domain_data.folder_id;
    fetch_data.application_manifest = domain_data.manifest;
    fetch_data.credentials.is_scis = fetch_data.application_manifest.type === SCIS_NAME;

    cb(null, fetch_data);
}

async function selectSubsidiary(fetch_data, cb)
{
    if (!fetch_data.credentials.is_scis) {
        cb(null, fetch_data);
        return;
    }

    const subsidiaries = fetch_data.websites[fetch_data.credentials.website].subsidiaries;

    let {subsidiary} = fetch_data.credentials;
    if(!subsidiary) {
        const all_sub_choice = {
            name: 'All the subsidiaries',
            value: null
        };

        const answers = await inquirer.prompt([{
            type: 'list',
            name: 'subsidiary',
            message: 'Choose the subsidiary',
            choices: [all_sub_choice]
                .concat(
                    _.map(subsidiaries, (sub) => ({
                        name: sub.subsidiary_name,
                        value: sub.subsidiary_id
                    }))
                )
        }]);

        subsidiary = answers.subsidiary;
    }

    const subsidiary_data = _.find(subsidiaries, data => data.subsidiary_id === subsidiary);
    if(!subsidiary_data) {
        cb(new Error('Invalid subsidiary ' + subsidiary));
        return;
    }

    log(colorText(color.YELLOW, 'Subsidiary ' + subsidiary));

    fetch_data.credentials.subsidiary = subsidiary;
    fetch_data.credentials.location = null;
    cb(null, fetch_data);
}

async function selectLocation(fetch_data, cb)
{
    if (!fetch_data.credentials.is_scis || !fetch_data.credentials.subsidiary) {
        cb(null, fetch_data);
        return;
    }

    try {
        await WebsiteService.getSubsidiaryLocations(fetch_data);

        let {location} = fetch_data.credentials;
        if(!location){
            const all_locations_choice = {
                name: 'All the locations of the subsidiary',
                value: null
            };

            const answers = await inquirer.prompt([{
                type: 'list',
                name: 'location',
                message: 'Choose the location',
                choices: [all_locations_choice]
                    .concat(
                        _.map(fetch_data.locations, (loc) => ({
                            name: loc.location_name,
                            value: loc.location_id
                        }))
                    )
            }]);

            location = answers.location;
        }

        const location_data = _.find(fetch_data.locations, data => data.location_id === location);
        if(!location_data) {
            cb(new Error('Invalid location ' + location));
            return;
        }

        log(colorText(color.YELLOW, 'Location ' + location));

        fetch_data.credentials.location = location;
        cb(null, fetch_data);
    } catch (error) {
        cb(error);
    }
}

function doUntilGetWebsiteAndDomain(fetch_data, cb)
{
    let credentials_tasks = [
        function(callback) {
            transformCredentials(fetch_data, callback);
        },
        WebsiteService.getWebsites,
        WebsiteService.getWebsiteDomains,
        selectWebsite
    ];

    //do not ask all the activation data if just deploying (without using the reactivation flag)
    if (['extension:deploy', 'theme:deploy'].indexOf(process.argv[2]) < 0 || process.argv.slice(2).includes('--reactivate'))
    {
        credentials_tasks = credentials_tasks.concat(
            [
                selectDomain,
                selectSubsidiary,
                selectLocation
            ]
        );
    }

    async.waterfall(
        credentials_tasks,
        (err) => err ? cb(err) : cb(null, fetch_data)
    );

}

function validateToken(token, account){
    if(!account) {
        return new Error('--account is required when --token is used');
    }

    if(token.split(':').length !== 2) {
        return new Error('Invalid token format. It has to be <key>:<secret>');
    }
}

module.exports =  {
    nsdeploy_path,

    writeApplicationManifest()
    {
        fs.writeFileSync(application_manifest_path, JSON.stringify(configs.application.application_manifest, null, 4));
    },

    /*
        @method getCredentials gets all the credentials of the account, password, ssp application folder
        website, and domain and also the application manifest
    */
    getCredentials(fetch_data, done)
    {
        if(fs.existsSync(application_manifest_path))
        {
            try
            {
                configs.application.application_manifest = JSON.parse(fs.readFileSync(application_manifest_path).toString());
            }
            catch(error)
            {
                configs.application.application_manifest = null;
            }
        }

        var credentials = configs.credentials,
            application_manifest = configs.application.application_manifest;

        if(!credentials || !credentials.user_agent)
        {
            var package_json = JSON.parse(fs.readFileSync('./package.json')),
                extensionMode = configs.extensionMode;

            if(!extensionMode){
                package_json.name = package_json.name.replace('extension', 'theme');
            }

            var user_agent = package_json.name + '/' + package_json.version;

            credentials = credentials || {};
            credentials.user_agent = user_agent;
        }

        function handleResult(err, result)
        {
            if (err)
            {
                var error = (err.error && err.error.message) || err;

                if(error === 'ETIMEDOUT')
                {
                    error = 'Network Error. Please check your Internet Connection.';
                }

                var task_name = configs.extensionMode ? 'extension:fetch' : 'theme:fetch';
                done(new PluginError('gulp ' + task_name + ' getCredentials', error));
                return;
            }

            done(null, result);
        }

        var waterfall = [
            function passInitialData(first_cb)
            {
                const {user_agent, authID, molecule} = credentials || {};
                const {key, secret, account, token} = args;

                if(token){
                    const error = validateToken(token, account);
                    if(error){
                        first_cb(error);
                        return;
                    }
                }

                var initial_data =  {
                    credentials: credentials || {},
                    application_manifest: application_manifest || {},
                    info: {
                        user_agent,
                        authID,
                        key,
                        secret,
                        account,
                        token
                    },
                    options: {molecule}
                };

                if(fetch_data)
                {
                    initial_data = _.extend(initial_data, fetch_data);
                }

                first_cb(null, initial_data);
            },
            ui.selectToken,
            net.authorize,
            doUntilGetWebsiteAndDomain,
            writeCredentials,
        ];

        //result contains the credentials and application_manifest
        async.waterfall(
            waterfall,
            handleResult
        );
    },

    // declare all possible command line arguments
    setupArguments() {
        // Retrieve credentials and application data again ignoring .nsdeploy file and application downloaded files
        nsArgs.option('ask_credentials', {
            alias: 'to'
        });

        // Virtual Machine
        nsArgs.option('credentials.vm', {
            alias: ['vm', 'credentials:vm']
        });

        // Molecule
        nsArgs.option('credentials.molecule', {
            alias: ['m', 'credentials:molecule']
        });

        //	Version
        nsArgs.option('credentials.nsVersion', {
            alias: ['nsVersion', 'credentials:nsVersion']
        });

        //	Role Id
        nsArgs.option('credentials.roleId', {
            alias: ['role', 'credentials:roleId']
        });

        // Website
        nsArgs.option('credentials.website', {
            alias: ['website', 'credentials:website']
        });

        //	Application Id
        nsArgs.option('credentials.applicationId', {
            alias: ['applicationId', 'credentials:applicationId']
        });

        // Domain name (www.name.com)
        nsArgs.option('credentials.domain', {
            alias: ['domain', 'credentials:domain']
        });

        nsArgs.option('credentials.authID', {
            alias: 'authID'
        });

        return nsArgs;
    }
};
/* jshint esversion: 8 */

const gulp = require('gulp');
const { setupArguments } = require('../extension-mechanism/credentials-inquirer');

const nsArgs = setupArguments();

nsArgs.option('async', { alias: 'a' });
nsArgs.option('update', { alias: 'u' });

/**
 * Triggers a re-activation
 * It can receive the following arguments:
 * @task {reactivate}
 * @order {9}
 * @group {Utility tasks}

 * @arg {website} Sets target website.
 * @arg {domain} Sets target domain.
 * @arg {async} Alias -a. Do not wait for activation to finish.
 * @arg {update} Alias -u. Activates the latest available versions of extensions.
 * @arg {token <key>:<secret>} Uses a key:secret from a token from the .nstba file to authenticate. Requires --account
 * @arg {account} Sets target account. Required then --token is used.
 * @arg {m} Sets molecule to be used. i.e. "gulp reactivate --m f" uses system.f.netsuite.com.
 * @arg {to} Asks for credentials, ignoring current ones.
 */

gulp.task('reactivate', function reactivate(cb) {
    const { reactivate } = require('../extension-mechanism/activation/activation');
    reactivate(cb);
});
/* jshint esversion: 8 */

const async = require('ns-async');
const args = require('ns-args').argv();

const { getCredentials } = require('../credentials-inquirer');
const { reActivate }= require('../extension-record-helper');
const PluginError = require('../CustomError');

function reactivate(done) {
    const waterfall = [
        function passInitialData(first_cb) {
            const {async, update} = args;
            first_cb(null, {async, update});
        },
        getCredentials,
        reActivate
    ];

    async.waterfall(waterfall, function (err) {
        if (err) {
            let error = (err.error && err.error.message) || err;

            if(error === 'ETIMEDOUT')
            {
                error = 'Network Error. Please check your Internet Connection.';
            }

            done(new PluginError(`gulp reactivate`, error));
            return;
        }

        done(null);
    });
}

module.exports = {
    reactivate
};
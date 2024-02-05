/* jshint node: true */
/*
@module gulp.istanbul-instrument

Collection of gulp tasks related to front end code instrumentation and coverage reports with istanbuljs

Deploy front end insturmented code that will post information to "coverage-server":

	gulp deploy --instrument-frontend --coverage-server http://localhost:8080

Perform unit test with insturmented code:

	gulp unit-test --modules Utilities --instrument-frontend --coverage-server http://localhost:8080

Run gulp local front end instrumented code that will post information to "coverage-server":

	gulp local --instrument-frontend --coverage-server http://localhost:8080

Local server that collect the coverage information from the front end:

	gulp coverage-server --port 8080 --coverage-folder ./todaysCoverageData

Tool for building reports from local coverage files:

	gulp coverage-report --input ./todaysCoverageData --output ./todaysCoverageReport

*/

// TODO: we are only instrumenting those loaded .js files and not all of them. So the coverage will be higher than the real one because there could be some files that are not required() and so the report wont consider them. We need to automatically add ALL .js files to the reporter so all of them are considered.

const path = require('path');
const args = require('ns-args').argv();
const _ = require('underscore');

// coverage report :

const instrumenter = require('istanbul-lib-instrument').createInstrumenter({});

const jsFileExcludes = ['third_parties'];

function instrumentCode(config) {
    if (jsFileExcludes.find(exclude => config.fileName.indexOf(exclude) != -1)) {
        return config.content;
    }

    const coverageServer = config.coverageServer || 'http://localhost:8080';
    let code = config.content;

    // Heads up ! ugly hack so application post the coverage data before exiting exiting - which could be triggered by
    // navigating to other app or closing the window. We add the prefix to a file we know all applications load !

    const addPrefix = config.fileName.indexOf('ApplicationSkeleton.Layout.js') != -1;
    code = addPrefix ? getJsPrefix(coverageServer) + code : code;

    const fileInfo = package_manager.getModuleForPath(config.fileName, false);
    let path_out = config.fileName;

    if (fileInfo) {
        path_out = path.join(
            fileInfo.baseDir,
            fileInfo.moduleName,
            _.last(config.fileName.split(path.sep))
        );
    }

    return instrumenter.instrumentSync(code, path_out);
}

function getJsPrefix(coverageServer) {
    return `
		window.addEventListener("beforeunload", function(e)
		{
			SC.dontSetRequestHeaderTouchpoint = true;
			jQuery.post('${coverageServer}/__coverage__', JSON.stringify(window.__coverage__));
		}, false);
	`;
}

const through = require('through');
const package_manager = require('../package-manager');

function instrumentVinylFile(config) {
    config.coverageServer = config.coverageServer || 'http://localhost:8080';
    const onFile = function(file) {
        // heads up - gulp unit test depends on javascript but we dont want that task to intrument the code in this particular case.
        const instrument = file.contents && args._.indexOf('unit-test') == -1;
        if (!instrument) {
            this.emit('data', file);
        } else {
            const instrumentConfig = {
                content: file.contents.toString(),
                coverageServer: config.coverageServer,
                fileName: file.path
            };
            const instrumentedCode = instrumentCode(instrumentConfig);
            file.contents = Buffer.from(instrumentedCode);
            this.emit('data', file);
        }
    };

    const onEnd = function() {
        this.emit('end');
    };

    return through(onFile, onEnd);
}

module.exports = {
    instrumentVinylFile,
    instrumentCode,
    getJsPrefix
};

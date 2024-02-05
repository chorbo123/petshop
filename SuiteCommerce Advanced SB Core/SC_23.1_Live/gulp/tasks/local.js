/* jshint node: true */
/*
@module gulp.local

This gulp task will start a local development environment server. The idea is to have a agile development environment
where the user just modify the project JavaScript, Sass, Less and templates and they are automatically compiled and
even the browser is reloaded to show the changes.

##JavaScript

For compiling JavaScript internally it uses the task 'gulp javascript' so it support two main modalities

#Usage: compiilng JavaScript like in production

	gulp local

#Usage: loading JavaScript with require js

This is more agile for working because JavaScript don't need to be compiled:

	gulp local --js require

##Implementation

Files are watched using nodejs watch and when changes are detected specific gulp task are called to compiling files,
like gulp javascript, gulp sass, gulp templates etc.

*/

const gulp = require('gulp');
const { log, color, colorText } = require('ns-logs');

function initServer(cb) {
    const args = require('ns-args').argv();
    const package_manager = require('../package-manager');
    const http_config = package_manager.getTaskConfig('local.http', false);
    const https_config = package_manager.getTaskConfig('local.https', false);

    if (!http_config && !https_config) {
        log(`No server configuration specified in the files`);
        cb();
    }

    initServerExpress(http_config, https_config, cb);
}

function installExpressMiddleware(app) {
    const args = require('ns-args').argv();
    const package_manager = require('../package-manager');

    // Allow CORS requests in server
    app.use(function (req, res, next) {
        const { origin, referer } = req.headers;

        res.setHeader('Access-Control-Allow-Origin', origin || referer || '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Allow-Private-Network', true);
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });

    const path = require('path');
    const src_dir = path.join(package_manager.env.srcDir, 'Modules');
    let thirdparties_path = path.join(
        package_manager.env.srcDir,
        package_manager.distro.folders.thirdPartyModules
    );

    thirdparties_path = path.normalize(thirdparties_path).replace(/\\/g, '/');

    app.use('/', process.gulp_dest);
    app.use('/Modules', src_dir);
    app.use('/third_parties', thirdparties_path);

    // Service used by the index-local.ssp files to know what files load
    app.use('/who/:app', whoService);
    // Serves the script patch to run almond and requirejs together
    app.use('/require_patch.js', requirePatchService);
}

function requirePatchService(req, res) {
    const response = function require_patch() {
        Object.defineProperty(window, 'define', {
            set: function (val) {
                if (!window.__my_define) {
                    window.__my_define = val;
                }
            },
            get: function () {
                return window.__my_define;
            }
        });

        Object.defineProperty(window, 'require', {
            set: function (val) {
                if (!window.__my_require) {
                    window.__my_require = val;
                }
            },
            get: function () {
                return window.__my_require;
            }
        });

        Object.defineProperty(window, 'requirejs', {
            set: function (val) {
                if (!window.__my_require) {
                    window.__my_require = val;
                }
            },
            get: function () {
                return window.__my_require;
            }
        });
    };

    res.setHeader('Content-Type', 'application/javascript');
    res.send(`${response}; require_patch();`);
}

function whoService(req, res) {
    const protocol = req.connection.encrypted ? 'https' : 'http';
    const { host } = req.headers;
    const { app } = req.params;

    // A null url make the local ssp file grab the resource from backend (production)

    const css = {
        tag: 'link',
        resource: 'css',
        url: `${protocol}://${host}/css/${app}.css`
    };
    const require_patch = {
        tag: 'script',
        resource: 'require_patch',
        url: `${protocol}://${host}/require_patch.js`
    };
    const requirejs = {
        tag: 'script',
        resource: 'module-loader',
        url: `${protocol}://${host}/javascript/module-loader.js`
    };
    const templates = {
        tag: 'script',
        resource: 'templates',
        url: null
    };
    const js_core = {
        tag: 'script',
        resource: 'js_core',
        url: `${protocol}://${host}/javascript/${app}.js`
    };
    const js_extensions = {
        tag: 'script',
        resource: 'js_extensions',
        url: null
    };

    let response;
    if (process.is_SCA_devTools) {
        // Released core devtools doesn't provide tpl nor sass, so we grab them from backend
        css.url = null;

        response = [css, require_patch, requirejs, templates, js_core, js_extensions];
    } else {
        response = [css, requirejs, js_core, js_extensions];
    }

    res.setHeader('Content-Type', 'application/json');
    res.json(response);
}

function initServerExpress(http_config, https_config, cb) {
    const nsServer = require('ns-server');
    const fs = require('fs');
    const server = nsServer.createServer();

    installExpressMiddleware(server);

    const batch_logger = require('../library/batch-logger');
    const logger = batch_logger();

    // Starts the http server
    if (http_config) {
        server.listen(http_config.port, '0.0.0.0', cb);
        logger.push(
            '+- Local http server available at: ',
            colorText(color.CYAN, `http://localhost:${http_config.port}/`)
        );
    }

    // Starts the https server
    if (https_config) {
        const https = require('https');
        let keyfile;
        let certfile;

        try {
            keyfile = process.env[https_config.key] || https_config.key;
            certfile = process.env[https_config.cert] || https_config.cert;

            const https_options = {
                secure: true,
                key: fs.readFileSync(keyfile, 'utf8'),
                cert: fs.readFileSync(certfile, 'utf8')
            };

            const serverSecure = nsServer.createServer(https_options);

            installExpressMiddleware(serverSecure);

            serverSecure.listen(https_config.port, '0.0.0.0');
            logger.push(
                `+- Local https server available at: `,
                colorText(color.CYAN, `https://localhost:${https_config.port}`)
            );
        } catch (ex) {
            logger.push(
                colorText(
                    color.RED,
                    `+- Could not start secure local server. Reason: ${ex.toString()}`
                )
            );
        }
    }

    logger.push(`+- Watching current folder: ${colorText(color.CYAN, process.cwd())}`);
    logger.push(`+- To cancel Gulp Watch enter: ${colorText(color.CYAN, `control + c`)}`);
    logger.flush();
}

gulp.task('local-install', function (cb) {
    const package_manager = require('../package-manager');
    // just define a flag so other tasks know if they must exit on error or not. i.e. when 'gulp local' we don't want to kill the local server on sass, handlebars, javascript errors.
    package_manager.isGulpLocal = true;
    cb();
});

gulp.task('init-server', initServer);

gulp.task(
    'local',
    gulp.series(
        'local-install',
        gulp.series('frontend', 'javascript-local'),
        gulp.parallel('watch', 'init-server')
    )
);

module.exports = {
    initServerExpress,
    initServer,
    installExpressMiddleware
};

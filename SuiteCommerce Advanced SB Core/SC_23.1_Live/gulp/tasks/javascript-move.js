/* jshint node: true */
/* jshint esversion: 6 */

const gulp = require('gulp');
const nsIf = require('ns-if');
const path = require('path');
const package_manager = require('../package-manager');

const dest = path.join(process.gulp_dest, 'javascript');
const destSS2 = path.join(process.gulp_dest_ss2, 'javascript');

gulp.task('javascript-move', function(cb) {
    const glob = package_manager.getGlobsFor('javascript-move');
    if (!glob || !glob.length) {
        return cb();
    }

    return gulp
        .src(glob, { allowEmpty: true })
        .pipe(gulp.dest(dest, { mode: 0o700 }))
        .pipe(nsIf(process.generateV2, gulp.dest(destSS2, { mode: 0o700 })));
});

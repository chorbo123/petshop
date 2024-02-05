const gulp = require('gulp');
const nsIf = require('ns-if');
const path = require('path');
const package_manager = require('../package-manager');

gulp.task('requireJSCopy', function() {
    const dest = path.join(process.gulp_dest, 'javascript');
    const destSS2 = path.join(process.gulp_dest_ss2, 'javascript');
    return gulp
        .src(package_manager.getGlobsForModule('module-loader', 'javascript'), {
            allowEmpty: true
        })
        .pipe(gulp.dest(dest, { mode: 0o700 }))
        .pipe(nsIf(process.generateV2, gulp.dest(destSS2, { mode: 0o700 })));
});

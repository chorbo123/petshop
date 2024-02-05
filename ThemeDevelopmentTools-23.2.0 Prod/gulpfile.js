'use strict';

const fs = require('fs');
const path = require('path');
const HelpDisplay = require('./gulp/extension-mechanism/HelpDisplay');
const gulp = require('gulp');
const nsArgs = require('ns-args');

nsArgs.addHiddenParam('product', 'gulp');

process.gulp_init_cwd = process.env.INIT_CWD || process.cwd();
process.gulp_dest = process.gulp_init_cwd;

// evaluate all gulp tasks files
var baseTaskDir = path.resolve(__dirname, './gulp/tasks');
fs.readdirSync(baseTaskDir).forEach(function(task_name)
{
	if (/\.js/.test(task_name))
	{
		require(path.join(baseTaskDir, task_name.replace('.js', '')));
	}
});

/**
 * This simply defines help task which would produce usage
 * display for this gulpfile.
 */
gulp.task('help', async function()
{
	return new HelpDisplay();
});
gulp.task('default', gulp.parallel('help'));

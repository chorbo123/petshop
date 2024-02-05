'use strict';

const gulp = require('gulp');
const configurations = require('../extension-mechanism/configurations');

require('./init');

//compute all the differences from all the  manifests in the workspace folder
//for each manifest, get all the promises to change each file
//after all the files have updated the manifest, impact the changes (write the manifest)
//after all the manifests have finished, the task is completed

gulp.task('update-manifest', (cb) =>
{
	var helper = require('../extension-mechanism/update-manifest/update-manifest-task');
	return helper.startUpdateManifest(cb);
});


if(configurations.getConfigs().extensionMode)
{
	/**
	  * Updates the manifest removing and adding entries to match your files and folders.
	  * @task {extension:update-manifest}
	  * @group {Utility tasks}
	  * @order {5}
	  */
	gulp.task('extension:update-manifest', gulp.series('init', gulp.parallel('update-manifest')));
}
else
{
	/**
	  *Updates the manifest removing and adding entries to match your files and folders.
	  * @task {theme:update-manifest}
	  * @group {Utility tasks}
	  * @order {5}
	  */
	gulp.task('theme:update-manifest', gulp.series('init', gulp.parallel('update-manifest')));
}


const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const args = require('ns-args').argv();
const package_manager = require('../package-manager');

function rename(folder)
{
	const version = path.basename(folder);
	const parent = path.dirname(folder);
	return parent + '_' + version;
}

// Avoid using fs-extra
function copyFileSync( source, target ) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = target;
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}

function deleteFolderRecursive(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

gulp.task('extract3pls', done=>{

	const distroDir = path.dirname(package_manager.env.distro);
	let outputDir = args.output;

	if(!outputDir)
	{
		throw new Error('Please specify an output directory with --output parameter');
	}
	outputDir = path.join(process.gulp_init_cwd || process.cwd(), outputDir);

	if(!outputDir.startsWith(process.gulp_init_cwd || process.cwd()))
	{
		throw new Error('For security reasons, the output dir needs to be inside the current working directory');
	}

	const thirdparties = 	package_manager.distro.modules.filter(e=>{ 
								return e.startsWith(package_manager.distro.folders.thirdPartyModules);
							}).map(e=>{
								return path.join(distroDir,e);
							});

	if(fs.existsSync(outputDir))
	{
		console.log('Deleting ',outputDir);
		deleteFolderRecursive(outputDir);
	}
	fs.mkdirSync(outputDir, {recursive:true});


	console.log(thirdparties); 
	console.log(outputDir);
	thirdparties.forEach(lib => {
		const newName = path.join(outputDir,path.basename(rename(lib)));
		console.log('Copying',lib,newName);
		copyFolderRecursiveSync(lib,newName);
	});
	done();
});
const fs = require('fs');
const path = require('path');
const through = require('through2');

module.exports = (destination, options = {}) => {
    const cwd = process.cwd();

    return through.obj(function(sourceFile, encoding, callback) {
        let destPath = path.resolve(cwd, destination, sourceFile.relative);

        if (options.extension) {
            const fileName = `${path.basename(destPath, path.extname(destPath))}${
                options.extension
            }`;
            destPath = path.join(path.dirname(destPath), fileName);
        }

        let fileHasChanged = true;

        try {
            if (fs.existsSync(destPath)) {
                if (sourceFile.stat && sourceFile.stat.mtimeMs <= fs.statSync(destPath).mtimeMs) {
                    fileHasChanged = false;
                }
            }
        } catch (error) {
            this.emit('error', error);
        }

        if (fileHasChanged) {
            this.push(sourceFile);
        }

        callback();
    });
};

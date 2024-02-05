const through2 = require('through2');

const nsIf = (condition, conditionAction) => {
    if (typeof condition === 'function') {
        const readableStream = through2.obj();
        let originalStream;
        readableStream.pipe(conditionAction);
        readableStream.on('data', chunk => {
            originalStream.push(chunk);
        });
        readableStream.on('error', err => {
            originalStream.emit('error', err);
        });
        return through2.obj(
            function(file, type, cb) {
                try {
                    originalStream = this;
                    if (condition(file)) {
                        readableStream.push(file);
                    } else {
                        this.push(file);
                    }
                    cb();
                } catch (error) {
                    this.emit('error', error);
                }
            },
            function(cb) {
                readableStream.on('end', cb);
                readableStream.emit('end');
            }
        );
    }
    return condition ? conditionAction : through2.obj();
};

module.exports = nsIf;

const { mockFs, mockPath } = require('node-mocks');
const fs = require('fs');
const path = require('path');
const changed = require('ns-changed');

const mockStream = { emit: jest.fn(), push: jest.fn() };
const mockFile = { relative: '', stat: { mtimeMs: 0 } };
jest.mock('fs', () => mockFs.mock());
jest.mock('path', () => mockPath.mock());
jest.mock('through2', () => ({
    obj: jest.fn(fn => {
        fn.call(mockStream, mockFile, null, jest.fn());
        return mockStream;
    })
}));

describe('ns-changed', () => {
    const destPath = './destTestPath';

    beforeEach(() => {
        mockStream.push.mockReset();
        mockStream.emit.mockReset();
    });

    it('should keep the file on stream if dest path file does not exists', () => {
        fs.existsSync.mockReturnValueOnce(false);

        changed(destPath);

        expect(mockStream.push).toHaveBeenCalled();
        expect(mockStream.emit).not.toHaveBeenCalled();
    });

    it('should not keep the file on stream if dest path file exists and source file is older than dest file', () => {
        fs.existsSync.mockReturnValueOnce(true);
        mockFile.stat.mtimeMs = 100;
        fs.statSync.mockReturnValueOnce({ mtimeMs: 200 });

        changed(destPath);

        expect(mockStream.push).not.toHaveBeenCalled();
        expect(mockStream.emit).not.toHaveBeenCalled();
    });

    it('should compare files with a specific extension if options.extension is defined', () => {
        const testDirName = 'testDir';
        const testFileName = 'testFile';
        const newExtension = '.js';
        path.resolve.mockReturnValueOnce(`${testDirName}/${testFileName}.d.ts`);
        path.basename.mockReturnValueOnce(testFileName);
        path.dirname.mockReturnValueOnce(testDirName);

        changed(destPath, { extension: newExtension });

        expect(path.join).toHaveBeenCalledWith(testDirName, `${testFileName}${newExtension}`);
        expect(mockStream.emit).not.toHaveBeenCalled();
    });

    it('should thrown an error if there are any while reading the files', () => {
        fs.existsSync.mockImplementationOnce(() => new Error());

        changed(destPath);

        expect(mockStream.emit).toHaveBeenCalledWith('error', expect.any(Error));
    });
});

const through2 = require('through2');
const nsIf = require('../nsif');

const trueConditionFunction = function() {
    return true;
};

describe('ns-if', () => {
    it('It should throw an error because the function condition action is throwing one', cb => {
        const conditionAction = through2.obj(function(file, cbThrough) {
            throw Error('Error Test');
        });

        const thrg2 = through2.obj();
        thrg2.push('test');
        thrg2.pipe(nsIf(trueConditionFunction, conditionAction)).on('error', function(err) {
            expect(err.message).toMatch('Error Test');
            cb();
        });
    });
    it('It should call the console log function passed as second parameter because the condition is true', () => {
        const logConsole = jest.spyOn(console, 'log').mockImplementation(() => {});
        const through2Mock = jest.spyOn(through2, 'obj').mockImplementation(() => {});
        nsIf(true, console.log('test'));
        expect(logConsole).toBeCalledWith(expect.stringContaining('test'));
        expect(through2Mock).not.toHaveBeenCalled();
    });
    it('It should call the through.obj function instead of the condition passed as second parameter because the condition is false', () => {
        const through2Mock = jest.spyOn(through2, 'obj').mockImplementation(() => {});
        const conditionAction = jest.fn();
        nsIf(false, conditionAction);
        expect(through2Mock).toHaveBeenCalled();
        expect(conditionAction).not.toHaveBeenCalled();
    });
    it('It should use the through2 and the readableStream because the function passed as condition is a function that returns true', () => {
        const data = [];
        jest.spyOn(console, 'log').mockImplementation(() => {});
        const through2Mock = jest.spyOn(through2, 'obj').mockImplementation((param1, param2) => {
            if (typeof param1 === 'function' && typeof param2 === 'function') {
                const cbFunction = jest.fn();
                param1('file1', '', cbFunction);
                param2(cbFunction);
            }
            return {
                pipe: jest.fn().mockImplementationOnce(() => {}),
                on: jest.fn().mockImplementationOnce(() => {}),
                emit: jest.fn().mockImplementationOnce(() => {}),
                push: jest.fn().mockImplementationOnce(param => {
                    data.push(param);
                })
            };
        });
        nsIf(trueConditionFunction, console.log('test'));
        expect(through2Mock).toHaveBeenCalled();
        expect(data[0]).toMatch('file1');
    });
});

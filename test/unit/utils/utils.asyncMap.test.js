const utils = require('../../../utils');
const assert = require('assert');

function checkListContainsElements(list, elements) {
    for (let i = 0; i < elements.length; i++) {
        if (list.indexOf(elements[i]) === -1) {
            return false;
        }
    }
    return true;
}

describe('asyncMap', function () {
    it('should call the callback function if the list is empty', function (done) {
        utils.asyncMap([], () => { }, done);
    });

    it('should map the array correctly without any options', function (done) {
        const list = [1, 2, 3], results = [];
        const expected = [2, 4, 6];
        utils.asyncMap(list, (item, cb) => {
            results.push(item * 2);
            cb();
        }, (err) => {
            assert.strictEqual(checkListContainsElements(results, expected), true);
            done();
        });
    });

    it('should map the array in order if the "keep_order" option is true', function (done) {
        const list = [1, 2, 3], results = [];
        const expected = [2, 4, 6];
        utils.asyncMap(list, (item, cb) => {
            results.push(item * 2);
            cb();
        }, (err) => {
            assert.deepStrictEqual(results, expected);
            done();
        }, { keep_order: true });
    });

    it('should map the array with a maximum concurrency if the "max_concurrency" option is set', function (done) {
        const list = [1, 2, 3], results = [];
        const expected = [2, 4, 6];
        utils.asyncMap(list, (item, cb) => {
            results.push(item * 2);
            cb();
        }, (err) => {
            assert.strictEqual(checkListContainsElements(results, expected), true);
            done();
        }, { max_concurrency: 2 });
    });

    it('should handle errors if the "throw_error" option is set', function (done) {
        const list = [1, 2, 3], results = [];
        const expected = [2, 6];
        utils.asyncMap(list, (item, cb) => {
            if (item === 2) {
                setTimeout(() => {
                    cb(new Error('Error on item 2'));
                }, 50);
            } else {
                results.push(item * 2);
                cb();
            }
        }, (err, result) => {
            assert.strictEqual(checkListContainsElements(results, expected), true);
            assert(err instanceof Error);
            assert.strictEqual(err.message, 'Error on item 2');
            done();
        }, { throw_error: true });
    });

    it('should handle errors if the "throw_error" option is set and callback should only be called once', function (done) {
        const list = [1, 2, 3, 4, 5, 6], results = [];
        const expected = [6, 8, 10, 12];
        utils.asyncMap(list, (item, cb) => {
            if (item === 1) {
                setTimeout(() => {
                    results.push(item * 2);
                    cb();
                }, 100);
            }else if (item === 2) {
                setTimeout(() => {
                    cb(new Error('Error on item 2'));
                }, 50);
            } else {
                results.push(item * 2);
                cb();
            }
        }, (err, result) => {
            assert.strictEqual(checkListContainsElements(results, expected), true);
            assert(err instanceof Error);
            assert.strictEqual(err.message, 'Error on item 2');
            done();
        }, { throw_error: true });
    });

    it('should handle errors if the "throw_error" and "keep_order" options are set', function (done) {
        const list = [1, 2, 3], results = [];
        const expected = [2];
        utils.asyncMap(list, (item, cb) => {
            if (item === 2) {
                setTimeout(() => {
                    cb(new Error('Error on item 2'));
                }, 50);
            } else {
                results.push(item * 2);
                cb();
            }
        }, (err, result) => {
            assert.strictEqual(checkListContainsElements(results, expected), true);
            assert(err instanceof Error);
            assert.strictEqual(err.message, 'Error on item 2');
            done();
        }, { throw_error: true, keep_order: true });
    });

    it('should handle errors if the "throw_error" and "max_concurrency" options are set', function (done) {
        const list = [1, 2, 3], results = [];
        const expected = [2, 6];
        utils.asyncMap(list, (item, cb) => {
            if (item === 2) {
                setTimeout(() => {
                    cb(new Error('Error on item 2'));
                }, 50);
            } else {
                results.push(item * 2);
                cb();
            }
        }, (err, result) => {
            assert.strictEqual(checkListContainsElements(results, expected), true);
            assert(err instanceof Error);
            assert.strictEqual(err.message, 'Error on item 2');
            done();
        }, { throw_error: true, max_concurrency: 2 });
    });

    it('should handle errors if the "throw_error" and "max_concurrency" options are set and callback should only be called once', function (done) {
        const list = [1, 2, 3, 4, 5, 6], results = [];
        const expected = [];
        utils.asyncMap(list, (item, cb) => {
            if (item === 2) {
                setTimeout(() => {
                    cb(new Error('Error on item 2'));
                }, 50);
            } else {
                setTimeout(() => {
                    results.push(item * 2);
                    cb();
                }, 100);
            }
        }, (err, result) => {
            assert.strictEqual(checkListContainsElements(results, expected), true);
            assert(err instanceof Error);
            assert.strictEqual(err.message, 'Error on item 2');
            done();
        }, { throw_error: true, max_concurrency: 3});
    });

});
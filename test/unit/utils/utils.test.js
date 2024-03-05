const utils = require('../../../utils');
const _ = require('lodash');
const assert = require('assert');

describe('utils', () => {

    describe('getRandomHexString', () => {
        it('should return a string', () => {
            const length = 10;
            const randomHexString = utils.getRandomHexString(length);
            assert(typeof randomHexString === 'string');
        });

        it('should return a string of the specified length', () => {
            const length = 10;
            const randomHexString = utils.getRandomHexString(length);
            assert(randomHexString.length === length);
        });

        it('should only contain hexadecimal characters', () => {
            const length = 10;
            const randomHexString = utils.getRandomHexString(length);
            const hexRegex = /^[0-9a-fA-F]+$/;
            assert(hexRegex.test(randomHexString));
        });

        it('should return an empty string when length is 0', () => {
            const length = 0;
            const randomHexString = utils.getRandomHexString(length);
            assert(randomHexString === '');
        });

        it('should return a string of length 1 when length is 1', () => {
            const length = 1;
            const randomHexString = utils.getRandomHexString(length);
            assert(randomHexString.length === 1);
        });

        it('should return a string of length 2 when length is 2', () => {
            const length = 2;
            const randomHexString = utils.getRandomHexString(length);
            assert(randomHexString.length === 2);
        });

        it('generate several hex string of random length', () => {
            for (let i = 0; i < 100; i++) {
                const length = _.random(100);
                const randomHexString = utils.getRandomHexString(length);
                assert(randomHexString.length === length);
            }
        });

        it('should throw an error when n is not a number', () => {
            const length = 'not a number';
            assert.throws(() => {
                utils.getRandomHexString(length);
            }, Error);
        });
    });

    describe('isHexString', function () {
        it('should return true for a valid hex string', function () {
            const result = utils.isHexString('0123456789abcdefABCDEF');
            assert.strictEqual(result, true);
        });

        it('should return false for a non-hex string', function () {
            const result = utils.isHexString('hello world');
            assert.strictEqual(result, false);
        });

        it('should return false for a hex string with invalid characters', function () {
            const result = utils.isHexString('0123456789abcdefABCDEF!');
            assert.strictEqual(result, false);
        });

        it('should return false for an empty string', function () {
            const result = utils.isHexString('');
            assert.strictEqual(result, false);
        });
    });

    describe('isIntegerString', function () {
        it('should return true for a positive integer string', function () {
            const result = utils.isIntegerString('123');
            assert.strictEqual(result, true);
        });

        it('should return true for a negative integer string', function () {
            const result = utils.isIntegerString('-123');
            assert.strictEqual(result, true);
        });

        it('should return false for a non-integer string', function () {
            const result = utils.isIntegerString('hello world');
            assert.strictEqual(result, false);
        });

        it('should return false for a decimal string', function () {
            const result = utils.isIntegerString('123.45');
            assert.strictEqual(result, false);
        });

        it('should return false for an empty string', function () {
            const result = utils.isIntegerString('');
            assert.strictEqual(result, false);
        });

    });

    describe('isTime', function () {
        it('should return true for a valid time string', function () {
            const result = utils.isTime('12:34');
            assert.strictEqual(result, true);
        });

        it('should return false for a time string with invalid hour', function () {
            const result = utils.isTime('24:00');
            assert.strictEqual(result, false);
        });

        it('should return false for a time string with invalid minute', function () {
            const result = utils.isTime('12:60');
            assert.strictEqual(result, false);
        });

        it('should return false for a time string with invalid format', function () {
            const result = utils.isTime('1234');
            assert.strictEqual(result, false);
        });

        it('should return false for a time string with invalid characters', function () {
            let result = utils.isTime('1a:34');
            assert.strictEqual(result, false);
            result = utils.isTime('11:3b');
            assert.strictEqual(result, false);
        });

        it('should return false for an empty string', function () {
            const result = utils.isTime('');
            assert.strictEqual(result, false);
        });
    });

    describe('isDate', function () {
        it('should return true for a valid date string', function () {
            const result = utils.isDate('31/12/2021');
            assert.strictEqual(result, true);
        });

        it('should return false for a date string with invalid day', function () {
            const result = utils.isDate('32/12/2021');
            assert.strictEqual(result, false);
        });

        it('should return false for a date string with invalid month', function () {
            const result = utils.isDate('31/13/2021');
            assert.strictEqual(result, false);
        });

        it('should return false for a date string with invalid year', function () {
            const result = utils.isDate('31/12/21');
            assert.strictEqual(result, false);
        });

        it('should return false for a date string with invalid format', function () {
            const result = utils.isDate('31-12-2021');
            assert.strictEqual(result, false);
        });

        it('should return false for a date string with invalid characters', function () {
            let result = utils.isDate('3a/12/2021');
            assert.strictEqual(result, false);
            result = utils.isDate('31/1b/2021');
            assert.strictEqual(result, false);
            result = utils.isDate('31/12/2c21');
            assert.strictEqual(result, false);
        });

        it('should return false for an empty string', function () {
            const result = utils.isDate('');
            assert.strictEqual(result, false);
        });
    });

    describe('isIsoDate', function () {
        it('should return true for a valid ISO date string', function () {
            const result = utils.isIsoDate('2021-12-31T23:59:59Z');
            assert.strictEqual(result, true);
        });

        it('should return false for an invalid ISO date string', function () {
            const result = utils.isIsoDate('2021-13-31T23:59:59Z');
            assert.strictEqual(result, false);
        });

        it('should return false for a non-ISO date string', function () {
            const result = utils.isIsoDate('31/12/2021');
            assert.strictEqual(result, false);
        });

        it('should return false for an empty string', function () {
            const result = utils.isIsoDate('');
            assert.strictEqual(result, false);
        });
    });

    describe('isEmail', function () {
        it('should return true for a valid email address', function () {
            const result = utils.isEmail('test@example.com');
            assert.strictEqual(result, true);
        });

        it('should return false for an email address without @', function () {
            const result = utils.isEmail('testexample.com');
            assert.strictEqual(result, false);
        });

        it('should return false for an email address without domain', function () {
            const result = utils.isEmail('test@');
            assert.strictEqual(result, false);
        });

        it('should return false for an email address without username', function () {
            const result = utils.isEmail('@example.com');
            assert.strictEqual(result, false);
        });

        it('should return false for an email address without . in domain', function () {
            const result = utils.isEmail('test@examplecom');
            assert.strictEqual(result, false);
        });

        it('should return false for an empty string', function () {
            const result = utils.isEmail('');
            assert.strictEqual(result, false);
        });
    });

    describe('isPhoneNumber', function () {
        it('should return true for a valid phone number', function () {
            const result = utils.isPhoneNumber('1234567890');
            assert.strictEqual(result, true);
        });

        it('should return true for a valid phone number with plus sign', function () {
            const result = utils.isPhoneNumber('+1234567890');
            assert.strictEqual(result, true);
        });

        it('should return false for a phone number with non-numeric characters', function () {
            const result = utils.isPhoneNumber('123-456-7890');
            assert.strictEqual(result, false);
        });

        it('should return false for a phone number with plus sign in the middle', function () {
            const result = utils.isPhoneNumber('12+34567890');
            assert.strictEqual(result, false);
        });

        it('should return false for an empty string', function () {
            const result = utils.isPhoneNumber('');
            assert.strictEqual(result, false);
        });
    });

    describe('clearObjectUndefinedValues', function () {
        it('should remove all undefined attributes from a simple object', function () {
            const object = { a: 1, b: undefined, c: 3 };
            const result = utils.clearObjectUndefinedValues(object);
            assert.deepStrictEqual(result, { a: 1, c: 3 });
        });

        it('should remove all undefined attributes from a nested object', function () {
            const object = { a: 1, b: { c: undefined, d: 4 }, e: undefined };
            const result = utils.clearObjectUndefinedValues(object);
            assert.deepStrictEqual(result, { a: 1, b: { d: 4 } });
        });

        it('should return the same object if it has no undefined attributes', function () {
            const object = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
            const result = utils.clearObjectUndefinedValues(object);
            assert.deepStrictEqual(result, object);
        });
    });

    describe('isSubTargetProperty', function () {
        it('should return true for a property with a sub-target', function () {
            const result = utils.isSubTargetProperty('target.property');
            assert.strictEqual(result, true);
        });

        it('should return false for a property without a sub-target', function () {
            const result = utils.isSubTargetProperty('target');
            assert.strictEqual(result, false);
        });

        it('should return false for an empty string', function () {
            const result = utils.isSubTargetProperty('');
            assert.strictEqual(result, false);
        });
    });

    describe('objectMatchAttributes', function () {
        it('should return true if the object has all matching attributes', function () {
            const object = { a: 1, b: 2, c: 3 };
            const attributes = { a: 1, b: 2 };
            const result = utils.objectMatchAttributes(object, attributes);
            assert.strictEqual(result, true);
        });

        it('should return false if the object does not have all matching attributes', function () {
            const object = { a: 1, b: 2, c: 3 };
            const attributes = { a: 1, b: 3 };
            const result = utils.objectMatchAttributes(object, attributes);
            assert.strictEqual(result, false);
        });

        it('should return true if the object has all matching attributes after applying get', function () {
            const object = { a: { b: 2 }, c: 3 };
            const attributes = { 'a.b': 2 };
            const result = utils.objectMatchAttributes(object, attributes);
            assert.strictEqual(result, true);
        });

        it('should return false if apply get is set to false', function () {
            const object = { a: { b: 2 }, c: 3 };
            const attributes = { 'a.b': 2 };
            const result = utils.objectMatchAttributes(object, attributes, false);
            assert.strictEqual(result, false);
        });

        it('should return false if the object does not have all matching attributes after applying get', function () {
            const object = { a: { b: 2 }, c: 3 };
            const attributes = { 'a.b': 3 };
            const result = utils.objectMatchAttributes(object, attributes);
            assert.strictEqual(result, false);
        });

        it('should return true if the attributes object is empty', function () {
            const object = { a: 1, b: 2, c: 3 };
            const attributes = {};
            const result = utils.objectMatchAttributes(object, attributes);
            assert.strictEqual(result, true);
        });
    });

    describe('objectMatchAtLeastOneAttribute', function () {
        it('should return true if the object has at least one matching attribute', function () {
            const object = { a: 1, b: 2, c: 3 };
            const attributes = { a: 1, b: 3 };
            const result = utils.objectMatchAtLeastOneAttribute(object, attributes);
            assert.strictEqual(result, true);
        });

        it('should return false if the object has no matching attributes', function () {
            const object = { a: 1, b: 2, c: 3 };
            const attributes = { b: 3, d: 4, e: 5 };
            const result = utils.objectMatchAtLeastOneAttribute(object, attributes);
            assert.strictEqual(result, false);
        });

        it('should return false if the attributes object is empty', function () {
            const object = { a: 1, b: 2, c: 3 };
            const attributes = {};
            const result = utils.objectMatchAtLeastOneAttribute(object, attributes);
            assert.strictEqual(result, false);
        });

        it('should return true if the object has a matching attribute after applying get', function () {
            const object = { a: { b: 2 }, c: 3 };
            const attributes = { 'a.b': 2, c: 4 };
            const result = utils.objectMatchAtLeastOneAttribute(object, attributes);
            assert.strictEqual(result, true);
        });

        it('should return false if the object does not have a matching attribute after applying get', function () {
            const object = { a: { b: 2 }, c: 3 };
            const attributes = { 'a.b': 3 };
            const result = utils.objectMatchAtLeastOneAttribute(object, attributes);
            assert.strictEqual(result, false);
        });
    });

    describe('fillStringFromObject', function () {
        it('should replace all placeholders with their corresponding values', function () {
            const string = 'Hello {name}, your age is {age}';
            const object = { name: 'John', age: 30 };
            const result = utils.fillStringFromObject(string, object);
            assert.strictEqual(result, 'Hello John, your age is 30');
        });

        it('should return the original string if there are no placeholders', function () {
            const string = 'Hello world';
            const object = { name: 'John', age: 30 };
            const result = utils.fillStringFromObject(string, object);
            assert.strictEqual(result, 'Hello world');
        });

        it('should return the string with undefined in place of placeholders without match', function () {
            const string = 'Hello {name}, your age is {age}';
            const object = { name: 'John' };
            const result = utils.fillStringFromObject(string, object);
            assert.strictEqual(result, 'Hello John, your age is undefined');
        });
    });

    describe('getFlattenedObject', function () {
        it('should return a flattened object with dot-separated keys', function () {
            const object = { a: 1, b: { c: 2, d: { e: 3 } } };
            const result = utils.getFlattenedObject(object);
            assert.deepStrictEqual(result, { 'a': 1, 'b.c': 2, 'b.d.e': 3 });
        });

        it('should return an empty object if the input object is empty', function () {
            const object = {};
            const result = utils.getFlattenedObject(object);
            assert.deepStrictEqual(result, {});
        });

        it('should return an object with the specified prefix', function () {
            const object = { a: 1, b: { c: 2, d: { e: 3 } } };
            const prefix = 'prefix.';
            const result = utils.getFlattenedObject(object, prefix);
            assert.deepStrictEqual(result, { 'prefix.a': 1, 'prefix.b.c': 2, 'prefix.b.d.e': 3 });
        });

        it('Property with null value should be included', function () {
            const object = { a: 1, b: null };
            const result = utils.getFlattenedObject(object);
            assert.deepStrictEqual(result, { 'a': 1, 'b': null });
        });

        it('Property with undefined value should be included', function () {
            const object = { a: 1, b: undefined };
            const result = utils.getFlattenedObject(object);
            assert.deepStrictEqual(result, { 'a': 1, 'b': undefined });
        });

        it('Property with empty object value should be included', function () {
            const object = { a: 1, b: {} };
            const result = utils.getFlattenedObject(object);
            assert.deepStrictEqual(result, { 'a': 1, 'b': {} });
        });
    });

    describe('getUpdatedProperties', function () {

        it('should return an empty object when there are no updated properties', function () {
            const entity = { name: 'John', age: 30 };
            const update = { name: 'John', age: 30 };

            const result = utils.getUpdatedProperties(entity, update);

            assert.deepStrictEqual(result, {});
        });

        it('should return the updated properties when there are some', function () {
            const entity = { name: 'John', age: 30 };
            const update = { name: 'John', age: 31 };

            const result = utils.getUpdatedProperties(entity, update);

            assert.deepStrictEqual(result, { age: 31 });
        });

        it('should handle nested properties correctly', function () {
            const entity = { name: 'John', details: { age: 30, address: 'USA' } };
            const update = { name: 'John', details: { age: 31, address: 'USA' } };

            const result = utils.getUpdatedProperties(entity, update);

            assert.deepStrictEqual(result, { details: { age: 31, address: 'USA' } });
        });

        it('should handle new properties correctly', function () {
            const entity = { name: 'John', age: 30 };
            const update = { name: 'John', age: 30, country: 'USA' };

            const result = utils.getUpdatedProperties(entity, update);

            assert.deepStrictEqual(result, { country: 'USA' });
        });

        it('should handle complex property paths correctly (update)', function () {
            const entity = {
                name: 'John',
                details: {
                    age: 30,
                    address: {
                        country: 'USA',
                        city: 'New York'
                    }
                }
            };

            const update = {
                name: 'John',
                'details.age': 31,
                'details.address.city': 'Los Angeles'
            };

            const result = utils.getUpdatedProperties(entity, update);

            assert.deepStrictEqual(result, { 'details.age': 31, 'details.address.city': 'Los Angeles' });
        });

        it('should handle complex property paths correctly (new properties)', function () {
            const entity = {
                name: 'John',
                details: {
                    age: 30,
                    address: {
                        country: 'USA',
                        city: 'New York'
                    }
                }
            };

            const update = {
                name: 'John',
                'details.age': 30,
                'details.address.city': 'New York',
                'details.address.street': '5th Avenue'
            };

            const result = utils.getUpdatedProperties(entity, update);

            assert.deepStrictEqual(result, { 'details.address.street': '5th Avenue' });
        });

    });

    describe('updateObject', function () {
        it('should update an object with new property values', function () {
            const object = { prop1: { prop2: 'oldValue' } };
            const update = { 'prop1.prop2': 'newValue' };
            _.set(object, 'prop1.prop3', 'anotherValue');
            const expected = { prop1: { prop2: 'newValue', prop3: 'anotherValue' } };
            utils.updateObject(object, update);
            assert.deepStrictEqual(object, expected);
        });

        it('should handle empty update object', function () {
            const object = { prop1: { prop2: 'value' } };
            const update = {};
            const expected = { prop1: { prop2: 'value' } };
            utils.updateObject(object, update);
            assert.deepStrictEqual(object, expected);
        });

        it('should handle empty object', function () {
            const object = {};
            const update = { 'prop1.prop2': 'value' };
            const expected = { prop1: { prop2: 'value' } };
            utils.updateObject(object, update);
            assert.deepStrictEqual(object, expected);
        });
    });

    describe('isChildPath', function () {
        it('should return true if target_path is a child of path', function () {
            const target_path = '//path/to/target';
            const path = '//path/to';
            const result = utils.isChildPath(target_path, path);
            assert.strictEqual(result, true);
        });

        it('should return false if target_path is not a child of path', function () {
            const target_path = '//path/to/target';
            const path = '//path/from';
            const result = utils.isChildPath(target_path, path);
            assert.strictEqual(result, false);
        });

        it('should return false if target_path is equal to path', function () {
            const target_path = '//path/to';
            const path = '//path/to';
            const result = utils.isChildPath(target_path, path);
            assert.strictEqual(result, false);
        });

        it('should return false if target_path is longer than path but not a child of path', function () {
            const target_path = '//path/to/target2';
            const path = '//path/to/target';
            const result = utils.isChildPath(target_path, path);
            assert.strictEqual(result, false);
        });
    });

    describe('getTargetsCommonParent', function () {
        it('should return the common parent of a list of targets with default delimiter', function () {
            const target_list = ['path.to.file1', 'path.to.file2', 'path.to.file3'];
            const result = utils.getTargetsCommonParent(target_list);
            assert.strictEqual(result, 'path.to');
        });

        it('should return the common parent of a list of targets with custom delimiter', function () {
            const target_list = ['path/to/file1', 'path/to/file2', 'path/to/file3'];
            const delimiter = '/';
            const result = utils.getTargetsCommonParent(target_list, delimiter);
            assert.strictEqual(result, 'path/to');
        });

        it('should return an empty string if the list of targets is empty', function () {
            const target_list = [];
            const result = utils.getTargetsCommonParent(target_list);
            assert.strictEqual(result, '');
        });

        it('should return empty string if all targets have no common parents', function () {
            const target_list = ['path1/to/file1', 'path2/to/file2', 'path3/to/file3'];
            const delimiter = '/';
            const result = utils.getTargetsCommonParent(target_list, delimiter);
            assert.strictEqual(result, '');
        });

        it('should return the parent path if the list contains a child target', function () {
            const target_list = ['path.to.file1', 'path.to.file2', 'path.to'];
            const result = utils.getTargetsCommonParent(target_list);
            assert.strictEqual(result, 'path.to');
        });
    });

    describe('getParentPath', function () {
        it('should return the parent path of a file path', function () {
            const path = '//path/to/file';
            const result = utils.getParentPath(path);
            assert.strictEqual(result, '//path/to');
        });

        it('should return an empty string if the path is the root path', function () {
            const path = '/';
            const result = utils.getParentPath(path);
            assert.strictEqual(result, '');
        });

        it('should return the root path if the path is a file in the root directory', function () {
            const path = '//file';
            const result = utils.getParentPath(path);
            assert.strictEqual(result, '/');
        });

        it('should return an empty string if the path is an empty string', function () {
            const path = '';
            const result = utils.getParentPath(path);
            assert.strictEqual(result, '');
        });
    });

    describe('getParentPathList', function () {
        it('should return a list of parent paths for a given path', function () {
            const path = '//path/to/file';
            const result = utils.getParentPathList(path);
            assert.deepStrictEqual(result, ['/', '//path', '//path/to']);
        });

        it('should return an empty list if the path is the root path', function () {
            const path = '/';
            const result = utils.getParentPathList(path);
            assert.deepStrictEqual(result, []);
        });

        it('should return a list with one element if the path is a file in the root directory', function () {
            const path = '//file';
            const result = utils.getParentPathList(path);
            assert.deepStrictEqual(result, ['/']);
        });

        it('should return an empty list if the path is an empty string', function () {
            const path = '';
            const result = utils.getParentPathList(path);
            assert.deepStrictEqual(result, []);
        });
    });

    describe('getHex', function () {
        it('should return a hex string with "0x" prefix for a given number', function () {
            const result = utils.getHex(255, 'byte');
            assert.strictEqual(result, '0xff');
        });

        it('should add a leading zero for byte hex strings with length 1', function () {
            const result = utils.getHex(15, 'byte');
            assert.strictEqual(result, '0x0f');
        });

        it('should return correct short hex strings', function () {
            const result = utils.getHex(4242, 'short');
            assert.strictEqual(result, '0x1092');
        });

        it('should pad short hex strings with leading zeros', function () {
            const result = utils.getHex(255, 'short');
            assert.strictEqual(result, '0x00ff');
        });

        it('should return a hex string with "0x" prefix for an undefined hexType', function () {
            const result = utils.getHex(424242424242);
            assert.strictEqual(result, '0x62c6d1a9b2');
        });

        it('should return truncated hex string for a given long number and byte hexType', function () {
            const result = utils.getHex(4242, 'byte');
            assert.strictEqual(result, '0x92');
        });

        it('should return truncated hex string for a given long number and short hexType', function () {
            const result = utils.getHex(424242424242, 'short');
            assert.strictEqual(result, '0xa9b2');
        });

        it('should return a hex string with "0x" prefix for a decimal number', function () {
            const result = utils.getHex(10.5, 'byte');
            assert.strictEqual(result, '0x0a');
        });

    });

    describe('getSignedHex', function () {
        it('should return a hex string with "0x" prefix for a given positive number', function () {
            const result = utils.getSignedHex(42, 'byte');
            assert.strictEqual(result, '0x2a');
        });

        it('should return a hex byte if no type provided', function () {
            const result = utils.getSignedHex(42);
            assert.strictEqual(result, '0x2a');
        });

        it('should return a hex string with "0x" prefix for a given negative number and byte hexType', function () {
            const result = utils.getSignedHex(-42, 'byte');
            assert.strictEqual(result, '0xd6');
        });

        it('should return a hex string with "0x" prefix for a given negative number and short hexType', function () {
            const result = utils.getSignedHex(-255, 'short');
            assert.strictEqual(result, '0xff01');
        });

        it('should add a leading zero for byte hex strings with length 1', function () {
            const result = utils.getSignedHex(15, 'byte');
            assert.strictEqual(result, '0x0f');
        });

        it('should pad short hex strings with leading zeros', function () {
            const result = utils.getSignedHex(255, 'short');
            assert.strictEqual(result, '0x00ff');
        });

        it('should return truncated hex string for a given long number and byte hexType', function () {
            const result = utils.getSignedHex(4242, 'byte');
            assert.strictEqual(result, '0x92');
        });

        it('should return truncated hex string for a given long number and short hexType', function () {
            const result = utils.getSignedHex(424242424242, 'short');
            assert.strictEqual(result, '0xa9b2');
        });

    });

    describe('aggregateEntitiesDataCount', function () {
        it('should return an empty array if no entities match the filter', function () {
            const entities = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
            const filter = { name: 'Bob' };
            const aggregation_target = 'id';
            const result = utils.aggregateEntitiesDataCount(entities, filter, aggregation_target);
            assert.deepStrictEqual(result, []);
        });

        it('should return an array of counts for the given aggregation target', function () {
            const entities = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 3, name: 'John' }, { id: 3, name: 'John' }];
            const filter = { name: 'John' };
            const aggregation_target = 'id';
            const result = utils.aggregateEntitiesDataCount(entities, filter, aggregation_target);
            assert.deepStrictEqual(result, [{ _id: 1, count: 1 }, { _id: 3, count: 2 }]);
        });

        it('should handle null and undefined values for the aggregation target', function () {
            const entities = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 3, name: 'John', age: null }];
            const filter = { name: 'John' };
            const aggregation_target = 'age';
            const result = utils.aggregateEntitiesDataCount(entities, filter, aggregation_target);
            assert.deepStrictEqual(result, []);
        });

        it('should handle missing aggregation target values', function () {
            const entities = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 3, name: 'John' }];
            const filter = { name: 'John' };
            const aggregation_target = 'age';
            const result = utils.aggregateEntitiesDataCount(entities, filter, aggregation_target);
            assert.deepStrictEqual(result, []);
        });
    });

    describe('String.prototype.upperFirstLetter', function () {
        it('should return an empty string if the input string is empty', function () {
            const result = ''.upperFirstLetter();
            assert.strictEqual(result, '');
        });

        it('should capitalize the first letter of a single-word string', function () {
            const result = 'hello'.upperFirstLetter();
            assert.strictEqual(result, 'Hello');
        });

        it('should capitalize the first letter of each word in a hyphenated string', function () {
            const result = 'hello-world'.upperFirstLetter();
            assert.strictEqual(result, 'HelloWorld');
        });

        it('should capitalize the first letter of each word in an underscored string', function () {
            const result = 'hello_world'.upperFirstLetter();
            assert.strictEqual(result, 'HelloWorld');
        });

        it('should handle strings with mixed delimiters', function () {
            const result = 'hello_world-how_are_you'.upperFirstLetter();
            assert.strictEqual(result, 'HelloWorldHowAreYou');
        });
    });

});
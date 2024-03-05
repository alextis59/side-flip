const utils = require('../../../utils');
const assert = require('assert');

describe('utils', () => {
  describe('checkVar', () => {
    it('should return true for a valid integer', () => {
      const value = 10;
      const type = 'integer';
      const result = utils.checkVar(value, type);
      assert(result === true);
    });

    it('should return false for an invalid integer', () => {
      const value = 'not an integer';
      const type = 'integer';
      const result = utils.checkVar(value, type);
      assert(result === false);
    });

    it('should return true for a valid number', () => {
      const value = 10.5;
      const type = 'number';
      const result = utils.checkVar(value, type);
      assert(result === true);
    });

    it('should return false for an invalid number', () => {
      const value = 'not a number';
      const type = 'number';
      const result = utils.checkVar(value, type);
      assert(result === false);
    });

    it('should return true for a valid string', () => {
      const value = 'hello';
      const type = 'string';
      const result = utils.checkVar(value, type);
      assert(result === true);
    });

    it('should return false for an invalid string', () => {
      const value = 123;
      const type = 'string';
      const result = utils.checkVar(value, type);
      assert(result === false);
    });

    it('should return true for a valid function', () => {
      const value = () => { };
      const type = 'function';
      const result = utils.checkVar(value, type);
      assert(result === true);
    });

    it('should return false for an invalid function', () => {
      const value = 'not a function';
      const type = 'function';
      const result = utils.checkVar(value, type);
      assert(result === false);
    });

    it('should return true for a valid boolean', () => {
      const value = true;
      const type = 'boolean';
      const result = utils.checkVar(value, type);
      assert(result === true);
    });

    it('should return false for an invalid boolean', () => {
      const value = 'not a boolean';
      const type = 'boolean';
      const result = utils.checkVar(value, type);
      assert(result === false);
    });

    it('should return true for a valid array', () => {
      const value = [1, 2, 3];
      const type = 'array';
      const result = utils.checkVar(value, type);
      assert(result === true);
    });

    it('should return false for an invalid array', () => {
      const value = 'not an array';
      const type = 'array';
      const result = utils.checkVar(value, type);
      assert(result === false);
    });

    it('should return true for a valid object', () => {
      const value = { a: 1, b: 2 };
      const type = 'object';
      const result = utils.checkVar(value, type);
      assert(result === true);
    });

    it('should return false for an invalid object', () => {
      const value = 'not an object';
      const type = 'object';
      const result = utils.checkVar(value, type);
      assert(result === false);
    });

    it('should return true for a valid hex string', () => {
      const value = 'abcdef123456';
      const type = 'hex-string';
      const result = utils.checkVar(value, type);
      assert(result === true);
    });

    it('should return false for an invalid hex string', () => {
      const value = 'not a hex string';
      const type = 'hex-string';
      const result = utils.checkVar(value, type);
      assert(result === false);
    });

    it('should return true for a valid db id', () => {
      const value = 'abcdef123456789012345678';
      const type = 'db_id';
      const result = utils.checkVar(value, type);
      assert(result === true);
    });

    it('should return false for an invalid db id', () => {
      const value = 'not a db id';
      const type = 'db_id';
      const result = utils.checkVar(value, type);
      assert(result === false);
    });

    it('should return false for an invalid db id', () => {
      const value = 'abcdef123456';
      const type = 'db_id';
      const result = utils.checkVar(value, type);
      assert(result === false);
    });

    it('should return true for a valid db id (options)', () => {
      const value = 'abcdef123456789012345678';
      const type = 'string';
      const options = { db_id: true };
      const result = utils.checkVar(value, type, options);
      assert(result === true);
    });

    it('should return false for an invalid db id (options)', () => {
      const value = 'not a db id';
      const type = 'string';
      const options = { db_id: true };
      const result = utils.checkVar(value, type, options);
      assert(result === false);
    });

    it('should return false for an invalid db id (options)', () => {
      const value = 'abcdef123456';
      const type = 'string';
      const options = { db_id: true };
      const result = utils.checkVar(value, type, options);
      assert(result === false);
    });

    it('should return false for undefined value', () => {
      const value = undefined;
      const type = 'string';
      const result = utils.checkVar(value, type);
      assert(result === false);
    });

    it('should return false for null value', () => {
      const value = null;
      const type = 'string';
      const result = utils.checkVar(value, type);
      assert(result === false);
    });

    it('should return false for value less than min', () => {
      const value = 5;
      const type = 'integer';
      const options = { min: 10 };
      const result = utils.checkVar(value, type, options);
      assert(result === false);
    });

    it('should return false for value greater than max', () => {
      const value = 15;
      const type = 'integer';
      const options = { max: 10 };
      const result = utils.checkVar(value, type, options);
      assert(result === false);
    });

    it('should return false for value with length not equal to specified length', () => {
      const value = 'hello';
      const type = 'string';
      const options = { length: 10 };
      const result = utils.checkVar(value, type, options);
      assert(result === false);
    });

    it('should return false for value with length not in specified lengths', () => {
      const value = 'hello';
      const type = 'string';
      const options = { lengths: [10, 20] };
      const result = utils.checkVar(value, type, options);
      assert(result === false);
    });

    it('should return false for value with length less than min length', () => {
      const value = 'hello';
      const type = 'string';
      const options = { min_length: 10 };
      const result = utils.checkVar(value, type, options);
      assert(result === false);
    });

    it('should return false for value with length greater than max length', () => {
      const value = 'hello';
      const type = 'string';
      const options = { max_length: 3 };
      const result = utils.checkVar(value, type, options);
      assert(result === false);
    });

    it('should return false for value that does not start with specified string', () => {
      const value = 'hello';
      const type = 'string';
      const options = { starts_with: 'hi' };
      const result = utils.checkVar(value, type, options);
      assert(result === false);
    });

    it('should return false for value that does not match specified regular expression', () => {
      const value = 'hello';
      const type = 'string';
      const options = { regexp: /hi/ };
      const result = utils.checkVar(value, type, options);
      assert(result === false);
    });

    it('should return false for value that does not have specified attribute', () => {
      const value = { a: 1 };
      const type = 'object';
      const options = { attr: 'b' };
      const result = utils.checkVar(value, type, options);
      assert(result === false);
    });

    it('should return false for value that does not have all specified attributes', () => {
      const value = { a: 1 };
      const type = 'object';
      const options = { attrs: ['a', 'b'] };
      const result = utils.checkVar(value, type, options);
      assert(result === false);
    });

    it('should return false for value that is not in specified authorized values', () => {
      const value = 'hello';
      const type = 'string';
      const options = { authorized_values: ['hi', 'hey'] };
      const result = utils.checkVar(value, type, options);
      assert(result === false);
    });

    describe('options.forbidden_content', function () {
      it('should return false if the value contains forbidden content', function () {
        const result = utils.checkVar('hello world', 'string', { forbidden_content: ['foo', 'world'] });
        assert.strictEqual(result, false);
      });

      it('should return true if the value does not contain forbidden content', function () {
        const result = utils.checkVar('hello world', 'string', { forbidden_content: ['foo'] });
        assert.strictEqual(result, true);
      });
    });

    describe('options.array_content_type', function () {
      it('should return false if any array element does not match the specified type', function () {
        const result = utils.checkVar([1, 2, 'three'], 'array', { array_content_type: 'number' });
        assert.strictEqual(result, false);
      });

      it('should return true if all array elements match the specified type', function () {
        const result = utils.checkVar([1, 2, 3], 'array', { array_content_type: 'number' });
        assert.strictEqual(result, true);
      });
    });

    describe('options.email', function () {
      it('should return false if the value is not a valid email address', function () {
        const result = utils.checkVar('not_an_email', 'string', { email: true });
        assert.strictEqual(result, false);
      });

      it('should return true if the value is a valid email address', function () {
        const result = utils.checkVar('test@example.com', 'string', { email: true });
        assert.strictEqual(result, true);
      });
    });

    describe('options.phone', function () {
      it('should return false if the value is not a valid phone number', function () {
        const result = utils.checkVar('not_a_phone_number', 'string', { phone: true });
        assert.strictEqual(result, false);
      });

      it('should return true if the value is a valid phone number', function () {
        const result = utils.checkVar('+1234567890', 'string', { phone: true });
        assert.strictEqual(result, true);
      });
    });

    describe('options.time', function () {
      it('should return false if the value is not a valid time', function () {
        const result = utils.checkVar('not_a_time', 'string', { time: true });
        assert.strictEqual(result, false);
      });

      it('should return true if the value is a valid time', function () {
        const result = utils.checkVar('12:34', 'string', { time: true });
        assert.strictEqual(result, true);
      });
    });

    describe('options.date', function () {
      it('should return false if the value is not a valid date', function () {
        const result = utils.checkVar('not_a_date', 'string', { date: true });
        assert.strictEqual(result, false);
      });

      it('should return true if the value is a valid date', function () {
        const result = utils.checkVar('01/01/2022', 'string', { date: true });
        assert.strictEqual(result, true);
      });
    });

    describe('options.iso_date', function () {
      it('should return false if the value is not a valid ISO date', function () {
        const result = utils.checkVar('not_an_iso_date', 'string', { iso_date: true });
        assert.strictEqual(result, false);
      });

      it('should return true if the value is a valid ISO date', function () {
        const result = utils.checkVar('2022-01-01T12:34:56Z', 'string', { iso_date: true });
        assert.strictEqual(result, true);
      });
    });

  });
});
const _ = require('lodash'),
    async_utils = require('./async'),
    entities = require('./entities'),
    hex = require('./hex'),
    math = require('./math'),
    objects = require('./objects'),
    paths = require('./paths'),
    variable_validation = require('./variable_validation');

String.prototype.upperFirstLetter = function () {
    let target = this, delimiter;
    if (target.length === 0) {
        return "";
    }
    if (target.indexOf('-') > -1) {
        delimiter = '-';
    } else if (target.indexOf('_') > -1) {
        delimiter = '_';
    }
    if (!delimiter) {
        return target.replace(target[0], target[0].toUpperCase());
    } else {
        let split = target.split(delimiter);
        for (let i = 0; i < split.length; i++) {
            split[i] = split[i].upperFirstLetter();
        }
        return split.join('');
    }
};

const self = {

    ...async_utils,
    ...entities,
    ...hex,
    ...math,
    ...objects,
    ...paths,
    ...variable_validation,

}

module.exports = self;
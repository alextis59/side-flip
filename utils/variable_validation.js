const _ = require('lodash');

const self = {

    /**
     * Check if a variable match a type and optional other conditions
     * @param {*} value - value to check
     * @param {string} type - variable type to match
     * @param {{}} options - other conditions
     * @returns {boolean} true if match
     */
    checkVariable: (value, type, options = {}) => {
        if (typeof type === "object") {
            options = type;
            type = options.type || "any";
        }
        if (value == null && type) {
            return false;
        }
        switch (type) {
            case undefined:
            case null:
                return type === value;
            case "number":
            case "string":
            case "function":
            case "boolean":
                if (typeof value != type) {
                    return false;
                }
                break;
            case "integer":
                if (!Number.isInteger(value)) {
                    return false;
                }
                break;
            case "array":
                if (typeof value != "object" || value.constructor !== Array) {
                    return false;
                }
                break;
            case "object":
                if (typeof value != "object" || value.constructor !== Object) {
                    return false;
                }
                break;
            case "hex-string":
                if (typeof value != "string" || !self.isHexString(value)) {
                    return false;
                }
                break;
            case "mongodb_id":
            case "db_id":
                if (!self.isMongoDbId(value)) {
                    return false;
                }
                break;
        }
        let min_length = _.get(options, 'length.min', options.min_length),
            max_length = _.get(options, 'length.max', options.max_length);
        if ((options.db_id || options.mongodb_id) && !self.isMongoDbId(value)) {
            return false;
        } else if (options.min != null && value < options.min) {
            return false;
        } else if (options.max != null && value > options.max) {
            return false;
        } else if (options.length != null && value.length !== options.length) {
            return false;
        } else if (options.lengths && !options.lengths.includes(value.length)) {
            return false;
        } else if (min_length != null && value.length < min_length) {
            return false;
        } else if (max_length != null && value.length > max_length) {
            return false;
        } else if (options.starts_with && !_.startsWith(value, options.starts_with)) {
            return false;
        } else if (options.regexp && !options.regexp.test(value)) {
            return false;
        } else if (options.attr && value[options.attr] === undefined) {
            return false;
        } else if (options.authorized_values && !_.find(options.authorized_values, (i) => { return _.isEqual(i, value) })) {
            return false;
        } else if (options.email === true && !self.isEmail(value)){
            return false;
        }else if (options.phone === true && !self.isPhoneNumber(value)){
            return false;
        }else if (options.time === true && !self.isTime(value)){
            return false;
        }else if (options.date === true && !self.isDate(value)){
            return false;
        }else if (options.iso_date === true && !self.isIsoDate(value)){
            return false;
        }
        let attr_list = options.attr_list || options.attrs;
        if (attr_list) {
            for (let attr of attr_list) {
                if (value[attr] === undefined) {
                    return false;
                }
            }
        }
        if (options.forbidden_content) {
            for (let forbid of options.forbidden_content) {
                if (value.indexOf(forbid) > -1){
                    return false;
                }
            }
        }
        if (options.array_content_type) {
            for (let item of value) {
                if (!self.checkVar(item, options.array_content_type)){
                    return false;
                }
            }
        }
        return true;
    },

    /**
     * Check if a variable is a hexadecimal string
     * @param {string} value - value to check
     * @returns {boolean} true if hexadecimal string
     */
    isHexString: (value) => {
        return /^[0-9a-fA-F]+$/.test(value);
    },

    /**
     * Check if a variable is an integer string
     * @param {string} value - value to check
     * @returns {boolean} true if integer string
     */
    isIntegerString: (value) => {
        return /^[0-9]+$/.test(value) || /^-[0-9]+$/.test(value);
    },

    /**
     * Check if a variable is a valid mongo db id
     * @param {string} value - value to check
     * @returns {boolean} true if valid mongo db id
     */
    isMongoDbId: (value) => {
        return typeof value === "string" && value.length === 24 && self.isHexString(value)
    },

    /**
     * Check if a variable is a valid email address
     * @param {string} value - value to check
     * @returns {boolean} true if valid email address
     */
    isEmail: (value) => {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}$/.test(value);
    },

    /**
     * Check if a variable is a valid phone number
     * @param {string} value - value to check
     * @returns {boolean} true if valid phone number
     */
    isPhoneNumber: (value) => {
        if (!/^[0-9+]+$/.test(value))
            return false;
        if (value.indexOf("+") > 0)
            return false;
        return true;
    },

    /**
     * Check if a variable is a valid time string (HH:mm or HH:mm:ss)
     * @param {string} value - value to check
     * @returns {boolean} true if valid time string
     */
    isTime: (value, separator = ":") => {
        let parts = value.split(separator);
        if (parts.length < 2 || parts.length > 3)
            return false;
        if (parts[0].length !== 2 || parts[1].length !== 2)
            return false;
        if (parts.length === 3 && parts[2].length !== 2)
            return false;
        let h = parseInt(parts[0]),
            m = parseInt(parts[1]),
            s = parts.length === 3 && parseInt(parts[2]);
        if (h < 0 || h > 23 || m < 0 || m > 59 || (s && (s < 0 || s > 59)))
            return false;
        return true;
    },

    /**
     * Check if a variable is a valid date string (DD/MM/YYYY)
     * @param {string} value - value to check
     * @returns {boolean} true if valid date string
     */
    isDate: (value, separator = "/") => {
        let parts = value.split(separator);
        if (parts.length !== 3)
            return false;
        let d = parseInt(parts[0]),
            m = parseInt(parts[1]),
            y = parseInt(parts[2]);
        if (d < 1 || d > 31 || m < 1 || m > 12 || y < 0 || y > 2100)
            return false;
        return true;
    },

    /**
     * Checks if a given value is a valid ISO 8601 date string.
     * @param {string} value - The string to be checked for ISO 8601 date format compliance.
     * @returns {boolean} Returns true if the value is a valid ISO 8601 date string, false otherwise.
     */
    isIsoDate: (value) => {
        return moment(value, moment.ISO_8601).isValid();
    },
}

module.exports = self;
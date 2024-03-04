const _ = require('lodash');

const self = {

    /**
     * Recursively removes properties with undefined values from an object.
     * If a property is an object itself, it will also be cleaned of undefined values.
     * This function mutates the original object.
     *
     * @param {Object} object - The object to clean of undefined properties.
     * @returns {Object} The original object with undefined values removed.
     */
    clearObjectUndefinedValues: (object) => {
        for (let prop in object) {
            let value = object[prop];
            if (value === undefined) {
                delete object[prop];
            } else if (value !== null && value.constructor === Object) {
                self.clearObjectUndefinedValues(value);
            }
        }
        return object;
    },

    /**
     * Checks if a given property is a sub-target property.
     * @param {string} property - The property to be checked.
     * @returns {boolean} - Returns true if the property contains a dot (.), indicating it is a sub-target property. Otherwise, returns false.
     */
    isSubTargetProperty: (property) => {
        return property.indexOf(".") > -1;
    },

    /**
     * This function checks if the given object matches the given attributes.
     * @param {Object} object - The object to be checked.
     * @param {Object} attributes - The attributes to be checked against.
     * @param {Boolean} apply_get - Optional. Indicates whether to apply the fillStringFromObject function to the attributes. Default is true.
     * @returns {Boolean} Returns true if the object matches the attributes, false otherwise.
     */
    objectMatchAttributes: (object, attributes, apply_get = true) => {
        let target = object, check = attributes;
        if (apply_get) {
            check = {};
            target = {};
            for (let prop in attributes) {
                let filter_target = self.fillStringFromObject(prop, object);
                _.set(check, filter_target, attributes[prop]);
            }
            for (let prop in object) {
                _.set(target, prop, object[prop]);
            }
        }
        return _.find([target], check) != null;
    },

    /**
     * Checks if an object has at least one attribute that matches the given attributes.
     * @param {object} object - The object to be checked.
     * @param {object} attributes - The attributes to be matched.
     * @returns {boolean} - Returns true if at least one attribute matches, otherwise returns false.
     */
    objectMatchAtLeastOneAttribute: (object, attributes) => {
        for (let prop in attributes) {
            if (self.objectMatchAttributes(object, { [prop]: attributes[prop] })) {
                return true;
            }
        }
        return false;
    },

    /**
     * Replaces placeholders in a string with corresponding values from an object.
     * @param {string} string - The string containing placeholders.
     * @param {object} object - The object containing values to replace the placeholders.
     * @returns {string} - The string with all placeholders replaced with corresponding values.
     */
    fillStringFromObject: (string, object) => {
        let result = string;
        while (result.indexOf("{") > -1 && result.indexOf("}") > -1) {
            let target = result.substring(result.indexOf("{") + 1, result.indexOf("}"));
            result = result.replace("{" + target + "}", _.get(object, target));
        }
        return result;
    },

    /**
     * Flattens a given object and returns a new object with the flattened structure.
     * @param {object} object - The object to be flattened.
     * @param {string} prefix - Optional prefix to be added to the flattened keys.
     * @returns {object} - The flattened object.
     */
    getFlattenedObject: (object, prefix = "") => {
        let result = {};
        for (let prop in object) {
            let value = object[prop];
            if (value != null && value.constructor === Object) {
                if (Object.keys(value).length === 0) {
                    // Handling the empty object case
                    result[prefix + prop] = {};
                } else {
                    let sub_result = self.getFlattenedObject(value, prefix + prop + ".");
                    for (let sub_prop in sub_result) {
                        result[sub_prop] = sub_result[sub_prop];
                    }
                }
            } else {
                result[prefix + prop] = value;
            }
        }
        return result;
    },

    /**
     * Returns an object containing only the properties that have been updated.
     *
     * @param {Object} entity - The entity to update.
     * @param {Object} update - The update object containing the new property values (works with nested target properties such as 'prop1.prop2': 'value').
     * @returns {Object} - An object containing the updated properties of the entity.
     */
    getUpdatedProperties: (entity, update) => {
        let updated_props = {};
        for (let target in update) {
            if (!_.isEqual(_.get(entity, target), update[target])) {
                updated_props[target] = update[target];
            }
        }
        return updated_props;
    },

    /**
     * Updates an object with the properties from the given update object.
     *
     * @param {Object} object - The object to update.
     * @param {Object} update - The update object containing the new property values (works with nested target properties such as 'prop1.prop2': 'value').
     */
    updateObject: (object, update) => {
        for (let target in update) {
            _.set(object, target, update[target]);
        }
    },

}

module.exports = self;
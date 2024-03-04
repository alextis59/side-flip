const _ = require('lodash');

const self = {

    /**
     * This function aggregates the data count of entities based on a given filter and aggregation target.
     * @param {Array} entities - The array of entities to be filtered and aggregated.
     * @param {Function} filter - The filter function to be applied on the entities.
     * @param {String} aggregation_target - The target property to be used for aggregation.
     * @returns {Array} - An array of objects containing the aggregated data count for each unique value of the aggregation target.
     */
    aggregateEntitiesDataCount: (entities, filter, aggregation_target) => {
        let targets = _.filter(entities, filter), counts = {};
        for (let target of targets) {
            let value = _.get(target, aggregation_target);
            if (value != null) {
                if (counts[value] == null) {
                    counts[value] = { _id: value, count: 0 };
                }
                counts[value].count++;
            }
        }
        return Object.values(counts);
    },

}


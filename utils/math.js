const moment = require('moment'),
    _ = require('lodash');

// Add a function to Number.prototype to convert degrees to radians
if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}

const self = {

    /**
     * Earth's mean radius in meters.
     * This constant is used for calculations involving the Earth's spherical geometry, such as
     * computing distances or coordinates offsets based on meter measurements.
     * @type {number}
     */
    R: 6378137, // Earth radius in meters

    /**
     * The maximum latitude value used to clamp the latitude input for conversion.
     * This value represents the latitude beyond which the Web Mercator projection is no longer accurate.
     * @type {number}
     */
    MAX_LATITUDE: 85.0511287798,

    /**
     * The distance covered by each step in meters.
     * This constant is used to calculate the distance based on the number of steps taken.
     * @type {number}
     */
    STEP_DISTANCE: 0.5,

    /**
     * Converts degrees to radians.
     * @param {number} degrees - The angle in degrees to be converted to radians.
     * @returns {number} The angle in radians.
     */
    radians: (degrees) => {
        return degrees * Math.PI / 180
    },

    /**
     * Calculates the dot product of two 2D vectors.
     * 
     * @param {Object} u - The first vector, with properties x and y representing its coordinates.
     * @param {Object} v - The second vector, with properties x and y representing its coordinates.
     * @returns {number} The dot product of the two vectors.
     */
    dot: (u, v) => {
        return u.x * v.x + u.y * v.y;
    },

    /**
     * Calculates the vector from point p1 to point p2.
     * 
     * @param {Object} p1 - The starting point with properties x and y representing the coordinates.
     * @param {Object} p2 - The ending point with properties x and y representing the coordinates.
     * @returns {Object} A vector object with properties x and y that represent the difference in coordinates.
     */
    vector: (p1, p2) => {
        return {
            x: (p2.x - p1.x),
            y: (p2.y - p1.y)
        };
    },

    /**
     * Converts a geographical point given in latitude and longitude to Cartesian coordinates.
     * The conversion is based on the Mercator projection, taking into account the maximum latitude.
     * 
     * @param {Object} p - The geographical point to be converted.
     * @param {number} p.lat - The latitude of the point in degrees. Must be between -85.0511287798 and 85.0511287798.
     * @param {number} p.lng - The longitude of the point in degrees.
     * @returns {Object} A point in Cartesian coordinates, where `x` is the longitude and `y` is the transformed latitude.
     */
    convertToCartesian: (p) => {
        var d = Math.PI / 180,
            max = self.MAX_LATITUDE,
            lat = Math.max(Math.min(max, p.lat), -max),
            sin = Math.sin(lat * d);

        var x = p.lng * d;
        var y = Math.log((1 + sin) / (1 - sin)) / 2;
        return { x: x, y: y };
    },

    /**
     * Compute coordinates given a original point and a offset in meters
     * @param {Object} point - {lat: number, lng: number}
     * @param {Object} offset - offset in meters {lat: number, lng: number}
     * @returns {Object} - {lat: number, lng: number} - new coordinates
     */
    getCoordinatesMeterOffset: (point, offset) => {
        let dLat = 180 * (offset.lat / self.R) / Math.PI,
            dLng = 180 * (offset.lng / (self.R * Math.cos(point.lat.toRad()))) / Math.PI;
        return { lat: point.lat + dLat, lng: point.lng + dLng }
    },

    /**
     * Compute the distance between two points in meters
     * @param {number} lat1 - latitude of the first point
     * @param {number} lng1 - longitude of the first point
     * @param {number} lat2 - latitude of the second point
     * @param {number} lng2 - longitude of the second point
     * @returns {number} - distance in meters
     */
    getDistance: (lat1, lng1, lat2, lng2) => {
        let dLat = (lat2 - lat1).toRad();
        let dLon = (lng2 - lng1).toRad();
        lat1 = lat1.toRad();
        lat2 = lat2.toRad();

        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return self.R * c;
    },

    /**
     * Compute a distance in meters from a speed in km/h and two timestamps
     * @param {string} timestamp1 - first timestamp
     * @param {string} timestamp2 - second timestamp
     * @param {number} speed - speed in km/h
     * @returns {number} - distance in meters
     */
    getVelocityDistance: (timestamp1, timestamp2, speed) => {
        let dt = Math.abs(moment(timestamp2).diff(moment(timestamp1), "s"));
        let v_s = speed / 3.6;
        return dt * v_s;
    },

    /**
     * Calculates the distance based on the number of steps taken.
     * Assumes each step covers a distance of 0.5 units.
     * 
     * @param {number} steps - The number of steps taken. Should be a non-negative number.
     * @returns {number} The calculated distance. If the number of steps is 0 or negative, the function returns 0.
     */
    getStepDistance: (steps) => {
        return steps > 0 ? steps * self.STEP_DISTANCE : 0;
    },

}

module.exports = self;
const _ = require('lodash');

const self = {

    /**
     * Converts a number to its equivalent hexadecimal value.
     * @param {number} n - The number to be converted.
     * @param {string} hexType - The type of hexadecimal value to be returned. Acceptable values are "byte" and "short".
     * @returns {string} The hexadecimal value of the given number, prefixed with "0x".
     */
    getHex: (n, hexType = "byte") => {
        n = parseInt(n);
        let hex = n.toString(16);
        if (hexType === "byte" && hex.length === 1) {
            hex = "0" + hex;
        } else if (hexType === "short") {
            while (hex.length < 4)
                hex = "0" + hex;
        }
        if (hexType === "byte" && hex.length > 2) {
            hex = hex.substring(hex.length - 2);
        }
        if (hexType === "short" && hex.length > 4) {
            hex = hex.substring(hex.length - 4);
        }
        hex = "0x" + hex;
        return hex;
    },

    /**
     * Converts a decimal value to a signed hexadecimal value.
     * @param {number} value - The decimal value to be converted.
     * @param {string} hexType - The type of hexadecimal value to be returned. Can be "byte" or "short". Defaults to "byte".
     * @returns {string} - The signed hexadecimal value.
     */
    getSignedHex: (value, hexType = "byte") => {
        let result = 0;
        if (value < 0) {
            if (hexType === "byte") {
                result += 256;
            } else {
                result += 65536;
            }
        }
        result += value;
        result = result.toString(16);
        if (hexType === "byte" && result.length === 1) {
            result = "0" + result;
        } else if (hexType === "short") {
            while (result.length < 4)
                result = "0" + result;
        }
        if (hexType === "byte" && result.length > 2) {
            result = result.substring(result.length - 2);
        }
        if (hexType === "short" && result.length > 4) {
            result = result.substring(result.length - 4);
        }
        result = "0x" + result;
        return result;
    },

    /**
     * Converts a number to a hexadecimal string with a specified length.
     * The number is first converted to an unsigned 32-bit integer using zero-fill right shift,
     * then it is converted to a hexadecimal string. If the resulting hex string is shorter
     * than the specified length, it is padded with leading zeros.
     *
     * @param {number} number - The number to be converted to a hexadecimal string.
     * @param {number} [length=8] - The desired length of the output hexadecimal string. Defaults to 8 if not provided.
     * @returns {string} A hexadecimal string representation of the input number, padded with leading zeros to match the specified length.
     */
    numberToHex: (number, length = 8) => {
        const hex = Math.floor(number >>> 0).toString(16);
        return ('0'.repeat(length) + hex).slice(-length)
    },

    /**
     * Reverses the order of characters in a hexadecimal string in byte-wise chunks.
     * For example, given the hex string '1A2B3C4D' it will return '4D3C2B1A'.
     *
     * @param {string} hex - The hexadecimal string to be reversed.
     * @returns {string} - The reversed hexadecimal string.
     */
    reverseHex: (hex) => {
        const chunks = [],
            charsLength = hex.length;
        for (let i = 0; i < charsLength; i += 2) {
            chunks.push(hex.substring(i, i + 2));
        }
        return chunks.reverse().join("")
    },

}

module.exports = self;
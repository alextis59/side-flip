const _ = require('lodash');

const self = {

    /**
     * Sets a timeout for the given number of milliseconds and returns a promise that will reject with an error if the timeout is reached
     * @param {number} ms - The number of milliseconds to set the timeout for
     * @returns {Promise} A promise that will reject with an error if the timeout is reached
     */
    timeout: (ms) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error("Request timed out"));
            }, ms);
        });
    },

    /**
     * Delays the execution of code for a specified amount of time.
     * @param {number} ms - The amount of time to wait in milliseconds.
     * @returns {Promise} A promise that resolves after the specified amount of time has passed.
     */
    wait: (ms) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    },

    /**
     * Converts a function that accepts any number of arguments with the last one being a Callback into an async function.
     * If the input function is already an async function, it returns it directly.
     *
     * @param {Function} fn - The original function to convert. It should accept any number of arguments with the last one being a Callback.
     * @returns {Function} An async function or the original async function if already async.
     */
    toAsync: (fn) => {
        // Check if fn is an async function
        if (fn[Symbol.toStringTag] === 'AsyncFunction') {
            return fn;
        }
        return async function (...args) {
            return new Promise((resolve, reject) => {
                // Add a callback function as the last argument
                args.push((error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
                // Apply the arguments to the original function
                fn.apply(this, args);
            });
        };
    },

    getTrackedPromise: (promise) => {
        let status = "pending";
        let result;

        const trackedPromise = promise.then(
            value => {
                status = "fulfilled";
                result = value;
                return value;
            },
            error => {
                status = "rejected";
                result = error;
                throw error;
            }
        );

        trackedPromise.getStatus = () => status;
        trackedPromise.getResult = () => result;

        return trackedPromise;
    },

    /**
     * Asynchronously map given function on each item of the provided list.
     * The final callback, if provided, is called when all items have been processed with the result of the map or if an error occurs
     * and the 'throw_error' option is set to true.
     * 
     * @param {Array} list - The array of items to be processed.
     * @param {Function} func - The asynchronous function to apply to each item of the list.
     *                          It must accept an item and a callback, which should be called with
     *                          an optional error argument upon completion.
     * @param {Function} callback - The final callback to be called after processing all items
     *                              or when an error occurs. If no error occurs, it's called with no arguments.
     * @param {Object} [options={}] - An optional options object to customize the behavior of the mapping.
     *                                Available options:
     *                                  - keep_order: If true, processes items in order, one after the other.
     *                                  - throw_error: If true, stops processing and calls the final callback
     *                                                 with the error as soon as any async function calls its callback
     *                                                 with an error.
     *                                  - max_concurrency: A number that limits the maximum number of asynchronous
     *                                                     operations running at the same time.
     * @returns {Array} - An array of results from the asynchronous function calls.
     */
    asyncMap: async (list, func, callback, options = {}) => {
        if (typeof callback === 'object') {
            options = callback;
            callback = () => { };
        } else if (typeof callback !== 'function') {
            callback = () => { };
        }
        if (list.length === 0) {
            callback(undefined, []);
            return [];
        }

        func = self.toAsync(func);

        if (options.keep_order) {
            const results = [];
            for (let item of list) {
                try {
                    const result = await func(item);
                    results.push(result);
                } catch (err) {
                    if (options.throw_error) {
                        callback(err);
                        throw err;
                    }
                    results.push(undefined); // Or handle the error as appropriate
                }
            }
            callback(undefined, results);
            return results;
        } else {
            let max_concurrency = options.max_concurrency || list.length;
            let promises = [];
            let results = new Array(list.length);
            let currentIndex = 0;

            // Function to process a single item and handle its completion
            const processItem = async (item, index) => {
                try {
                    let result = await func(item);
                    results[index] = result; // Store result in the corresponding position
                } catch (err) {
                    if (options.throw_error) {
                        throw err;
                    }
                    results[index] = undefined; // Or handle the error as appropriate
                }
            };

            // Main loop to manage concurrency
            while (currentIndex < list.length) {
                // While there are items left to process and we haven't reached max concurrency
                while (currentIndex < list.length && promises.length < max_concurrency) {
                    let promise = self.getTrackedPromise(processItem(list[currentIndex], currentIndex++));
                    promises.push(promise);
                }

                try {
                    // Wait for at least one promise to finish
                    await Promise.race(promises);
                } catch (err) {
                    if (options.throw_error) {
                        callback(err);
                        throw err;
                    }
                }

                // Remove settled promises from the array
                promises = promises.filter(p => p.getStatus() === 'pending');
            }

            // Wait for all remaining promises to settle
            try {
                await Promise.all(promises);
            } catch (err) {
                if (options.throw_error) {
                    callback(err);
                    throw err;
                }
            }
            callback(undefined, results);
            return results;
        }
    },

    /**
     * Asynchronously call given function on each item of the provided list.
     * The final callback, if provided, is called when all items have been processed or if an error occurs
     * and the 'throw_error' option is set to true.
     * 
     * @param {Array} list - The array of items to be processed.
     * @param {Function} func - The asynchronous function to apply to each item of the list.
     *                          It must accept an item and a callback, which should be called with
     *                          an optional error argument upon completion.
     * @param {Function} callback - The final callback to be called after processing all items
     *                              or when an error occurs. If no error occurs, it's called with no arguments.
     * @param {Object} [options={}] - An optional options object to customize the behavior of the mapping.
     *                                Available options:
     *                                  - keep_order: If true, processes items in order, one after the other.
     *                                  - throw_error: If true, stops processing and calls the final callback
     *                                                 with the error as soon as any async function calls its callback
     *                                                 with an error.
     *                                  - max_concurrency: A number that limits the maximum number of asynchronous
     *                                                     operations running at the same time.
     */
    asyncEach: async (list, func, callback, options = {}) => {
        await self.asyncMap(list, func, callback, options);
    }
}

module.exports = self;
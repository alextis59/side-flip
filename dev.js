/**
 * Converts a function that accepts any number of arguments with the last one being a Callback into an async function.
 *
 * @param {Function} fn - The original function to convert. It should accept any number of arguments with the last one being a Callback.
 * @returns {Function} An async function.
 */
function convertToAsyncFunction(fn) {
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
}

// Example usage:

// Original function that takes multiple arguments with the last one being a callback
function originalFunction(arg1, arg2, callback) {
    // Simulate asynchronous operation with setTimeout
    setTimeout(() => {
        if (arg1 + arg2 > 0) {
            callback(null, "Success!"); // Success case
        } else {
            callback(new Error("Failure")); // Error case
        }
    }, 1000);
}

// Convert to an async function
const asyncFunction = convertToAsyncFunction(originalFunction);

// Call the converted async function with await
async function run() {
    try {
        const result = await asyncFunction(1, -2); // Passing arguments that the original function expects (excluding the callback)
        console.log(result); // "Success!"
    } catch (error) {
        console.error(error); // Error: "Failure"
    }
}

run();

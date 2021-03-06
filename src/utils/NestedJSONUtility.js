/**
 * Given a JS object, will encode nested objects such that they can be stored in
 * the SQL database without needing to recursively check for primitives below top layer
 * of the object.
 *
 * @param {Object} obj a given javascript object
 * @returns {Object} a JS object with no nested objects; all nested objects are encoded in strings.
 */
const encode = obj => {

    const output = {};
    const keys = Object.keys(obj);

    keys.forEach(key => {
        
        if (typeof obj[key] === "object") {
            output[key] = JSON.stringify(obj[key]);
        } else {
            output[key] = obj[key];
        }

    });

    return output;

};

/**
 * Given a javascript objects, this function detects whether there is a string-encoded
 * JSON object in any of the object properties, and parses that object.
 *
 * Only good for parsing objects with only 1-level of encoding. If any of the parsed nested
 * objects contains another encoded nested object in it, the function will not convert that.
 *
 * @param {Object} obj the object to be parsed for encoded nested objects
 */
const parse = obj => {

    const keys = Object.keys(obj);
    const output = {};

    keys.forEach(key => {

        // detect if there's an opening bracket inside object
        if (typeof obj[key] === "string" && obj[key].charAt(0) === "{") {
            output[key] = JSON.parse(obj[key]);
        } else {
            output[key] = obj[key];
        }

    });

    return output;

};

module.exports = {
    parse,
    encode
};

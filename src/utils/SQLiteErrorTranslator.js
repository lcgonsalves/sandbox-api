// a utility to translate sqlite error codes into something more readable.
const errorMap = {};

errorMap.SQLITE_CONSTRAINT = "Data does not fit required constraints!";
errorMap.SQLITE_MISMATCH = "Wrong data type used!";
errorMap.NONE_FOUND = "No data found.";

module.exports = errorMap;

// imports
const sqlite3 = require("sqlite3").verbose();
const queries = require("../queries/TuneMountainQueries");
const demoQueries = require("../queries/DemoQueries");
const errorDescriptions = require("../utils/SQLiteErrorTranslator");
const {parse, encode} = require("../utils/NestedJSONUtility");

// defined constants
const DB_LOCATION = './sql/tune-mountain.db';
const APP_NAME = 'Tune Mountain';

// common errors
const TYPE_MISMATCH_ERROR = {
    "status": "failure",
    "errorCode": 20,
    "details": errorDescriptions.SQLITE_MISMATCH
};

/**
 * Each method allows for either fetching or adding data
 * into the database.
 *
 * Be sure to surround instantiation of this class in Try / Catch
 * blocks in case an initialization error occurs.
 */
class TuneMountainDBUtility {

    constructor(foreignKeyEnforcement = true) {

        this.db = null;
        const dbObject = new sqlite3.Database(DB_LOCATION, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                throw new Error("Connection to DB failed!");
            }
            else {
                console.log(`Connected to the ${APP_NAME} database.`);
                this.db = dbObject;
                if (foreignKeyEnforcement) this.db.get("PRAGMA foreign_keys = ON");
            }

        });

    }

    /**
     * Executes an insert query with the passed values;
     *
     * @param {String} spotifyID the spotify id of the user
     * @param {String} displayName the display name of user
     * @param {String} imageUrl the url of the profile picture of the user
     * @returns {Promise<Object>} a promise that evaluates to a success response object or an error response object.
     */
    insertUser(spotifyID, displayName, imageUrl) {

        const handler = (resolve, reject) => {

            // type check all inputs
            if (
                typeof spotifyID !== "string" ||
                typeof displayName !== "string" ||
                typeof imageUrl !== "string"
            ) reject(TYPE_MISMATCH_ERROR);

            // execute query
            this.db.run(
                queries.insertUser,
                {
                    "$spotifyID": spotifyID,
                    "$displayName": displayName,
                    "$imageUrl": imageUrl
                },
                error => {
                    if (error) reject({
                        "status": "failure",
                        "errorCode": error.errno,
                        "details": errorDescriptions[error.code]
                    });
                    else resolve({
                        "status": "success",
                        "user": {
                            spotifyID,
                            displayName,
                            imageUrl
                        }
                    });
                }
            );

        };

        return new Promise(handler);
    }

    /**
     * Executes a SELECT query with the selected parameter
     *
     * @param {String} spotifyID user's spotify ID
     * @returns {Promise<Object>} an object containing the status code and either the fetched user or error information.
     */
    fetchUserWithID(spotifyID) {

        const handler = (resolve, reject) => {

            // type check all inputs
            if (
                typeof spotifyID !== "string"
            ) reject(TYPE_MISMATCH_ERROR);

            // execute query
            this.db.get(
                queries.selectUser,
                { "$spotifyID": spotifyID },
                (error, row) => {
                    if (error) reject({
                        "status": "failure",
                        "errorCode": error.errno,
                        "details": errorDescriptions[error.code]
                    });
                    else if (!row) reject({
                        "status": "failure",
                        "errorCode": 1,
                        "details": errorDescriptions.NONE_FOUND
                    });
                    else resolve({
                            "status": "success",
                            "user": {...row}
                        });
                }
            );

        };

        return new Promise(handler);

    }

    /**
     * Inserts a new session and responds with all sessions associated
     * with the given user.
     *
     * @param {String} score amount scored during the session
     * @param {String} songID spotify song ID
     * @param {String} userID spotify user ID (must be foreign key in 'users')
     * @param {String} gameVersion a version this session was recorded in (must be current or it won't be replayable)
     * @returns {Promise<Array<Object>>} a promise that resolves to an array of sessions pertaining to the user or
     * an error.
     */
    insertSession(score, songID, userID, gameVersion) {

        const handler = (resolve, reject) => {

            // type check all inputs
            if (
                typeof score !== "number" ||
                typeof songID !== "string" ||
                typeof userID !== "string" ||
                typeof gameVersion !== "string"
            ) reject(TYPE_MISMATCH_ERROR);

            // execute query
            this.db.run(
                queries.insertSession,
                {
                    "$score": score,
                    "$songID": songID,
                    "$userID": userID,
                    "$gameVersion": gameVersion
                },
                error => {
                    if (error) reject({
                        "status": "failure inserting session",
                        "errorCode": error.errno,
                        "details": errorDescriptions[error.code]
                    });
                    else {

                        // fetch all sessions from this user
                        this.db.all(
                            queries.selectSessionOfUser,
                            { "$userID": userID },
                            (error, rows) => {
                                if (error) reject({
                                    "status": "failure retrieving sessions",
                                    "errorCode": error.errno,
                                    "details": errorDescriptions[error.code]
                                });
                                else resolve({
                                    "status": "success",
                                    "userID": userID,
                                    "sessions": rows
                                })
                            }
                        );

                    }
                }
            );

        };

        return new Promise(handler);

    }

    /**
     * Fetches session information referring to a given ID;
     *
     * @param {Number} sessionID an integer identifier for the session
     * @returns {Promise<Object>}
     */
    fetchSessionInfoWithID(sessionID) {

        const handler = (resolve, reject) => {

            // type check all inputs
            if (
                typeof sessionID !== "number"
            ) reject(TYPE_MISMATCH_ERROR);

            // execute query
            this.db.get(
                queries.selectSessionWithID,
                { "$sessionID": sessionID },
                (error, row) => {
                    if (error) reject({
                        "status": "failure",
                        "errorCode": error.errno,
                        "details": errorDescriptions[error.code]
                    });
                    else if (!row) reject({
                        "status": "failure",
                        "errorCode": 1,
                        "details": errorDescriptions.NONE_FOUND
                    });
                    else resolve({
                            "status": "success",
                            "sessionInfo": {...row}
                        });
                }
            );

        };

        return new Promise(handler);

    }

    /**
     * Retrieves all game sessions belonging to user
     *
     * @param {String} spotifyID the spotify ID of user
     * @returns {Promise<Object>} promise that resolves to an object containing the array of sessions or rejects to
     * an error.
     */
    fetchSessionsFromUser(spotifyID) {

        const handler = (resolve, reject) => {

            // type check all inputs
            if (
                typeof spotifyID !== "string"
            ) reject(TYPE_MISMATCH_ERROR);

            // execute query
            this.db.all(
                queries.selectSessionOfUser,
                { "$userID": spotifyID },
                (error, rows) => {
                    if (error) reject({
                        "status": "failure retrieving sessions",
                        "errorCode": error.errno,
                        "details": errorDescriptions[error.code]
                    });
                    else resolve({
                        "status": "success",
                        "userID": spotifyID,
                        "sessions": rows
                    })
                }
            );

        };

        return new Promise(handler);

    }

    /**
     * Retrieves session info and an array of all inputs
     * related to that session.
     *
     * @param {Number} sessionID an integer identifier for the session
     * @returns {Promise<Object>} promise that resolves to an object containing the
     * session or rejects with an error if no sessions are found.
     */
    fetchSessionWithID(sessionID) {

        const handler = (resolve, reject) => {

            // type check all inputs
            if (
                typeof sessionID !== "number"
            ) reject(TYPE_MISMATCH_ERROR);

            // execute query
            this.db.get(
                queries.selectSessionWithID,
                { "$sessionID": sessionID },
                (error, row) => {
                    if (error) reject({
                        "status": "failure",
                        "errorCode": error.errno,
                        "details": errorDescriptions[error.code]
                    });
                    else if (!row) reject({
                        "status": "failure fetching session info",
                        "errorCode": 1,
                        "details": errorDescriptions.NONE_FOUND
                    });
                    else {
                        // for clarity
                        const session = row;

                        this.db.all(
                            queries.selectAllInputsFromSessionWIthID,
                            { "$sessionID": sessionID },
                            (error, rows) => {
                                if (error) reject({
                                    "status": "failure",
                                    "errorCode": error.errno,
                                    "details": errorDescriptions[error.code]
                                });
                                else resolve({
                                        "status": "success",
                                        "sessionInfo": {...session},
                                        "inputs": rows
                                    });
                            }
                        );
                    }
                }
            );

        };

        return new Promise(handler);

    }

    /**
     *
     * @param maxResults
     * @param spotifyID
     * @returns {Promise<unknown>}
     */
    fetchTopSessions(maxResults = 10, spotifyID) {

        const handler = (resolve, reject) => {

            // type check all inputs and existance of spotifyID
            if (
                typeof maxResults !== "number" ||
                (spotifyID && typeof spotifyID !== "string")
            ) reject(TYPE_MISMATCH_ERROR);

            if (spotifyID) {
                // execute query with spotifyID
                this.db.all(
                    queries.selectTopSessionsFromUserWithID,
                    { "$userID": spotifyID, "$maxResults": maxResults > 20 ? 20 : maxResults },
                    (error, rows) => {
                        if (error) reject({
                            "status": "failure retrieving sessions from user",
                            "errorCode": error.errno,
                            "details": errorDescriptions[error.code]
                        });
                        else resolve({
                            "status": "success",
                            "userID": spotifyID,
                            "sessions": rows
                        });
                    }
                );
            } else {
                // execute query without spotify ID
                this.db.all(
                    queries.selectTopSessions,
                    {"$maxResults": maxResults > 20 ? 20 : maxResults },
                    (error, rows) => {
                        if (error) reject({
                            "status": "failure retrieving sessions",
                            "errorCode": error.errno,
                            "details": errorDescriptions[error.code]
                        });
                        else resolve({
                            "status": "success",
                            "userID": spotifyID,
                            "sessions": rows
                        });
                    }
                );
            }
        };

        return new Promise(handler);

    }

    /**
     * Inserts an array of inputs into a database
     *
     * @param {Array} inputArray array of inputs
     * @returns {Promise<Object>} promise that resolves into an object containing all inputs and session id or error.
     */
    insertInputs(inputArray) {

        const handler = (resolve, reject) => {

            // execute query
            try {
                this.db.run(
                    queries.insertArrayOfInputs(inputArray),
                    [],
                    error => {
                        if (error) reject({
                            "status": "failure inserting inputs",
                            "errorCode": error.errno,
                            "details": errorDescriptions[error.code]
                        });
                        else {
                            resolve({
                                "status": "success",
                                "sessionID": inputArray[0].sessionID,
                                "inputsAdded": inputArray
                            })
                        }
                    }
                );
            } catch (e) {

                // for cases where it's not an array since type checking is being weird
                reject({
                    "status": "failure",
                    "errorCode": e.name
                })

            }

        };

        return new Promise(handler);

    }

    /**
     * Inserts feedback form responses into the database.
     *
     * @param {Object} feedbackFormObj object containing song ID and responses to questions.
     * @returns {Promise<Object>} resolves into object containing success or rejects into failure
     */
    insertFeedbackForm(feedbackFormObj) {

        const handler = (resolve, reject) => {

            if (!feedbackFormObj) reject({
                "status": "failure",
                "details": "feedback form object not passed"
            });

            // encoding: transforms nested objects into strings
            const encodedObj = encode(feedbackFormObj);

            const {
                songID, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14
            } = encodedObj;

            const containsANullField = () => {

                Object.keys(encodedObj).forEach(key => {
                    if (key !== "q14" && (encodedObj[key] === null || encodedObj[key] === undefined)) {
                        return true;
                    }
                });

                return false;

            };

            if (containsANullField()) reject({
                "status": "failure",
                "details": "one of the required fields was null"
            });

            // execute query
            try {

                this.db.run(
                    queries.insertFeedbackForm,
                    {
                        $songID: songID,
                        $q1: q1,
                        $q2: q2,
                        $q3: q3,
                        $q4: q4,
                        $q5: q5,
                        $q6: q6,
                        $q7: q7,
                        $q8: q8,
                        $q9: q9,
                        $q10: q10,
                        $q11: q11,
                        $q12: q12,
                        $q13: q13,
                        $q14: q14
                    },
                    error => {
                        if (error) reject({
                            "status": "failure inserting inputs",
                            "errorCode": error.errno,
                            "details": errorDescriptions[error.code]
                        });
                        else {
                            resolve({
                                "status": "success"
                            });
                        }
                    }
                );
            } catch (e) {

                // for cases where it's not an array since type checking is being weird
                reject({
                    "status": "failure",
                    "errorCode": e.name
                })

            }

        };

        return new Promise(handler);

    }

    /**
     * Inserts a signature into the appropriate table.
     * @param name
     * @returns {Promise<unknown>}
     */
    insertIRBName(name) {

        const handler = (resolve, reject) => {

            if (!name) reject({
                "status": "failure",
                "details": "no name passed"
            });

            // execute query
            this.db.run(
                queries.insertFeedbackForm,
                { $name: name },
                error => {
                    if (error) reject({
                        "status": "failure inserting IRB Name",
                        "errorCode": error.errno,
                        "details": errorDescriptions[error.code]
                    });
                    else {
                        resolve({
                            "status": "success"
                        });
                    }
                }
            );

        };

        return new Promise(handler);

    }

    /**
     * Selects all feedback form responses
     *
     * @returns {Promise<Object>} promise that resolves into a status field and a body field containing the responses
     */
    fetchAllFeedbackForms() {

        const handler = (resolve, reject) => {

            this.db.all(
                queries.selectFeedbackForms,
                [],
                (error, rows) => {
                    if (error) reject({
                        "status": "failure inserting inputs",
                        "errorCode": error.errno,
                        "details": errorDescriptions[error.code]
                    });
                    else {
                        resolve({
                            "status": "success",
                            "body": rows ? rows.map(parse) : []
                        })
                    }
                }
            );

        };

        return new Promise(handler);

    }

    /**
     * Fetches all user profiles in the database;
     *
     * TODO: secure this with Access Token
     *
     * @returns {Promise<Object>}
     */
    demoFetchAll(category) {

        const handler = (resolve, reject) => {

                this.db.all(
                    demoQueries.ALL(category),
                    [],
                    (error, rows) => {

                        console.log(error, rows);

                        if (error) reject({
                            "status": `failure fetching ${category}`,
                            "errorCode": error.errno,
                            "details": errorDescriptions[error.code]
                        });
                        else {
                            const output = {};
                            output.status = "success";
                            output[category] = rows;

                            resolve(output);
                        }
                    }
                );

        };

        return new Promise(handler);

    }

}

module.exports = TuneMountainDBUtility;

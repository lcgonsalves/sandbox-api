// imports
const sqlite3 = require("sqlite3");
const queries = require("../queries/TuneMountainQueries");
const errorDescriptions = require("../utils/SQLiteErrorTranslator");

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
                typeof score !== "string" ||
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

    // todo: get session with sessionID

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

    // todo: add array of inputs

    // todo: get all inputs associated with a sessionID

}

module.exports = TuneMountainDBUtility;

const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const queries = require("../queries/DataVisQueries");
const errorDescriptions = require("../utils/SQLiteErrorTranslator");
const initBuildings = require("../utils/StoreAllBuildingsInDatabase");
const cors = require("cors");
const {mean, median, sum} = require("d3-array");

// initialize db
const DB_LOCATION = './sql/datavis.db';
const APP_NAME = 'Data Visualization Sandbox';
const allowedOrigins = {
    github: "https://lcgonsalves.github.io",
    local: "http://localhost:8080",
    react: "http://localhost:3000"
};

let db = new sqlite3.Database(DB_LOCATION, sqlite3.OPEN_READWRITE, (err) => {

    if (err) {
        throw new Error("Connection to DB failed!");
    }
    else {
        console.log(`Connected to the ${APP_NAME} database.`);
        db.get("PRAGMA foreign_keys = ON");

        // initialize db with buildings
        initBuildings(db);
    }

});

/**
 * Allow cross origin for localhost and github
 */
router.use(cors());

// save session a3
router.post("/a3/saveResponse", (req, res) => {

    if (!req.body) {
        res.status(400).send({
            "status": "failure",
            "errorCode": 400,
            "details": "No request body passed."
        })
    }

    // check if all params are sent correctly
    const {
        ansRadar,
        userAnsRadar,
        ansRing,
        userAnsRing,
        ansBar,
        userAnsBar
    } = req.body;

    if (!ansRadar || !userAnsRadar || !ansRing || !userAnsRing || !ansBar || !userAnsBar) {
        res.status(400).send({
            "status": "failure",
            "errorCode": 400,
            "details": "One or more params are missing."
        })
    } else {

        // add to database
        db.run(
            queries.insertA3Answer,
            {
                $ansRadar: ansRadar,
                $userAnsRadar: userAnsRadar,
                $ansRing: ansRing,
                $userAnsRing: userAnsRing,
                $ansBar: ansBar,
                $userAnsBar: userAnsBar
            },
            error => {
                if (error) res.status(400).send({
                    "status": "failure",
                    "errorCode": error.errno,
                    "details": errorDescriptions[error.code]
                });

                else res.status(200).send({
                    "status": "success"
                })
            }
        )
    }


});

// get all data a3
router.get("/a3", (req, res) => {

    db.all(
        queries.getA3Results,
        [],
        (error, rows) => {

            console.log(error, rows);

            if (error) res.status(400).send({
                "status": `failure fetching data`,
                "errorCode": error.errno,
                "details": errorDescriptions[error.code]
            });

            else {

                const output = {
                    status: "success",
                    data: rows
                };

                res.status(200).send(output);

            }

        }
    )

});

// posts a set of responses, including profile
router.post("/campus-survey/submit", (req, res) => {

    const finish = () => res.status(200).send({
        "status": "success"
    });

    const reject = (errno, msg) => res.status(400).send({
        "status": "failed!",
        "errNo": errno,
        "details": msg
    });

    if (!req.body) reject(-1, "empty request body");

    const {
        profile,
        response
    } = req.body;

    if (!profile || !response) reject(-1, `Missing ${!profile ? "profile" : ""} ${!profile && !response ? "and" : ""} ${!response ? "response" : ""}.`);

    // insert survey, get id, insert profile
    // inserts a profile given an ID
    const insertProfile = () => {

        const {
            gradeLevel, age, major, residence
        } = profile;

        db.run(
            queries.insertProfileResponse,
            {
                "$gradeLevel": gradeLevel,
                "$age": age,
                "$major": major,
                "$residence": residence
            },
            function(error) {
                if (error) reject(error.errno, "failed to insert profile");
                else {
                    insertResponses(this.lastID);
                }
            }
        );

    };

    // inserts all responses with a given profile id
    const insertResponses = id => {


        db.run(
            queries.insertArrayOfResponses(response, id),
            [],
            function(error) {
                if (error) reject(error.errno, "failed to insert response");
                else finish();
            }
        );

    };

    insertProfile();

});

// gets all responses from survey, average value of each question
router.get("/campus-survey/responses", (req, res) => {

    console.log(req.origin);

    const finish = body => res.status(200).send({
        "status": "success",
        "body": body
    });

    const reject = (errno, msg) => res.status(400).send({
        "status": "failed!",
        "errNo": errno,
        "details": msg
    });

    // buildings
    let temp = {};
    let output = {};

    db.all(
        queries.getAllResponses,
        [],
        (error, rows) => {
            if (error) reject(error.errno, "failed to fetch responses.");
            else {
                // if no length just finish
                if (!rows.length) {
                    return finish(rows);
                }

                // all rows have the same keys
                const questions = Object.keys(rows[0]).filter(key => key !== "buildingName" && key !== "responseID");

                // parse each row
                rows.forEach(row => {

                    // check if building has been parsed, initialize container
                    if (!temp[row.buildingName]) {
                        temp[row.buildingName] = {};
                        output[row.buildingName] = {};
                    }

                    // check if each question response has been parsed, if not, initialize
                    questions.forEach(q => {
                        // if answer isn't null
                        if (row[q] !== null) {
                            // array that contains all responses for a given answer
                            if (!temp[row.buildingName][q]) temp[row.buildingName][q] = [];

                            // append response to question at the end of array
                            temp[row.buildingName][q].push(row[q]);
                        }

                    });

                });

                // get average of each response
                const buildings = Object.keys(output);
                const choiceQuestions = [
                    "STUDY_QUALITY_6",
                    "STUDY_QUALITY_7",
                    "STUDY_QUALITY_8",
                    "STUDY_QUALITY_9"
                ];

                buildings.forEach(building => {
                    questions.forEach(question => {

                        // only do operation for valid question
                        if (temp[building][question]) {

                            // for choice questions, return sum of bool (1=true, 0=false)
                            if (choiceQuestions.includes(question)) {
                                output[building][question] = sum(temp[building][question]);
                            } else {
                                output[building][question] = mean(temp[building][question]);
                            }

                        }

                    });

                });

                finish(output);

            }
        }
    )


});

module.exports = router;
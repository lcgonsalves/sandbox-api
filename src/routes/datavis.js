const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const queries = require("../queries/DataVisQueries");
const errorDescriptions = require("../utils/SQLiteErrorTranslator");

// initialize db
const DB_LOCATION = './sql/datavis.db';
const APP_NAME = 'Data Visualization Sandbox';

let db = new sqlite3.Database(DB_LOCATION, sqlite3.OPEN_READWRITE, (err) => {

    if (err) {
        throw new Error("Connection to DB failed!");
    }
    else {
        console.log(`Connected to the ${APP_NAME} database.`);
    }

});

router.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

    console.log(req.body);

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

module.exports = router;
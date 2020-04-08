const express = require("express");
const router = express.Router();
const TMDBUtility = require("../utils/TuneMountainDBUtility");

let db = new TMDBUtility(); // default to TMDB

// more descriptive logger function
const log = response => console.log({ "timestamp": new Date(), ...response });

// demo endpoints for visualizer
router.get("/demo/:category", (req, res) => {

    const { category } = req.params;

    console.log(category);

    res.append("Content-Type", "application/json");

    db.demoFetchAll(category)
        .then((response) => {
            log(response);
            res.status(200).send(response);
        })
        .catch((err) => {
            log(err);
            res.status(400).send(err);
        });
});

// insert new user
router.post("/users", (req, res) => {

    res.append("Content-Type", "application/json");

    if (!req.body) {
        res.status(400).send({
            "status": "failure",
            "errorCode": 400,
            "details": "No request body passed."
        })
    }

    const {
        spotifyID,
        displayName,
        imageUrl
    } = req.body;

    db.insertUser(spotifyID, displayName, imageUrl)
        .then((response) => {
            log(response);
            res.status(200).send(response);
        })
        .catch((err) => {
            log(err);
            res.status(400).send(err);
        });

});

// insert new feedback response
router.post("/submit-feedback", (req, res) => {

    res.append("Content-Type", "application/json");

    if (!req.body || !req.body.name) {
        res.status(400).send({
            "status": "failure",
            "errorCode": 400,
            "details": "No request body passed."
        })
    }

    Promise.all([
        db.insertFeedbackForm(req.body),
        db.insertIRBName(req.body.name)
    ]).then((response) => {
            log(response);
            res.status(200).send(response);
        })
        .catch((err) => {
            log(err);
            res.status(400).send(err);
        });

});

// insert new session
router.post("/sessions", (req, res) => {

    res.append("Content-Type", "application/json");

    if (!req.body) {
        res.status(400).send({
            "status": "failure",
            "errorCode": 400,
            "details": "No request body passed."
        })
    }

    const {
        score,
        songID,
        userID,
        gameVersion
    } = req.body;

    db.insertSession(score, songID, userID, gameVersion)
        .then((response) => {
            log(response);
            res.status(200).send(response);
        })
        .catch((err) => {
            log(err);
            res.status(400).send(err);
        });

});

// insert inputs
router.post("/inputs", (req, res) => {

    res.append("Content-Type", "application/json");

    if (!req.body) {
        res.status(400).send({
            "status": "failure",
            "errorCode": 400,
            "details": "No request body passed."
        })
    }

    const { inputs } = req.body;

    db.insertInputs(inputs)
        .then((response) => {
            log(response);
            res.status(200).send(response);
        })
        .catch((err) => {
            log(err);
            res.status(400).send(err);
        });

});

// get user by ID
router.get("/user/:id", (req, res) => {

    const {id} = req.params;

    res.append("Content-Type", "application/json");

    db.fetchUserWithID(id)
        .then((response) => {
            log(response);
            res.status(200).send(response);
        })
        .catch((err) => {
            log(err);
            res.status(400).send(err);
        });

});

// get all feedback form responses
router.get("/feedback-responses", (req, res) => {

    res.append("Content-Type", "application/json");

    db.fetchAllFeedbackForms()
        .then((response) => {
            log(response);
            res.status(200).send(response);
        })
        .catch((err) => {
            log(err);
            res.status(400).send(err);
        });

});

// fetch session info
router.get("/session/:sessionID/info", (req, res) => {

    const { sessionID } = req.params;

    res.append("Content-Type", "application/json");

    db.fetchSessionInfoWithID(parseInt(sessionID))
        .then((response) => {
            log(response);
            res.status(200).send(response);
        })
        .catch((err) => {
            log(err);
            res.status(400).send(err);
        });

});

// fetch complete session
router.get("/session/:sessionID", (req, res) => {

    const { sessionID } = req.params;

    res.append("Content-Type", "application/json");

    db.fetchSessionWithID(parseInt(sessionID))
        .then((response) => {
            log(response);
            res.status(200).send(response);
        })
        .catch((err) => {
            log(err);
            res.status(400).send(err);
        });

});

// get all sessions belonging to user
router.get("/user/:userID/sessions", (req, res) => {

    const { userID } = req.params;

    res.append("Content-Type", "application/json");

    db.fetchSessionsFromUser(userID)
        .then((response) => {
            log(response);
            res.status(200).send(response);
        })
        .catch((err) => {
            log(err);
            res.status(400).send(err);
        });

});

// leaderboard
router.get("/leaderboard/:userID?", (req, res) => {

    res.append("Content-Type", "application/json");

    if (!req.body) {
        res.status(400).send({
            "status": "failure",
            "errorCode": 400,
            "details": "No request body passed."
        })
    }

    // optional parameter to limit the number of results
    const {
        maxResults
    } = req.body;

    // optional parameter to filter by user
    const {
        userID
    } = req.params;

    db.fetchTopSessions(maxResults, userID)
        .then((response) => {
            log(response);
            res.status(200).send(response);
        })
        .catch((err) => {
            log(err);
            res.status(400).send(err);
        });

});

module.exports = router;

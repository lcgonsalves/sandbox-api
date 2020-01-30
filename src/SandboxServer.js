//*********************\\
//                     \\
//    Web API Root     \\
//                     \\
//*********************\\

// Arguments: [port] [useDB]
const express = require("express"),
    path = require("path"),
    bodyParser = require("body-parser"),
    TMDBUtility = require("./utils/TuneMountainDBUtility"),
    port = (process.argv[2] || process.env.PORT || 9595);

// more descriptive logger function
const log = response => console.log({ "timestamp": new Date(), ...response });

let db;

if (process.argv[3]) {
    db = new TMDBUtility();
}

const app = express();
app.use(express.static(path.join(__dirname, "../static")));
app.use(bodyParser.json());

// TODO: only allow this view if token is present
// return db visualizer
app.get("/", (req, res) => {

    // status ok
    res.status(200);
    res.sendFile(path.join(__dirname + "/index.html"));

});

// insert new user
app.post("/tm/users", (req, res) => {

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

// get user by ID
app.get("/tm/user/:id", (req, res) => {

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

// insert new session
app.post("/tm/sessions", (req, res) => {

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

// fetch session info
app.get("/tm/session/:sessionID/info", (req, res) => {

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
app.get("/tm/session/:sessionID", (req, res) => {

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

// insert inputs
app.post("/tm/inputs", (req, res) => {

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

// get all sessions belonging to user
app.get("/tm/user/:userID/sessions", (req, res) => {

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
app.get("/tm/leaderboard/:userID?", (req, res) => {

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

// init server
app.listen(port, () => {
    console.log(`SQL API running on port ${port}`)
});
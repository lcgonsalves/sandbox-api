const queries = {};

queries.insertUser =
    `INSERT INTO users(spotifyID, displayName, imageUrl) VALUES ($spotifyID, $displayName, $imageUrl);`;
queries.selectUser = `SELECT * FROM users WHERE users.spotifyID = $spotifyID;`;
queries.insertSession =
    `INSERT INTO sessions(score, songID, userID, gameVersion) VALUES($score, $songID, $userID, $gameVersion)`;
queries.selectSessionOfUser = `SELECT * FROM sessions WHERE sessions.userID = $userID`;
queries.selectSessionWithID =
    `SELECT * FROM sessions WHERE sessions.sessionID = $sessionID`;

queries.selectAllInputsFromSessionWIthID =
    `SELECT * FROM inputs WHERE inputs.sessionID = $sessionID`;

// todo: add version checking
queries.selectTopSessionsFromUserWithID =
    `SELECT * FROM sessions WHERE sessions.userID = $userID AND sessions.gameVersion = $gameVersion ORDER BY score DESC LIMIT $maxResults;`;
queries.selectTopSessions =
    `SELECT * FROM sessions WHERE sessions.gameVersion = $gameVersion ORDER BY score DESC LIMIT $maxResults;`;
queries.insertFeedbackForm = "INSERT INTO feedbackFormResponses(songID, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14) VALUES ($songID, $q1, $q2, $q3, $q4, $q5, $q6, $q7, $q8, $q9, $q10, $q11, $q12, $q13, $q14);";

queries.selectFeedbackForms = "SELECT * FROM feedbackFormResponses;";
queries.insertIRBName = "INSERT INTO IRBNames(name) VALUES ($name)";

queries.insertArrayOfInputs = (inputs) => {

    const arr = inputs.map(input => {
        const {
            sessionID,
            action,
            timestamp,
            type
        } = input;

        if (
            typeof sessionID !== "number" ||
            typeof  action !== "string" ||
            typeof timestamp !== "string" ||
            typeof type !== "string"
        ) throw new TypeError("Invalid type");

        return `(${sessionID}, '${action}', '${timestamp}', '${type}')`;
    });

    return `INSERT INTO inputs(sessionID, action, timestamp, type)
    VALUES ${arr};`;
};

module.exports = queries;

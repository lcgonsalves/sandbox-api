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

queries.selectTopSessionsFromUserWithID =
    `SELECT * FROM sessions WHERE sessions.userID = $userID ORDER BY score DESC LIMIT $maxResults;`;
queries.selectTopSessions =
    `SELECT * FROM sessions ORDER BY score DESC LIMIT $maxResults;`;

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
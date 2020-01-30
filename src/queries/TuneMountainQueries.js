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

queries.insertArrayOfInputs = (inputs) => {

    const arr = inputs.map(input => {
        const {
            sessionID,
            action,
            timestamp
        } = input;

        return `(${sessionID}, '${action}', '${timestamp}')`;
    });

    return `INSERT INTO inputs(sessionID, action, timestamp)
    VALUES ${arr};`;
};

module.exports = queries;
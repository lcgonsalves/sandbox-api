const queries = {};

queries.insertUser = `INSERT INTO users(spotifyID, displayName, imageUrl) VALUES ($spotifyID, $displayName, $imageUrl);`;
queries.selectUser = `SELECT * FROM users WHERE users.spotifyID = $spotifyID;`;
queries.insertSession = `INSERT INTO sessions(score, songID, userID, gameVersion) VALUES($score, $songID, $userID, $gameVersion)`;
queries.selectSessionOfUser = `SELECT * FROM sessions WHERE sessions.userID = $userID`;
queries.selectSessionWithID = `SELECT * FROM sessions WHERE sessions.sessionID = $sessionID`;

module.exports = queries;
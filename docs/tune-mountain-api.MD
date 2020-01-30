## Tune Mountain API Endpoints

Provides all needed database interactivity for the web application to function and provide services.

### How to fetch endpoints

At the time of writing, all URIs are defined in terms of path extensions of the URL `api.tune-mountain.com`. This is
 an alias for the server that encompasses all other databases, which is associated with `api.leogons.com`; however
 , in order to access the same endpoints using the second URL, one has to access the subdirectory `/tm/` prefixing
  all endpoints.
  
  Example:
  `api.tune-mountain.com/users` == `api.leogons.com/tm/users`
  
Endpoints
----

#### POST requests
#### `/users/`
Adds a user to the database.
```javascript
Body (JSON): {
    spotifyID: String,   // spotify ID of user
    displayName: String, // spotify displayname of user
    imageUrl: String     // spotify profile picture of user
}
```
---
#### `/sessions/`
Add a game session to database.

```javascript
Body (JSON): {
    score: Integer,
    songID: String,
    userID: String,
    gameVersion: String
}
```
---
#### `/inputs/`
Adds an array of inputs to the database.

```javascript
Body (JSON): {
    inputArray: Array
}
```

#### GET requests
#### `/user/:userID`
Fetches a user profile belonging to user with spotify ID == `userID`;

On success, returns a JSON object containing: 
```JSON
{
  "status": "success",
  "user": {
      "spotifyID":  String,
      "displayName": String,
      "imageUrl": String
    }
}
```
On failure, see [on failure](#onfailure)

---
#### `/user/:userID/sessions`
Fetches all sessions belonging to a a user profile with spotify ID == `userID`;

On success, returns a JSON object containing: 
```JSON
{
    "status": "success",
    "userID": "123456678",
    "sessions": [
        {
            "sessionID": 69,
            "userID": "123456678",
            "score": 323,
            "songID": "Airborne Ranger",
            "gameVersion": "0.0.0"
        },
        {
            "sessionID": 76,
            "userID": "123456678",
            "score": 450,
            "songID": "Ragoo",
            "gameVersion": "0.0.0"
        }
    ]
}
```
**Note** that sessions do not contain inputs; a separate request must be done to fetch all inputs belonging to a
 session. 

On failure, see [on failure](#onfailure)

---
#### `/session/:sesssionID`
Fetches session information belonging to a session with ID `sessionID`, including all inputs;
On success, returns a JSON object containing
```JSON
{
    "status": "success",
    "sessionInfo": {
        "sessionID": 1,
        "userID": "1234567899",
        "score": 323,
        "songID": "Airborne Ranger",
        "gameVersion": "0.0.0"
    },
    "inputs": [
        {
            "sessionID": 1,
            "action": "jump",
            "timestamp": "12",
            "type": "press"
        },
        
        ...

        {
            "sessionID": 1,
            "action": "fuck",
            "timestamp": "15",
            "type": "press"
        }
    ]
}
```

All inputs belonging to this session will be returned in the array, which could be quite large.

On failure, see [on failure](#onfailure)

---
#### `/session/:sesssionID/info`
Fetches ONLY session information belonging to a session with ID `sessionID`;
On success, returns a JSON object containing
```JSON
{
    "status": "success",
    "sessionInfo": {
        "sessionID": 1,
        "userID": "1234567899",
        "score": 323,
        "songID": "Airborne Ranger",
        "gameVersion": "0.0.0"
    }
}
```
NOTE: This endpoint excludes inputs;

All inputs belonging to this session will be returned in the array.

On failure, see [on failure](#onfailure)

---
#### `/leaderboard/:userID?`
Fetches top sessions in the database. Can optionally filter to sessions by user with `userID`;
Can optionally filter the number of sessions to be fetched with the request body variable:
`{ "maxResults": 8 }` which maxes out at 20.

On success, returns a JSON object containing
```JSON
{
    "status": "success",
    "userID": "1234567899",
    "sessions": [
          {
                "sessionID": 1,
                "userID": "1234567899",
                "score": 323,
                "songID": "Poopoo",
                "gameVersion": "0.0.0"
          },
          
            ...

          {
                "sessionID": 2,
                "userID": "1234567899",
                "score": 450,
                "songID": "Peepee",
                "gameVersion": "0.0.0"
          }
    ]
}
```

All inputs belonging to sessions won't be returned in this request.

On failure, see [on failure](#onfailure)

---

#### On Failure
If a request to any of the above endpoints fails for any reason, it will return a JSON object containing the
 following fields:
 
 `"status"` -- either `failure` or `success`
 
 `"errorCode"` -- an internal error code
 
 `"details"` -- text describing what sort of error occurred
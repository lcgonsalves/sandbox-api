// todo: authorize token here

const token = true;

// nodes
const mainText = document.getElementById("main-text");
const mainContainer = document.getElementById("main-container");
const dropwdown = document.getElementById("dropdown");

if (token) {
    mainText.innerHTML = "Please select which table you would like to view:";

    // hardcode this for now
    let users = document.createElement("option");
    users.value = "users";
    users.innerHTML = "users table";

    let sessions = document.createElement("option");
    sessions.value = "sessions";
    sessions.innerHTML = "user sessions table";

    let inputs = document.createElement("option");
    inputs.value = "inputs";
    inputs.innerHTML = "user inputs table";

    // append
    dropwdown.appendChild(users);
    dropwdown.appendChild(sessions);
    dropwdown.appendChild(inputs);

    let selected = dropwdown.options[dropwdown.selectedIndex].value;

    const load = () => fetch(`/tm/demo/${selected}`)
        .then(response => response.json())
        .then(jsonObj => {

            if (selected === "users") {
                clearDiv();
                mainContainer.appendChild(generateUserTable(jsonObj.users));
            } else if (selected === "sessions") {
                clearDiv();
                mainContainer.appendChild(generateSessionTable(jsonObj.sessions));
            } else if (selected === "inputs") {
                clearDiv();
                mainContainer.appendChild(generateInputTable(jsonObj.inputs))
            }
            
        })
        .catch(err => mainText.innerHTML = err.message);

    dropwdown.addEventListener(
        "change",
        () => {
            selected = dropwdown.options[dropwdown.selectedIndex].value;
            load();
        }
    );

    load();

}

// clears table container
const clearDiv = () => {
    while (mainContainer.firstChild) {
        mainContainer.removeChild(mainContainer.firstChild);
    }
};

// generates a single row
const generateUserRow = (id, name, img) => {

    const userRow = document.createElement("tr");
    const idCell = document.createElement("td");
    const nameCell = document.createElement("td");
    const imgCell = document.createElement("td");

    idCell.innerHTML = id;
    nameCell.innerHTML = name;
    imgCell.innerHTML = img;

    userRow.appendChild(idCell);
    userRow.appendChild(nameCell);
    userRow.appendChild(imgCell);

    return userRow;

};

// generates a user table
const generateUserTable = (rows) => {

    const table = document.createElement("table");

    const headerRow = document.createElement("tr");
    const id = document.createElement("th");
    id.innerHTML = "spotifyID";
    const name = document.createElement("th");
    name.innerHTML = "display name";
    const imgUrl = document.createElement("th");
    imgUrl.innerHTML = "imgUrl";

    headerRow.appendChild(id);
    headerRow.appendChild(name);
    headerRow.appendChild(imgUrl);

    table.appendChild(headerRow);

    rows.forEach(row => table.appendChild(generateUserRow(row.spotifyID, row.displayName, row.imageUrl)));
    return table;

};

// single session row
const generateSessionRow = (id, score, userID, songID, version) => {

    const sessionRow = document.createElement("tr");

    const idCell = document.createElement("td");
    const scoreCell = document.createElement("td");
    const userIDCell = document.createElement("td");
    const songIDCell = document.createElement("td");
    const versionCell = document.createElement("td");

    idCell.innerHTML = id;
    scoreCell.innerHTML = score;
    userIDCell.innerHTML = userID;
    songIDCell.innerHTML = songID;
    versionCell.innerHTML = version;

    sessionRow.appendChild(idCell);
    sessionRow.appendChild(scoreCell);
    sessionRow.appendChild(userIDCell);
    sessionRow.appendChild(songIDCell);
    sessionRow.appendChild(versionCell);

    return sessionRow;

};

// session table
const generateSessionTable = (rows) => {

    const table = document.createElement("table");

    const headerRow = document.createElement("tr");

    const idCell = document.createElement("th");
    const scoreCell = document.createElement("th");
    const userIDCell = document.createElement("th");
    const songIDCell = document.createElement("th");
    const versionCell = document.createElement("th");

    idCell.innerHTML = "sessionID";
    scoreCell.innerHTML = "score";
    userIDCell.innerHTML = "userID";
    songIDCell.innerHTML = "songID";
    versionCell.innerHTML = "version";

    headerRow.appendChild(idCell);
    headerRow.appendChild(scoreCell);
    headerRow.appendChild(userIDCell);
    headerRow.appendChild(songIDCell);
    headerRow.appendChild(versionCell);

    table.appendChild(headerRow);

    rows.forEach(row => table.appendChild(generateSessionRow(row.sessionID, row.score, row.userID, row.songID, row.version)));
    return table;

};

// single input row
const generateInputRow = (sessionID, action, timestamp, type) => {

    const inputRow = document.createElement("tr");

    const sessionIDCell = document.createElement("td");
    const actionCell = document.createElement("td");
    const timestampIDCell = document.createElement("td");
    const typeIDCell = document.createElement("td");

    sessionIDCell.innerHTML = sessionID;
    actionCell.innerHTML = action;
    timestampIDCell.innerHTML = timestamp;
    typeIDCell.innerHTML = type;

    inputRow.appendChild(sessionIDCell);
    inputRow.appendChild(actionCell);
    inputRow.appendChild(timestampIDCell);
    inputRow.appendChild(typeIDCell);

    return inputRow;
};

// input table
const generateInputTable = (rows) => {

    const table = document.createElement("table");

    const headerRow = document.createElement("tr");

    const sessionIDCell = document.createElement("td");
    const actionCell = document.createElement("td");
    const timestampIDCell = document.createElement("td");
    const typeIDCell = document.createElement("td");

    sessionIDCell.innerHTML = "sessionID";
    actionCell.innerHTML = "action";
    timestampIDCell.innerHTML = "timestamp";
    typeIDCell.innerHTML = "type";

    headerRow.appendChild(sessionIDCell);
    headerRow.appendChild(actionCell);
    headerRow.appendChild(timestampIDCell);
    headerRow.appendChild(typeIDCell);

    table.appendChild(headerRow);

    rows.forEach(row => table.appendChild(generateInputRow(row.sessionID, row.action, row.timestamp, row.type)));

    return table;

};
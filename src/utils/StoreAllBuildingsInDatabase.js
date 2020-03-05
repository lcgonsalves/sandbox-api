const queries = require("../queries/DataVisQueries");

/**
 * Simple script to store all buildings in database for the first time.
 * @constructor
 */
const StoreAllBuildingsInDatabase = db => {
    // change this when number of buildings change
    const buildings = [{"category":"building","name":"Sports and Recreation Center"},{"category":"building","name":"Harrington Auditorium"},{"category":"building","name":"Foisie Innovation Center"},{"category":"residenceHall","name":"Messenger"},{"name":"Higgins Labs","category":"building"},{"category":"building","name":"Stratton Hall"},{"category":"building","name":"Washburn Shops"},{"category":"building","name":"Boynton Hall"},{"category":"building","name":"Gordon Library"},{"category":"building","name":"IGSD"},{"category":"building","name":"Salisbury Laboratories"},{"category":"poi","name":"Fountain"},{"category":"building","name":"Rubin Campus Center"},{"category":"building","name":"Olin Hall"},{"category":"building","name":"Fuller Laboratories"},{"category":"building","name":"Kaven Hall"},{"category":"building","name":"Atwater Kent Laboratories"},{"category":"building","name":"Goddard Hall"},{"category":"building","name":"Higgins House"},{"category":"poi","name":"Campus Center Lawn"},{"category":"poi","name":"Higgins Lawn"},{"category":"poi","name":"Salisbury Lawn"},{"category":"poi","name":"The Quad"},{"category":"residenceHall","name":"Morgan Hall"},{"category":"residenceHall","name":"Daniels Hall"},{"category":"residenceHall","name":"Sanford Riley Hall"},{"category":"building","name":"Alden Memorial"},{"category":"residenceHall","name":"East Hall"},{"category":"residenceHall","name":"Founders Hall"},{"category":"residenceHall","name":"Institute Hall"},{"category":"residenceHall","name":"Stoddard Complex"},{"category":"residenceHall","name":"Faraday Hall"},{"category":"building","name":"Bartlett Center"},{"category":"poi","name":"The Wedge"},{"category":"poi","name":"Pulse On Dining (DAKA)"},{"category":"poi","name":"Dunkin Donuts"},{"category":"poi","name":"CC Couch Room"},{"category":"poi","name":"CC Dining Area"},{"category":"poi","name":"Library Cafe"},{"category":"poi","name":"Goat's Head"},{"category":"poi","name":"Atwater Kent Lounge"},{"category":"poi","name":"Foisie Lounge Area"},{"category":"building","name":"Gateway Park"},{"category":"building","name":"Gateway Park I"},{"category":"building","name":"Gateway Park II"}];

    db.run(
        queries.insertArrayOfBuildings(buildings),
        [],
        error => console.log(error && error.errno === 19 ? "Values already in database." : "Successfully initialized database.")
    )

};

module.exports = StoreAllBuildingsInDatabase;

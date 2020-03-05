const queries = {};

queries.insertA3Answer =
    "INSERT INTO a3Answers(ansRadar, userAnsRadar, ansRing, userAnsRing, ansBar, userAnsBar) VALUES ($ansRadar, $userAnsRadar, $ansRing, $userAnsRing, $ansBar, $userAnsBar)";

queries.getA3Results = "SELECT * from a3Answers";

queries.insertArrayOfResponses = (inputs, id) => {

    // all questions
    const keys = [
        "STUDY_QUALITY_0",
        "STUDY_QUALITY_1",
        "STUDY_QUALITY_2",
        "STUDY_QUALITY_3",
        "STUDY_QUALITY_4",
        "STUDY_QUALITY_5",
        "STUDY_QUALITY_6",
        "STUDY_QUALITY_7",
        "STUDY_QUALITY_8",
        "STUDY_QUALITY_9",
        "STUDY_QUALITY_10",
        "LIVING_AND_EATING_0",
        "LIVING_AND_EATING_1",
        "LIVING_AND_EATING_2",
        "LIVING_AND_EATING_3",
        "LIVING_AND_EATING_4",
        "LIVING_AND_EATING_5",
        "LIVING_AND_EATING_6",
        "MISC_0",
        "MISC_1",
        "MISC_2",
        "MISC_3",
        "MISC_4"
    ];

    const arr = inputs.map(input => {
        let valueString = "( ";

        // converts booleans to integers
        const convert = val => {
            if (typeof(val) === "boolean") {
                return val ? 1 : 0;
            } else return val;
        };

        // save ID
        valueString += `${id}, `;

        // save name
        valueString += `"${input["buildingName"]}", `;

        keys.forEach((key, index) => {

            // IF NO
            valueString += (typeof(input[key]) !== "undefined") && input[key] !== "" ? convert(input[key]) : "NULL";

            valueString += index < keys.length - 1 ? ", " : " ";

        });

        valueString += ")";

        return valueString;

    });

    return `INSERT INTO WPISurveyResponses( responseID,
                                            buildingName,
                                            STUDY_QUALITY_0,
                                            STUDY_QUALITY_1,
                                            STUDY_QUALITY_2,
                                            STUDY_QUALITY_3,
                                            STUDY_QUALITY_4,
                                            STUDY_QUALITY_5,
                                            STUDY_QUALITY_6,
                                            STUDY_QUALITY_7,
                                            STUDY_QUALITY_8,
                                            STUDY_QUALITY_9,
                                            STUDY_QUALITY_10,
                                            LIVING_AND_EATING_0,
                                            LIVING_AND_EATING_1,
                                            LIVING_AND_EATING_2,
                                            LIVING_AND_EATING_3,
                                            LIVING_AND_EATING_4,
                                            LIVING_AND_EATING_5,
                                            LIVING_AND_EATING_6,
                                            MISC_0,
                                            MISC_1,
                                            MISC_2,
                                            MISC_3,
                                            MISC_4 )
    VALUES ${arr};`;
};

queries.insertArrayOfBuildings = buildings => {

    const arr = buildings.map(building => {
        return `("${building.name}", "${building.category}")`
    });

    return `INSERT INTO WPISurveyBuildings( name, category )
    VALUES ${arr};`;

};

queries.insertProfileResponse = "INSERT INTO WPISurveyProfiles(gradeLevel, age, major, residence ) VALUES ($gradeLevel, $age, $major, $residence)";

queries.getAllResponses =
    "SELECT * FROM WPISurveyResponses;";

module.exports = queries;

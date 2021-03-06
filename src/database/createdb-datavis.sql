CREATE TABLE IF NOT EXISTS a3Answers (
    sessionID INTEGER PRIMARY KEY AUTOINCREMENT,
    ansRadar REAL NOT NULL,
    userAnsRadar REAL NOT NULL,
    ansRing REAL NOT NULL,
    userAnsRing REAL NOT NULL,
    ansBar REAL NOT NULL,
    userAnsBar REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS WPISurveyResponses (
    responseID INTEGER NOT NULL,
    buildingName TEXT NOT NULL,
    STUDY_QUALITY_0 REAL, -- RATING
    STUDY_QUALITY_1 REAL, -- RATING
    STUDY_QUALITY_2 REAL, -- RATING
    STUDY_QUALITY_3 REAL,-- RATING
    STUDY_QUALITY_4 REAL,-- RATING
    STUDY_QUALITY_5 REAL,-- RATING
    STUDY_QUALITY_6 INTEGER, -- CHOOSE MANY
    STUDY_QUALITY_7 INTEGER, -- CHOOSE MANY
    STUDY_QUALITY_8 INTEGER, -- CHOOSE ONE
    STUDY_QUALITY_9 INTEGER, -- CHOOSE ONE
    STUDY_QUALITY_10 REAL, -- RATING
    LIVING_AND_EATING_0 REAL, --RATING
    LIVING_AND_EATING_1 REAL, --RATING
    LIVING_AND_EATING_2 REAL, --RATING
    LIVING_AND_EATING_3 REAL, --RATING
    LIVING_AND_EATING_4 REAL, --RATING
    LIVING_AND_EATING_5 REAL, --RATING
    LIVING_AND_EATING_6 REAL, --RATING
    MISC_0 REAL, -- RATING
    MISC_1 REAL, -- RATING
    MISC_2 REAL, -- RATING
    MISC_3 REAL, -- RATING
    MISC_4 REAL, -- RATING
    FOREIGN KEY (buildingName) REFERENCES WPISurveyBuildings(name),
    FOREIGN KEY (responseID) REFERENCES WPISurveyProfiles(id)
);


CREATE TABLE IF NOT EXISTS WPISurveyProfiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gradeLevel TEXT NOT NULL,
    age INTEGER NOT NULL,
    major TEXT NOT NULL,
    residence TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS WPISurveyBuildings (
    name TEXT PRIMARY KEY,
    category TEXT NOT NULL
);

-- Query for Getting All Responses to a given question for a given building
-- filtered by some user parameter
SELECT MISC_0 FROM WPISurveyResponses
INNER JOIN (
    SELECT id FROM WPISurveyProfiles
    WHERE gradeLevel = "Alumnus"
) ON id = WPISurveyResponses.responseID
WHERE buildingName = "Messenger";

const queries = {};

queries.insertA3Answer =
    "INSERT INTO a3Answers(ansRadar, userAnsRadar, ansRing, userAnsRing, ansBar, userAnsBar) VALUES ($ansRadar, $userAnsRadar, $ansRing, $userAnsRing, $ansBar, $userAnsBar)";

queries.getA3Results = "SELECT * from a3Answers";

module.exports = queries;

//*********************\\
//                     \\
//    Web API Root     \\
//                     \\
//*********************\\

// Arguments: [port] [useDB]
const express = require("express"),
    path = require("path"),
    bodyParser = require("body-parser"),
    tuneMountainRouter = require("./routes/tune-mountain"),
    datavisRouter = require("./routes/datavis"),
    port = 9595; // default to 9595

const app = express();
app.use(express.static(path.join(__dirname, "../static")));
app.use(bodyParser.json());
app.use("/tm", tuneMountainRouter);
app.use("/datavis", datavisRouter);

// init server
app.listen(port, () => {
    console.log(`SQL API running on port ${port}`)
});
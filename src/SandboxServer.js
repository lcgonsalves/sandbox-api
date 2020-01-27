//*********************\\
//                     \\
//    Web API Root     \\
//                     \\
//*********************\\

// Arguments: [port]

const express = require("express"),
    path = require("path"),
    port = (process.env.PORT || process.argv[0] || 95);

const app = express();


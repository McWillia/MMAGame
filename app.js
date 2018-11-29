const express = require('express');

const app = express();
let expressWs = require('express-ws')(app);

const webPort = 8080;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static('public'));

app.listen(webPort, function () {
   console.log('listening on ' + webPort);
});

// let websockets = {};
//
//
// app.ws("/ws/:id", function (ws, req){
//
//     ws.id = req.params.id;
//     console.log("Recieved connection from microbit: " + ws.id);
//     websockets[ws.id] = ws;
//
//     ws.on('message', function (msg){
//         console.log("message");
//     })
// });

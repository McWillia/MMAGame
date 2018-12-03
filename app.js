const express = require('express');

const app = express();
// let expressWs = require('express-ws')(app);

app.set('view engine', 'ejs');

const model = require('./model');
model.init();


const webPort = 8080;

app.get('/', function (req, res) {
	res.render('pages/index');
})

app.listen(webPort, function () {
   console.log('listening on ' + webPort);
});




app.get('/turn', function (req, res) {

    //console.log(req.query.name);
    model.turn(req, res);

    res.statusCode = 200;
    res.send(res.data);

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


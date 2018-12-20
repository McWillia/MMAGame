const express = require('express');

const app = express();
let expressWs = require('express-ws')(app);


app.use(express.static( __dirname + 'public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const model = require('./model');
model.init();


const webPort = 8080;

app.use(express.static('public'));



app.get('/', function (req, res) {
	res.render('pages/index');
});




app.listen(webPort, function () {
   console.log('listening on ' + webPort);
});



app.get('/newGame', function (req, res) {

    // console.log(req.query.nameIn);
    var game = new model.Game(req.query.nameIn);

    // console.log(game + " : " + game.getAI().getName() + " : " + game.getPlayer().getName());

    res.data = game;
    res.statusCode = 200;
    res.send(res.data);

});

app.get('/turn', function (req, res) {

    //console.log(req.query.name);
    // req.query.gameStateIn
    model.turn(req, res);

    res.statusCode = 200;
    res.send(res.data);

});

app.get('/moves', function (req, res) {

    // console.log("here");
    model.moveList(req, res);

    res.statusCode = 200;
    res.send(res.data);

});

app.get('/refreshGames', function (req, res){ 


    res.statusCode = 200;
    res.send(JSON.stringify(games));
});

let websockets = {};
let games = [];


app.ws("/ws/:id", function (ws, req){
    ws.id = req.params.id;
    var er = false;
    while (websockets[ws.id] != undefined) {
        ws.id += "1";
        console.log("running : " + ws.id);
        er = true;
    }


    console.log("Recieved connection from: " + ws.id + " : " + er);
    websockets[ws.id] = ws;

    if (er) {
        console.log("Running")
            ws.send(JSON.stringify({type:"erName", newName: ws.id}));
    }

    ws.on('message', function (msg){
        var msgIn = JSON.parse(msg);

        if (msgIn.type == "chat") {
            var msgOut = JSON.stringify({type:"chat", user: ws.id, chat:msgIn.ChatVal});
            console.log(msgOut);

            for (var key in websockets) {
                websockets[key].send(msgOut);
            }
            // ws.send(msg);
        } else if(msgIn.type == "newGame"){
            var found = false;
            for (var i = 0; i < games.length; i++) {
                if (games[i].player1 == ws.id || games[i].player2 == ws.id ) {
                    found = true;
                };
            };

            if (!found) {
                games.push({id:i, player1:ws.id});
            };

            console.log(games);
        }

        
    })

    ws.on('close',function(){
        console.log(ws.id + " has left");
        delete websockets[ws.id];
        for (var i = 0; i < games.length; i++) {    
                if (games[i].player1 == ws.id || games[i].player2 == ws.id ) {
                    games.splice(i,1);
                }
        } 
    });
});

var ws = null;
function init(){
    //console.log("berto")
    $("<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>").appendTo('.col-md-6');

    startGame();
    //webSoc();
}

function getTurn(){
    console.log($('#in').val());
    $.get("/turn",
    {name:$('#in').val()},
     function (data) {
        console.log("Data:" + JSON.stringify(data));
    });
}



function webSoc() {
    ws = new WebSocket('ws://localhost:8080/ws/1');
    ws.onopen = function () {
        console.log('websocket is connected ...')
        ws.send('connected')
    }
    ws.onmessage = function (ev) {
        console.log(ev);
        var data = event.data;
        console.log(data);
    }
}




function sendWS() {
    if(ws!=null && ws.readyState === 1){
        console.log("Sending data");
        // var selValue = $('input[name=section2]:checked').val();
        // var data1 = $('#Data1').val();
        // var data2 = $('#Data2').val();
        if(selValue === undefined){selValue = 0;}
        if(data1 === undefined){data1 = 0; console.log("1");}
        if(data2 === undefined){data2 = 0; console.log("2");}
        ws.send(JSON.stringify({
            // Data1: data1,
            // Data2: data2,
            option:selValue
        }));
    }
}


var redGamePiece, blueGamePiece, yellowGamePiece;

function startGame() {
    redGamePiece = new component(25, 25, "red", 10, 10, 3, 3);
    yellowGamePiece = new component(25, 25, "yellow", 50, 60, 0, 3);
    blueGamePiece = new component(25, 25, "blue", 10, 220, -3,-3);
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 300;
        this.canvas.height = 300;
        this.context = this.canvas.getContext("2d");
        $(this.canvas).appendTo('#div1');
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, xdir, ydir) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.xdir = xdir;
    this.ydir = ydir;
    this.update = function(){
        if(this.x <= 0){
            this.xdir = 3;
        }else if(this.x+ this.width > myGameArea.canvas.width){
            this.xdir = -3;
        }

        if(this.y <= 0){
            this.ydir = 3;
        }else if(this.y+ this.height > myGameArea.canvas.height){
            this.ydir = -3;
        }
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function updateGameArea() {
    myGameArea.clear();
    redGamePiece.x += redGamePiece.xdir;
    redGamePiece.y += redGamePiece.ydir;
    redGamePiece.update();

    yellowGamePiece.x += yellowGamePiece.xdir;
    yellowGamePiece.y += yellowGamePiece.ydir;
    yellowGamePiece.update();

    blueGamePiece.x += blueGamePiece.xdir;
    blueGamePiece.y += blueGamePiece.ydir;
    blueGamePiece.update();

}

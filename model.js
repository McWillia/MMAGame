let model = exports;
let moveList = undefined;
let moveListDef = undefined;

const fs = require('fs');

model.init = function () {
    fs.readFile('movelist.json', function(err, data){
        moveList = JSON.parse(data);
        console.log(moveList);
    });
    fs.readFile('moveListDefence.json', function(err, data){
        moveListDef = JSON.parse(data);
        console.log(moveListDef);
    });
}

model.Game = class {

    constructor(nameIn) {
        // console.log(nameIn);
        this.turn = 0;
        this.player = new model.Fighter(nameIn);
        this.ai = new model.Fighter("Opponent");
    }

    getAI(){return this.ai;}
    getPlayer(){return this.player;}


}

model.Fighter = class {

    constructor (nameIn) {
        this.name = nameIn;
        this.health = 100;
        this.stance = {name: "Neutral", punch:0.45, kick: 0.4}
    }

    getName(){return this.name;}

    getHealth(){return this.health;}

}

model.moveList = function(req, res){
    if (moveList != undefined && moveListDef != undefined) {
        res.data = {"Off":moveList, "Def":moveListDef};
    }
}

model.turn = function (req, res) {
    var gameState = req.query.gameStateIn;
    // console.log(gameState.ai);
    var i = 0;
    var j = 0;
    var found = false;
    var failed = false;
    var movesIn = req.query.off.split(",");
    var movesOut = [];

    ///GET MOVES FROM THE MOVE LIST
    while (j < movesIn.length & !failed ) {
        while (!found && i < moveList.length) {
            // console.log(movesIn[j] + " : " + moveList[i].name);
            if (moveList[i].name == movesIn[j]) {
                found = true;
                movesOut.push(moveList[i]);
            }
            i++;
        }

        if (!found) {
            res.data = "No such move";
            failed = true;
        }
        found = false;
        i=0;
        j++;
    }

    i=0;
    found = false;
    while (!found && i < moveListDef.length) {
        if (moveListDef[i].name == req.query.def) {
            found = true;
            //movesOut.push(moveList[i]);
        }
        i++;
    }


    if (!found) {
        res.data = "No such move";
        failed = true;
    }


    ///If moves were found
    if (!failed) {
        // console.log(gameState.ai);
        var turn = Number(gameState.turn) +  Number(1);
        gameState.turn = turn;
        var damageC = calculateDamage(movesOut, gameState.ai);
        gameState.ai.health -= damageC.dmg;
        res.data = {moves:movesOut, chance:damageC.chance, damage: damageC.dmg, state:gameState};
    }
}
//
// function calculateDodge(movesOut, gameStateIn){
//     var damage=0;
//     var chance=1;
//     var roll;
//     var moveType;
//
//     for (var i = 0; i < movesOut.length; i++) {
//         moveType = movesOut[i].type;
//         roll = Math.random();
//
//         if () {
//
//         }
//         damage -= movesOut[i].damage;
//
//     }
//
//
//
//     //console.log(roll + " : " + chance);
//     if (chance > roll) {
//         return {dmg:damage,chance:roll, gameState: gameStateOut};
//     } else {
//         return {dmg:0,chance:roll};
//     }
//
// }

function calculateDamage(movesOut, ai){
    // console.log(ai);
    var damage=0;
    var chance=1;
    var roll;
    // console.log(ai.stance);

    for (var i = 0; i < movesOut.length; i++) {
        roll = Math.random();
        // console.log(roll + " : " + ai.stance.punch + " : " + ai.stance.kick + " : " + ai.stance[movesOut[i].type]);
        if (roll > ai.stance[movesOut[i].type]) {
            damage += movesOut[i].damage;
        }
        chance *= movesOut[i].chance;
    }

    roll = Math.random();

    // console.log("End: " + roll + " : " + chance);

    if (roll < chance) {
        return {dmg:damage,chance:roll};
    } else {
        return {dmg:0,chance:roll};
    }

}

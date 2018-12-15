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
        this.winner = undefined;
    }

    getAI(){return this.ai;}
    getPlayer(){return this.player;}
    getWinner(){return this.winner;}


}

model.Fighter = class {

    constructor (nameIn) {
        this.name = nameIn;
        this.health = 50;
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
    var i = 0;
    var j = 0;
    var found = false;
    var failed = false;
    var movesIn = req.query.off.split(",");
    var movesOut = [];
    var newDef;

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
            newDef = moveListDef[i];
        }
        i++;
    }

    //Invalid move
    if (!found) {
        res.data = "No such move";
        failed = true;
    }


    ///If moves were found
    if (!failed) {
        //Set Defences
        gameState.player.stance = newDef;

        if (gameState.turn % 3 == 0) {
            gameState.ai.stance = getRandomStance();
        }
        //Increment turn
        var turn = Number(gameState.turn) +  Number(1);
        gameState.turn = turn;

        var aiMoves = getRandomAttacks();

        //Calculate the damage
        var damageOpp = calculateDamage(aiMoves, gameState.player.stance);
        gameState.player.health -= damageOpp.dmg;

        var damagePlayer = calculateDamage(movesOut, gameState.ai.stance);
        gameState.ai.health -= damagePlayer.dmg;

        //Check for winners
        if (gameState.ai.health <= 0) {
            gameState.winner = gameState.player;
        } else if (gameState.player.health <= 0) {
            gameState.winner = gameState.ai;
        }

        //Return data
        res.data = {moves:movesOut, chance:damagePlayer.chance, damage: damagePlayer.dmg, chanceAI:damageOpp.chance, damageAI: damageOpp.dmg, state:gameState};

    }
}

function getRandomStance() {
    var roll = Math.floor(Math.random()*moveListDef.length);
    return moveListDef[roll];
}

function getRandomAttacks() {
    var roll;
    var out = [];

    for (var i = 0; i < Math.ceil(Math.random()*5); i++) {
        out.push(moveList[Math.floor(Math.random()*moveList.length)]);
        console.log(out[i]);
    }
    return out;
}

function calculateDamage(movesOut, stance){
    // console.log(ai);
    var damage=0;
    var chance=1;
    var roll;
    // console.log(ai.stance);

    for (var i = 0; i < movesOut.length; i++) {
        roll = Math.random();
        // console.log(roll + " : " + ai.stance.punch + " : " + ai.stance.kick + " : " + ai.stance[movesOut[i].type]);
        if (roll > stance[movesOut[i].type]) {
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

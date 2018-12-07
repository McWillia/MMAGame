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

model.moveList = function(req, res){
    if (moveList != undefined && moveListDef != undefined) {
        res.data = {"Off":moveList, "Def":moveListDef};
    }
}

model.turn = function(req, res) {
    var i = 0;
    var j = 0;
    var found = false;
    var failed = false;
    var movesIn = req.query.off.split(",");
    var movesOut = [];

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

    if (!failed) {
        var damageC = calculateDamage(movesOut);
        res.data = {moves:movesOut, chance:damageC.chance, damage: damageC.dmg, stance: req.query.def};
    }
}

function calculateDamage(movesOut){
    var damage=0;
    var chance=1;

    for (var i = 0; i < movesOut.length; i++) {
        damage += movesOut[i].damage;
        chance *= movesOut[i].chance;
    }

    var date = new Date();
    var roll = date.getMilliseconds()/1000;

    //console.log(roll + " : " + chance);
    if (chance > roll) {
        return {dmg:damage,chance:roll};
    } else {
        return {dmg:0,chance:roll};
    }

}

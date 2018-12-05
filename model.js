let model = exports;
let moveList = undefined;

const fs = require('fs');

model.init = function () {
    fs.readFile('movelist.json', function(err, data){
        moveList = JSON.parse(data);
        console.log(moveList);
    });
}

model.moveList = function(req, res){
    if (moveList != undefined) {
        res.data = moveList;
    }
}

model.turn = function(req, res) {
    var i = 0;
    var j = 0;
    var found = false;
    var failed = false;
    var movesIn = req.query.name.split(",");
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

    if (!failed) {
        var damageC = calculateDamage(movesOut);
        res.data = {moves:movesOut, damage: damageC};
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
        return damage;
    } else {
        return 0;
    }

}

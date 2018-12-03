let model = exports;
let moveList = undefined;

const fs = require('fs');

model.init = function () {
    fs.readFile('movelist.json', function(err, data){
        moveList = JSON.parse(data);
        console.log(moveList);
    });
}

model.turn = function(req, res) {
    var i = 0;
    var found = false;

    while (!found && i < moveList.length) {
        if (moveList[i].name == req.query.name) {
            found = true;
            res.data = moveList[i];
        }
        i++;
    }

    if (!found) {
        res.data = "No such move";
    }



}

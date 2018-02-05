var game = [3, 4, 5, 2, 1, 6, 8, 7, 0]
var pos = [-1, 1, 0, 0]

var size = 3;

game = shuffle(game);
for (var i = 0; i < size * size; i++) {
    var d = document.getElementById(i + '');
    var num = game[i];
    if (num > 0) {

        d.innerHTML = num;
    }
    else {
        d.innerHTML = '';
    }
}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function myFunction(id) {
    var d = document.getElementById(id);
    if (game[id] > 0) {
        var emptyNeighbour = getEmptyNeighbour(id);
        if (emptyNeighbour > -1) {
            game[emptyNeighbour] = game[id];
            document.getElementById(emptyNeighbour).innerHTML = game[id];
            d.innerHTML = "";
            game[id] = 0;
        }
    }
}

function getEmptyNeighbour(id) {
    var x = id % size;
    var y = Math.floor(id / size);
    for (var i = 0, j = 3; i < 4; i++, j--) {
        var emptyNeighbour = getIfEmpty(x + pos[i], y + pos[j]);
        if (emptyNeighbour > -1) {
            return emptyNeighbour;
        }
    }
    return -1;
}

function getIfEmpty(x, y) {
    if (x >= 0 && x <= size && y >= 0 && y <= size) {
        var neighbourId = y * size + x;
        if (game[neighbourId] == 0) {
            return neighbourId;
        }
    }
    return -1;
}
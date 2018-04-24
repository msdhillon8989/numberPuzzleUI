var game = [
    2,
    8,
    6,
    7,
    1,
    4,
    3,
    5,
    0
];
var pos = [-1, 1, 0, 0];

var size = 3;
var time = 0;

testingAPI();

var data ={};
var interval;
function testingAPI() {
    var key = "Maninder";
    var response = httpGet("http://localhost:8080/game/new", key);
    //game = response.game;
    data = JSON.parse(response);
    game = data.game;
    document.getElementById("game").innerHTML = JSON.stringify(data.game);
    assign();
    interval=setInterval(tickTock, 100);
}
function tickTock()
{
    time  = time+1;
    document.getElementById("time").innerHTML = time+'';
}

function httpGet(theUrl, key) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.setRequestHeader("username", key);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}


//game = shuffle(game);

function assign() {
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
}

/*function shuffle(array) {
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
}*/
var sol = [];

function myFunction(id) {
    var d = document.getElementById(id);
    if (game[id] > 0) {
        var emptyNeighbour = getEmptyNeighbour(id);
        if (emptyNeighbour > -1) {
            sol.push(id);
            game[emptyNeighbour] = game[id];
            document.getElementById("moves").innerHTML = sol.length;
            document.getElementById("solution").innerHTML = sol;
            document.getElementById(emptyNeighbour).innerHTML = game[id];
            d.innerHTML = "";
            game[id] = 0;
            if(id==8)
            {
                if(solved())
                {
                    data.solution = sol;
                    data.seconds=time;
                    postData();
                    clearInterval(interval);
                }
            }
        }
    }
}

function postData()
{

}

function solved()
{
    for(var i =0;i<8;i++)
    {
        if(game[i] != (i+1))
        {
            return false;
        }
    }
    return true;
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
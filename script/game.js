gameApp.controller('gameController', function ($scope, $window,$interval,$http,$location) {

    var realServer = "https://puzzzle-api.herokuapp.com/game";
    var localServer = "http://localhost:8080/game";
    var server = realServer;

    $scope.username = $window.localStorage.getItem('username');
    console.log("usenrmae  "+$scope.username);

    $scope.game = [
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

    $scope.scoreBoard ={};

    var pos = [-1, 1, 0, 0];

    var size = 3;
    $scope.time = 0;

    var data = {};
    var interval;

    if($scope.username === null)
    {
        $location.path('/');
    }
    else{
        getNewGame();
        getScoreBoard();
    }







    function getNewGame() {

        var response = httpGet(server+"/new", $scope.username);
        //game = response.game;

        data = JSON.parse(response);
        $scope.game = Object.assign({}, data.game);
        console.log("game : "+response);


        //assign();
        interval= $interval(function(){
            $scope.time = $scope.time + 1;
        },100);

    }

    function getScoreBoard() {

        var resp = httpGet(server+"/leaderboard", $scope.username);
        //game = response.game;

        $scope.scoreBoard = JSON.parse(resp);

        console.log("leaderboard  : "+resp);
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
        console.log("in assign function");
        for (var i = 0; i < size * size; i++) {
            var d = angular.element(document).find(i + '');
            var num = $scope.game[i];

            if (num > 0) {
                d.innerHTML = num;
            }
            else {
                d.innerHTML = '';
            }
        }
    }


    $scope.sol = [];


    $scope.slide = function (id) {
        console.log("in slide");
        //var d = angular.element(document).find(id);
        //alert(d.innerHTML);
        if ($scope.game[id] > 0) {
            var emptyNeighbour = getEmptyNeighbour(id);
            if (emptyNeighbour > -1) {
                $scope.sol.push(id);

                $scope.game[emptyNeighbour] = $scope.game[id];
               /* angular.element(document).find("moves").innerHTML = sol.length;
                angular.element(document).find("solution").innerHTML = sol;
                angular.element(document).find(emptyNeighbour).innerHTML = game[id];*/
               // d.innerHTML = "";
                $scope.game[id] = 0;
                if (id == 8) {
                    if (solved()) {
                        data.solution = $scope.sol;
                        data.seconds = $scope.time;
                        postData();
                        $interval.cancel(interval);
                    }
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
                if ($scope.game[neighbourId] == 0) {
                    return neighbourId;
                }
            }
            return -1;
        }

        function solved() {
            for (var i = 0; i < 8; i++) {
                if ($scope.game[i] != (i + 1)) {
                    return false;
                }
            }
            return true;
        }

        function postData()
        {
            console.log(JSON.stringify(data));
            var post = $http({
                method: "POST",
                url: server+"/solved",
                dataType: 'json',
                data: data,
                headers: { "Content-Type": "application/json" }
            });

            post.success(function (data, status) {
                $window.alert("Hello: " + JSON.stringify(data) );
            });

            post.error(function (data, status) {
                $window.alert(data.Message);
            });
        }
    };

    $scope.logout = function()
    {
        $window.localStorage.removeItem('username');
        //create a message to display in our view
        $location.path('/');
    }






});








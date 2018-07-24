gameApp.controller('gameController', function ($scope, $window, $interval, $http, $location) {

    var realServer = "https://puzzzle-api.herokuapp.com/game";
    var localServer = "http://localhost:8080/game";
    var server = realServer;

    $scope.username = $window.localStorage.getItem('username');
    console.log("usenrmae  " + $scope.username);
    $scope.finished = false;
    $scope.loading = true;
    $scope.game = [];

    $scope.scoreBoard = {};
    $scope.range = [];
    var pos = [-1, 1, 0, 0];

    $scope.sol = [];
    $scope.level = 3;
    $scope.time = 0;

    var data = {};
    var interval;

    if ($scope.username === null) {
        $location.path('/');
    }
    else {
        getNewGame();
        getScoreBoard();
    }

    var assignGame = function (response) {
        data = response.data;
        console.log(data);
        //data = JSON.parse(data);
        $scope.game = Object.assign({}, data.game);
        $scope.range.length = 0;
        for (var i = 0; i < $scope.level * $scope.level; i++) {
            $scope.range.push(i);
        }
        $scope.loading = false;
        interval = $interval(function () {
            $scope.time = $scope.time + 1;
        }, 100);
        getScoreBoard();
    };

    var warning = function (response) {
        $window.alert(response.data.message);
    };

    function getNewGame() {
        $interval.cancel(interval);
        $scope.time = 0;
        $scope.sol.length = 0;
        $scope.finished = false;

        httpRequest("GET", server + "/" + $scope.level, "", function (response) {
            assignGame(response)
        }, function (response) {
            warning(response)
        });
    }


    function httpRequest(method, url, data, successMethod, failedMethod) {
        var httpRequest = $http({
            method: method,
            url: url,
            data: data,
            dataType: 'json',
            headers: {"Content-Type": "application/json", "username": $scope.username}
        });

        httpRequest.then(function onSuccess(response) {
            successMethod(response);
        });

        httpRequest.catch(function onError(response) {
            failedMethod(response)
        });
    }


    function getScoreBoard() {

        httpRequest("GET", server + "/leaderboard/" + $scope.level, "", function (response) {
            $scope.scoreBoard = response.data
        }, function (response) {
            warning(response)
        });

    }

    $scope.slide = function (id) {
        if (!$scope.finished) {
            if ($scope.game[id] > 0) {
                var emptyNeighbour = getEmptyNeighbour(id);
                if (emptyNeighbour > -1) {
                    $scope.sol.push(id);

                    $scope.game[emptyNeighbour] = $scope.game[id];

                    $scope.game[id] = 0;

                    if (id == ($scope.level * $scope.level - 1)) {
                        if (solved()) {
                            data.solution = $scope.sol;
                            data.timeTaken = $scope.time;
                            postData();
                            $interval.cancel(interval);
                        }
                    }
                }
            }

            function getEmptyNeighbour(id) {
                var x = id % $scope.level;
                var y = Math.floor(id / $scope.level);
                for (var i = 0, j = 3; i < 4; i++, j--) {
                    var emptyNeighbour = getIfEmpty(x + pos[i], y + pos[j]);
                    if (emptyNeighbour > -1) {
                        return emptyNeighbour;
                    }
                }
                return -1;
            }

            function getIfEmpty(x, y) {
                if (x >= 0 && x <= $scope.level && y >= 0 && y <= $scope.level) {
                    var neighbourId = y * $scope.level + x;
                    if ($scope.game[neighbourId] == 0) {
                        return neighbourId;
                    }
                }
                return -1;
            }

            function solved() {
                for (var i = 0; i < $scope.level * $scope.level - 1; i++) {
                    if ($scope.game[i] != (i + 1)) {
                        return false;
                    }
                }
                return true;
            }

            function postData() {
                $scope.finished = true;
                console.log(JSON.stringify(data));
                httpRequest("POST", server + "/solved", data, function (response) {
                    console.log(response.data);
                    getScoreBoard();
                }, function (response) {
                    warning(response)
                });

            }
        }
        else {
            $window.alert("Already solved");
        }
    };


    $scope.updatelevel = function (l) {
        console.log("sasdasd" + l);

        $scope.loading = true;
        $scope.level = l;
        getNewGame();
        getScoreBoard();

    };

    $scope.logout = function () {
        console.log("sasdasd logout");
        $window.localStorage.removeItem('username');
              $location.path('/');

    };

});








gameApp.controller('sudokuController', function ($scope, $window, $interval, $http, $location, $mdDialog) {

    $scope.level = 9;
    $scope.range = [];
    $scope.buttons = [];
    for (var i = 0; i < 10; i++) {
        $scope.buttons.push(i);
    }
    var segment = 3;

    var realServer = "https://puzzzle-api.herokuapp.com/mines";
    var localServer = "http://localhost:8080/sudoku";
    var server = realServer;
    $scope.username = $window.localStorage.getItem('username');


    $scope.object = {};
    $scope.object.game = {};
    $scope.gameOver = false;
    $scope.loading = true;
    var data = {};

    var interval;
    getScoreBoard();
    getNewGame();


    var assignGame = function (response) {
        data = response.data;
        console.log(data);
        $scope.range.length = 0;

        for (var i = 0; i < $scope.level * $scope.level; i++) {
            $scope.range.push(i);

            var button = {};
            button.value = data.game[i];
            button.clicked = false;
            button.class = $scope.getSegmentClass(i);
            $scope.object.game[i] = button;
            if (button.value > 0) {
                button.locked = true;
            }
            else {
                button.locked = false;
            }
        }
        console.log($scope.object);
        $scope.loading = false;
        interval = $interval(function () {
            $scope.time = $scope.time + 1;
        }, 100);
    };

    function gameOver() {
        $scope.gameOver = true;

        var data = {};
        data.title = 'Game Over';
        data.content = 'You have exploded the land mine';
        data.button = 'OK';
        showDialog(data);
    }

    function gameWon() {
        var dialogData = {};
        dialogData.title = 'Success';
        dialogData.content = 'You have found all the land mines' + token;
        dialogData.button = 'OK';
        showDialog(dialogData);
        postData();

    }

    function getScoreBoard() {

        httpRequest("GET", server + "/leaderboard/" + $scope.level, "", function (response) {
            $scope.scoreBoard = response.data
        }, function (response) {
            warning(response)
        });

    }

    function postData() {
        $scope.finished = true;
        data.moves = token;
        data.timeTaken = $scope.time;
        $interval.cancel(interval);
        console.log(JSON.stringify(data));
        httpRequest("POST", server + "/solved", data, function (response) {
            console.log(response.data);
            getScoreBoard();
        }, function (response) {
            warning(response)
        });

    }


    function showDialog(data) {

        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#sudokuGrid')))
                .clickOutsideToClose(true)
                .title(data.title)
                .textContent(data.content)
                .ok(data.button)
        );
    }


    var warning = function (response) {
        $window.alert(response.data.message);
    };

    function getNewGame() {
        $scope.time = 0;
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


    $scope.selectedButton = {};

    $scope.selected = function (num) {
        $scope.selectedButton = $scope.object.game[num];
    };


    $scope.applyNumber = function (num) {
        if (!$scope.selectedButton.locked)
            $scope.selectedButton.value = num;
    };


    $scope.getSegmentClass = function (num) {
        var x = num / $scope.level | 0;
        var y = num % $scope.level | 0;

        var CLASS1 = 'green';
        var CLASS2 = 'blue';

        if (( ((x / segment | 0) % 2) + ((y / segment | 0) % 2) ) === 1) {
            return CLASS1;
        }
        else {
            return CLASS2;
        }
    }

});








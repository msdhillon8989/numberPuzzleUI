gameApp.controller('minesController', function ($scope, $window, $interval, $http, $location,$mdDialog) {

    $scope.level = 20;
    $scope.range = [];
    var segment =1;

    var realServer = "https://puzzzle-api.herokuapp.com/mines";
    var localServer = "http://localhost:8080/mines";
    var server = realServer;
    $scope.username = $window.localStorage.getItem('username');


    $scope.game = {};
    $scope.object = {};
    $scope.object.game = {};
    $scope.gameOver = false;
    $scope.totalButton = 400;
    $scope.loading = true;
    var data = {};
    var token = 2568;
    var interval;
    getScoreBoard();
    getNewGame();


    var assignGame = function (response) {
        data = response.data;
        console.log(data);
        //data = JSON.parse(data);
        //$scope.game = Object.assign({}, data.game);
        $scope.range.length = 0;
        token = 0;
        for (var i = 0; i < $scope.level * $scope.level; i++) {
            $scope.range.push(i);
            token+=i;
            var jsonObject = {};
            var button = {};
            button.value=data.game[i];
            button.clicked = false;
            button.label = button.value;
            if(button.value>0)
            {
                button.class = 'blue';
            }
            else if(button.value<0)
            {
                button.label = "X";
                button.class = 'red';
            }
            else {
                button.class ='gray';
                button.label='';
            }

            jsonObject[i] = button;
            $scope.object.game[i] = button;
           // changeButton(button);

        }
        $scope.loading = false;
        interval = $interval(function () {
            $scope.time = $scope.time + 1;
        }, 100);
    };

    function gameOver() {
        $scope.gameOver =true;

        var data = {};
        data.title = 'Game Over';
        data.content = 'You have exploded the land mine';
        data.button ='OK';
        showDialog(data);
    }

    function gameWon() {
        var dialogData = {};
        dialogData.title = 'Success';
        dialogData.content = 'You have found all the land mines' +token;
        dialogData.button ='OK';
        showDialog(dialogData);
        postData();

    }

    function getScoreBoard() {

        httpRequest("GET", server + "/leaderboard/"+$scope.level , "", function (response) {
            $scope.scoreBoard = response.data
        }, function (response) {
            warning(response)
        });

    }

    function postData() {
        $scope.finished = true;
        data.moves=token;
        data.timeTaken=$scope.time;
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
                .parent(angular.element(document.querySelector('#minesGamePanel')))
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

        httpRequest("GET", server + "/"+$scope.level , "", function (response) {
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



    function explore(num) {
        var x = num/$scope.level | 0;
        var y = num%$scope.level | 0;
        console.log("khali button "+x+" "+y );

        explode(x-1,y-1);
        explode(x,y-1);
        explode(x+1,y-1);

        explode(x-1,y);
        explode(x+1,y);

        explode(x-1,y+1);
        explode(x,y+1);
        explode(x+1,y+1);


    }

    function explode(newx,newy)
    {
        console.log("kholo khali button "  + newx + " "+newy)
        if(newx>=0 && newx<$scope.level &&
            newy>=0 && newy<$scope.level)
        {
            $scope.openTile(newx*$scope.level + newy);
        }
    }

    $scope.openTile = function(num)
    {
        var button  = $scope.object.game[num];

        console.log("button pressed " + num );
        if(!button.clicked)
        {
            button.clicked = true;
            $scope.totalButton--;
            token-=num;
            if($scope.totalButton === $scope.level && $scope.gameOver ===false)
            {
                gameWon();
            }
            if(button.value<0) {
                gameOver();
            }
            if(button.value === 0)
            {
                explore(num);
            }
        }
    };


    $scope.getSegmentClass = function(num)
    {
        var x = num/$scope.level | 0;
        var y = num%$scope.level | 0;

        var CLASS1 = 'green';
        var CLASS2 = 'blue';

        if( ( ((x/segment | 0)%2) + ((y/segment | 0)%2) )=== 1)
        {
            return CLASS1;
        }
        else {
            return CLASS2;
        }
    }

});








// create the controller and inject Angular's $scope
gameApp.controller('mainController', function ($scope, $location, $window) {

    var username = $window.localStorage.getItem('username');
    if (username) {
        $location.path('/dashboard');
    }

    $scope.play = function () {

        $window.localStorage.setItem('username', $scope.username)
        //create a message to display in our view
        $location.path('/dashboard');

    }
});
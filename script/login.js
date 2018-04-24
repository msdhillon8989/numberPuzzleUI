// create the controller and inject Angular's $scope
gameApp.controller('mainController', function($scope,$location,$window) {
    $scope.play = function() {
        $window.localStorage.setItem('username',$scope.username)
        //create a message to display in our view
        $location.path('/game');

    }
});
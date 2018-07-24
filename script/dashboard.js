// create the controller and inject Angular's $scope
gameApp.controller('dashboardController', function ($scope, $location, $window) {

    $scope.username = $window.localStorage.getItem('username');
    if ($scope.username == null) {
        $location.path('/login');
    }

    $scope.gotoPage = function (location) {
        $location.path('/'+location);
    }
});
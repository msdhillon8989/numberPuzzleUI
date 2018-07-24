// create the module and name it scotchApp
var gameApp = angular.module('gameApp', ['ngRoute','ngMaterial']);

// configure our routes
gameApp.config(function($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/dashboard', {
            templateUrl : 'pages/dashboard.html',
            controller  : 'dashboardController'
        })
        .when('/mines', {
            templateUrl : 'pages/mines.html',
            controller  : 'minesController'
        })
        .when('/', {
            templateUrl : 'pages/login.html',
            controller  : 'mainController'
        })
        // route for the about page
        .when('/game', {
            templateUrl : 'pages/app.html',
            controller  : 'gameController'
        })
       ;
});

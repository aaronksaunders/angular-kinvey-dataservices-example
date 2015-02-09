/**
 * @see - https://egghead.io/lessons/angularjs-http
 */
var app = angular.module('kinveyRestAPIApp', ['ui.router', 'ngResource', 'appServices', 'appControllers']);

app.run(['$rootScope', '$state', function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError',
        function (event, toState, toParams, fromState, fromParams, error) {
            console.log('$stateChangeError ' + error.error);
            if (error && error.error === "noUser") {
                $state.go('login', {});
            }
        });
}]);
app.config(function ($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/login");

    // Now set up the states
    $stateProvider
        .state('main', {
            url: "/main",
            templateUrl: "views/main.html",
            controller: "SimpleRESTAPIController",
            resolve: {
                user: ['AuthenticationService', function (AuthenticationService) {
                    return AuthenticationService.currentUser();
                }]
            }
        })
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: "LoginController"
        });
});

app.value("KINVEY", {
    "auth": "YOUR VALUES",
    "appUrl": "https://baas.kinvey.com/appdata/kid_-JeiCLZM5/",
    "baseUrl": "https://baas.kinvey.com/appdata/kid_-JeiCLZM5/",
    "appId" : "kid_-JeiCLZM5",
    "appSecret" : "YOUR VALUES"
});
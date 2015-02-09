angular.module('appControllers', [])
/**
 * beginnings of a controller to login to system
 * here for the purpose of showing how a service might
 * be used in an application
 */
    .controller('LoginController', [
        '$state', '$scope', 'AuthenticationService',  // <-- controller dependencies
        function ($state, $scope, AuthenticationService) {

            // ng-model holding values from view/html
            $scope.creds = {
                username: "test",
                password: "test"
            };

            /**
             *
             */
            $scope.doLogoutAction = function () {
                AuthenticationService.logout()
                    .then(function (_response) {
                        if (_response.status) {
                            alert(_response.data.description);
                        } else {
                            alert("logout success " + _response);

                            // transition to next state
                            $state.go('login');

                        }
                    }).catch(function (_error) {
                        alert("error logging in");
                    })
            };

            /**
             *
             */
            $scope.doLoginAction = function () {
                AuthenticationService.login($scope.creds.username, $scope.creds.password)
                    .then(function (_response) {
                        if (_response.status) {
                            alert(_response.data.description);
                        } else {
                            alert("login success " + _response.username);

                            // transition to next state
                            $state.go('main');

                        }
                    }).catch(function (_error) {
                        alert("error logging in");
                    })
            };
        }])

/**
 * this controller has a dependency on 'SimpleRESTAPIService' which is how we interact
 * with the API through the service. This is a good pattern to seperate out the
 * API interaction from the controller
 */
    .controller('SimpleRESTAPIController', ['$scope', 'MemberService', function ($scope, MemberService) {


        $scope.getData = {};
        $scope.putData = {};
        $scope.postData = {};
        $scope.deleteData = {};
        $scope.response = {};

        function genericErrorHandler(_error) {
            console.log(_error.data);
            $scope.response = _error.data;
        }

        /**
         *
         * @param $scope
         */
        $scope.doList = function () {
            // specific helper classes for the HTTP VERBS
            MemberService.query()
                .$promise.then(function (_response) {
                    $scope.response = _response;
                }).catch(genericErrorHandler);
        };


        /**
         *
         * @param $scope
         */
        $scope.doGet = function () {

            if (!$scope.getData.id) {
                $scope.doList();
                return;
            }

            MemberService.get({_id: $scope.getData.id})
                .$promise.then(function (_response) {
                    $scope.response = _response;
                }).catch(genericErrorHandler);

        };


        /**
         *
         * @param $scope
         */
        $scope.doPost = function () {

            MemberService.save(JSON.parse($scope.postData.json))
                .$promise.then(function (_response) {
                    $scope.response = _response;
                }).catch(genericErrorHandler);
        };

        /**
         *
         * @param $scope
         */
        $scope.doPut = function () {

            var objectData = JSON.parse($scope.putData.json);
            objectData._id = $scope.putData.id;

            MemberService.update(objectData)
                .$promise.then(function (_response) {
                    $scope.response = _response;
                }).catch(genericErrorHandler);

        };


        /**
         *
         * @param $scope
         */
        $scope.doDelete = function () {

            MemberService.remove({_id: $scope.deleteData.id})
                .$promise.then(function (_response) {
                    $scope.response = _response;
                }).catch(genericErrorHandler);
        };
    }])
/**
 *
 * ============= OLD DEPRECATED NOT IN USE ===========
 *
 * Old controller for the application using $http directly in the controller
 * and no service. This can work, but is not a good pattern for an application
 *
 * ============= OLD DEPRECATED NOT IN USE ===========
 */
    .controller('KinveyRestAPICtrl_HTTP', ['$scope', '$http', 'KINVEY', function ($scope, $http, KINVEY) {

        $scope.getData = {};
        $scope.putData = {};
        $scope.postData = {};
        $scope.deleteData = {};
        $scope.response = {};

        var baseURL = KINVEY.appUrl + "users/";


        $scope.doDelete = function () {
            var id = "";

            id = $scope.deleteData.id;

            //
            // delete a specific user
            // https://baas.kinvey.com/appdata/kid_-JeiCLZM5/users/{id}
            $http.delete(baseURL + id, {
                headers: {
                    Authorization: KINVEY.auth
                }
            })
                .success(function (data) {
                    $scope.response = data;
                })
                .error(function (data) {
                    $scope.response = data;
                })
        };


        $scope.doGet = function () {
            var id = "";

            // see if an id was specified, if so, use it for the query
            if ($scope.getData.id) {
                id = $scope.getData.id;
            } else {
                id = "";
            }

            //
            // return all users
            // https://baas.kinvey.com/appdata/kid_-JeiCLZM5/users/
            //
            // get a specific user
            // https://baas.kinvey.com/appdata/kid_-JeiCLZM5/users/{id}
            $http.get(baseURL + id, {
                headers: {
                    Authorization: KINVEY.auth
                }
            })
                .success(function (data) {
                    $scope.response = data;
                })
                .error(function (data) {
                    $scope.response = data;
                })
        };


        $scope.doPost = function () {

            function aSuccessFunction(_responseFromServer) {
                $scope.response = _responseFromServer;
            }

            //
            // save the object, all data is passed as the BODY of  the POST
            // https://baas.kinvey.com/appdata/kid_-JeiCLZM5/users/
            //
            $http.post(baseURL, $scope.postData.data, {
                headers: {
                    Authorization: KINVEY.auth
                }
            })
                .success(aSuccessFunction)
                .error(function (data) {
                    $scope.response = data;
                })
        };


        $scope.doPut = function () {
            var id = "";

            // see if an id was specified, if so, use it for the query
            if ($scope.putData.id) {
                id = $scope.putData.id;
            } else {
                id = "";
            }

            //
            // save the object, all data is passed as the BODY of  the POST
            // https://baas.kinvey.com/appdata/kid_-JeiCLZM5/users/
            //
            $http.put(baseURL + id, $scope.putData.data, {
                headers: {
                    Authorization: KINVEY.auth
                }
            })
                .success(function (data) {
                    $scope.response = data;
                })
                .error(function (data) {
                    $scope.response = data;
                })
        };

    }]);
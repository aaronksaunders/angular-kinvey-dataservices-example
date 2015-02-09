angular.module('appServices', [])

    .factory('Base64', function () {
        var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';
        return {
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };
    })
/**
 *
 */
    .factory('AuthenticationService', ['$resource', 'KINVEY', 'Base64', '$q', '$window',
        function ($resource, KINVEY, Base64, $q, $window) {

            var currentUserObject = $window.localStorage.getItem('user') || null;
            if (currentUserObject !== null) {
                currentUserObject = JSON.parse(currentUserObject);
            }

            var authValue = {
                Authorization: 'Basic '
                + Base64.encode(KINVEY.appId +':' + KINVEY.appSecret)
            };

            // Define the User resource that we will use in this service
            var User = $resource("https://baas.kinvey.com/user/:appId/:action", {}, {
                login: {
                    params: {
                        appId :KINVEY.appId,
                        action: 'login'
                    },
                    method: 'POST',
                    headers: authValue
                }
            });


            /**
             * logs the user into kinvey
             *
             * @param _username
             * @param _password
             * @private
             */
            function _login(_username, _password) {


                return User.login({
                        username: _username,
                        password: _password
                    }
                ).$promise.then(function (_response) {
                        console.debug("User Data " + JSON.stringify(_response));

                        currentUserObject = _response;

                        $window.localStorage.setItem('user', JSON.stringify(currentUserObject));

                        return _response;

                    }).catch(function (_error) {
                        console.debug(_error);
                        return _error;
                    });

            }

            /**
             *
             * @returns {*}
             * @private
             */
            function _logout() {

                // Define the User resource that we will use in this service
                var User = $resource("https://baas.kinvey.com/user/:appId/:action", {}, {
                    logout: {
                        params: {
                            appId :KINVEY.appId,
                            action: '_logout'
                        },
                        method: 'POST',
                        headers: {
                            Authorization: 'Kinvey ' + currentUserObject._kmd.authtoken
                        }
                    }
                });
                return User.logout().$promise.then(function (_response) {
                    currentUserObject = null;
                    console.debug("user successfully logged out");
                    return _response;

                }).catch(function (_error) {
                    console.debug(_error);
                    return _error;
                });
            }

            /**
             * gets the current user object that was saved when the user
             * logged into the system. Returns a promise which will resolve
             * to the current user
             *
             * @returns {*}
             * @private
             */
            function _currentUser() {
                var result;
                if (currentUserObject) {
                    result = $q.when(currentUserObject);
                } else {
                    result = $q.reject({"error" : "noUser"});
                }
                return result;
            }

            // this is the set of functions that this
            // service supports
            return {
                login: _login,
                logout: _logout,
                currentUser: _currentUser
            };
        }])
/**
 * this factory wraps the use of angular-resource for interacting with the Kinvey
 * models we have created.
 * The factory also introduces the use of promises to handle the asynchronous http
 * requests.
 *
 * @see doc - https://docs.angularjs.org/api/ngResource/service/$resource
 * @see doc - $q - promises in angular - https://docs.angularjs.org/api/ng/service/$q
 */
    .factory('MemberService', ['$resource', 'KINVEY', function ($resource, KINVEY) {

        /**
         */
        function genericErrorHandler(_error) {
            console.log(_error.data);
            $scope.response = _error.data;
        }

        var reqHeaders = {
            'Authorization': KINVEY.auth
        };

        var Member = $resource(KINVEY.baseUrl + "members/:_id", {},
            {
                // headers are passed in as javascript name/value pairs
                'query': {
                    headers: reqHeaders,
                    isArray: true
                },
                'save': {
                    method: 'POST',
                    headers: reqHeaders
                },
                'get': {
                    headers: reqHeaders
                },
                'update': {
                    method: 'PUT',
                    params: {_id: "@_id"},
                    headers: reqHeaders
                },
                'remove': {
                    method: 'DELETE',
                    headers: reqHeaders
                }
            });

        return Member;
    }]);
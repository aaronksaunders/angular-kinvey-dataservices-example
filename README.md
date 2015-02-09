AngularJS $http & ngResource Example w/Kinvey
===========
Example code demonstrating the use of Angular [$http](https://docs.angularjs.org/api/ng/service/$http) and [ngResource](https://docs.angularjs.org/api/ngResource) as options to connect with a rest based API. In this example, the REST based API in [Kinvey](http://www.kinvey.com).

The example also demostrates createing the login process an securing routes based on the user login state.

This is based on a pen created at CodePen.io. You can find this one at http://codepen.io/aaronksaunders/pen/XJaJmr.

For this sample to work, you must create an account kn Kinvey and update the constants declared in the `app.js` file.

```JavaScript
app.value("KINVEY", {
    "auth": "YOUR BASIC AUTH VALUES",
    "appUrl": "https://baas.kinvey.com/appdata/YOUR APP ID/",
    "baseUrl": "https://baas.kinvey.com/appdata/YOUR APP ID/",
    "appId" : "YOUR APP ID",
    "appSecret" : "YOUR APP SECRET VALUE"
});
```
###Screenshots
------------
Login Screen
![Login Screen](https://raw.githubusercontent.com/aaronksaunders/angular-kinvey-dataservices-example/master/Screenshots/Login%20Screen.png)


Manage Data With HTTP Verbs
![Manage Data With HTTP Verbs](https://raw.githubusercontent.com/aaronksaunders/angular-kinvey-dataservices-example/master/Screenshots/CRUD%20Screen.png)
 
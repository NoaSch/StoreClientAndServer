let app = angular.module('myApp', ['ngCookies','ngRoute','ngSanitize','LocalStorageModule','ui.bootstrap.modal']);
//-------------------------------------------------------------------------------------------------------------------

app.controller('mainController', ['$http','UserService','cookiesService', '$location', '$window','cartService','carService','ProductModel','$scope', function ($http,UserService, cookiesService,$location, $window,cartService,carService,ProductModel,$scope ) {
    let self = this;
    self.userService = UserService;
    self.cookiesService=cookiesService;
    var userid=cookiesService.getCookie('user-id');
    var pass;
    pass = cookiesService.getCookie('user-pass');
    var last=cookiesService.getCookie('user-lastVisit');

    if (userid && pass) {
        var req = {
            method: 'POST',
            url: 'http://localhost:4000/Login',
            headers: {
                'Content-Type': "application/json"
            },
            data: {
                "username": userid,
                "password": pass
            }
        }
        $http(req).then(function (ans) {
            var res = ans.data;
            if (Object.values(res)[0] === "Fail User Name") {
            }
            else if (Object.values(res)[0] === "Fail Password"){


            }
            else{
                ///cookies
                UserService.notLoggedIn = false;
                UserService.userId = userid;
                UserService.lastLogin = last;
                cookiesService.setNewLoginDate();
                UserService.token=Object.values(res)[0];
                // $window.location.href = '/#/';
            }
            $http.get('/GetNewCars')
                .then(function (response) {
                    self.newCars = response.data;
                    $http.get('/GetPopularCars')
                        .then(function (response) {
                            self.popCars = response.data;
                        }, function (errResponse) {
                            console.error('Error while fetching pop1');
                        });

                }, function (errResponse) {
                    console.error('Error while fetching new1');
                });
        });
    }
    else{
        $http.get('/GetNewCars')
            .then(function (response) {
                self.newCars = response.data;
                $http.get('/GetPopularCars')
                    .then(function (response) {
                        self.popCars = response.data;
                    }, function (errResponse) {
                        console.error('Error while fetching populars');
                    });

            }, function (errResponse) {
                console.error('Error while fetching new');
            });

    }

    self.getCarDetails = function (prodID) {
        self.url = "http://localhost:4000/GetCarDetailsByID/" + prodID;
        $http.get(self.url).then(function (response) {
            self.carDetails = response.data;

        }, function (errResponse) {
            console.error('Error while fetching car details');
        });

    };

    self.addToCart = function (prodID) {
        self.url = "http://localhost:4000/GetCarDetailsByID/" + prodID;
        $http.get(self.url).then(function (response) {
            self.carDetails = response.data[0];
            //console.log( self.carDetails);
            cartService.addToCart(new ProductModel(self.carDetails))
        }, function (errResponse) {
            console.error('Error while adding cart');
        });

    };
    self.buyCar = function (prodID) {
        buyService.buyCar(prodID);
    };

    $scope.open = function (carID) {
        self.getCarDetails(carID);
        $scope.showModal = true;
    };

    $scope.ok = function () {
        $scope.showModal = false;
    };

    $scope.cancel = function () {
        $scope.showModal = false;
    };

}]);

//});




//-------------------------------------------------------------------------------------------------------------------
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);
app.config( ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "views/home.html",
            controller : "mainController"
        })
        .when("/login", {
            templateUrl : "views/login.html",
            controller : "loginController"
        })
        .when("/register", {
            templateUrl : "views/register.html",
            controller : "registerController"
        })
        .when("/cities", {
            templateUrl : "views/cities.html",
            controller: 'citiesController'
        })
        .when("/products", {
            templateUrl : "views/products.html",
            controller: 'storeCtrl'
        })
        .when("/about", {
            templateUrl : "views/about.html",
            controller: 'aboutCtrl'
        })
        .when("/cart", {
            templateUrl : "views/cart.html"
        })
        .otherwise({redirect: '/',
        });
}]);
//-------------------------------------------------------------------------------------------------------------------


var users = [];

/**
 * Created by Lera on 31/07/2017.
 */

angular.module("myApp")
    .controller('storeCtrl', function (ProductModel, restService, $rootScope, cartService,UserService,$http,$scope) {
        var vm = this;
        vm.userService = UserService;
        vm.products = [];
        vm.fieldToOrderBy = "Id";
        vm.reverseSort = false;
        vm.filterBy = "";
        vm.selectedCategory = "";
        vm.hideBtn = false;
        // vm.cart = new cartFactory();

        // cartFactory.initialize();

        $http.get('/GetAllCategories')
            .then(function (response) {
                vm.categories = response.data;
                if (!vm.userService.notLoggedIn) {
                    var req = {
                        method: 'POST',
                        url: '/GetRecommends',
                        headers: {
                            'Content-Type': "application/json"
                        },
                        data: {
                            "username": UserService.userId,
                            "token": UserService.token
                        }
                    }
                    $http(req)
                        .then(function (res) {
                            vm.recommendsCars = res.data;
                        }, function (errResponse) {
                            console.error('Error while fetching rec');
                        });
                }
            }, function (errResponse) {
                console.error('Error while fetching categories');
            });

        vm.addToCart = function (prodID) {
            vm.url = "http://localhost:4000/GetCarDetailsByID/" + prodID;
            $http.get(vm.url).then(function (response) {
                vm.carDetails = response.data[0];
                cartService.addToCart(new ProductModel(vm.carDetails))
            }, function (errResponse) {
                console.error('Error while adding to cart');
            });

        };

        vm.getAllProducts = function () {
            var reqUrl = "http://localhost:4000/GetAllCars";
            var ans = restService.Get(reqUrl, function (response) {
                vm.products = [];
                //get details
                angular.forEach(response, function (product) {
                    vm.products.push(new ProductModel(product));
                })
            });
            vm.hideBtn = true;
        }

        vm.addCart = function (product) {
            cartService.addToCart(product);
        }

        vm.getCarDetails = function (prodID) {
            vm.url = "http://localhost:4000/GetCarDetailsByID/" + prodID;
            $http.get(vm.url).then(function (response) {
                vm.carDetails = response.data;

            }, function (errResponse) {
                console.error('Error');
            });

        }
        $scope.open = function(carID) {
            vm  .getCarDetails(carID);
            $scope.showModal = true;
        };

        $scope.ok = function() {
            $scope.showModal = false;
        };

        $scope.cancel = function() {
            $scope.showModal = false;
        };



    });
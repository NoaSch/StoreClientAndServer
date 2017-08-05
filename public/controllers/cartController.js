/**
 * Created by Lera on 31/07/2017.
 */
angular.module("myApp")
    .controller('cartController', function (ProductModel, $rootScope,UserService, cartService, $scope,$http) {
        var vm = this;
        // vm.cart = new cartFactory();
        vm.fieldToOrderBy = "UnitPrice";
        vm.orderpressed=false;
        vm.reverseSort = false;
        vm.cart= [];


        vm.removeFromCart = function (product) {
            cartService.removeFromCart(product);
            vm.calculateTotal();
        }

        vm.calculateTotal = function () {
            var cart = cartService.getCart();
            vm.cart = cart[0];
            vm.totalItems = 0;
            vm.totalPrice = 0;
            for (i=0; i< vm.cart.length; i++) {
                vm.totalItems += vm.cart[i].quantity;
                vm.totalPrice += vm.cart[i].quantity * vm.cart[i].theItem.UnitPrice;
            }
        }
        vm.calculateTotal();
        vm.getPrevOrders = function () {
            vm.orderpressed=true;
            var req = {
                method: 'POST',
                url: 'http://localhost:4000/getPrevOrders',
                headers: {
                    'Content-Type': "application/json"
                },
                data: {
                    "username": UserService.userId,
                    "token": UserService.token
                }
            }
            $http(req).then(function (ans) {
                vm.prevOrders = ans.data;
            }, function (errResponse) {
                console.error('Error get prevs');
            });

        }

        vm.getCarDetails = function (prodID) {
            vm.url = "http://localhost:4000/GetCarDetailsByID/" + prodID;
            $http.get(vm.url).then(function (response) {
                vm.carDetails = response.data;

            }, function (errResponse) {
                console.error('Error get details');
            });

        }
        vm.getOrderDet = function (orderid) {
            var req = {
                method: 'POST',
                url: 'http://localhost:4000/getOrderDetails',
                headers: {
                    'Content-Type': "application/json"
                },
                data: {
                    "OrderID": orderid
                }
            }
            $http(req).then(function (res) {
                vm.orderDetails = res.data;
            }, function (errResponse) {
                console.error('Error get order det');
            });

        }

        vm.getCarsInOrder = function (orderid) {
            var req = {
                method: 'POST',
                url: 'http://localhost:4000/getCarsInOrder',
                headers: {
                    'Content-Type': "application/json"
                },
                data: {
                    "OrderID": orderid
                }
            }
            $http(req).then(function (res) {
                vm.carsInOrder = res.data;
            }, function (errResponse) {
                console.error('Error get order det');
            });

        }



        $scope.open = function (carID) {
            vm.getCarDetails(carID);
            $scope.showModal = true;
        };
        $scope.ok = function () {
            $scope.showModal = false;
        };

        $scope.cancel = function () {
            $scope.showModal = false;
        };

        $scope.openOrdersModal = function (orderId) {
            vm.getOrderDet(orderId);
            $scope.showModalOrders = true;
        };

        $scope.okOrdersModal = function () {
            $scope.showModalOrders = false;
        };

        $scope.cancelOrdersModal = function () {
            $scope.showModalOrders = false;
        };
        //carsInORders
        $scope.openCarsModal = function (orderId) {
            vm.getCarsInOrder(orderId);
            $scope.showModalCars = true;
        };

        $scope.okCarsModal = function () {
            $scope.showModalCars = false;
        };

        $scope.cancelCarsModal = function () {
            $scope.showModalCars = false;
        };
    });

/**
 * Created by NOA-PC on 6/23/2017.
 */

angular.module('myApp')
    .service('buyService', buyService);

buyService.$inject = ['$http'];

function buyService ($http) {

        this.buyCar = function (units, prodID) {
            var req1 = {
                method: 'POST',
                url: 'http://localhost:4000/CheckIsInStock',
                headers: {
                    'Content-Type': "application/json"
                },
                data: {
                    "CarSeriesID": prodID,
                    "Units": units
                }
            }
            $http(req1).then(function (response) {
                var res = response.data;
                Object.keys(res)[0] == "True" ? sayHello($http,prodID) :sayBye();

            }, function (errResponse) {
                console.error('Error while fetching notes');
            });

        };
    //};
}

function sayHello($http,prodID) {
    var req2 = {
        method: 'POST',
        url: 'http://localhost:4000/BuyOneCar',
        headers: {
            'Content-Type': "application/json"
        },
        data: {
            "carSeriesID": prodID,
            "username": "UserOne",
            "totalPrice": 1500000,
            "currency": "NIS",
            "deliveryDate": "2018-01-11"
        }
    }
    $http(req2).then(function (response) {
        var res = response.data;
        console.error('success');
    }, function (errResponse) {
        console.error('Error while fetching notes');
    });

};

function sayBye() {
    console.error('bye');
};


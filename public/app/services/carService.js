/**
 * Created by NOA-PC on 6/24/2017.
 */
angular.module('myApp')
    .service('carService', carService);

carService.$inject = ['$http'];

function carService ($http) {

    this.getDetails = function (prodID) {
        this.url = "http://localhost:4000/GetCarDetailsByID/" + prodID;
            $http.get(this.url).then(function (response) {
                return response.data;
                //herar need a modal
            }, function (errResponse) {
                console.error('Error while getDetails');
            });

    };
    //};
}
angular.module('myApp')
    .service('cartService', cartService);

function cartService(localStorageService, $rootScope,$window) {

    var Cart = [];
    if(localStorageService.isSupported) {
        Cart = localStorageService.get('cart');
        if (!Cart) {
            Cart = [];
            localStorageService.set('cart', Cart);
        }

    }

    cartService.addToCart = function (item) {
        Cart = localStorageService.get('cart');
        if (!Cart) {
            Cart = [];
            localStorageService.set('cart', Cart);
        }
        pushItem(Cart, item);
        localStorageService.set('cart', Cart);
        $window.alert('Car was added');

    }
    cartService.removeFromCart = function (item) {
        var foundAt = -1;
        for (i=0; i< Cart.length; i++) {
            if (item.CarSeriesID == Cart[i].CarSeriesID) {
                foundAt = i;
                break;
            }
        }
        if (foundAt != -1) {
            if (Cart[foundAt].quantity > 1) {
                Cart[foundAt].quantity --;
            }
            else {
                Cart.splice(foundAt, 1);
            }
            localStorageService.set('cart', Cart);
        }

    }


    cartService.getCart = function() {
        var cart = localStorageService.get('cart');
        if (!cart) {
            cart = [];
        }
        return new Array(cart);
    }


    cartService.deleteCart = function () {
        Cart = [];
        localStorageService.remove('cart');

    }

    return cartService;
}

function pushItem(list, item) {
    var foundAt = -1;
    for (i=0; i<list.length; i++) {
        if (item.CarSeriesID == list[i].CarSeriesID) {
            foundAt = i;
            break;
        }
    }
    if (foundAt == -1) {
        list.push({CarSeriesID: item.CarSeriesID, theItem: item, quantity: 1, UnitPrice:item.PriceNIS});
    }
    else {
        list[foundAt].quantity ++;
    }
}

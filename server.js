
var DButils = require('./DButils');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var express = require('express');
var bodyParser = require('body-parser');
var squel = require("squel");
var moment = require('moment');
var boolParser = require('express-query-boolean');
var passwordValidator = require('password-validator');

var schema = new passwordValidator();
schema
    .is().min(5)                                    // Minimum length 8 
    .is().max(10)                                  // Maximum length 100 
    .has().digits()                                 // Must have digits 
    .has().letters();                          // Should not have spaces 
//var validatorPass = new ValidatePassword(options);

//var validate = require("validate.js");
var validator = require('validator');
var expressValidator = require('express-validator');

var app = express();
//var Connection = require('tedious').Connection;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());


app.use(express.static(__dirname + '/public'));
//-------------------------------------------------------------------------------------------------------------------

app.locals.users = {};


var port = 4000;
app.listen(port, function () {
    console.log('listening to port: ' + port);
});


var config = {
    userName: 'ec',
    password: 'Admin1234',
    server: 'ec-server.database.windows.net',
    options: {
        encrypt: true,
        rowCollectionOnDone: true,
        database: 'EC_DB'
    }
}
var connection = new Connection(config);
var connection2 = new Connection(config);
var connection3 = new Connection(config);
var connection4 = new Connection(config);
var connection5 = new Connection(config);
var connectionsList = [];
for (var j = 0; j < 10; j++) {

    connectionsList.push(new Connection(config));

}

console.log("connected");

connection.on('connect', function (err) {
    if (err) {
        console.log(err)
    }
    else {
        //-------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------
        //chek if the user's password is correct so he can login to the system
        app.post('/Login', function (req, res) {
            var _username = req.body.username;
            var _password = req.body.password;
            var ckeckQuery = (
                squel.select()
                    .from("Users")
                    .where("username = ?", _username)
                    .toString()
            );
            //check if the user exist
            DButils.Select(connection2, ckeckQuery, function (result) {
                if (result.length === 0) {
                    res.send(JSON.stringify({ "Result": "Fail User Name"}));
                    // res.send(JSON.stringify({ "Failed": " the username  is Not exist" }));
                }
                else {
                    var query = (
                        squel.select()
                            .from("Users")
                            .where("username = ?", _username)
                            .where("password = ?", _password)
                            .toString()
                    );
                    //return the result
                    DButils.Select(connection5, query, function (result) {
                        if (result.length === 0) {
                            var token="";
                            res.send(JSON.stringify({ "Result": "Fail Password"}));

                        }
                        else {
                            var token="";
                            if(_username in app.locals.users)
                            {
                                token = app.locals.users[_username];
                            }
                            else{
                                token = Math.floor(Math.random() * 1000000) + 1;
                                app.locals.users[_username]=token;
                            }
                            res.send(JSON.stringify({ "Result": token}));
                        }
                    });
                }
            });
        });

        //Get the List of the current Inventory
        app.get('/GetAllCars', function (req, res) {
            var query = "SELECT * FROM Cars ORDER BY Category DESC";
            DButils.Select(connection, query, function (result) {
                res.send(result);
            });
        });


        //Get all cars ordered By Category
        app.get('/GetListCarsOrderedByCategory', function (req, res) {
            var query = (
                squel.select()
                    .field("CarSeriesId")
                    .field("Category")
                    .from("Cars")
                    .order("Category")
                    .toString()
            );
            DButils.Select(connection, query, function (result) {
                res.send(result);
            });
        });

        //Add new user to the system
        //Add new user to the system
        app.post('/Register', function (req, res) {
            var _username = req.body.username;
            var _password = req.body.password;
            var _FirstName = req.body.FirstName;
            var _LastName = req.body.LastName;
            var _Email = req.body.Email;
            var _Address = req.body.Address;
            var _Country = req.body.Country;
            var _Q1 = req.body.Q1;
            var _Ans1 = req.body.Ans1;
            var _Q2 = req.body.Q2;
            var _Ans2 = req.body.Ans2;
            var _Telephone = req.body.Telephone;
            var _CardNo = req.body.CreditCardNumber;
            var EmailVal = validator.isEmail(_Email);
            var options = { min: 3, max: 8 };
            var args = validator.isByteLength(_username, options);
            var optionsPas = { min: 5, max: 10 };
            var argsPass = validator.isByteLength(_password, optionsPas);
            var isLetters = validator.isAlpha(_username);
            var isLettersOrNum = validator.isAlphanumeric(_password);
            var passValied = schema.validate(_password);
            var counter;
            var length = req.body.Categories.length;

            //validate the username length
            if (!(args)) {
                res.send(JSON.stringify({ "Result": "The length of the user Name should be between 3-8 chars" }));
            }
            //validate the password
            else if (!(argsPass)) {
                res.send(JSON.stringify({ "Result": "The length of the Password should be between 5-10 chars" }));
            }
            //validate aplhanumneric value
            else if (!(isLetters)) {
                res.send(JSON.stringify({
                    "Result": "The User Name should Contains only letters"
                }));
            }
            else if (!(isLettersOrNum) || !(passValied)) {
                res.send(JSON.stringify({ "Result": " The password should contain only a combination of letters and numbers" }));
            }
            else if (!(EmailVal)) {
                res.send(JSON.stringify({ "Result": "The Email not Valid" }));

            }

            else {
                //check if the username is already taken
                var query = (
                    squel.select()
                        .from("Users")
                        .where("username = ?", _username)
                        .toString()
                );
                DButils.Select(connection, query, function (result) {
                    if (result.length > 0) {
                        res.send(JSON.stringify({ "Result": "Username already exists" }));
                    }
                    else {


                        var query2 = (
                            squel.insert()
                                .into("Users")
                                .set("username", _username)
                                .set("password", _password)
                                .set("FirstName", _FirstName)
                                .set("LastName", _LastName)
                                .set("Email", _Email)
                                .set("Address", _Address)
                                .set("Country", _Country)
                                .set("Q1", _Q1)
                                .set("Ans1", _Ans1)
                                .set("Q2", _Q2)
                                .set("Ans2", _Ans2)
                                .set("Telephone", _Telephone)
                                .set("CreditCardNumber", _CardNo)
                                .set("IsAdmin", 0) //set is admin to false
                                .toString()
                        );
                        DButils.Insert(connection2, query2, function (result) {
                            if (result) {
                                res.send(result);
                            }


                        });

                        //set the user's categories
                        for (var i = 0; i < length; i++) {
                            var x = req.body.Categories[i];
                            var query3 = (
                                squel.insert()
                                    .into("UsersCategories")
                                    .set("username", _username)
                                    .set("Category", x)
                                    .toString()
                            );
                            DButils.Insert(connectionsList[i], query3, function (result) {
                            });
                        }
                    }

                });
            }
        });

        //sent the user his authentication questions
        app.post('/ForgetPassword', function (req, res) {
            var _username = req.body.username;
            var query = (
                squel.select()
                    .field("Q1")
                    .field("Q2")
                    .from("Users")
                    .where("username = ?", _username)
                    .toString()
            );
            DButils.Select(connection, query, function (result) {
                res.send(result);
            });
        });



        //Send th user's password if the answers of the authentication questions match to the DB'
        app.post('/RestorePassword', function (req, res) {
            var _username = req.body.username;
            var _ans1 = req.body.Ans1;
            var _ans2 = req.body.Ans2;
            var query = (
                squel.select()
                    .field("Ans1")
                    .field("Ans2")
                    .field("password")
                    .from("Users")
                    .where("username = ?", _username)
                    .toString()
            );
            DButils.Select(connection, query, function (result) {
                if (((result[0].Ans1) === _ans1) && ((result[0].Ans2) === _ans2)) {
                    res.send(JSON.stringify({ "password": result[0].password }));
                }
                else {
                    res.send(JSON.stringify({ "Faild": "The Restore Password Faild" }));

                }
            });
        });

        //Get list of the popular cars
        app.get('/GetPopularCars', function (req, res) {
            var query = ' SELECT TOP(5) CarSeriesID,SUM (Quantity) as Sold FROM CarsInOrder WHERE(OrderID IN (SELECT OrderID FROM Orders WHERE DATEDIFF(day, Date, getdate()) < 7)) GROUP BY CarSeriesID ORDER BY Sold DESC';
            DButils.Select(connection, query, function (result) {
                res.send(result);
            });
        });


        //Get the cars from the last month
        app.get('/GetNewCars', function (req, res) {
            var query = 'SELECT CarSeriesID FROM  Cars WHERE DATEDIFF(day, DateOfEnter, getdate()) < 31';
            DButils.Select(connection, query, function (result) {
                res.send(result);
            });
        });

        //Get cars that are reccomended to the user by his previous orders
        app.post('/GetRecommends', function (req, res) {
            var _username = req.body.username;
            var _toekn = req.body.token;

            if(_username in app.locals.users)
            {
                tokenFromDic = app.locals.users[_username];
                if (tokenFromDic === _toekn){
                    var query = 'SELECT DISTINCT CarSeriesID FROM CarsInOrder T0  WHERE T0.username IN (SELECT T1.username FROM CarsInOrder T1 WHERE T1.username <> @Parameter AND T1.CarSeriesID IN (select T2.CarSeriesID from CarsInOrder T2 WHERE T2.username = @Parameter)) AND NOT EXISTS(SELECT TOP(1) 1  FROM CarsInOrder T3 WHERE T0.CarSeriesID = T3.CarSeriesID AND T3.username =@Parameter)';

                    DButils.SelectWithParam(_username, connection, query, function (result) {
                        res.send(result);
                    });
                }
                else{
                    res.send(JSON.stringify({ "Faild": "The token is inzalid"}));

                }

            }
            else {

                res.send(JSON.stringify({ "Faild": "The user name is invalid" }));
            }

        });


        //Get a car details by it's ID
        app.get('/GetCarDetailsByID/:id', function (req, res) {
            var id = req.params.id;
            var ckeckQuery = (
                squel.select()
                    .from("Cars")
                    .where("CarSeriesID = ?", id)
                    .toString()
            );
            //check if the car exist in the system
            DButils.Select(connection2, ckeckQuery, function (result) {
                if (result.length === 0) {
                    res.send(JSON.stringify({ "Failed": " this ID  is Not exist" }));
                }

                else {
                    //Get the car's details
                    var query = (
                        squel.select()
                            .from("Cars")
                            .where("CarSeriesID = ?", id)
                            .toString()
                    );
                    DButils.Select(connection, query, function (result) {
                        res.send(result);
                    });
                }
            });
        });

        //Get all cars from given manefucture
        app.get('/GetCarsOfMenufucturer/:m', function (req, res) {
            var manufacturer = req.params.m;
            //Get the car's details
            var query = (
                squel.select()
                    .field("CarSeriesID")
                    .from("Cars")
                    .where("Manufacturer = ?", manufacturer)
                    .toString()
            );
            DButils.Select(connection, query, function (result) {
                res.send(result);
            });

        });

        //get user's prev orders'
        app.post('/getPrevOrders', function (req, res) {
            var username = req.body.username;
            var token= req.body.token;
            if(username in app.locals.users)
            {
                tokenInUsers = app.locals.users[username];
                if (token === tokenInUsers){

                    var query = (
                        squel.select()
                            .field("OrderID")
                            .field("Date")
                            .from("Orders")
                            .where("username = ?", username)
                            .order("Date")
                            .toString()
                    );
                    DButils.Select(connection, query, function (result) {
                        if (result.length === 0) {
                            res.send(JSON.stringify({ "False": " Not found any order" }));
                        }
                        else {
                            res.send(result);
                        }
                    });
                }

                else {

                    res.send(JSON.stringify({ "False": "The token invalid" }));
                }
            }

            else{

                res.send(JSON.stringify({ "False": "The user name invalid" }));
            }
        });


        //get order's details
        app.post('/getOrderDetails', function (req, res) {
            var orderId = parseInt(req.body.OrderID);
            var query = (
                squel.select()
                    .from("Orders")
                    .where("OrderID = ?", orderId)
                    .toString()
            );
            DButils.Select(connection, query, function (result) {
                if (result.length === 0) {
                    res.send(JSON.stringify({ "False": " OrderId not exist" }));
                }
                else {
                    res.send(result);
                }
            });

        });

        app.post('/getCarsInOrder', function (req, res) {
            var orderId = parseInt(req.body.OrderID);
            var query = (
                squel.select()
                    .field("CarSeriesID")
                    .field("Quantity")
                    .from("CarsInOrder")
                    .where("OrderID = ?", orderId)
                    .toString()
            );
            DButils.Select(connection, query, function (result) {
                if (result.length === 0) {
                    res.send(JSON.stringify({ "False": " OrderId not exist" }));
                }
                else {
                    res.send(result);
                }
            });

        });

        //Check if wanted units of a car exist in the inventory
        app.post('/CheckIsInStock', function (req, res) {
            var id = req.body.CarSeriesID.toString();
            var units = parseInt(req.body.Units);

            var ckeckQuery = (
                squel.select()
                    .from("Cars")
                    .where("CarSeriesID = ?", id)
                    .where("NumInStock >= ?", units)
                    .toString()
            );
            DButils.Select(connection2, ckeckQuery, function (result) {
                if (result.length === 0) {
                    res.send(JSON.stringify({ "False": " NotInStock" }));
                }

                else {

                    res.send(JSON.stringify({ "True": " InStock" }));
                }
            });

        });

        //Buy A whole shopping cart
        app.post('/BuyCart', function (req, res) {

            var nextOrderID = 1;
            var cars = req.body.Items;
            var username = req.body.username;
            var totalPrice = req.body.totalPrice;
            var currency = req.body.currency;
            var date = moment().format('YYYY-MM-DD hh:mm:ss');
            var deliveryDate = req.body.deliveryDate;


            var rows = [];


            var keys = Object.keys(cars[0]);
            //check if the username exist 
            var ckeckQueryUserName = (
                squel.select()
                    .from("Users")
                    .where("username = ?", username)
                    .toString()
            );
            DButils.Select(connection2, ckeckQueryUserName, function (result) {
                if (result.length === 0) {
                    res.send(JSON.stringify({ "Failed": "user not exist" }));
                }
                //find next available orderid
                else {
                    var nextOrderIDQuery = (
                        squel.select()
                            .from("Orders")
                            .field("MAX(OrderID)", "max")
                            .toString()
                    );
                    DButils.Select(connection3, nextOrderIDQuery, function (result3) {
                        if (!(result3[0].max === null))
                            nextOrderID = parseInt(result3[0].max) + 1;
                        //create the order
                        var queryAddOrder = (
                            squel.insert()
                                .into("Orders")
                                .set("username", username)
                                .set("OrderID", nextOrderID)
                                .set("Date", date)
                                .set("Price", totalPrice)
                                .set("Currency", currency)
                                .set("DeliveryDate", deliveryDate)
                                .toString()
                        );
                        DButils.Insert(connection4, queryAddOrder, function (result4) {


                            //set an array to add to the db
                            for (var i = 0; i < keys.length; i++) {

                                var item = {};
                                item["OrderID"] = nextOrderID;
                                item["username"] = username;
                                item["CarSeriesID"] = keys[i];
                                item["Quantity"] = cars[0][keys[i]];
                                rows.push(item);
                            }

                            var queryAddCarsToOrder = (
                                squel.insert()
                                    .into("CarsInOrder")
                                    .setFieldsRows(rows)
                                    .toString()
                            );
                            //add the cars to the order
                            DButils.Insert(connection, queryAddCarsToOrder, function (result) {
                                var sent = false;
                                for (var obj in result) {
                                    if (!sent) {
                                        if (obj === "Success") {
                                            sent = true;
                                            res.send(JSON.stringify({ "Sucess":nextOrderID }));
                                        }
                                        else {
                                            sent = true;
                                            res.send(result);

                                        }
                                    }
                                }
                            });
                        });

                    });
                }
            });
        });

        //Buy one car
        app.post('/BuyOneCar', function (req, res) {

            var nextOrderID = 1;
            var carSeriesID = req.body.carSeriesID;
            var username = req.body.username;
            var totalPrice = req.body.totalPrice;
            var currency = req.body.currency;
            var date = moment().format('YYYY-MM-DD hh:mm:ss');
            var deliveryDate = req.body.deliveryDate;

            var rows = []
            //check if the user exist
            var ckeckQueryUserName = (
                squel.select()
                    .from("Users")
                    .where("username = ?", username)
                    .toString()
            );
            DButils.Select(connection2, ckeckQueryUserName, function (result) {
                if (result.length === 0) {
                    res.send(JSON.stringify({ "Failed": " The user " + username + " not exist" }));
                }
                //find free order number
                else {
                    var nextOrderIDQuery = (
                        squel.select()
                            .from("Orders")
                            .field("MAX(OrderID)", "max")
                            .toString()
                    );
                    DButils.Select(connection3, nextOrderIDQuery, function (result3) {
                        if (!(result3[0].max === null))
                            nextOrderID = parseInt(result3[0].max) + 1;


                        var queryAddOrder = (
                            squel.insert()
                                .into("Orders")
                                .set("username", username)
                                .set("OrderID", nextOrderID)
                                .set("Date", date)
                                .set("Price", totalPrice)
                                .set("Currency", currency)
                                .set("DeliveryDate", deliveryDate)
                                .toString()
                        );
                        DButils.Insert(connection4, queryAddOrder, function (result4) {

                            //create the order
                            var queryAddCarToOrder = (
                                squel.insert()
                                    .into("CarsInOrder")
                                    .set("OrderID", nextOrderID)
                                    .set("username", username)
                                    .set("CarSeriesID", carSeriesID)
                                    .set("Quantity", 1)
                                    .toString()
                            );
                            DButils.Insert(connection, queryAddCarToOrder, function (result) {
                                //add the car to the order
                                var sent = false;
                                for (var obj in result) {
                                    if (!sent) {
                                        if (obj === "Success") {
                                            sent = true;
                                            res.send(JSON.stringify({ "Success": nextOrderID}));
                                        }
                                        else {
                                            sent = true;
                                            res.send(result);

                                        }
                                    }
                                }
                            });
                        });

                    });
                }
            });
        });

        //get list of all the categories
        app.get('/GetAllCategories', function (req, res) {
            var query = ' SELECT * FROM Categories';
            DButils.Select(connection, query, function (result) {
                res.send(result);
            });
        });

        /////Admins

        //Update user to be admin
        app.put('/AddAdmin', function (req, res) {
            var _username = req.body.username;
            var ckeckQuery = (
                squel.select()
                    .from("Users")
                    .where("username = ?", _username)
                    .toString()
            );
            //check if the user exist
            DButils.Select(connection2, ckeckQuery, function (result) {
                if (result.length === 0) {
                    res.send(JSON.stringify({ "Failed": "username Not exist" }));
                }
                else {

                    var query = (
                        squel.update()
                            .table("Users")
                            .set("IsAdmin = 1")
                            .where("username = ?", _username)
                            .toString()
                    );
                    //return the result                  
                    DButils.Update(connection, query, function (result) {
                        var sent = false;
                        for (var obj in result) {
                            if (!sent) {
                                if (obj === "Success") {
                                    sent = true;
                                    res.send(JSON.stringify({ "Success": "isAdmin" }));
                                }
                                else {
                                    sent = true;
                                    res.send(result);

                                }
                            }
                        }


                    });
                }
            });
        });


        //add new car to the system
        app.post('/addCar', function (req, res) {


            var date = moment().format('YYYY-MM-DD hh:mm:ss');
            var id = req.body.CarSeriesID;
            var cat = req.body.cat;
            var man = req.body.Manufacturer;
            var model = req.body.ModelName;
            var year = parseInt(req.body.Year, 10);
            var color = req.body.Color;
            var price = parseInt(req.body.Price, 10);
            var num = parseInt(req.body.NumInStock, 10);
            //check if the wanted id is already in the system
            var ckeckQuery = (
                squel.select()
                    .from("Cars")
                    .where("CarSeriesID = ?", id)
                    .toString()
            );
            DButils.Select(connection2, ckeckQuery, function (result) {
                if (result.length > 0) {
                    res.send(JSON.stringify({ "Failed": "ID  already exists" }));
                }

                else {

                    var query = (
                        squel.insert()
                            .into("Cars")
                            .set("CarSeriesID", id)
                            .set("Category", cat)
                            .set("Manufacturer", man)
                            .set("ModelName", model)
                            .set("Year", year)
                            .set("Color", color)
                            .set("PriceNIS", price)
                            .set("NumInStock", num)
                            .set("DateOfEnter", date)
                            .toString()
                    );
                    DButils.Insert(connection, query, function (result) {
                        //return the result
                        var sent = false;
                        for (var obj in result) {
                            if (!sent) {
                                if (obj === "Success") {
                                    sent = true;
                                    res.send(JSON.stringify({ "Success": "Car Added" }));
                                }
                                else {
                                    sent = true;
                                    res.send(result);

                                }
                            }
                        }

                    });
                }
            });
        });

        //Delete a car from the system
        app.delete('/deleteCar', function (req, res) {
            var carID = req.body.CarSeriesID;

            var ckeckQuery = (
                squel.select()
                    .from("Cars")
                    .where("CarSeriesID = ?", carID)
                    .toString()
            );
            DButils.Select(connection2, ckeckQuery, function (result) {
                if (result.length === 0) {
                    res.send(JSON.stringify({ "Failed": " this ID  is Not exist" }));
                }
                else {

                    var query = (
                        squel.delete()
                            .from("Cars")
                            .where("CarSeriesID = ?", carID)
                            .toString()
                    );
                    DButils.Delete(connection, query, function (result) {

                        res.send(result);
                    });

                }
            });


        });

        //Delete client
        app.delete('/deleteClient', function (req, res) {
            var _username = req.body.username;

            var ckeckQuery = (
                squel.select()
                    .from("Users")
                    .where("username = ?", _username)
                    .toString()
            );
            DButils.Select(connection2, ckeckQuery, function (result) {
                if (result.length === 0) {
                    res.send(JSON.stringify({ "Failed": " the username  is Not exist" }));
                }
                else {

                    var query = (
                        squel.delete()
                            .from("Users")
                            .where("username = ?", _username)
                            .toString()
                    );
                    DButils.Delete(connection, query, function (result) {
                        res.send(result);
                    });

                }
            });


        });

        //Get the List of the current Inventory
        app.get('/GetInventory', function (req, res) {
            var query = "SELECT CarSeriesID,Manufacturer,ModelName,Year,NumInStock FROM Cars ORDER BY NumInStock DESC";
            DButils.Select(connection, query, function (result) {
                res.send(result);
            });
        });


        //Updete the inventory with new units of certain car
        app.put('/UpdateInventory', function (req, res) {
            var id = req.body.CarSeriesID.toString();
            var units = parseInt(req.body.NewUnitsToAdd);

            var ckeckQuery = (
                squel.select()
                    .from("Cars")
                    .where("CarSeriesID = ?", id)
                    .toString()
            );
            //Check if the car is exist
            DButils.Select(connection2, ckeckQuery, function (result) {
                if (result.length === 0) {
                    res.send(JSON.stringify({ "Failed": "ID  is Not exist" }));
                }

                else {
                    var query = (
                        squel.update()
                            .table("Cars")
                            .set("NumInStock = NumInStock + " + units)
                            .where("CarSeriesID = ?", id)
                            .toString()
                    );
                    //add the new units to the inventory
                    DButils.Update(connection, query, function (result) {

                        var sent = false;
                        for (var obj in result) {
                            if (!sent) {
                                if (obj === "Success") {
                                    sent = true;
                                    res.send(JSON.stringify({ "Success":"Stock was Updated" }));
                                }
                                else {
                                    sent = true;
                                    res.send(result);
                                }
                            }
                        }
                    });
                }
            });

        });

        //Get All orders
        app.get('/GetAllOrders', function (req, res) {
            var query = ' SELECT * FROM ORDERS';
            DButils.Select(connection, query, function (result) {
                res.send(result);
            });
        });


    }
});



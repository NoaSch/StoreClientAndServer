/**
 * Created by Hasidi on 18/06/2017.
 */

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// var cors = require('cors');
// app.use(cors());

//-------------------------------------------------------------------------------------------------------------------
app.use(express.static(__dirname + '/public'));
//-------------------------------------------------------------------------------------------------------------------
app.locals.users = {};
//-------------------------------------------------------------------------------------------------------------------
app.get('/cities', function (req,res) {
    if (!checkLogin(req))
        res.status(403).send("you are not logged in");
    else {
        res.json(cities);
    }
});
//-------------------------------------------------------------------------------------------------------------------
app.post('/login', function (req,res) {
    let username = req.body.username;
    let password = req.body.password;
    if (username == '123' && password == '123'){
        let token = 12345;
        app.locals.users[username] = token;
        res.json(token);
    }
    else {
        res.status(403).send("username or password incorrect");
    }

});
//-------------------------------------------------------------------------------------------------------------------
function checkLogin(req) {
    let token = req.headers["my-token"];
    let user = req.headers["user"];
    if (!token || !user)
        return false;
    let validToken = app.locals.users[user];
    if (validToken == token)
        return true;
    else
        return false;
}
//-------------------------------------------------------------------------------------------------------------------
var port = 4000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
//-------------------------------------------------------------------------------------------------------------------





var cities = [
    {
        name: 'Liverpool',
        country: 'England',
        population: '466,415',
        description: "Liverpool is a city in Merseyside, England. A borough from 1207 and a city from 1880, in 2014 the city council area had a population of 470,537 and the Liverpool/Birkenhead metropolitan area one of 2,241,000. Liverpool is in the south west of the historic county of Lancashire in North West England, on the eastern side of the Mersey Estuary. The town historically lay within the ancient Lancashire division of West Derby known as a hundred."
    },
    {
        name: 'Paris',
        country: 'France',
        population: '2,240,621',
        description: 'Paris is the capital and most populous city of France. Situated on the Seine River, in the north of the country, it is in the centre of the Île-de-France region, also known as the région parisienne, Paris Region.',
    },
    {
        name: 'Madrid',
        country: 'Spain',
        population: '3,141,992',
        description: 'Madrid , is a south-western European city, the capital of Spain, and the largest municipality of the Community of Madrid. The population of the city is almost 3.2 million with ametropolitan area population of around 6.5 million. It is the third-largest city in the European Union, after Londonand Berlin, and its metropolitan area is the third-largest in the European Union after London and Paris. The city spans a total of 604.3 km2 (233.3 sq mi).',
    }
];


var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

//Handle SELECT Commands
exports.Select = function (connection, query, callback) {            
            var req = new Request(query, function (err, rowCount) {           
                if (err) {
                    console.log(err);                  
                }
            });
            var res = [];
            var properties = [];
            req.on('columnMetadata', function (columns) {           
                columns.forEach(function (column) {
                    if (column.colName !== null)
                        properties.push(column.colName);
                });
            });

            req.on('row', function (row) {
                var item = {};
                for (i = 0; i < row.length; i++) {
                    item[properties[i]] = row[i].value;
                }
                res.push(item);            
            });

            req.on('requestCompleted', function (rowCount,more) {              
                callback(res);                        
            });
            connection.execSql(req);          
};

//Handle DELETE Commands
exports.Delete = function (connection, query, callback) {  
    var item = {};
    var req = new Request(query, function (err, rowCount) {

       
        if (err) {
            callback(err);
        }
        else
        {
            callback(JSON.stringify({ "Success": "Deleted" }));
        }
    });  
    connection.execSql(req);
};

//Handle INSERT Commands
exports.Insert = function (connection,query, callback) {
    var req = new Request(query, function (err, rowCount) {       
        if (err) {      
            callback(err);
        }
        else
        {                     
            callback({ "Success": "Inserted" });
        }
    });
    connection.execSql(req);
};

//Handle UPDATE Commands
exports.Update = function (connection, query, callback) {
    var req = new Request(query, function (err, rowCount) {      
        if (err) {         
            callback(err);
        }
        else {
            callback({ "Success": "Updated"});
        }
    });
    connection.execSql(req);
};

//Handle select command with given parameter
exports.SelectWithParam = function (par,connection, query, callback) {
    var req = new Request(query, function (err, rowCount) {
        if (err) {
            console.log(err);
        }
    });
    req.addParameter('Parameter',TYPES.VarChar, par)
    var res = [];
    var properties = [];
    req.on('columnMetadata', function (columns) {
        columns.forEach(function (column) {
            if (column.colName !== null)
                properties.push(column.colName);
        });
    });

    req.on('row', function (row) {
        var item = {};
        for (i = 0; i < row.length; i++) {
            item[properties[i]] = row[i].value;
        }
        res.push(item);
    });

    req.on('requestCompleted', function (rowCount, more) {
        callback(res);
    });
    connection.execSql(req);
};


    
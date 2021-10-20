var mysql = require('mysql');
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_node"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("terhubung!");
});

module.exports = db;
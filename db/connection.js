const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'employeetracker_db',
    multipleStatements: true
});

db.connect(function(err, response) {
    if(err) {
        console.log("Connection didn't work")
        return err 
    } else {
        return response
    }
});

module.exports = db;
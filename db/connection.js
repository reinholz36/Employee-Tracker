const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    port: '3001',
    user: 'root',
    password: 'root',
    database: 'employeetracker_db'
});

db.connect(function(err, response) {
    (err) ? err : response;
});

module.exports = db;
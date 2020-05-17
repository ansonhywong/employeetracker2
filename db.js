const mysql         = require('mysql');
const connection    = require('./connection.json');
let db;

function connectDatabase() {
    if (!db) {
        db = mysql.createConnection(connection);

        db.connect(function(err) {
            if(err) {
                return;
            }
        });
    }
    return db;
}

module.exports = connectDatabase();

var mysql = require('mysql2');
var config = {
    connexion : mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'societe'
    })
};

module.exports = config;

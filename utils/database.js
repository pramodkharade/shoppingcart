const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root',
    database:'node_db_shoppingcart'
});

module.exports = pool.promise();
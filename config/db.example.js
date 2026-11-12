// Copy this file to config/db.js and fill in your own credentials.
// config/db.js is excluded from version control (.gitignore).
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'petcare'
});

module.exports = pool;

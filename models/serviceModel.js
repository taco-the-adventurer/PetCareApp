const pool = require('../config/db');

function getActiveServices(callback) {
  const sql = 'SELECT id, name, price FROM services WHERE is_active = 1 ORDER BY name';
  pool.query(sql, callback);
}

module.exports = { getActiveServices };

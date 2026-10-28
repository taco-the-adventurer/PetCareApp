const connection = require('../config/db');

function create(data, cb) {
  const sql = 'INSERT INTO pets (owner_id, name, species, breed, age, image) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(sql, [data.owner_id, data.name, data.species, data.breed, data.age, data.image], cb);
}

function findByOwnerId(ownerId, cb) {
  const sql = 'SELECT * FROM pets WHERE owner_id = ?';
  connection.query(sql, [ownerId], cb);
}

module.exports = { create, findByOwnerId };

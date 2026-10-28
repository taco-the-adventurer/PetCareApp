const connection = require('../config/db');

function create(data, cb) {
  const sql = 'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)';
  connection.query(sql, [data.username, data.password, data.name, data.role], cb);
}

function findByCredentials(username, hash, cb) {
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(sql, [username, hash], cb);
}

function findAll(cb) {
  const sql = 'SELECT id, name, username, role FROM users';
  connection.query(sql, cb);
}

function findById(id, cb) {
  const sql = 'SELECT id, name, username, role FROM users WHERE id = ?';
  connection.query(sql, [id], cb);
}

function deleteById(id, cb) {
  const sql = 'DELETE FROM users WHERE id = ?';
  connection.query(sql, [id], cb);
}

module.exports = { create, findByCredentials, findAll, findById, deleteById };

const connection = require('../config/db');

function findByOwnerAndPet(userId, petId, cb) {
  const sql = `
    SELECT journal.*, pets.name, pets.species, pets.breed, pets.age, pets.image
    FROM journal
    JOIN pets ON journal.pet_id = pets.id
    WHERE pets.owner_id = ? AND pets.id = ?
  `;
  connection.query(sql, [userId, petId], cb);
}

function findByUserId(userId, cb) {
  const sql = `
    SELECT journal.*, pets.id AS pet_id
    FROM journal
    JOIN pets ON journal.pet_id = pets.id
    WHERE pets.owner_id = ?
  `;
  connection.query(sql, [userId], cb);
}

function create(data, cb) {
  const sql = 'INSERT INTO journal (pet_id, activity, notes, entry_date) VALUES (?, ?, ?, ?)';
  connection.query(sql, [data.pet_id, data.activity, data.notes, data.entry_date], cb);
}

function findById(id, cb) {
  const sql = 'SELECT * FROM journal WHERE id = ?';
  connection.query(sql, [id], cb);
}

function update(data, id, cb) {
  const sql = 'UPDATE journal SET entry_date = ?, activity = ?, notes = ?, pet_id = ? WHERE id = ?';
  connection.query(sql, [data.entry_date, data.activity, data.notes, data.pet_id, id], cb);
}

function getPetIdById(id, cb) {
  const sql = 'SELECT pet_id FROM journal WHERE id = ?';
  connection.query(sql, [id], cb);
}

function deleteById(id, cb) {
  const sql = 'DELETE FROM journal WHERE id = ?';
  connection.query(sql, [id], cb);
}

function search(userId, query, petId, cb) {
  const searchQuery = `%${query}%`;
  let sql = `
    SELECT journal.*, pets.name, pets.species, pets.breed, pets.age, pets.image
    FROM journal
    JOIN pets ON journal.pet_id = pets.id
    WHERE pets.owner_id = ? AND (journal.activity LIKE ? OR journal.notes LIKE ?)`;

  const params = [userId, searchQuery, searchQuery];

  if (petId) {
    sql += ' AND pets.id = ?';
    params.push(petId);
  }

  connection.query(sql, params, cb);
}

module.exports = { findByOwnerAndPet, findByUserId, create, findById, update, getPetIdById, deleteById, search };

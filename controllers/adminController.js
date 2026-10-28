const User = require('../models/User');
const Pet = require('../models/Pet');
const Journal = require('../models/Journal');

function getDashboard(req, res) {
  res.render('adminDashboard', { session: req.session });
}

function getUsers(req, res) {
  User.findAll((err, results) => {
    if (err) return res.send('Error loading users');
    res.render('adminUsers', { users: results, session: req.session });
  });
}

function getUserDetails(req, res) {
  const userId = req.params.id;

  User.findById(userId, (err, userResults) => {
    if (err || userResults.length === 0) return res.send('User not found');

    Pet.findByOwnerId(userId, (err2, petResults) => {
      if (err2) return res.send('Error retrieving pet info');

      Journal.findByUserId(userId, (err3, journalResults) => {
        if (err3) return res.send('Error retrieving journal entries');

        res.render('adminUserDetails', {
          user: userResults[0],
          pets: petResults,
          journals: journalResults,
          session: req.session
        });
      });
    });
  });
}

function deleteUser(req, res) {
  const userId = req.params.id;
  console.log(userId);
  User.deleteById(userId, (err) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.send('Error deleting user');
    }
    res.redirect('/admin/users');
  });
}

module.exports = { getDashboard, getUsers, getUserDetails, deleteUser };

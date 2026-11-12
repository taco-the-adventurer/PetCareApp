const userModel = require('../models/userModel');
const petModel = require('../models/petModel');
const journalModel = require('../models/journalModel');
const serviceBookingModel = require('../models/serviceBookingModel');

function dashboard(req, res) {
  serviceBookingModel.getBookingStats((err, stats) => {
    res.render('adminDashboard', {
      session: req.session,
      stats: err ? null : stats
    });
  });
}

function listUsers(req, res) {
  userModel.getAllUsers((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).render('404', { session: req.session });
    }
    res.render('adminUsers', { users: results, session: req.session });
  });
}

function viewUserDetails(req, res) {
  const userId = req.params.id;

  userModel.getUserById(userId, (err, userResults) => {
    if (err || userResults.length === 0) return res.status(404).render('404', { session: req.session });

    petModel.getPetsByOwner(userId, (err2, petResults) => {
      if (err2) return res.status(500).render('404', { session: req.session });

      journalModel.getJournalsByOwner(userId, (err3, journalResults) => {
        if (err3) return res.status(500).render('404', { session: req.session });

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
  userModel.deleteUser(userId, (err) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Error deleting user. Please try again.');
      return res.redirect('/admin/users');
    }
    req.flash('success', 'User deleted successfully.');
    res.redirect('/admin/users');
  });
}

function bookingsDashboard(req, res) {
  serviceBookingModel.getBookingStats((err, stats) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Unable to load booking statistics.');
    }
    serviceBookingModel.getAllBookings((err2, bookings) => {
      if (err2) {
        console.error(err2);
        return res.status(500).send('Unable to load bookings.');
      }
      res.render('adminBookings', {
        stats,
        bookings,
        session: req.session,
        messages: req.flash('success'),
        errors: req.flash('error')
      });
    });
  });
}

module.exports = { dashboard, listUsers, viewUserDetails, deleteUser, bookingsDashboard };

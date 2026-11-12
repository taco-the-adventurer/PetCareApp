const petModel = require('../models/petModel');
const serviceModel = require('../models/serviceModel');
const serviceBookingModel = require('../models/serviceBookingModel');

// Build today's date as a local YYYY-MM-DD string (not UTC).
function localToday() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Return true only when the string is a real calendar date in YYYY-MM-DD and
// the date is today or in the future.
function isValidFutureDate(dateStr, today) {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() + 1 !== m || dt.getDate() !== d) return false;
  return dateStr >= today;
}

function listServices(req, res) {
  const userId = req.session.user.id;
  const today = localToday();

  petModel.getPetsByOwner(userId, (err, pets) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Unable to load pets.');
    }

    serviceModel.getActiveServices((err2, services) => {
      if (err2) {
        console.error(err2);
        return res.status(500).send('Unable to load services.');
      }

      // Preselect petId only when it belongs to this customer.
      const rawPetId = req.query.petId;
      const owned = pets.find(p => String(p.id) === String(rawPetId));
      const selectedPetId = owned ? String(rawPetId) : '';

      res.render('services', {
        pets,
        services,
        selectedPetId,
        today,
        messages: req.flash('success'),
        errors: req.flash('error'),
        session: req.session
      });
    });
  });
}

function createBooking(req, res) {
  const userId = req.session.user.id;
  const { petId, serviceId, bookingDate } = req.body;
  const today = localToday();

  // Validate: both IDs must be positive integers; date must be valid and not past.
  const petIdNum = parseInt(petId, 10);
  const serviceIdNum = parseInt(serviceId, 10);

  if (!petIdNum || petIdNum <= 0 || !serviceIdNum || serviceIdNum <= 0 ||
      !isValidFutureDate(bookingDate, today)) {
    req.flash('error', 'Choose a pet, service, and valid booking date.');
    return res.redirect('/services');
  }

  serviceBookingModel.createPendingBooking(userId, petIdNum, serviceIdNum, bookingDate, (err, result) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Unable to create the booking. Please try again.');
      return res.redirect(`/services?petId=${petIdNum}`);
    }

    if (!result) {
      req.flash('error', 'That pet or service is unavailable for booking.');
      return res.redirect('/services');
    }

    req.flash('success', 'Booking created. Payment is pending; no payment has been processed.');
    res.redirect('/bookings');
  });
}

function listBookings(req, res) {
  const userId = req.session.user.id;

  serviceBookingModel.getBookingsByOwner(userId, (err, bookings) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Unable to load booking history.');
    }

    res.render('bookings', {
      bookings,
      messages: req.flash('success'),
      errors: req.flash('error'),
      session: req.session
    });
  });
}

module.exports = { listServices, createBooking, listBookings };

const pool = require('../config/db');

function createPendingBooking(ownerId, petId, serviceId, bookingDate, callback) {
  pool.getConnection((connErr, conn) => {
    if (connErr) return callback(connErr);

    conn.beginTransaction((txErr) => {
      if (txErr) {
        conn.release();
        return callback(txErr);
      }

      // Insert booking only when the pet belongs to ownerId and the service is active.
      // booked_price is taken from the database, not from the request.
      const bookingSql = `
        INSERT INTO service_bookings (pet_id, service_id, booking_date, booked_price, booking_status)
        SELECT p.id, s.id, ?, s.price, 'pending'
        FROM pets AS p
        JOIN services AS s ON s.id = ? AND s.is_active = 1
        WHERE p.id = ? AND p.owner_id = ?
      `;

      conn.query(bookingSql, [bookingDate, serviceId, petId, ownerId], (bookErr, bookResult) => {
        if (bookErr) {
          return conn.rollback(() => { conn.release(); callback(bookErr); });
        }

        if (bookResult.affectedRows === 0) {
          // Pet not owned or service inactive/unknown
          return conn.rollback(() => { conn.release(); callback(null, null); });
        }

        const bookingId = bookResult.insertId;

        // Payment amount comes from the booking row just inserted, not a second catalogue lookup.
        const paymentSql = `
          INSERT INTO payments (booking_id, amount, payment_status)
          SELECT id, booked_price, 'pending'
          FROM service_bookings
          WHERE id = ?
        `;

        conn.query(paymentSql, [bookingId], (payErr, payResult) => {
          if (payErr) {
            return conn.rollback(() => { conn.release(); callback(payErr); });
          }

          conn.commit((commitErr) => {
            if (commitErr) {
              return conn.rollback(() => { conn.release(); callback(commitErr); });
            }
            conn.release();
            callback(null, { bookingId, paymentId: payResult.insertId });
          });
        });
      });
    });
  });
}

function getBookingsByOwner(ownerId, callback) {
  const sql = `
    SELECT
      sb.id                                        AS booking_id,
      DATE_FORMAT(sb.booking_date, '%Y-%m-%d')     AS booking_date,
      p.name                                       AS pet_name,
      s.name                                       AS service_name,
      sb.booked_price,
      sb.booking_status,
      pay.payment_status,
      pay.payment_reference,
      sb.created_at
    FROM service_bookings AS sb
    JOIN pets    AS p   ON p.id  = sb.pet_id
    JOIN services AS s  ON s.id  = sb.service_id
    LEFT JOIN payments AS pay ON pay.booking_id = sb.id
    WHERE p.owner_id = ?
    ORDER BY sb.created_at DESC, sb.id DESC
  `;
  pool.query(sql, [ownerId], callback);
}

module.exports = { createPendingBooking, getBookingsByOwner };

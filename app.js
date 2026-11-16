
// Pet Care Journal System
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const PORT = 3000;

// View Engine and Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set SESSION_SECRET in the environment for real deployments; the fallback
// keeps a clean clone runnable for marking without extra setup.
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

// Make current path available to all views for active nav highlighting
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Routes
app.use(require('./routes/indexRoutes'));
app.use(require('./routes/authRoutes'));
app.use(require('./routes/adminRoutes'));
app.use(require('./routes/petRoutes'));
app.use(require('./routes/journalRoutes'));
app.use(require('./routes/paymentRoutes'));
app.use(require('./routes/serviceRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { session: req.session });
});

// =========================
// Start Server
// =========================
app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));

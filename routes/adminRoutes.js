const router = require('express').Router();
const { isAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');

router.get('/dashboard', isAdmin, ctrl.getDashboard);
router.get('/users', isAdmin, ctrl.getUsers);
router.get('/users/delete/:id', isAdmin, ctrl.deleteUser);
router.get('/users/:id', isAdmin, ctrl.getUserDetails);

module.exports = router;

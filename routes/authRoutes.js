const router = require('express').Router();
const upload = require('../config/upload');
const ctrl = require('../controllers/authController');

router.get('/', ctrl.getIndex);
router.get('/signup', ctrl.getSignup);
router.post('/signup', upload.single('pet_image'), ctrl.postSignup);
router.get('/login', ctrl.getLogin);
router.post('/login', ctrl.postLogin);
router.get('/logout', ctrl.logout);

module.exports = router;

const router = require('express').Router();
const upload = require('../config/upload');
const { isLoggedIn } = require('../middleware/auth');
const ctrl = require('../controllers/petController');

router.get('/new', isLoggedIn, ctrl.getNewPet);
router.post('/', upload.single('pet_image'), isLoggedIn, ctrl.createPet);

module.exports = router;

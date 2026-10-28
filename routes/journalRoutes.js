const router = require('express').Router();
const { isLoggedIn } = require('../middleware/auth');
const ctrl = require('../controllers/journalController');

router.get('/search', isLoggedIn, ctrl.searchJournals);
router.get('/', isLoggedIn, ctrl.listJournals);
router.get('/new', isLoggedIn, ctrl.getNewJournal);
router.post('/new', isLoggedIn, ctrl.createJournal);
router.get('/edit/:id', isLoggedIn, ctrl.getEditJournal);
router.post('/edit/:id', isLoggedIn, ctrl.updateJournal);
router.get('/delete/:id', isLoggedIn, ctrl.deleteJournal);

module.exports = router;

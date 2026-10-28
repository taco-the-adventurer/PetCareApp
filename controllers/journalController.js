const Pet = require('../models/Pet');
const Journal = require('../models/Journal');

function listJournals(req, res) {
  const userId = req.session.user.id;
  let selectedPetId = req.query.petId;

  Pet.findByOwnerId(userId, (err, pets) => {
    if (err) return res.send('Error loading pets');

    if (!selectedPetId && pets.length > 0) {
      selectedPetId = pets[0].id;
    }

    if (!selectedPetId) {
      return res.render('journals', {
        journals: [],
        pets,
        selectedPetId: '',
        pet: null,
        session: req.session
      });
    }

    Journal.findByOwnerAndPet(userId, selectedPetId, (err2, journals) => {
      if (err2) return res.send('Error loading journals');

      const petInfo = pets.find(p => p.id == selectedPetId);

      return res.render('journals', {
        journals,
        pets,
        selectedPetId,
        pet: petInfo,
        session: req.session
      });
    });
  });
}

function getNewJournal(req, res) {
  const userId = req.session.user.id;
  const selectedPetId = req.query.petId;

  Pet.findByOwnerId(userId, (err, pets) => {
    if (err) return res.send('Error loading pets');
    res.render('newJournal', { pets, session: req.session, selectedPetId });
  });
}

function createJournal(req, res) {
  const { pet_id, activity, notes, entry_date } = req.body;

  Journal.create({ pet_id, activity, notes, entry_date }, (err) => {
    if (err) return res.send('Error saving journal');
    res.redirect(`/journals?petId=${pet_id}`);
  });
}

function getEditJournal(req, res) {
  const journalId = req.params.id;
  const userId = req.session.user.id;

  Journal.findById(journalId, (err, journalResults) => {
    if (err || journalResults.length === 0) return res.send('Journal not found');

    Pet.findByOwnerId(userId, (err2, pets) => {
      if (err2) return res.send('Error fetching pets');

      res.render('editJournal', { journal: journalResults[0], pets, session: req.session });
    });
  });
}

function updateJournal(req, res) {
  const { entry_date, activity, notes, pet_id } = req.body;
  const journalId = req.params.id;

  Journal.update({ entry_date, activity, notes, pet_id }, journalId, (err) => {
    if (err) return res.send('Error updating journal');
    res.redirect(`/journals?petId=${pet_id}`);
  });
}

function deleteJournal(req, res) {
  const journalId = req.params.id;

  Journal.getPetIdById(journalId, (err, result) => {
    if (err || result.length === 0) return res.send('Journal not found.');

    const petId = result[0].pet_id;

    Journal.deleteById(journalId, (err2) => {
      if (err2) return res.send('Error deleting journal.');
      res.redirect(`/journals?petId=${petId}`);
    });
  });
}

function searchJournals(req, res) {
  const userId = req.session.user.id;
  const selectedPetId = req.query.petId;

  Pet.findByOwnerId(userId, (err, pets) => {
    if (err) return res.send('Error loading pets');

    Journal.search(userId, req.query.q, selectedPetId, (err2, journals) => {
      if (err2) return res.send('Error searching journals');

      let pet = null;
      if (selectedPetId) {
        const found = pets.find(p => p.id.toString() === selectedPetId);
        if (found) pet = found;
      }

      res.render('journals', {
        journals,
        pets,
        selectedPetId,
        pet,
        session: req.session
      });
    });
  });
}

module.exports = {
  listJournals,
  getNewJournal,
  createJournal,
  getEditJournal,
  updateJournal,
  deleteJournal,
  searchJournals
};

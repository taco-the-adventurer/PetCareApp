const Pet = require('../models/Pet');

function getNewPet(req, res) {
  res.render('newPet', { session: req.session });
}

function createPet(req, res) {
  const { pet_name, species, breed, age } = req.body;
  let petImage;

  if (req.file) {
    petImage = req.file.filename;
  } else {
    petImage = null;
  }

  const ownerId = req.session.user.id;

  Pet.create({ owner_id: ownerId, name: pet_name, species, breed, age, image: petImage }, (err) => {
    if (err) {
      console.error(err);
      return res.send('Failed to add pet.');
    }
    res.redirect('/journals');
  });
}

module.exports = { getNewPet, createPet };

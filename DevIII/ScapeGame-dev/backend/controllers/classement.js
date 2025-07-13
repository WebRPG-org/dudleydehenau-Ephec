const { validationResult } = require('express-validator');
const Scores = require('../modèles/classement');


exports.getClassement = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const levelId = req.params.levelId;

  try {
    const [rows] = await Scores.getClassement(levelId);
    res.json(rows);
  } catch (err) {
    res.status(500).send(err);
  }
};

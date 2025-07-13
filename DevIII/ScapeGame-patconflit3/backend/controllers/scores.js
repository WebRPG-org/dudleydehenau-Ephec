const { validationResult } = require('express-validator');
const Scores = require('../modèles/scores');

exports.postScore = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const levelId = req.body.levelId;
  const userId = req.body.userId;
  const scoreBTime = req.body.scoreBTime;

  try {
    const [rows] = await Scores.getBestScore(levelId, userId);

    if (rows.length > 0) {
      const bestScore = rows[0].scoreBTime;
      if (scoreBTime < bestScore) { // Changement ici : vérifie si le score est inférieur
        await Scores.updateScore(levelId, userId, scoreBTime); // Mettre à jour le score
        return res.status(200).json({ message: 'Score mis à jour avec succès', bestScore: scoreBTime });
      } else {
        return res.status(200).json({ message: 'Le nouveau score n\'est pas inférieur au score existant', bestScore: bestScore });
      }
    } else {
      await Scores.save({ levelId, userId, scoreBTime });
      return res.status(201).json({ message: 'Score ajouté avec succès', bestScore: scoreBTime });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getBestScore = async (req, res, next) => {
  const { userId, levelId } = req.params;
  try {
    const [rows] = await Scores.getBestScore(levelId, userId);
    const bestScore = rows.length > 0 ? rows[0].scoreBTime : 0;
    res.json({ bestScore });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateBestScore = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { levelId, userId, score } = req.body;
  try {
    const [rows] = await Scores.getBestScore(levelId, userId);

    if (rows.length > 0) {
      const bestScore = rows[0].scoreBTime;
      if (score < bestScore) { // Changement ici : vérifie si le score est inférieur
        await Scores.updateScore(levelId, userId, score); // Mettre à jour le score
        return res.status(200).json({ message: 'Score mis à jour avec succès', bestScore: score });
      } else {
        return res.status(200).json({ message: 'Le nouveau score n\'est pas inférieur au score existant', bestScore: bestScore });
      }
    } else {
      await Scores.save({ levelId, userId, scoreBTime: score });
      return res.status(201).json({ message: 'Score ajouté avec succès', bestScore: score });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

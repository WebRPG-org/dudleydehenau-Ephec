const { validationResult } = require('express-validator');

const Score = require('../modèles/score');

exports.postScore = (async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) return

    const levelId = req.body.levelId;
    const userId = req.body.userId;
    const scoreBTime = req.body.scoreBTime;

    try {
        const scoreDetail = {
          levelId: levelId,
          userId: userId,
          scoreBTime: scoreBTime
        };

        console.log("Valeurs reçues pour levelId, userId et scoreBTime :", levelId, userId, scoreBTime);

        const result = await Score.save(scoreDetail);

        res.status(201).json({ message: 'Score enregistré avec succès' });
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
});
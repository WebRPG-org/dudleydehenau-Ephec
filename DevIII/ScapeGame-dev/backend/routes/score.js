const express = require('express');

const { body } = require('express-validator');

const auth = require('../middleware/auth');

const router = express.Router();

const scoreController = require('../controllers/score');

const Score = require('../modèles/score');

// Route pour ajouter un score
router.post(
    '/scores',
    [
      auth,
      body('levelId').isInt().not().isEmpty(),
      body('userId').isInt().not().isEmpty(),
      body('scoreBTime').isInt().not().isEmpty()
    ],
    scoreController.postScore
);


module.exports = router;
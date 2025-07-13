const express = require('express');
const { body } = require('express-validator');
const scoresController = require('../controllers/scores');

const router = express.Router();

router.post('/',
  [
    body('levelId').isInt(),
    body('userId').isString(),
    body('scoreBTime').isInt()
  ],
  scoresController.postScore
);

router.get('/best/:userId/:levelId', scoresController.getBestScore);

router.put('/update', 
  [
    body('levelId').isInt(),
    body('userId').isString(),
    body('score').isInt()
  ], 
  scoresController.updateBestScore);

module.exports = router;

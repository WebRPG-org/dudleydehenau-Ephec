const express = require('express');

const { query } = require('express-validator');

const router = express.Router();

const levelController = require('../controllers/level');

const Level = require('../modèles/level');

router.get(
    '/search', 
    [
        query('term')
        .trim()
        .not()
        .isEmpty()
        .withMessage('la recherche ne peut pas être vide')
    ], 
    levelController.searchLevels
);

router.get('/data',
    levelController.getLevelData
);  

module.exports = router;
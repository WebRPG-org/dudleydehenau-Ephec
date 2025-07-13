const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const User = require('../modèles/user');

const authController = require('../controllers/auth');

router.post(
    '/signup',
    [body('nom').trim().not().isEmpty(),
    body('email').isEmail().withMessage('Email invalide').custom(async(email) =>{
        const user = await User.find(email);
        if(user[0].length > 0){
            return Promise.reject('email existe déjà');
        }
    })
    .normalizeEmail(),
    body('secret').trim().isLength({min: 7})
    ],
    authController.signup
);

router.post('/login', authController.login);

module.exports = router;
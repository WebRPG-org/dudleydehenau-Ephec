const express = require('express');

const { body } = require('express-validator');

const commentaireController = require('../controllers/commentaire');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:levelId',auth, commentaireController.fetchAll);

router.post(
  '/',
  [
    auth,
    body('userId').trim().not().isEmpty(),
    body('levelId').trim().not().isEmpty(),
    body('commentaryText').trim().isLength({ min: 10 }).not().isEmpty(),
  ],
  commentaireController.postCommentaire
);

router.delete('/:id' ,auth, commentaireController.deleteCommentaire);

module.exports = router;
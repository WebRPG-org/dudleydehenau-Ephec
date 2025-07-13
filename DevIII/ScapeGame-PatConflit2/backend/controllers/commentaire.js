const { validationResult } = require('express-validator');

const Commentaire = require('../modèles/commentaire');

exports.fetchAll = async (req, res, next) => {
    try{
        const [allCommentaires] = await Commentaire.fetchAll();
        res.status(200).json(allCommentaires);
    }catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    }
};

exports.postCommentaire = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) return

    const commentaire = req.body.commentaire;
    const userId = req.body.userId;

    try{

        const commentaireDetails = {
            commentaire: commentaire,
            userId: userId,
        };

        const result = await Commentaire.save(commentaireDetails);

        res.status(201).json({message: 'posté avec succès'});
    }catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    }
};

exports.deleteCommentaire = async (req, res, next) => {
    try{
        const deleteResponse = await Commentaire.delete(req.params.id);
        res.status(200).json(deleteResponse);
    }catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    }
};

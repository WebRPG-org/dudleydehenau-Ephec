const db = require('../utiles/databases');

module.exports = class Post {
  constructor( commentaire, userId) {
    this.commentaire = commentaire;
    this.userId = userId;
  }

  static fetchAll() {
    return db.execute('SELECT * FROM commentaire');
  }

  static save(commentaire) {
    return db.execute(
      'INSERT INTO commentaire (commentaire, userId) VALUES (?, ?)',
      [commentaire.commentaire, commentaire.userId]
    );


  }
   static delete(id){
    return db.execute('DELETE FROM commentaire WHERE id = ?', [id]);
  }
}



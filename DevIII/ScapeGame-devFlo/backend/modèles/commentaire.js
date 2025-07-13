const db = require('../utiles/databases');

module.exports = class Post {
  constructor(userId,levelId,commentaryText) {
    this.userId = userId;
    this.levelId = levelId;
    this.commentaryText = commentaryText;
  }

  static fetchAll(levelId) {
    return db.execute(
        'SELECT * FROM commentary WHERE levelId = ?',[levelId]);

  }

  static save(commentary) {
    return db.execute(
      'INSERT INTO commentary (userId,levelId,commentaryText) VALUES (?, ?, ?)',
      [commentary.userId,commentary.levelId,commentary.commentaryText]
    );


  }
   static delete(id){
    return db.execute('DELETE FROM commentary WHERE commentaryId = ?', [id]);
  }
}



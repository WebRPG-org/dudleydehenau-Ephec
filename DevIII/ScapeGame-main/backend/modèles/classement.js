const db = require('../utiles/databases');

module.exports = class Scores {
  constructor(levelId, scoreBTime) {
    this.levelId = levelId;
    this.scoreBTime = scoreBTime;
  }

  static getClassement(levelId) {
    return db.execute(
      'SELECT userId, scoreBTime FROM scoreboard WHERE levelId = ? ORDER BY scoreBTime ASC',
      [levelId]
    );
  }
};

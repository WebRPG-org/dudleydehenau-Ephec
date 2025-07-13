const db = require('../utiles/databases');

module.exports = class Scores {
  constructor(levelId, userId, scoreBTime) {
    this.levelId = levelId;
    this.userId = userId;
    this.scoreBTime = scoreBTime;
  }

  static save(score) {
    return db.execute(
      'INSERT INTO scoreboard (levelId, userId, scoreBTime) VALUES (?, ?, ?)',
      [score.levelId, score.userId, score.scoreBTime]
    );
  }

  static getBestScore(levelId, userId) {
    return db.execute(
      'SELECT scoreBTime FROM scoreboard WHERE levelId = ? AND userId = ? ORDER BY scoreBTime DESC LIMIT 1',
      [levelId, userId]
    );
  }

  static updateScore(levelId, userId, scoreBTime) {
    return db.execute(
      'UPDATE scoreboard SET scoreBTime = ? WHERE levelId = ? AND userId = ?',
      [scoreBTime, levelId, userId]
    );
  }
}

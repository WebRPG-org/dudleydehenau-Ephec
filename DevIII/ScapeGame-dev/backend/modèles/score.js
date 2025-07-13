const db = require('../utiles/databases');

module.exports = class Score {
    constructor(levelId, userId, scoreBTime) {
        this.levelId = levelId;
        this.userId = userId;
        this.scoreBTime = scoreBTime;
    }

    static async save(score) {
        // check si un score existe
        const [rows] = await db.execute(
            'SELECT scoreBTime FROM scoreboard WHERE levelId = ? AND userId = ?',
            [score.levelId, score.userId]
        );

        if (rows.length > 0) {
            // update si le score est plus haut
            const existingScore = rows[0].scoreBTime;
            if (score.scoreBTime > existingScore) {
                return db.execute(
                    'UPDATE scoreboard SET scoreBTime = ? WHERE levelId = ? AND userId = ?',
                    [score.scoreBTime, score.levelId, score.userId]
                );
            } else {
                // fait rien si le score est plus bas
                return Promise.resolve();
            }
        } else {
            // si pas de score
            return db.execute(
                'INSERT INTO scoreboard (levelId, userId, scoreBTime) VALUES (?, ?, ?)',
                [score.levelId, score.userId, score.scoreBTime]
            );
        }
    }
}

const db = require('../utiles/databases');

module.exports = class Level {
    constructor(levelId, levelName, difficulty, theme, likes, publication_date, views) {
        this.levelId = levelId;
        this.levelName = levelName;
        this.difficulty = difficulty;
        this.theme = theme;
        this.likes = likes;
        this.publication_date = publication_date;
        this.views = views;
    }

    static fetchAll() {
        return db.execute('SELECT * FROM level');
    }

    static searchByName(name) {
        return db.execute(
            'SELECT * FROM level WHERE levelName LIKE ?',
            ['%' + name + '%']
        );
    }
}
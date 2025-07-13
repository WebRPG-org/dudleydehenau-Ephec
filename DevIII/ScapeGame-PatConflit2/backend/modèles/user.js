const db = require('../utiles/databases');

module.exports = class User {
    constructor(nom, email, secret){
        this.nom = nom;
        this.email = email;
        this.secret = secret;
    }

    static find(email){
        return db.execute('SELECT * FROM user WHERE email = ?', [email]);
    }

    static save(user){
        return db.execute(
            'INSERT INTO user (nom, email, secret) VALUES (?,?,?)',
            [user.nom, user.email, user.secret]
        );
    };
};
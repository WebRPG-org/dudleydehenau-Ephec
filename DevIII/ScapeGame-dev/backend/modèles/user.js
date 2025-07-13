const db = require('../utiles/databases');

module.exports = class User {
    constructor(userFName, userLName, userBirth,userPassword, email) {
        this.userFName = userFName;
        this.userLName = userLName;
        this.userBirth = userBirth;
        this.userPassword = userPassword;
        this.email = email;
    }

    static find(email){
        return db.execute('SELECT * FROM user WHERE email = ?', [email]);
    }

    static save(user){
        return db.execute(
            'INSERT INTO user (userFName,userLName,userBirth,userPassword,email ) VALUES (?,?,?,?,?)',
            [user.userFName, user.userLName, user.userBirth, user.userPassword, user.email]
        );
    };
};
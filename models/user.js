const db = require('../config/config');
const crypto = require('crypto');

const User = {};

User.getAll = () => {
    const sql = `SELECT * FROM users`;
    return db.manyOrNone(sql);
}

User.create = (user) =>{
    user.salt = crypto.randomBytes(16).toString('hex');      
    const passHashed = crypto.pbkdf2Sync(user.password, user.salt,  
    1000, 64, `sha512`).toString(`hex`); 

    user.password = passHashed;

    const sql = `INSERT INTO 
    users
    (
        email,
        name,
        lastname,
        phone,
        password,
        image,
        salt,
        created_at,
        updated_at
    )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id`;
    

    return db.oneOrNone(sql, [
        user.email,
        user.name,
        user.lastname,
        user.phone,
        user.password,
        user.image,
        user.salt,
        new Date(),
        new Date()
    ]);
}
module.exports = User;
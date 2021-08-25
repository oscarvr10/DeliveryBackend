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

    const sql = `
    INSERT INTO 
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

User.findById = (id, callback) =>{
    const sql = `
    SELECT
        id,
        email,
        name,
        lastname,
        image,
        phone,
        password,        
        session_token
    FROM users
    WHERE id = $1`;

    return db.oneOrNone(sql, id).then(user => { callback(null, user)});
}

User.findByEmail = (email) =>{
    const sql = `
    SELECT
        u.id,
        u.email,
        u.name,
        u.lastname,
        u.image,
        u.phone,
        u.password,        
        u.salt,
        u.session_token,
        json_agg(
            json_build_object(
                'id', r.id,
                'name', r.name,
                'image', r.image,
                'route', r.route
            )
        ) AS roles
        FROM users AS u
        INNER JOIN user_has_roles AS uhr
        ON uhr.id_user = u.id
        INNER JOIN roles AS r
        ON r.id = uhr.id_role
        WHERE u.email = $1
        GROUP BY u.id`;

    return db.oneOrNone(sql, email);
}

User.isPasswordMatched = (password, passwordHashed, salt) =>{
    var hash = crypto.pbkdf2Sync(password,  
        salt, 1000, 64, `sha512`).toString(`hex`);         

    return hash === passwordHashed; 
}

module.exports = User;
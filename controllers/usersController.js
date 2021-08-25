const User = require('../models/user');
const Role = require('../models/role');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = {
    async getAll(req, res, next) {
        try {
            const users = await User.getAll();
            console.log(`Usuarios: ${users}`);

            return res.status(201).json({
                success: true,
                message: null,
                data: users
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(200).json({
                success: false,
                data : null,
                message: 'Error al obtener los usuarios',
                error: error
            });
        }
    },

    async register(req, res, next) {
        try {
            const user = req.body;
            const data = await User.create(user);
            
            await Role.create(data.id, 1); // Role by default -> client

            return res.status(201).json({
                success: true,
                message: 'El registro se ha realizado correctamente. Por favor, ahora inicia sesión.',
                data: data.id
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                data : null,
                message: 'Hubo un error al registrar el usuario. Intenta nuevamente.',
                error: error
            });
        }
    },

    async login(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const userResult = await User.findByEmail(email);

            if(!userResult) {
                return res.status(401).json({
                    success: false,
                    message: 'El correo electrónico no fue encontrado. Verifica tus datos.',
                    data: null
                });
            }

            if(User.isPasswordMatched(password, userResult.password, userResult.salt)) {
                const token = jwt.sign(
                    {
                        id: userResult.id,
                        email: userResult.email,
                    }, 
                    keys.secretOrKey, {
                        //expiresIn: (60*60*24) // 1 hora
                    }
                );
                const data = {
                    id: userResult.id,
                    name: userResult.name,
                    lastname: userResult.lastname, 
                    email: userResult.email, 
                    phone: userResult.phone, 
                    image: userResult.image, 
                    session_token: `JWT ${token}`,
                    roles: userResult.roles
                }

                console.log(`USUARIO: ${data}`);

                return res.status(200).json({
                    success: true,
                    message: `¡Bienvenido ${userResult.name} ${userResult.lastname}!`,
                    data: data
                });
            } else{
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña y/o el correo electrónico son incorrectos. Verifica tus datos.',
                    data: null
                });
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                data : null,
                message: 'Error al momento de autenticar al usuario. Intenta nuevamente.',
                error: error
            });
        }
    }
};
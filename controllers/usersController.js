const User = require('../models/user');

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
            return res.status(501).json({
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

            return res.status(201).json({
                success: true,
                message: 'El usuario se ha registrado correctamente.',
                data: data.id
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                data : null,
                message: 'Hubo un error al registrar el usuario.',
                error: error
            });
        }
    }
};
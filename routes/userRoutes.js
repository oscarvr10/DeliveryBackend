const UsersController = require('../controllers/usersController');

module.exports = (app) => {
    app.get('/api/users', UsersController.getAll);
    app.post('/api/users/create', UsersController.register);
    app.post('/api/users/login', UsersController.login);
}
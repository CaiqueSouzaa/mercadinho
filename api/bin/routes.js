const { Router } = require('express');
const { body } = require('express-validator');

// Importação de middlewares
const catchError = require('./app/middlewares/catchError.js');
const jwtAuthorization = require('./app/middlewares/jwtAuthorization.js');

const SessoesController = require('./app/controllers/SessoesController.js');
const UsuariosController = require('./app/controllers/UsuariosController.js');
const alterPassword = require('./app/middlewares/alterPassword.js');

const routes = new Router();

routes.post(
    '/login',
    body(['login', 'password']).escape(),
    SessoesController.store
);

routes.use(jwtAuthorization);
routes.use(alterPassword);

routes.get('/', (req, res) =>
    res.status(200).json({
        message: true,
        code: 200,
    })
);

// Rotas de usuários
routes.get('/usuarios', UsuariosController.index);
routes.post(
    '/usuarios',
    body([
        'nome',
        'sobrenome',
        'login',
        'senha',
        'confirmacao_senha',
        'alterar_senha',
    ]).escape(),
    UsuariosController.store
);

routes.use(catchError);

module.exports = routes;

const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const jwtConfig = require('../../config/jwtConfig.js');
const Sessoes = require('../models/Sessoes.js');

module.exports = async (req, res, next) => {
    const headerAuthorization = req.headers.authorization;

    if (!headerAuthorization) {
        return res.status(401).json({
            message: 'Token não localizado',
            code: 401,
        });
    }

    const [bearer, token] = headerAuthorization.split(' ');

    if (bearer !== 'Bearer') {
        return res.status(401).json({
            message: 'Bearer não localizado',
            code: 401,
        });
    }
    if (!token) {
        return res.status(401).json({
            message: "Necessário 'Bearer' estar presente ao token de sessão",
            code: 401,
        });
    }

    // Verificando se o token segue ativo no bando de dados
    try {
        const session_token = await Sessoes.findOne({
            where: {
                token,
                ainda_valido: true,
            },
        });

        if (!session_token) {
            return res.status(401).json({
                message: 'Token de sessão não válido',
                code: 401,
            });
        }
    } catch (err) {
        return next(err);
    }

    try {
        const decoded = await promisify(jwt.verify)(token, jwtConfig.secret);

        // console.log(decoded);

        req.userLogin = decoded.login;
        req.userId = decoded.id;

        return next();
    } catch (err) {
        return res.status(401).json({
            message: 'Não autorizado',
            code: 401,
        });
    }
};

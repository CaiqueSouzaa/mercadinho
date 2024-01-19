require('dotenv/config.js');

const Usuarios = require('../models/Usuarios.js');

module.exports = async (req, res, next) => {
    // Verificando se o usuário deve atualizar a senha
    try {
        const user = await Usuarios.findByPk(req.userId);

        if (user.dataValues.update_password) {
            return res.status(200).json({
                message: 'Necessário atualizar sua senha de acesso',
                url: `http://${process.env.APP_URL}:${process.env.APP_PORT}/update-password?login=${req.userLogin}`,
                code: 200,
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: 'Ocorreu um erro no lado do servidor',
            code: 500,
        });
    }

    return next();
};

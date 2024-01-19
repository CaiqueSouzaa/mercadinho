require('dotenv/config');
const { matchedData } = require('express-validator');
const jwt = require('jsonwebtoken');
const Yup = require('yup');

const Sessoes = require('../models/Sessoes.js');
const Usuarios = require('../models/Usuarios.js');
const jwtConfig = require('../../config/jwtConfig.js');

class SessoesController {
    async store(req, res, next) {
        const data = matchedData(req);
        const schema = Yup.object().shape({
            login: Yup.string().min(5).required(),
            password: Yup.string().min(5).required(),
        });

        // Verifiando se os dados enviados estão de acordo com o esperado definido no Yup
        try {
            await schema.validate(data);
        } catch (err) {
            return res.status(400).json({
                message: err.errors,
                code: 400,
            });
        }

        // Verificando se o login informado existe e se a password correspode ao usuário
        let user;
        try {
            user = await Usuarios.findOne({
                where: {
                    login: data.login,
                },
            });

            if (!user) {
                return res.status(400).json({
                    message: 'Usuário ou senha incorretos',
                    code: 400,
                });
            }

            if (!(await user.checkPassword(data.password))) {
                return res.status(400).json({
                    message: 'Usuário ou senha incorretos',
                    code: 400,
                });
            }
        } catch (err) {
            return next(err);
        }

        // Invalidando os tokens existentes do usuário
        try {
            const sessions = await Sessoes.findAll({
                where: {
                    usuario_id: user.dataValues.id,
                    ainda_valido: true,
                },
            });

            if (sessions) {
                sessions.forEach(async (session) => {
                    await session.update({
                        ainda_valido: false,
                    });
                });
            }
        } catch (err) {
            return next(err);
        }

        // Gerando o token do usuário
        const session_token = jwt.sign(
            { id: user.dataValues.id, login: user.dataValues.login },
            jwtConfig.secret,
            {
                expiresIn: jwtConfig.expiresIn,
            }
        );

        // Salvando a token no banco de dados
        try {
            await Sessoes.create({
                usuario_id: user.dataValues.id,
                token: session_token,
                ainda_valido: true,
            });
        } catch (err) {
            return next(err);
        }

        return res.status(200).json({
            session_token,
        });
    }
}

module.exports = new SessoesController();

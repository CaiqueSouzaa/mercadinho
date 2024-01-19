/* eslint-disable no-unused-vars */
const { matchedData } = require('express-validator');
const Yup = require('yup');

const Usuarios = require('../models/Usuarios.js');

class UsuariosController {
    async index(req, res, next) {
        // Obtendo os usuários cadastrados
        let users;
        try {
            users = await Usuarios.findAll({
                attributes: [
                    'id',
                    'nome',
                    'sobrenome',
                    'login',
                    'update_password',
                ],
            });
        } catch (err) {
            return next(err);
        }

        return res.status(200).json({
            users,
            code: 200,
        });
    }

    async store(req, res, next) {
        const data = matchedData(req);
        const schema = Yup.object().shape({
            nome: Yup.string().min(3).required(),
            sobrenome: Yup.string(),
            login: Yup.string().min(5).required(),
            senha: Yup.string().min(5).required(),
            confirmacao_senha: Yup.string().min(5).required(),
            alterar_senha: Yup.boolean(),
        });

        // Removendo os valores vazios dos campos não preenchidos
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(data)) {
            if (data[key] === '') {
                data[key] = undefined;
            }
        }

        // Validando os dados enviados para a API
        try {
            await schema.validate(data);
        } catch (err) {
            return res.status(400).json({
                message: err.errors,
                code: 400,
            });
        }

        // Verificando se o nome de login já existe
        try {
            const login = await Usuarios.findOne({
                where: {
                    login: data.login,
                },
                attributes: ['id'],
            });

            if (login) {
                return res.status(409).json({
                    message: `Nome de login '${data.login}' em uso`,
                    code: 409,
                });
            }
        } catch (err) {
            return next(err);
        }

        // Verificanso se as senhas são iguais

        if (data.confirmacao_senha !== data.senha) {
            return res.status(400).json({
                message: 'As senhas não são iguais',
                code: 400,
            });
        }

        // Criando o usuário
        try {
            const { id } = await Usuarios.create({
                nome: data.nome,
                sobrenome: data.sobrenome,
                login: data.login,
                password: data.senha,
                update_password: data.alterar_senha,
            });

            return res.status(201).json({
                id,
                message: 'Usuário criado com sucesso',
                code: 201,
            });
        } catch (err) {
            return next(err);
        }
    }

    async updatePassword(req, res, next) {
        const data = matchedData(req);
        const schema = Yup.object().shape({
            senha: Yup.string().min(5).required(),
            nova_senha: Yup.string().min(5).required(),
            confirmacao_senha: Yup.string().min(5).required(),
        });

        // Validando os dados encaminhados para a API
        try {
            await schema.validate(data);
        } catch (err) {
            return res.status(400).json({
                message: err.errors,
                code: 400,
            });
        }

        // Buscando pelo login informado
        let user;
        try {
            user = await Usuarios.findOne({
                where: {
                    login: data.login,
                    update_password: true,
                },
            });

            if (!user) {
                return res.status(401).json({
                    message:
                        'Login de usuário não localizado ou o usuário não necessita atualizar a senha',
                    code: 401,
                });
            }
        } catch (err) {
            return next(err);
        }

        // Verificando se a senha informada corresponde a senha do usuário
        if (!(await user.checkPassword(data.senha))) {
            return res.status(401).json({
                message: 'Senha de usuário incorreta',
                code: 401,
            });
        }

        // Confirmando se a nova senha e a confirmação de senha são iguais
        if (data.confirmacao_senha !== data.nova_senha) {
            return res.status(400).json({
                message: 'As novas senhas não são iguais',
                code: 400,
            });
        }

        // Atualizando a senha do usuário
    }
}

module.exports = new UsuariosController();

/* eslint-disable import/no-extraneous-dependencies */
const { Sequelize, Model } = require('sequelize');
const bcrypt = require('bcrypt');

class Usuarios extends Model {
    static init(sequelize) {
        super.init(
            {
                nome: Sequelize.STRING,
                sobrenome: Sequelize.STRING,
                login: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
                update_password: Sequelize.BOOLEAN,
                created_at: Sequelize.DATE,
                updated_at: Sequelize.DATE,
            },
            {
                sequelize,
                modelName: 'Usuarios',
                tableName: 'usuarios',
            }
        );

        this.addHook('beforeSave', async (usuario) => {
            if (usuario.password) {
                // eslint-disable-next-line no-param-reassign
                usuario.password_hash = await bcrypt.hash(usuario.password, 12);
            }
        });

        return this;
    }

    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

module.exports = Usuarios;

const { Sequelize, Model } = require('sequelize');

class Sessoes extends Model {
    static init(sequelize) {
        super.init(
            {
                usuario_id: Sequelize.INTEGER,
                token: Sequelize.STRING,
                ainda_valido: Sequelize.BOOLEAN,
                created_at: Sequelize.DATE,
                updated_at: Sequelize.DATE,
            },
            {
                sequelize,
                modelName: 'Sessoes',
                tableName: 'sessoes',
            }
        );

        return this;
    }
}

module.exports = Sessoes;

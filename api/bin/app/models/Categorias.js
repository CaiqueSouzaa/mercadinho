const { Sequelize, Model } = require('sequelize');

class Categorias extends Model {
    static init(sequelize) {
        super.init(
            {
                nome: Sequelize.STRING,
                descricao: Sequelize.STRING,
                criado_por: Sequelize.INTEGER,
                created_at: Sequelize.DATE,
                updated_at: Sequelize.DATE,
            },
            {
                sequelize,
                modelName: 'Categorias',
                tableName: 'categorias',
            }
        );

        return this;
    }

    static association(models) {
        this.belongsTo(models.Usuarios, {
            foreignKey: 'criado_por',
            key: 'id',
            as: 'criadoPor',
        });
    }
}

module.exports = Categorias;

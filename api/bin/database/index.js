const { Sequelize } = require('sequelize');

const databaseConfig = require('../config/database.cjs');
const Sessoes = require('../app/models/Sessoes.js');
const Usuarios = require('../app/models/Usuarios.js');
const Categorias = require('../app/models/Categorias.js');

const models = [Sessoes, Usuarios, Categorias];

class Database {
    constructor() {
        this.connection = new Sequelize(databaseConfig);

        this.init();
    }

    init() {
        models
            .map((model) => model.init(this.connection))
            .map(
                (model) =>
                    model.association &&
                    model.association(this.connection.models)
            );
    }
}

module.exports = new Database();

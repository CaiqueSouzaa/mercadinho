// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const password_hash = await bcrypt.hash('admin', 12);
        await queryInterface.bulkInsert(
            'Usuarios',
            [
                {
                    nome: 'admin',
                    sobrenome: 'admin',
                    login: 'admin',
                    password_hash,
                    update_password: false,
                    created_at: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Usuarios', null, {});
    },
};

'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('Places', [
            {
                name: 'Nghe An',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Hà Tĩnh',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Thanh Hóa    ',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Hà tĩnh',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Hà tĩnh',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});

    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Places', null, {});
    }
};

'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Clinics', [
            {
                name: 'Hà Nam',
                address: 'Trụ sở: Tầng 1, TTTM 25 Lý Thường Kiệt, Phan Chu Trinh, Hoàn Kiếm, Hà Nội',
                image: 'usa-az.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Long Xuyên',
                address: 'Trụ sở: Tầng 1, TTTM 25 Lý Thường Kiệt, Phan Chu Trinh, Hoàn Kiếm, Hà Nội',
                image: 'mayo-clinic-health-system.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Hoa Phat',
                address: ', Trụ sở: Tầng 1, TTTM 25 Lý Thường Kiệt, Phan Chu Trinh, Hoàn Kiếm, Hà Nội',
                image: 'campbell-clinic.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Tân Bình',
                address: 'Trụ sở: Tầng 1, TTTM 25 Lý Thường Kiệt, Phan Chu Trinh, Hoàn Kiếm, Hà Nội',
                image: 'cleveland-clinic-usa.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Thắng Long',
                address: 'Trụ sở: Tầng 1, TTTM 25 Lý Thường Kiệt, Phan Chu Trinh, Hoàn Kiếm, Hà Nội',
                image: 'clinic-Ft-McCoy.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Clinics', null, {});
    }
};

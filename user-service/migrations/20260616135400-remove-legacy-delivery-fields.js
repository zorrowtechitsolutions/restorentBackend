'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('deliveries', 'km');
    await queryInterface.removeColumn('deliveries', 'price');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('deliveries', 'km', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('deliveries', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });
  }
};

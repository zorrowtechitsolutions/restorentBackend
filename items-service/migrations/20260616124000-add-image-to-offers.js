'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('offers', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'amount'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('offers', 'image');
  }
};

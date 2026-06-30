'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'pos_payment_note');
    await queryInterface.removeColumn('orders', 'payment_method');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'pos_payment_note', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('orders', 'payment_method', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};

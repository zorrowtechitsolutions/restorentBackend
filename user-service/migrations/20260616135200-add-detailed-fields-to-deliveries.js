'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('deliveries', 'distance_km', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('deliveries', 'delivery_rate_per_km', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('deliveries', 'calculated_delivery_charge', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('deliveries', 'distance_km');
    await queryInterface.removeColumn('deliveries', 'delivery_rate_per_km');
    await queryInterface.removeColumn('deliveries', 'calculated_delivery_charge');
  }
};

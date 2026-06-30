'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('branches', 'password', {
        type: Sequelize.STRING,
        allowNull: true, // Existing branches won't have it
      }),
      queryInterface.addColumn('branches', 'otp', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('branches', 'otp_expiry', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('branches', 'role_id', {
        type: Sequelize.INTEGER,
        allowNull: true, // Will default or be required based on logic
      }),
      queryInterface.addColumn('branches', 'fcm_token', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('branches', 'password'),
      queryInterface.removeColumn('branches', 'otp'),
      queryInterface.removeColumn('branches', 'otp_expiry'),
      queryInterface.removeColumn('branches', 'role_id'),
      queryInterface.removeColumn('branches', 'fcm_token'),
    ]);
  }
};

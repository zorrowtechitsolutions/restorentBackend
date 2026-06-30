"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add fcm_token
    await queryInterface.addColumn("users", "fcm_token", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // 2. Remove deprecated tokens
    await queryInterface.removeColumn("users", "device_token");
    await queryInterface.removeColumn("users", "web_token");
    await queryInterface.removeColumn("users", "remember_token");
  },

  async down(queryInterface, Sequelize) {
    // Revert changes
    await queryInterface.removeColumn("users", "fcm_token");
    
    await queryInterface.addColumn("users", "device_token", { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn("users", "web_token", { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn("users", "remember_token", { type: Sequelize.STRING, allowNull: true });
  },
};

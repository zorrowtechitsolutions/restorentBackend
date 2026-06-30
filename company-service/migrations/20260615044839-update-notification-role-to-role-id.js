"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Remove old role column
    await queryInterface.removeColumn("notifications", "role");
    
    // 2. Add new role_id column
    await queryInterface.addColumn("notifications", "role_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert changes
    await queryInterface.removeColumn("notifications", "role_id");
    await queryInterface.addColumn("notifications", "role", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};

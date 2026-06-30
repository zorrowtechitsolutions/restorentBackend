"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the role_id column from leave_requests table
    await queryInterface.removeColumn("leave_requests", "role_id");
  },

  async down(queryInterface, Sequelize) {
    // Re-add role_id if we have to rollback
    await queryInterface.addColumn("leave_requests", "role_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};

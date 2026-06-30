"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove old columns
    await queryInterface.removeColumn("attendances", "time_in");
    await queryInterface.removeColumn("attendances", "time_out");
    await queryInterface.removeColumn("attendances", "attendance_date");

    // Add new EMS-style columns
    await queryInterface.addColumn("attendances", "type", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("attendances", "timestamp", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("attendances", "latitude", {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });
    await queryInterface.addColumn("attendances", "longitude", {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
    });
    await queryInterface.addColumn("attendances", "selfie_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("attendances", "status", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("attendances", "time_in", { type: Sequelize.STRING });
    await queryInterface.addColumn("attendances", "time_out", { type: Sequelize.STRING });
    await queryInterface.addColumn("attendances", "attendance_date", { type: Sequelize.DATEONLY });

    await queryInterface.removeColumn("attendances", "type");
    await queryInterface.removeColumn("attendances", "timestamp");
    await queryInterface.removeColumn("attendances", "latitude");
    await queryInterface.removeColumn("attendances", "longitude");
    await queryInterface.removeColumn("attendances", "selfie_url");
    await queryInterface.removeColumn("attendances", "status");
  },
};

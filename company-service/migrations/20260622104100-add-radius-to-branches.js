"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("branches", "radius", {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "Allowed attendance radius in meters",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("branches", "radius");
  },
};

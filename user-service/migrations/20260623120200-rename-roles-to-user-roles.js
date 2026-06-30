"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable("roles", "user_roles");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable("user_roles", "roles");
  },
};

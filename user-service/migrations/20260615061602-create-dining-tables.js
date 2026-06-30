"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("dining_tables", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      qr_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      creator_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      creator_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      editor_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      editor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("dining_tables");
  },
};

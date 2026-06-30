"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. CREATE roles table
    await queryInterface.createTable("roles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      permissions: {
        type: Sequelize.JSONB,
        defaultValue: {},
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });

    // 2. CREATE users table
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      image: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: false, unique: true },
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      email_verified_at: { type: Sequelize.DATE, allowNull: true },
      password: { type: Sequelize.STRING, allowNull: false },
      device_token: { type: Sequelize.STRING, allowNull: true },
      web_token: { type: Sequelize.STRING, allowNull: true },
      branch_id: { type: Sequelize.INTEGER, allowNull: true },
      country_code: { type: Sequelize.STRING, allowNull: true },
      is_guest: { type: Sequelize.BOOLEAN, defaultValue: false },
      status: { type: Sequelize.INTEGER, defaultValue: 1 },
      balance: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0.0 },
      creator_type: { type: Sequelize.STRING, allowNull: true },
      creator_id: { type: Sequelize.INTEGER, allowNull: true },
      editor_type: { type: Sequelize.STRING, allowNull: true },
      editor_id: { type: Sequelize.INTEGER, allowNull: true },
      remember_token: { type: Sequelize.STRING, allowNull: true },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("roles");
  },
};

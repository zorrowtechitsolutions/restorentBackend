"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_items", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "orders", key: "id" },
        onDelete: "CASCADE",
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      tax_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tax_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      tax_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      item_variations: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      item_extras: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      item_variation_total: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      item_extra_total: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      instruction: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable("order_items");
  },
};

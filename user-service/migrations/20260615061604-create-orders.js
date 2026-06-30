"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_serial_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      delivery_charge: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      total_tax: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      order_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      order_date_time: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      delivery_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      preparation_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_advance_order: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      payment_method: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pos_payment_method: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pos_received_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      pos_payment_note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      payment_status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      dining_table_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "dining_tables", key: "id" },
      },
      delivery_boy_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      source: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable("orders");
  },
};

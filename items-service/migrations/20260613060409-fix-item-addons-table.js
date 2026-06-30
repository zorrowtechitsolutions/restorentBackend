"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add missing columns
    await queryInterface.addColumn("item_addons", "addon_item_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "items", key: "id" },
    });

    await queryInterface.addColumn("item_addons", "addon_item_variation", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // 2. Remove incorrect columns
    await queryInterface.removeColumn("item_addons", "name");
    await queryInterface.removeColumn("item_addons", "price");
    await queryInterface.removeColumn("item_addons", "status");
  },

  async down(queryInterface, Sequelize) {
    // Revert changes
    await queryInterface.removeColumn("item_addons", "addon_item_id");
    await queryInterface.removeColumn("item_addons", "addon_item_variation");
    
    await queryInterface.addColumn("item_addons", "name", { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn("item_addons", "price", { type: Sequelize.DECIMAL(10,2), allowNull: true });
    await queryInterface.addColumn("item_addons", "status", { type: Sequelize.INTEGER, defaultValue: 1 });
  },
};

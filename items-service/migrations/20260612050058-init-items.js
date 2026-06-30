"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const commonFields = {
      creator_type: { type: Sequelize.STRING, allowNull: true },
      creator_id: { type: Sequelize.INTEGER, allowNull: true },
      editor_type: { type: Sequelize.STRING, allowNull: true },
      editor_id: { type: Sequelize.INTEGER, allowNull: true },
      branch_id: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    };

    // 1. CREATE item_categories
    await queryInterface.createTable("item_categories", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.INTEGER, defaultValue: 1 },
      sort: { type: Sequelize.INTEGER, defaultValue: 0 },
      ...commonFields,
    });

    // 2. CREATE item_taxes
    await queryInterface.createTable("item_taxes", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING, allowNull: false },
      code: { type: Sequelize.STRING, allowNull: false, unique: true },
      tax_rate: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      status: { type: Sequelize.INTEGER, defaultValue: 1 },
      ...commonFields,
    });

    // 3. CREATE items
    await queryInterface.createTable("items", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      item_category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "item_categories", key: "id" },
      },
      tax_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "item_taxes", key: "id" },
      },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      image: { type: Sequelize.STRING, allowNull: true },
      caution: { type: Sequelize.STRING, allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      status: { type: Sequelize.INTEGER, defaultValue: 1 },
      item_type: { type: Sequelize.STRING, allowNull: false },
      order: { type: Sequelize.INTEGER, defaultValue: 0 },
      is_featured: { type: Sequelize.BOOLEAN, defaultValue: false },
      ...commonFields,
    });

    // 4. CREATE item_attributes
    await queryInterface.createTable("item_attributes", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING, allowNull: false },
      status: { type: Sequelize.INTEGER, defaultValue: 1 },
      ...commonFields,
    });

    // 5. CREATE item_variations
    await queryInterface.createTable("item_variations", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "items", key: "id" },
      },
      item_attribute_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "item_attributes", key: "id" },
      },
      name: { type: Sequelize.STRING, allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      caution: { type: Sequelize.STRING, allowNull: true },
      status: { type: Sequelize.INTEGER, defaultValue: 1 },
      ...commonFields,
    });

    // 6. CREATE item_extras
    await queryInterface.createTable("item_extras", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING, allowNull: false },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "items", key: "id" },
      },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      status: { type: Sequelize.INTEGER, defaultValue: 1 },
      ...commonFields,
    });

    // 7. CREATE item_addons
    await queryInterface.createTable("item_addons", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "items", key: "id" },
      },
      addon_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "items", key: "id" },
      },
      addon_item_variation: { type: Sequelize.STRING, allowNull: true },
      ...commonFields,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("item_addons");
    await queryInterface.dropTable("item_extras");
    await queryInterface.dropTable("item_variations");
    await queryInterface.dropTable("item_attributes");
    await queryInterface.dropTable("items");
    await queryInterface.dropTable("item_taxes");
    await queryInterface.dropTable("item_categories");
  },
};

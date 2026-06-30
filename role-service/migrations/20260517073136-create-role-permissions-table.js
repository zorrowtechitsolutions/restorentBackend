"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("role_permissions");

    // ✅ branchId
    if (!table.branchId) {
      await queryInterface.addColumn("role_permissions", "branchId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    // ✅ Remove deprecated columns if they still exist
    if (table.hospitalId) {
      await queryInterface.removeColumn("role_permissions", "hospitalId");
    }

    if (table.labId) {
      await queryInterface.removeColumn("role_permissions", "labId");
    }

    if (table.pharmacyId) {
      await queryInterface.removeColumn("role_permissions", "pharmacyId");
    }

    // ✅ Composite Unique Constraint
    const indexes = await queryInterface.showIndex("role_permissions");

    const indexExists = indexes.some(
      (index) => index.name === "unique_role_permission_scope"
    );

    if (indexExists) {
      await queryInterface.removeIndex(
        "role_permissions",
        "unique_role_permission_scope"
      );
    }

    await queryInterface.addIndex(
      "role_permissions",
      ["roleId", "permissionId", "branchId"],
      {
        unique: true,
        name: "unique_role_permission_scope",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("role_permissions");

    // ✅ Remove index safely
    const indexes = await queryInterface.showIndex("role_permissions");

    const indexExists = indexes.some(
      (index) => index.name === "unique_role_permission_scope"
    );

    if (indexExists) {
      await queryInterface.removeIndex(
        "role_permissions",
        "unique_role_permission_scope"
      );
    }

    // ✅ Remove branchId
    if (table.branchId) {
      await queryInterface.removeColumn("role_permissions", "branchId");
    }

    // ✅ Restore old columns
    if (!table.hospitalId) {
      await queryInterface.addColumn("role_permissions", "hospitalId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!table.labId) {
      await queryInterface.addColumn("role_permissions", "labId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (!table.pharmacyId) {
      await queryInterface.addColumn("role_permissions", "pharmacyId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },
};
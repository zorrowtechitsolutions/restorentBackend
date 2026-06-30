"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Add granular ID arrays
      const idColumns = [
        "administratorIds",
        "customerIds",
        "employeeIds",
        "waiterIds",
        "chefIds",
        "staffIds",
        "superAdminIds"
      ];
      for (const col of idColumns) {
        await queryInterface.addColumn(
          "notifications",
          col,
          {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            defaultValue: [],
          },
          { transaction }
        );
      }

      // Add granular read status objects
      const statusColumns = [
        "administratorReadStatus",
        "customerReadStatus",
        "employeeReadStatus",
        "waiterReadStatus",
        "chefReadStatus",
        "staffReadStatus",
        "superAdminReadStatus"
      ];
      for (const col of statusColumns) {
        await queryInterface.addColumn(
          "notifications",
          col,
          {
            type: Sequelize.JSONB,
            defaultValue: {},
          },
          { transaction }
        );
      }

      // Remove old columns
      await queryInterface.removeColumn("notifications", "userIds", { transaction });
      await queryInterface.removeColumn("notifications", "role_ids", { transaction });
      await queryInterface.removeColumn("notifications", "userReadStatus", { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Re-add old columns
      await queryInterface.addColumn(
        "notifications",
        "userIds",
        {
          type: Sequelize.ARRAY(Sequelize.INTEGER),
          defaultValue: [],
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "notifications",
        "role_ids",
        {
          type: Sequelize.ARRAY(Sequelize.INTEGER),
          defaultValue: [],
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "notifications",
        "userReadStatus",
        {
          type: Sequelize.JSONB,
          defaultValue: {},
        },
        { transaction }
      );

      // Remove new granular arrays
      const idColumns = [
        "administratorIds",
        "customerIds",
        "employeeIds",
        "waiterIds",
        "chefIds",
        "staffIds",
        "superAdminIds"
      ];
      for (const col of idColumns) {
        await queryInterface.removeColumn("notifications", col, { transaction });
      }

      // Remove new read status objects
      const statusColumns = [
        "administratorReadStatus",
        "customerReadStatus",
        "employeeReadStatus",
        "waiterReadStatus",
        "chefReadStatus",
        "staffReadStatus",
        "superAdminReadStatus"
      ];
      for (const col of statusColumns) {
        await queryInterface.removeColumn("notifications", col, { transaction });
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};

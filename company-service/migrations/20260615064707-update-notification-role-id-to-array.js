"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Rename column from role_id to role_ids
    await queryInterface.renameColumn("notifications", "role_id", "role_ids");

    // 2. Change type from INTEGER to INTEGER[]
    // We use a raw query because changeColumn with array types and casting needs explicit USING clause in Postgres
    await queryInterface.sequelize.query(
      'ALTER TABLE "notifications" ALTER COLUMN "role_ids" TYPE INTEGER[] USING ARRAY["role_ids"]'
    );

    // 3. Set default value to empty array
    await queryInterface.sequelize.query(
      'ALTER TABLE "notifications" ALTER COLUMN "role_ids" SET DEFAULT ARRAY[]::INTEGER[]'
    );
  },

  async down(queryInterface, Sequelize) {
    // Revert changes
    await queryInterface.sequelize.query(
      'ALTER TABLE "notifications" ALTER COLUMN "role_ids" TYPE INTEGER USING "role_ids"[1]'
    );
    await queryInterface.renameColumn("notifications", "role_ids", "role_id");
  },
};

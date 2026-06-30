"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create the ENUM types
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_orders_payment_status" AS ENUM ('paid', 'unpaid');`
    );
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_orders_status" AS ENUM ('accept', 'preparing', 'prepared', 'delivered');`
    );

    // 2. Convert payment_status: INTEGER -> ENUM
    //    Map old values: 0 = 'unpaid', 1 = 'paid'
    await queryInterface.sequelize.query(`
      ALTER TABLE "orders"
        ALTER COLUMN "payment_status" DROP DEFAULT,
        ALTER COLUMN "payment_status" TYPE "enum_orders_payment_status"
          USING (CASE
            WHEN "payment_status" = 1 THEN 'paid'
            ELSE 'unpaid'
          END)::"enum_orders_payment_status",
        ALTER COLUMN "payment_status" SET DEFAULT 'unpaid';
    `);

    // 3. Convert status: INTEGER -> ENUM
    //    Map old values: 0 = 'accept', 1 = 'accept', 2 = 'preparing', 3 = 'prepared', 4 = 'delivered'
    await queryInterface.sequelize.query(`
      ALTER TABLE "orders"
        ALTER COLUMN "status" DROP DEFAULT,
        ALTER COLUMN "status" TYPE "enum_orders_status"
          USING (CASE
            WHEN "status" = 0 THEN 'accept'
            WHEN "status" = 1 THEN 'accept'
            WHEN "status" = 2 THEN 'preparing'
            WHEN "status" = 3 THEN 'prepared'
            WHEN "status" = 4 THEN 'delivered'
            ELSE 'accept'
          END)::"enum_orders_status",
        ALTER COLUMN "status" SET DEFAULT 'accept';
    `);

    // 4. Add preparation_time to order_items
    await queryInterface.addColumn("order_items", "preparation_time", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // 1. Remove preparation_time from order_items
    await queryInterface.removeColumn("order_items", "preparation_time");

    // 2. Revert status back to INTEGER
    await queryInterface.sequelize.query(`
      ALTER TABLE "orders"
        ALTER COLUMN "status" DROP DEFAULT,
        ALTER COLUMN "status" TYPE INTEGER
          USING (CASE
            WHEN "status" = 'accept' THEN 0
            WHEN "status" = 'preparing' THEN 2
            WHEN "status" = 'prepared' THEN 3
            WHEN "status" = 'delivered' THEN 4
            ELSE 0
          END),
        ALTER COLUMN "status" SET DEFAULT 0;
    `);

    // 3. Revert payment_status back to INTEGER
    await queryInterface.sequelize.query(`
      ALTER TABLE "orders"
        ALTER COLUMN "payment_status" DROP DEFAULT,
        ALTER COLUMN "payment_status" TYPE INTEGER
          USING (CASE
            WHEN "payment_status" = 'paid' THEN 1
            ELSE 0
          END),
        ALTER COLUMN "payment_status" SET DEFAULT 0;
    `);

    // 4. Drop the ENUM types
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_orders_status";`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_orders_payment_status";`);
  },
};

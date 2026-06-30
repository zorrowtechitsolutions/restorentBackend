'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Office Shifts
    await queryInterface.createTable('office_shifts', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING, allowNull: false },
      branch_id: { type: Sequelize.INTEGER, allowNull: false },
      monday_in: { type: Sequelize.STRING, allowNull: true },
      monday_out: { type: Sequelize.STRING, allowNull: true },
      tuesday_in: { type: Sequelize.STRING, allowNull: true },
      tuesday_out: { type: Sequelize.STRING, allowNull: true },
      wednesday_in: { type: Sequelize.STRING, allowNull: true },
      wednesday_out: { type: Sequelize.STRING, allowNull: true },
      thursday_in: { type: Sequelize.STRING, allowNull: true },
      thursday_out: { type: Sequelize.STRING, allowNull: true },
      friday_in: { type: Sequelize.STRING, allowNull: true },
      friday_out: { type: Sequelize.STRING, allowNull: true },
      saturday_in: { type: Sequelize.STRING, allowNull: true },
      saturday_out: { type: Sequelize.STRING, allowNull: true },
      sunday_in: { type: Sequelize.STRING, allowNull: true },
      sunday_out: { type: Sequelize.STRING, allowNull: true },
      creator_type: { type: Sequelize.STRING, allowNull: true },
      creator_id: { type: Sequelize.INTEGER, allowNull: true },
      editor_type: { type: Sequelize.STRING, allowNull: true },
      editor_id: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    });

    // 2. Attendances
    await queryInterface.createTable('attendances', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      branch_id: { type: Sequelize.INTEGER, allowNull: false },
      emp_id: { type: Sequelize.INTEGER, allowNull: false },
      attendance_date: { type: Sequelize.DATEONLY, allowNull: false },
      time_in: { type: Sequelize.STRING, allowNull: true },
      time_out: { type: Sequelize.STRING, allowNull: true },
      creator_type: { type: Sequelize.STRING, allowNull: true },
      creator_id: { type: Sequelize.INTEGER, allowNull: true },
      editor_type: { type: Sequelize.STRING, allowNull: true },
      editor_id: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    });

    // 3. Leave Types
    await queryInterface.createTable('leave_types', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      title: { type: Sequelize.STRING, allowNull: false },
      branch_id: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 4. Leave Requests
    await queryInterface.createTable('leave_requests', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      branch_id: { type: Sequelize.INTEGER, allowNull: false },
      role_id: { type: Sequelize.INTEGER, allowNull: true },
      employee_name: { type: Sequelize.STRING, allowNull: false },
      emp_id: { type: Sequelize.INTEGER, allowNull: false },
      leave_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'leave_types', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      start_date: { type: Sequelize.DATEONLY, allowNull: false },
      end_date: { type: Sequelize.DATEONLY, allowNull: false },
      status: { type: Sequelize.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
      attachment: { type: Sequelize.STRING, allowNull: true },
      leave_reason: { type: Sequelize.TEXT, allowNull: true },
      creator_type: { type: Sequelize.STRING, allowNull: true },
      creator_id: { type: Sequelize.INTEGER, allowNull: true },
      editor_type: { type: Sequelize.STRING, allowNull: true },
      editor_id: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    });

    // 5. Holidays
    await queryInterface.createTable('holidays', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      branch_id: { type: Sequelize.INTEGER, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      start_date: { type: Sequelize.DATEONLY, allowNull: false },
      end_date: { type: Sequelize.DATEONLY, allowNull: false },
      details: { type: Sequelize.TEXT, allowNull: true },
      creator_type: { type: Sequelize.STRING, allowNull: true },
      creator_id: { type: Sequelize.INTEGER, allowNull: true },
      editor_type: { type: Sequelize.STRING, allowNull: true },
      editor_id: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    });

    // 6. Payrolls
    await queryInterface.createTable('payrolls', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      branch_id: { type: Sequelize.INTEGER, allowNull: true },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      employee_id: { type: Sequelize.INTEGER, allowNull: false },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      payment_choice: { type: Sequelize.STRING, allowNull: false },
      creator_type: { type: Sequelize.STRING, allowNull: true },
      creator_id: { type: Sequelize.INTEGER, allowNull: true },
      editor_type: { type: Sequelize.STRING, allowNull: true },
      editor_id: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    });
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payrolls');
    await queryInterface.dropTable('holidays');
    await queryInterface.dropTable('leave_requests');
    await queryInterface.dropTable('leave_types');
    await queryInterface.dropTable('attendances');
    await queryInterface.dropTable('office_shifts');
    
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_leave_requests_status";');
  }
};

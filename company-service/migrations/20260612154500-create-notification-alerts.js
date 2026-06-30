'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notification_alerts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'branches',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mail_message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      sms_message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      push_notification_message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      mail: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      sms: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      push_notification: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      creator_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      creator_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      editor_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      editor_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notification_alerts');
  }
};

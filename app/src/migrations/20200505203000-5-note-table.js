module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable('note', {
          noteId: {
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            type: Sequelize.UUID
          },
          ipcPlanId: {
            allowNull: false,
            comment: 'Associated ICP Plan id',
            type: Sequelize.UUID,
            references: {
              model: 'ipc_plan',
              key: 'ipcPlanId'
            }
          },
          inspectionStatusId: {
            allowNull: true,
            comment: 'Associated Inspection Status id',
            type: Sequelize.UUID,
            references: {
              model: 'inspection_status',
              key: 'inspectionStatusId'
            }
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
            allowNull: true,
            type: Sequelize.DATE
          },
          createdBy: {
            allowNull: false,
            type: Sequelize.STRING(255)
          },
          note: {
            allowNull: true,
            comment: 'Free-form notes field',
            type: Sequelize.STRING(4000),
            unique: false
          }
        }, {
          comment: 'List of all note records',
          transaction: t
        })
      ]);
    });
  },

  down: queryInterface => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable('note', {
          transaction: t
        })
      ]);
    });
  }
};

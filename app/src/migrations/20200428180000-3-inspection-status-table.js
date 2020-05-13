const { v4: uuidv4 } = require('uuid');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable('inspection_status', {
          inspectionStatusId: {
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
          createdBy: {
            allowNull: false,
            type: Sequelize.STRING(255)
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
          status: {
            allowNull: false,
            comment: 'Inspection Status/Stage',
            type: Sequelize.STRING(30),
            unique: false,
            defaultValue: 'Submitted'
          },
          grade: {
            allowNull: true,
            comment: 'Inspection Grade (Pass/Fail)',
            type: Sequelize.STRING(120),
            unique: false
          },
          inspectorName: {
            allowNull: true,
            comment: 'Inspector Name',
            type: Sequelize.STRING(255),
            unique: false
          },
          inspectorEmail: {
            allowNull: true,
            comment: 'Inspector email address',
            type: Sequelize.STRING(255),
            unique: false
          },
          inspectionDate: {
            allowNull: true,
            comment: 'Inspector email address',
            type: Sequelize.DATE,
            unique: false
          },
          reasonsForDecision: {
            allowNull: true,
            comment: 'Reason for grade',
            type: Sequelize.STRING(4000),
            unique: false
          },
          guidancePlan: {
            allowNull: true,
            comment: 'Plan to get from failing to passing grade',
            type: Sequelize.STRING(4000),
            unique: false
          }
        }, {
          comment: 'List of all inspection status records',
          transaction: t
        }).then(() => {
          return queryInterface.sequelize.query('SELECT * FROM ipc_plan');
        }).then(data => {
          if (data && Array.isArray(data) && Array.isArray(data[0]) && data[0].length) {
            // ok, there are ipc_plan records... create a default inspection status of submitted...
            const ipcPlans = data[0];
            const recs = ipcPlans.map(p => { return {inspectionStatusId: uuidv4(), createdAt: new Date(), updatedAt: new Date(), createdBy: 'migration', ipcPlanId: p.ipcPlanId}; });
            return queryInterface.bulkInsert('inspection_status', recs, {transaction: t});
          } else {
            return [];
          }
        })
      ]);
    });
  },

  down: queryInterface => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable('inspection_status', {
          transaction: t
        })
      ]);
    });
  }
};

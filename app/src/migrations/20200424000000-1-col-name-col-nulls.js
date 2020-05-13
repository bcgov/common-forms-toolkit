module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameColumn('ipc_plan', 'distancingSleepingBarriers', 'distancingMaintained', {transaction: t}),
        queryInterface.changeColumn('contact', 'phone1', {
          type: Sequelize.STRING,
          allowNull: true,
          transaction: t
        }),
        queryInterface.changeColumn('contact', 'email', {
          type: Sequelize.STRING,
          allowNull: true,
          transaction: t
        }),
        queryInterface.changeColumn('location', 'startDate', {
          type: Sequelize.DATE,
          allowNull: true,
          transaction: t
        }),
        queryInterface.changeColumn('location', 'endDate', {
          type: Sequelize.DATE,
          allowNull: true,
          transaction: t
        }),
        queryInterface.changeColumn('location', 'addressLine1', {
          type: Sequelize.STRING,
          allowNull: true,
          transaction: t
        }),
        queryInterface.changeColumn('location', 'city', {
          type: Sequelize.STRING,
          allowNull: true,
          transaction: t
        }),
        queryInterface.changeColumn('location', 'province', {
          type: Sequelize.STRING,
          allowNull: true,
          transaction: t
        }),
        queryInterface.changeColumn('location', 'postalCode', {
          type: Sequelize.STRING,
          allowNull: true,
          transaction: t
        })
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameColumn('ipc_plan', 'distancingMaintained', 'distancingSleepingBarriers', {transaction: t}),
        queryInterface.changeColumn('contact', 'phone1', {
          type: Sequelize.STRING,
          allowNull: false,
          transaction: t
        }),
        queryInterface.changeColumn('contact', 'email', {
          type: Sequelize.STRING,
          allowNull: false,
          transaction: t
        }),
        queryInterface.changeColumn('location', 'startDate', {
          type: Sequelize.DATE,
          allowNull: false,
          transaction: t
        }),
        queryInterface.changeColumn('location', 'endDate', {
          type: Sequelize.DATE,
          allowNull: false,
          transaction: t
        }),
        queryInterface.changeColumn('location', 'addressLine1', {
          type: Sequelize.STRING,
          allowNull: false,
          transaction: t
        }),
        queryInterface.changeColumn('location', 'city', {
          type: Sequelize.STRING,
          allowNull: false,
          transaction: t
        }),
        queryInterface.changeColumn('location', 'province', {
          type: Sequelize.STRING,
          allowNull: false,
          transaction: t
        }),
        queryInterface.changeColumn('location', 'postalCode', {
          type: Sequelize.STRING,
          allowNull: false,
          transaction: t
        })
      ]);
    });
  }
};

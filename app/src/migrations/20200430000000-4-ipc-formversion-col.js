module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'ipc_plan',
          'formVersion',
          {
            allowNull: false,
            comment: 'Version of form used to populate this plan',
            type: Sequelize.STRING(30),
            unique: false,
            defaultValue: '1.0.0'
          },
          { transaction: t })
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn(
          'ipc_plan',
          'formVersion',
          { transaction: t })
      ]);
    });
  }
};

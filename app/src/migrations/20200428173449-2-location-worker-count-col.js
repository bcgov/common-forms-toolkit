module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'location',
          'numberOfWorkers',
          {
            allowNull: true,
            comment: 'Number (integer) of workers working at the location',
            type: Sequelize.INTEGER,
            unique: false
          },
          {transaction: t})
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn(
          'location',
          'numberOfWorkers',
          {transaction: t})
      ]);
    });
  }
};

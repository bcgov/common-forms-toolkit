module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'location',
          'licencees',
          {
            allowNull: true,
            comment: 'Name of licencee(s) (free text)',
            type: Sequelize.STRING(1000),
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
          'licencees',
          {transaction: t})
      ]);
    });
  }
};

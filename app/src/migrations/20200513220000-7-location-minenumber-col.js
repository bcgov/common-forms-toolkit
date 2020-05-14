module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'location',
          'mineNumber',
          {
            allowNull: true,
            comment: 'Mines Act Permit or Mine Number',
            type: Sequelize.STRING(255),
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
          'mineNumber',
          {transaction: t})
      ]);
    });
  }
};

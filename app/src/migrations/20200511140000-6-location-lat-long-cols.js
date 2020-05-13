module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'location',
          'cityLatitude',
          {
            allowNull: true,
            comment: 'Latitude coordinate of city',
            type: Sequelize.NUMERIC(10, 7),
            unique: false
          },
          { transaction: t }),
        queryInterface.addColumn(
          'location',
          'cityLongitude',
          {
            allowNull: true,
            comment: 'Longitude coordinate of city',
            type: Sequelize.NUMERIC(10, 7),
            unique: false
          },
          { transaction: t })
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn(
          'location',
          'cityLatitude',
          { transaction: t }),
        queryInterface.removeColumn(
          'location',
          'cityLongitude',
          { transaction: t }),
      ]);
    });
  }
};

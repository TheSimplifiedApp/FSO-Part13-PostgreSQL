const { DataTypes } = require('sequelize');

const currentYear = new Date().getFullYear

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: 1991,
          msg: 'year at least equal to 1991',
        },
        max: {
          args: currentYear,
          msg: `not greater than the current year ${currentYear}`,
        },
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year');
  },
};
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('project', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ''
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: false,
      },
    construction_time: {
      type: DataTypes.DATE,
      allowNull: false
     },
    investment: {
      type: "DOUBLE",
      allowNull: true
    },
    motivation: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ''
    },
    benefits: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ''
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ''
    },
    registry_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });
};

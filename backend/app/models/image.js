/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('image', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: '',
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    projectid: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: '',
      references: {
        model: 'project',
        key: 'id'
      }
    }
  }, {
    tableName: 'image'
  });
};

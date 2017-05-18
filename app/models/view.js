/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('view', {
    projectid: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: '',
      primaryKey: true,
      references: {
        model: 'project',
        key: 'id'
      }
    },
    usersid: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: '',
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    view_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '',
      primaryKey: true
    }
  }, {
    tableName: 'view'
  });
};

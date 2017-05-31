// file app/models/user.js
// define the model for User 


// load the things we need

var bcrypt   = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users', {
		
    user: {
      type: DataTypes.STRING(25)
    },
   password: {
      type: DataTypes.STRING(255)
    },
    name: {
      type: DataTypes.STRING(25)
    },
    last_name: {
      type: DataTypes.STRING(50)
    },
    email: {
      type: DataTypes.STRING(50)
    },
    status: {
      type: DataTypes.INTEGER(4)
    },
    last_access_date: {
      type: DataTypes.DATE
    },
    type: {
      type: DataTypes.STRING(50)
    },
    role: {
      type: DataTypes.STRING(50)
    },
    telephone: {
      type: DataTypes.STRING(50)
    },
   
  },
	{
		classMethods: {
			generateHash : function(password) {
				return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
			},			
		},
		instanceMethods: {			
			validPassword : function(password) {
				return bcrypt.compareSync(password, this.password);
			}
		},
		getterMethods: {
			someValue: function() {
				return this.someValue;
			}
		},
		setterMethods: {
			someValue: function(value) {
				this.someValue = value;
			}
		}
	});
}
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  orders.init({
    customerName: DataTypes.STRING,
    customerAddress: DataTypes.STRING,
    cart: DataTypes.ARRAY(DataTypes.STRING),
    total: DataTypes.INTEGER,
    paymentSuccesful: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'orders',
  });
  return orders;
};
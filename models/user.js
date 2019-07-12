const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('User',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name: Sequelize.STRING,
    email:Sequelize.STRING
});
module.exports = User;
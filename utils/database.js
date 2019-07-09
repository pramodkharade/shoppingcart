const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_db_shoppingcart','root','root',{
    dialect:'mysql',
    host:'localhost'
});

module.exports = sequelize;
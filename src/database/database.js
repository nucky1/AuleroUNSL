const Sequelize = require('sequelize') ;

const sequelize = new Sequelize( 
    'postgres',
    'postgres',
    '123456',
    {
        host: 'localhost',
        dialect: 'postgres',
        pool:{
            max: 5,
            min: 0,
            require: 30000,
            idle: 10000
        },
        logging: false,
        define: {
            freezeTableName: true
        }
    }
)
module.exports = sequelize;
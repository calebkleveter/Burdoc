const Sequelize = require('sequelize');

/**
 * A instance of Sequelize which is connected to the PostgreSQL database.
 */
const sequelize = new Sequelize('burdoc', 'calebkleveter', '', {
  host: 'localhost',
  dialect: 'postgres'
});

/**
 * Connects the `sequelize` constent to the database by checking the authentication.
 */
function connect() {
  sequelize.authenticate()
           .then(function(){
             console.log("Connected to db")
           })
           .catch(function(error){
             console.error("Error connecting to db: ", error)
           });
}

module.exports = {
  connect: connect,
  sequelize: sequelize
}

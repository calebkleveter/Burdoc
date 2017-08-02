const Sequelize = require('sequelize');

const sequelize = new Sequelize('burdoc', 'calebkleveter', '', {
  host: 'localhost',
  dialect: 'postgres'
});

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
  connect: connect
}

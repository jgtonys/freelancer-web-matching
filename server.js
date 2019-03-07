let express = require('./config/express');
let config = require('./config/config');
let db = require('./config/db'); //db is not complete
//db.sequelize.sync({force: false}).then(r => console.log(' DB connection success : ')).catch(e => console.log(e));
/*db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });*/

express.listen(config.port, () => {
    console.log(`Express server has started on port ${config.port}`);
});

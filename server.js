let express = require('./config/express');
let config = require('./config/config');
let db = require('./config/db');

express.listen(config.port, () => {
    console.log(`Express server has started on port ${config.port}`);
});

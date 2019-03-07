const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const mysql = require('mysql2/promise');

module.exports.connection = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'k123123',
  port     : 3306,
  database : 'project'
});

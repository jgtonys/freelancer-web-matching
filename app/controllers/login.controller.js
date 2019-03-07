const async = require('async');
const _ = require('lodash');
const jwt = require('../../config/jwt');
const db = require('../../config/db');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

/////////////////////////////////////////////
// ADMIN LOGIN
/////////////////////////////////////////////
module.exports.adminLogin = (req, res, next) => {
  let user_id = req.body.user_id;
  let password = req.body.password;

  /////////////////////////////////////////////
  // Form contents error (not valid)
  // return 400
  /////////////////////////////////////////////
  if (!user_id || !password) {
    return next({
      statusCode: 400,
      message: 'invalidParams'
    });
  }
  /////////////////////////////////////////////
  // Find id && pw in Administrator table
  //
  /////////////////////////////////////////////
  async.waterfall([
    (nextStep) => {
      sql = 'SELECT * FROM Administrator WHERE user_id = ' + mysql.escape(user_id);
      db.connection.query({
        sql
      }).then(rows => {
        /////////////////////////////////////////////
        // Find user_id in Administrator table
        // if not existing -> return 401
        // else -> nextStep()
        /////////////////////////////////////////////
        if (!rows[0][0]) next({
          statusCode: 401,
          message: 'not found user'
        });
        else nextStep(null, rows[0][0]);
      }).catch(nextStep);
    },
    (user, nextStep) => {
      /////////////////////////////////////////////
      // If password is correct -> generate token
      // else -> return 400
      /////////////////////////////////////////////
      let data = _.pick(user, ['id','user_id', 'password']);
      let token = jwt.generate(data);
      if (password == user.password) nextStep(null, {
        token, data
      });
      else nextStep({
        statusCode: 400,
        message: 'invalid password'
      });
    }
  ], (err, result) => {
    /////////////////////////////////////////////
    // If occurs error -> alert err to front
    // else -> response (user data column)
    /////////////////////////////////////////////
    if (err) next(err);
    else {
      res.json(result);
    }
  });
};

/////////////////////////////////////////////
// FREELANCER LOGIN
/////////////////////////////////////////////
module.exports.freelancerLogin = (req, res, next) => {
  let user_id = req.body.user_id;
  let password = req.body.password;

  /////////////////////////////////////////////
  // Form contents error (not valid)
  // return 400
  /////////////////////////////////////////////
  if (!user_id || !password) {
    return next({
      statusCode: 400,
      message: res.__('invalidParams')
    });
  }
  /////////////////////////////////////////////
  // Find id && pw in Freelancer table
  //
  /////////////////////////////////////////////
  async.waterfall([
    (nextStep) => {
      sql = 'SELECT * FROM Freelancer WHERE user_id = ' + mysql.escape(user_id);
      db.connection.query({
        sql
      }).then(rows => {
        /////////////////////////////////////////////
        // Find user_id in Freelancer table
        // if not existing -> return 401
        // else -> nextStep()
        /////////////////////////////////////////////
        if (!rows[0][0]) next({
          statusCode: 401,
          message: 'not found user'
        });
        else nextStep(null, rows[0][0]);
      }).catch(nextStep);
    },
    (user, nextStep) => {
      /////////////////////////////////////////////
      // If Authenticated password is correct -> generate token
      // else -> return 400
      /////////////////////////////////////////////
      Authenticate(password, user.password).then(valid => {
        if (valid) {
          let data = _.pick(user, ['id', 'user_id', 'password', 'name']);
          let token = jwt.generate(data);
          nextStep(null, {
            token, data
          }); //original : nextStep(null, { token, data });
        } else nextStep({
          statusCode: 400,
          message: 'invalid password'
        });
      }).catch(nextStep);
    }
  ], (err, result) => {
    /////////////////////////////////////////////
    // If occurs error -> alert err to front
    // else -> response (user data column)
    /////////////////////////////////////////////
    if (err) next(err);
    else {
      res.json(result);
    }
  });
};

/////////////////////////////////////////////
// CLIENT LOGIN
/////////////////////////////////////////////
module.exports.clientLogin = (req, res, next) => {
  let user_id = req.body.user_id;
  let password = req.body.password;

  /////////////////////////////////////////////
  // Form contents error (not valid)
  // return 400
  /////////////////////////////////////////////
  if (!user_id || !password) {
    return next({
      statusCode: 400,
      message: res.__('invalidParams')
    });
  }
  /////////////////////////////////////////////
  // Find id && pw in Client table
  //
  /////////////////////////////////////////////
  async.waterfall([
    (nextStep) => {
      sql = 'SELECT * FROM Client WHERE user_id = ' + mysql.escape(user_id);
      db.connection.query({
        sql
      }).then(rows => {
        /////////////////////////////////////////////
        // Find user_id in Client table
        // if not existing -> return 401
        // else -> nextStep()
        /////////////////////////////////////////////
        if (!rows[0][0]) next({
          statusCode: 401,
          message: 'not found user'
        });
        else nextStep(null, rows[0][0]);
      }).catch(nextStep);
    },
    (user, nextStep) => {
      /////////////////////////////////////////////
      // If Authenticated password is correct -> generate token
      // else -> return 400
      /////////////////////////////////////////////
      Authenticate(password, user.password).then(valid => {
        if (valid) {
          let data = _.pick(user, ['id', 'user_id', 'password', 'name']);
          let token = jwt.generate(data);
          nextStep(null, {
            token, data
          }); //original : nextStep(null, { token, data });
        } else nextStep({
          statusCode: 400,
          message: 'invalid password'
        });
      }).catch(nextStep);
    }
  ], (err, result) => {
    /////////////////////////////////////////////
    // If occurs error -> alert err to front
    // else -> response (user data column)
    /////////////////////////////////////////////
    if (err) next(err);
    else {
      res.json(result);
    }
  });
};

Authenticate = (plainText, db_password) => {
  return new Promise((resolve, reject) => {
    //console.log("plainText", plainText);
    //console.log("password", db_password);
    bcrypt.compare(plainText, db_password, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

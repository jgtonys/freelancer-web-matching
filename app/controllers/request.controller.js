const async = require('async');
const _ = require('lodash');
const jwt = require('../../config/jwt');
const db = require('../../config/db');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');


module.exports.addRequest = (req, res, next) => {
  let title = req.body.title;
  let money = parseInt(req.body.money);
  let start_date = req.body.start_date;
  let end_date = req.body.end_date;
  let people_max = parseInt(req.body.people_max);
  let people_min = parseInt(req.body.people_min);
  let career = parseInt(req.body.career);
  let team_id = -1;
  let client_id = parseInt(req.body.client_id);
  let status = 0;
  let pending = 0;
  let spec = req.body.spec;
  let language = req.body.language;
  let score = req.body.score;

  let sql = '';
  let sql1 = '';
  let sql2 = '';
  async.waterfall([
    (nextStep) => {
      let args = {
        title: title,
        money: money,
        start_date: start_date,
        end_date: end_date,
        people_max: people_max,
        people_min: people_min,
        career: career,
        client_id: client_id,
        status: status,
        pending: pending,
      }
      sql = 'Insert INTO Request SET ' + mysql.escape(args);
      console.log(sql);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
              next({
              statusCode: 401,
              message: 'ERROR: request creating error!'
            });
          }
          else nextStep(null, result.insertId);
        })
        .catch(nextStep);
    },
    (id, nextStep) => {
      let l = language.length;
      let sqlarray = [];
      let tmparray = [];
      for (var i = 0; i < l; i++) {
        tmparray = [language[i], score[i], id];
        console.log(tmparray);
        sqlarray.push(tmparray);
      }
      console.log(sqlarray);
      let multiple_sql = 'Insert INTO Request_lang (`type`, `level`, `request_id`) Values ' + mysql.escape(sqlarray);
      db.connection.query(multiple_sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'ERROR: request language spec insert error!'
          });
        }
          else nextStep(null, id);
        })
        .catch(nextStep);

    },
    (id, nextStep) => {
      let jsonData = {
        file_location: spec,
        request_id: id,
      }
      let blob_sql = 'Insert INTO Request_doc SET ' + mysql.escape(jsonData);
      db.connection.query(blob_sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'ERROR: request doc insert error!'
          });
        }
          else nextStep(null, result);
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.json(result);
  });
};



module.exports.getAllRequest = (req, res, next) => {
  let resultArr = [];
  let uid = '';
  if(req.body.uid == "all") uid = "all";
  else uid = parseInt(req.body.uid);
  let sql = '';
  let sql2 = '';
  let lang = [];
  async.waterfall([
    (nextStep) => {
      if(uid == "all") sql = 'Select * from Request';
      else sql = 'Select * from Request where client_id = ' + mysql.escape(uid);

      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'no requests'
          });
        }
          else {
            resultArr.push(result);
            nextStep(null,result);
          }
        })
        .catch(nextStep);
    },
    (result,nextStep) => {
      if(result.length == 0) next({
        statusCode: 401,
        message: 'no requests'
      });
      else {
        for(let i=0;i<result.length;i++) {
          lang.push(result[i].id);
        }
        if(uid == "all") sql2 = 'Select * from Request_lang';
        else sql2 = 'Select * from Request_lang where request_id in ' + mysql.escape([lang]);
        db.connection.query(sql2, function(err, result) {
            if (err) next({
              statusCode: 401,
              message: 'no users'
            });
            else {
              resultArr.push(result);
              nextStep(null,resultArr);
            }
          })
          .catch(nextStep);
      }      
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};

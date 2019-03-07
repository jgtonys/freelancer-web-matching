const async = require('async');
const _ = require('lodash');
const jwt = require('../../config/jwt');
const db = require('../../config/db');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');


Authenticate = (plainText, db_password) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainText, db_password, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

cryptPassword = (plainText) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err);
      else {
        bcrypt.hash(plainText, salt, (err, hash) => {
          if (err) reject(err);
          else resolve(hash);
        });
      }
    });
  });
};

module.exports.signup = (req, res, next) => {
  let userType = parseInt(req.body.userType[0]);
  let user_id = req.body.userId;
  let password = req.body.userPassword;
  let name = req.body.userName;
  let phone = req.body.phone;
  let portfolio = '';
  let major = '';
  let career = '';
  let age = '';
  let language = '';
  let score = '';
  let freelancerId = 0;

  if (userType == 2) {
    portfolio = req.file.originalname;
    file_location = req.file.path;
    major = req.body.userMajor;
    career = parseInt(req.body.career.split(' ')[0]);
    age = parseInt(req.body.age.split(' ')[0]);
    language = req.body.languages.split(',');
    score = req.body.scores.split(',');
  }
  let sql = '';
  let sql1 = '';
  let sql2 = '';
  async.waterfall([
    (nextStep) => {
      let sqlt1 = 'SELECT user_id FROM Administrator WHERE user_id = ' + mysql.escape(user_id);
      let sqlt2 = 'SELECT user_id FROM Freelancer WHERE user_id = ' + mysql.escape(user_id);
      let sqlt3 = 'SELECT user_id FROM Client WHERE user_id = ' + mysql.escape(user_id);
      sql = '(' + sqlt1 + ') UNION (' + sqlt2 + ') UNION (' + sqlt3 + ')';
      db.connection.query({
        sql
      }).then(rows => {
        if (rows[0][0]) next({
          statusCode: 401,
          message: 'ERROR: already existing user'
        });
        else nextStep(null);
      }).catch(nextStep);
    },
    (nextStep) => {
      cryptPassword(password).then(hashedValue => {
          password = hashedValue;
          if(userType == 3) {
            let args1 = {
              user_id: user_id,
              password: password,
              name: name,
              phone: phone,
            }
            sql1 = 'Insert INTO Client SET ' + mysql.escape(args1);
          }
          else if(userType == 2) {
            let args1 = {
              user_id: user_id,
              password: password,
              name: name,
              phone: phone,
              major: major,
              age: age,
              career: career,
            }
            sql1 = 'Insert INTO Freelancer SET ' + mysql.escape(args1);
          }
          nextStep(null, sql1);
        })
        .catch(nextStep);
    },
    (sql1, nextStep) => { // user table insertion (id,pw,name,phone)
      db.connection.query(sql1, function(err, result) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'ERROR: user creating error!'
          });
        }
          else nextStep(null, result.insertId);
        })
        .catch(nextStep);
    },
    (id, nextStep) => {
      freelancerId = id;
      if (userType == 2) {
        let l = language.length;
        let sqlarray = [];
        let tmparray = [];
        for (var i = 0; i < l; i++) {
          tmparray = [language[i], score[i], id];
          sqlarray.push(tmparray);
        }
        let multiple_sql = 'Insert INTO Free_lang (`type`, `level`, `free_id`) Values ' + mysql.escape(sqlarray);
        db.connection.query(multiple_sql, function(err, result) {
            if (err) {
              console.log(err);
              next({
              statusCode: 401,
              message: 'ERROR: freelancer language spec insert error!'
            });
          }
            else nextStep(null, id);
          })
          .catch(nextStep);
      } else {
        nextStep(null, id);
      }
    },
    (id, nextStep) => {
      if (userType == 2) {
        let jsonData = {
          title: portfolio,
          free_id: id,
          file_location: file_location,
        }
        let blob_sql = 'Insert INTO Ext_portfolio SET ' + mysql.escape(jsonData);
        db.connection.query(blob_sql, function(err, result) {
            if (err) {
              console.log(err);
              next({
              statusCode: 401,
              message: 'ERROR: freelancer ext_portfolio insert error!'
            });
          }
            else nextStep(null, id);
          })
          .catch(nextStep);
      } else {
        nextStep(null, id);
      }
    },
    (id, nextStep) => {
      if (userType == 2) {
        let jsonData = {
          name: user_id + " alone team",
          min_career: career,
          mgr_id: id,
        }
        let tsql = 'Insert INTO Team SET ' + mysql.escape(jsonData);
        db.connection.query(tsql, function(err, result) {
            if (err) {
              console.log(err);
              next({
              statusCode: 401,
              message: 'ERROR: freelancer alone team insert error!'
            });
          }
            else nextStep(null, result.insertId);
          })
          .catch(nextStep);
      } else {
        nextStep(null, id);
      }
    },
    (id, nextStep) => {
      if (userType == 2) {
        l = language.length;
        sqlarray = [];
        tmparray = [];
        for (var i = 0; i < l; i++) {
          tmparray = [language[i], score[i], id];
          sqlarray.push(tmparray);
        }
        let multiple_sql2 = 'Insert INTO Team_lang (`type`, `max_level`, `team_id`) Values ' + mysql.escape(sqlarray);
        db.connection.query(multiple_sql2, function(err, result) {
            if (err) {
              console.log(err);
              next({
              statusCode: 401,
              message: 'ERROR: freelancer alone team lang insert error!'
            });
          }
            else nextStep(null, id);
          })
          .catch(nextStep);
      } else {
        nextStep(null, id);
      }
    },
    (id, nextStep) => {
      if (userType == 2) {
        let jsonData = {
          team_id: id,
          member_id: freelancerId,
        }
        let tmsql = 'Insert INTO Team_member SET ' + mysql.escape(jsonData);
        db.connection.query(tmsql, function(err, result) {
            if (err) {
              console.log(err);
              next({
              statusCode: 401,
              message: 'ERROR: freelancer alone team member insert error!'
            });
          }
            else nextStep(null, result);
          })
          .catch(nextStep);
      } else {
        nextStep(null);
      }
    },
  ], (err, result) => {
    if (err) next(err);
    else res.json(result);
  });
};

module.exports.updateFreelancer = (req, res, next) => {
  let fid = req.body.fid;
  let user_id = req.body.userId;
  let password = req.body.userPassword;
  let name = req.body.userName;
  let major = req.body.userMajor;
  let language = req.body.languages.split(',');
  let score = req.body.scores.split(',');
  let userType = req.body.userType;
  let phone = req.body.phone;
  let career = parseInt(req.body.career.split(' ')[0]);
  let age = parseInt(req.body.age.split(' ')[0]);
  let title = req.file.originalname;
  let file_location = req.file.path;
  let team_id = -1;

  console.log("Asdfasdf");

  async.waterfall([
    (nextStep) => {
      cryptPassword(password).then(hashedValue => {
          password = hashedValue;
          nextStep(null);
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let jsonData = {
        user_id: user_id,
        password: password,
        name: name,
        phone: phone,
        age: age,
        career: career,
        major: major,
      }
      let sql1 = "Update Freelancer set " + mysql.escape(jsonData) + " where id = " + mysql.escape(fid);
      console.log(sql1);
      db.connection.query(sql1, function(err, result) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'ERROR: freelancer updating error!'
          });
        }
          else nextStep(null);
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let dsql = 'Delete from Free_lang where free_id = ' + mysql.escape(fid);
      db.connection.query(dsql, function(err, result) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'ERROR: freelancer language spec delete error!'
          });
        }
          else nextStep(null);
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let l = language.length;
      let sqlarray = [];
      let tmparray = [];
      for (var i = 0; i < l; i++) {
        tmparray = [language[i], score[i], fid];
        sqlarray.push(tmparray);
      }
      let multiple_sql = 'Insert INTO Free_lang (`type`, `level`, `free_id`) Values ' + mysql.escape(sqlarray);
      db.connection.query(multiple_sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'ERROR: freelancer language spec insert error!'
          });
        }
          else nextStep(null);
        })
        .catch(nextStep);
    },
    (nextStep) => {
      jsonData = {
        title: title,
        file_location: file_location,
      }
      let blob_sql = 'Update Ext_portfolio SET ' + mysql.escape(jsonData) + ' where free_id = ' + mysql.escape(fid);
      db.connection.query(blob_sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'ERROR: freelancer ext_portfolio update error!'
          });
        }
          else nextStep(null);
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let sql2 = "select * from Team_member where member_id = " + mysql.escape(fid);
      db.connection.query(sql2, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no teams'
          });
          else {
            team_id = result[0].team_id;
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let dsql2 = 'Delete from Team_lang where team_id = ' + mysql.escape(team_id);
      db.connection.query(dsql2, function(err, result) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'ERROR: freelancer alone team lang delete error!'
          });
        }
          else nextStep(null);
        })
        .catch(nextStep);
    },
    (nextStep) => {
      l = language.length;
      sqlarray = [];
      tmparray = [];
      for (var i = 0; i < l; i++) {
        tmparray = [language[i], score[i], team_id];
        sqlarray.push(tmparray);
      }
      let multiple_sql2 = 'Insert INTO Team_lang (`type`, `max_level`, `team_id`) Values ' + mysql.escape(sqlarray);
      db.connection.query(multiple_sql2, function(err, result) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'ERROR: freelancer alone team lang insert error!'
          });
        }
          else nextStep(null);
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let usql = 'Update Team set min_career = ' + mysql.escape(career) + ', name = ' + mysql.escape(user_id + ' alone team') + ' where id = ' + mysql.escape(team_id);
      db.connection.query(usql, function(err, result) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'ERROR: freelancer alone team update error!'
          });
        }
          else nextStep(null,result);
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};

module.exports.updateClient = (req, res, next) => {
  let cid = req.body.cid;
  let user_id = req.body.userId;
  let password = req.body.userPassword;
  let name = req.body.userName;
  let userType = req.body.userType;
  let phone = req.body.phone;

  async.waterfall([
    (nextStep) => {
      cryptPassword(password).then(hashedValue => {
          password = hashedValue;
          nextStep(null);
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let jsonData = {
        user_id: user_id,
        password: password,
        name: name,
        phone: phone,
      }
      let sql1 = "Update Client set " + mysql.escape(jsonData) + " where id = " + mysql.escape(cid);
      db.connection.query(sql1, function(err, result) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'ERROR: client updating error!'
          });
        }
          else nextStep(null,result);
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};


module.exports.getFreelancerInfo = (req, res, next) => {
  let id = req.body.id;
  let resultArr = [];
  async.waterfall([
    (nextStep) => {
      let sql = "select f.*,l.type,l.level, e.title, e.file_location from Freelancer as f join Free_lang as l on f.id = l.free_id join Ext_portfolio as e on f.id = e.free_id where f.id = " + mysql.escape(id);
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no users'
          });
          else {
            resultArr.push(result);
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let sql2 = "select * from Team_member where member_id = " + mysql.escape(id);
      db.connection.query(sql2, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no users'
          });
          else {
            resultArr.push(result);
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let sql3 = "select r.*,tm.* from Freelancer as f\
                  join Team_member as tm on tm.member_id = f.id\
                  join Request as r on r.team_id = tm.team_id\
                  where r.status = 1 and f.id = " + mysql.escape(id);
      db.connection.query(sql3, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no users'
          });
          else {
            resultArr.push(result);
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let sql4 = "select * from Apply as a\
                  join Team_member as tm on tm.team_id = a.team_id\
                  join Freelancer as f on tm.member_id = f.id\
                  where f.id = " + mysql.escape(id);
      db.connection.query(sql4, function(err, result) {
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
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};

module.exports.getClientInfo = (req, res, next) => {
  let id = req.body.id;
  async.waterfall([
    (nextStep) => {
      let sql = "Select * from Client where id = " + mysql.escape(id);
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no users'
          });
          else {
            nextStep(null,result);
          }
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};

module.exports.getTeamMgr = (req, res, next) => {
  let rid = req.body.rid;
  async.waterfall([
    (nextStep) => {
      let sql = 'select t.mgr_id from Request as r join Team as t on t.id = r.team_id where r.id = ' + mysql.escape(rid);

      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no users'
          });
          else {
            nextStep(null, result);
          }
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};

module.exports.updatePorfolio = (req, res, next) => {
  let uid = req.body.uid;
  let title = req.file.originalname;
  let file_location = req.file.path;
  async.waterfall([
    (nextStep) => {
      let sql = "Update Ext_portfolio set title = " + mysql.escape(title) + ", file_location = " + mysql.escape(file_location) + " where free_id = " + mysql.escape(uid);
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'update ext portfolio error!'
          });
          else nextStep(null, result);
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};

module.exports.getMyExtPortfolio = (req, res, next) => {
  let uid = req.body.uid;
  async.waterfall([
    (nextStep) => {
      let sql = "select * from Ext_portfolio where free_id = " + mysql.escape(uid);
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'find ext portfolio error!'
          });
          else nextStep(null, result);
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};

module.exports.getMyTeam = (req, res, next) => {
  let id = req.body.id;
  let team_array = [];
  let member_array = [];
  let ids = [];
  async.waterfall([
    (nextStep) => {
      let sql = "select t.id,t.name,t.min_career,t.mgr_id,tl.type,tl.max_level from Freelancer as f join Team_member as tm on tm.member_id = f.id join Team as t on t.id = tm.team_id join Team_lang as tl on t.id = tl.team_id where f.id = " + mysql.escape(id);
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no users'
          });
          else {
            team_array = result;
            for(var i=0;i<result.length;i++) {
              if(ids.indexOf(result[i].id) == -1) ids.push(result[i].id);
            }
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      if(team_array.length == 0 ) nextStep(null, []);
      else {
        let whereSql = '';
        for(var i=0;i<ids.length;i++) {
          if(i == ids.length-1) whereSql += 't.id = ' + mysql.escape(ids[i]);
          else whereSql += 't.id = ' + mysql.escape(ids[i]) + ' or ';
        }
        let sql2 = "select t.id as team_id,f.id as member_id,f.user_id,f.name,f.age,f.career,f.grade_sum,f.request_count from Team as t join Team_member as tm on tm.team_id = t.id join Freelancer as f on tm.member_id = f.id where " + whereSql;
        db.connection.query(sql2, function(err, result) {
            if (err) next({
              statusCode: 401,
              message: 'no users'
            });
            else {
              member_array = result;
              nextStep(null, [team_array,member_array]);
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

module.exports.getAllTeam = (req, res, next) => {
  let team_array = [];
  let member_array = [];
  let ids = [];
  let resultArr = [];
  async.waterfall([
    (nextStep) => {
      let sql = "select t.id,t.name,t.min_career,t.mgr_id,tl.type,tl.max_level from Freelancer as f join Team_member as tm on tm.member_id = f.id join Team as t on t.id = tm.team_id join Team_lang as tl on t.id = tl.team_id";
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no users'
          });
          else {
            team_array = result;
            resultArr.push(result);
            for(var i=0;i<result.length;i++) {
              if(ids.indexOf(result[i].id) == -1) ids.push(result[i].id);
            }
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      if(team_array.length == 0 ) nextStep(null);
      else {
        let whereSql = '';
        for(var i=0;i<ids.length;i++) {
          if(i == ids.length-1) whereSql += 't.id = ' + mysql.escape(ids[i]);
          else whereSql += 't.id = ' + mysql.escape(ids[i]) + ' or ';
        }
        let sql2 = "select t.id as team_id,f.id as member_id,f.user_id,f.name,f.age,f.career,f.grade_sum,f.request_count from Team as t join Team_member as tm on tm.team_id = t.id join Freelancer as f on tm.member_id = f.id where " + whereSql;
        db.connection.query(sql2, function(err, result) {
            if (err) next({
              statusCode: 401,
              message: 'no users'
            });
            else {
              resultArr.push(result);
              nextStep(null);
            }
          })
          .catch(nextStep);
      }
    },
    (nextStep) => {
      if(team_array.length == 0 ) nextStep(null, []);
      else {
        let sql3 = "Select team_id from Request where (status = 1 or status = 2) and team_id in " + mysql.escape([ids]);
        db.connection.query(sql3, function(err, result) {
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


module.exports.getClientBadgeMsg = (req, res, next) => {
  let uid = parseInt(req.body.uid);
  async.waterfall([
    (nextStep) => {
      let sql = 'select * from Message where sent_from = 1 and is_read = 0 and client_id = ' + mysql.escape(uid);
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no messages!'
          });
          else {
            nextStep(null,result);
          }
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};


module.exports.getFreeBadgeMsg = (req, res, next) => {
  let uid = parseInt(req.body.uid);
  async.waterfall([
    (nextStep) => {
      let sql = 'select m.*,t.name from Message as m join Team_member as tm on m.team_id = tm.team_id join Freelancer as f on tm.member_id = f.id join Team as t on t.id = tm.team_id where m.sent_from = 0 and m.is_read = 0 and f.id = ' + mysql.escape(uid);
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no messages!'
          });
          else {
            nextStep(null,result);
          }
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};


module.exports.readClientMsg = (req, res, next) => {
  let uid = parseInt(req.body.uid);
  async.waterfall([
    (nextStep) => {
      let sql = 'Update Message set is_read = 1 where sent_from = 1 and client_id = ' + mysql.escape(uid);
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no messages updated'
          });
          else {
            nextStep(null,result);
          }
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};


module.exports.readFreelancerMsg = (req, res, next) => {
  let uid = parseInt(req.body.uid);
  async.waterfall([
    (nextStep) => {
      let sql = 'select team_id from Team_member where member_id = ' + mysql.escape(uid);
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'can not find team id error!'
          });
          else {
            nextStep(null,result);
          }
        })
        .catch(nextStep);
    },
    (result,nextStep) => {
      let whereSql = '';
      for (var i = 0; i < result.length; i++) {
        if(i == result.length-1) whereSql += 'team_id = ' + mysql.escape(result[i].team_id);
        else whereSql += 'team_id = ' + mysql.escape(result[i].team_id) + ' or ';
      }
      let sql = 'Update Message set is_read = 1 where sent_from = 0 and (' + whereSql + ')';
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no messages updated error!'
          });
          else {
            nextStep(null,result);
          }
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};


module.exports.getAllMessages = (req, res, next) => {
  let uid = parseInt(req.body.uid);
  async.waterfall([
    (nextStep) => {
      let sql = 'select * from Message where sent_from = 1 and client_id = ' + mysql.escape(uid);
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no messages found'
          });
          else {
            nextStep(null,result);
          }
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};

module.exports.getTeamMessage = (req, res, next) => {
  let tid = req.body.tid;
  async.waterfall([
    (nextStep) => {
      let sql = 'select r.title, m.* from Message as m join Request as r on r.id = m.request_id where m.sent_from = 0 and m.team_id = ' + mysql.escape(tid);
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no messages!'
          });
          else {
            nextStep(null,result);
          }
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};

module.exports.addTeam = (req, res, next) => {
  let mgr_id = req.body.mgr_id;
  let name = req.body.name;
  let uid = req.body.uid;
  let mgr_uid = req.body.mgr_uid;

  let whereSql = '';
  let career = 100;
  let lang = [];
  let lv = [];
  let ids = [];

  for(var i=0;i<uid.length;i++) {
    if(i == uid.length-1) whereSql += 'f.user_id = ' + mysql.escape(uid[i]);
    else whereSql += 'f.user_id = ' + mysql.escape(uid[i]) + ' or ';
  }
  whereSql += ' or f.user_id = ' + mysql.escape(mgr_uid);
  async.waterfall([
    (nextStep) => {
      let sql = 'select f.id, f.career,l.type,l.level from Freelancer as f join Free_lang as l on f.id = l.free_id where ' + whereSql;
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no users'

          });
          else {
            for(var i=0;i<result.length;i++) {
              if(ids.indexOf(result[i].id) == -1) ids.push(result[i].id);
              if(result[i].career < career) career = result[i].career;
              if(lang.indexOf(result[i].type) == -1) {
                lang.push(result[i].type);
                lv.push(result[i].level);
              }
              else {
                let index = lang.indexOf(result[i].type);
                if(lv[index] < result[i].level) lv[index] = result[i].level;
              }
            }
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let jsonData = {
        name: name,
        min_career: career,
        mgr_id: mgr_id
      }
      let sql2 = 'Insert INTO Team SET ' + mysql.escape(jsonData);
      db.connection.query(sql2, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'team adding error!'
          });
          else {
            nextStep(null,result.insertId);
          }
        })
        .catch(nextStep);
    },
    (id,nextStep) => {
      let tmparray = [];
      let sqlarray = [];
      for(var i=0;i<ids.length;i++) {
        tmparray = [id,ids[i]];
        sqlarray.push(tmparray);
      }
      let sql3 = 'Insert INTO Team_member (`team_id`,`member_id`) Values ' + mysql.escape(sqlarray);
      db.connection.query(sql3, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'team member adding error!'
          });
          else {
            nextStep(null,id);
          }
        })
        .catch(nextStep);
    },
    (id,nextStep) => {
      tmparray = [];
      sqlarray = [];
      for(var i=0;i<lang.length;i++) {
        tmparray = [id,lang[i],lv[i]];
        sqlarray.push(tmparray);
      }
      let sql4 = 'Insert INTO Team_lang (`team_id`,`type`,`max_level`) Values ' + mysql.escape(sqlarray);
      db.connection.query(sql4, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'team lang adding error!'
          });
          else {
            nextStep(null,result);
          }
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
}


module.exports.updateTeam = (req, res, next) => {
  let name = req.body.name;
  let uid = req.body.members.split(',');
  let team_id = req.body.team_id;

  let whereSql = '';
  let career = 100;
  let lang = [];
  let lv = [];
  let ids = [];

  for(var i=0;i<uid.length;i++) {
    if(i == uid.length-1) whereSql += 'f.user_id = ' + mysql.escape(uid[i]);
    else whereSql += 'f.user_id = ' + mysql.escape(uid[i]) + ' or ';
  }
  async.waterfall([
    (nextStep) => {
      let sql = 'select f.id, f.career,l.type,l.level from Freelancer as f join Free_lang as l on f.id = l.free_id where ' + whereSql;
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no users'
          });
          else {
            for(var i=0;i<result.length;i++) {
              if(ids.indexOf(result[i].id) == -1) ids.push(result[i].id);
              if(result[i].career < career) career = result[i].career;
              if(lang.indexOf(result[i].type) == -1) {
                lang.push(result[i].type);
                lv.push(result[i].level);
              }
              else {
                let index = lang.indexOf(result[i].type);
                if(lv[index] < result[i].level) lv[index] = result[i].level;
              }
            }
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let jsonData = {
        name: name,
        min_career: career,
      }
      let sql2 = 'Update Team SET ' + mysql.escape(jsonData) + ' where id = ' + mysql.escape(team_id);
      db.connection.query(sql2, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'team updating error!'
          });
          else {
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let dsql = 'Delete from Team_member where team_id = ' + mysql.escape(team_id);
      db.connection.query(dsql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'team member delete error!'
          });
          else {
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let dsql2 = 'Delete from Team_lang where team_id = ' + mysql.escape(team_id);
      db.connection.query(dsql2, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'team lang delete error!'
          });
          else {
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let dsql2 = 'Delete from Apply where team_id = ' + mysql.escape(team_id);
      db.connection.query(dsql2, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'team apply delete error!'
          });
          else {
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let tmparray = [];
      let sqlarray = [];
      for(var i=0;i<ids.length;i++) {
        tmparray = [team_id,ids[i]];
        sqlarray.push(tmparray);
      }
      let sql3 = 'Insert INTO Team_member (`team_id`,`member_id`) Values ' + mysql.escape(sqlarray);
      db.connection.query(sql3, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'team member adding error!'
          });
          else {
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      tmparray = [];
      sqlarray = [];
      for(var i=0;i<lang.length;i++) {
        tmparray = [team_id,lang[i],lv[i]];
        sqlarray.push(tmparray);
      }
      let sql4 = 'Insert INTO Team_lang (`team_id`,`type`,`max_level`) Values ' + mysql.escape(sqlarray);
      db.connection.query(sql4, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'team lang adding error!'
          });
          else {
            nextStep(null,result);
          }
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
}

module.exports.deleteTeam = (req, res, next) => {
  let team_id = req.body.team_id;
  async.waterfall([
    (nextStep) => {
      let dsql = 'Delete from Team_member where team_id = ' + mysql.escape(team_id);
      db.connection.query(dsql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'team member delete error!'
          });
          else {
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let dsql2 = 'Delete from Team_lang where team_id = ' + mysql.escape(team_id);
      db.connection.query(dsql2, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'team lang delete error!'
          });
          else {
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let dsql2 = 'Delete from Apply where team_id = ' + mysql.escape(team_id);
      db.connection.query(dsql2, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'team apply delete error!'
          });
          else {
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let dsql3 = 'Delete from Team where id = ' + mysql.escape(team_id);
      db.connection.query(dsql3, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'team delete error!'
          });
          else {
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
}


module.exports.getall = (req, res, next) => {
  let resultArr = [];
  let free_ids = [];
  let exceptionArr = [];
  async.waterfall([
    (nextStep) => {
      let sql = 'Select * from Administrator;'
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no users'
          });
          else {
            resultArr.push(result);
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let sql2 = 'Select * from Freelancer;'
      db.connection.query(sql2, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no users'
          });
          else {
            for(var i=0;i<result.length;i++) {
              free_ids.push(result[i].id);
            }
            resultArr.push(result);
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let sql3 = 'Select * from Client;'
      db.connection.query(sql3, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no users'
          });
          else {
            resultArr.push(result);
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let sql4 = "select member_id as fid from Team_member where member_id in " + mysql.escape([free_ids]);
      db.connection.query(sql4, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'team not found error!'
          });
          else {
            exceptionArr.push(result);
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let sql5 = "select f.id as fid,r.*,tm.* from Freelancer as f\
                  join Team_member as tm on tm.member_id = f.id\
                  join Request as r on r.team_id = tm.team_id\
                  where r.status = 1 and f.id in " + mysql.escape([free_ids]);
      db.connection.query(sql5, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no request found error!'
          });
          else {
            exceptionArr.push(result);
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let sql6 = "select *,f.id as fid from Apply as a\
                  join Team_member as tm on tm.team_id = a.team_id\
                  join Freelancer as f on tm.member_id = f.id\
                  where f.id in " + mysql.escape([free_ids]);
      db.connection.query(sql6, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no request apply error!'
          });
          else {
            exceptionArr.push(result);
            resultArr.push(exceptionArr);
            nextStep(null,resultArr);
          }
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};

module.exports.deleteUser = (req, res, next) => {
  let id = req.body.id;
  let type = req.body.type;
  let sql = ''
  if(type == 2) sql = 'Delete from Freelancer where id = ' + mysql.escape(id);
  else sql = 'Delete from Client where id = ' + mysql.escape(id);
  async.waterfall([
    (nextStep) => {
      db.connection.query(sql, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no users'
          });
          else nextStep(null, result);
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};

module.exports.addRequest = (req, res, next) => {
  async.waterfall([
    (nextStep) => {
      let args1 = {
        client_user_id: req.body.client_user_id,
        title: req.body.title,
        money: req.body.money,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        people_min: req.body.people_min,
        people_max: req.body.people_max,
        career: req.body.career,
        spec: req.body.spec,
      }
      sql1 = 'Insert INTO request SET ' + mysql.escape(args1);
      db.connection.query(sql1, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'ERROR: adding request error!'
          });
          nextStep(null, result.insertId);
        })
        .catch(nextStep);
    },
    (id, nextStep) => {
      let l = req.body.language.length;
      let sqlarray = [];
      let tmparray = [];
      for (var i = 0; i < l; i++) {
        tmparray = [req.body.language[i], req.body.score[i], id, req.body.client_user_id];

        sqlarray.push(tmparray);
      }
      let multiple_sql = 'Insert INTO require_languages (`type`, `level`, `request_requestId`,`request_client_user_id`) Values ' + mysql.escape(sqlarray);
      db.connection.query(sql1, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'ERROR: require languages inserting error!'
          });
          nextStep(null, result.insertId);
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};

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
  let client_id = parseInt(req.body.client_id);
  let status = 0;
  let pending = 0;
  let file_location = req.file.path;
  let language = req.body.languages.split(',');
  let score = req.body.scores.split(',');

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
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'ERROR: request creating error!'
            });
          } else nextStep(null, result.insertId);
        })
        .catch(nextStep);
    },
    (id, nextStep) => {
      let l = language.length;
      let sqlarray = [];
      let tmparray = [];
      for (var i = 0; i < l; i++) {
        tmparray = [language[i], score[i], id];
        sqlarray.push(tmparray);
      }
      let multiple_sql = 'Insert INTO Request_lang (`type`, `level`, `request_id`) Values ' + mysql.escape(sqlarray);
      db.connection.query(multiple_sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'ERROR: request language spec insert error!'
            });
          } else nextStep(null, id);
        })
        .catch(nextStep);

    },
    (id, nextStep) => {
      let jsonData = {
        file_location: file_location,
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
          } else nextStep(null, result);
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.json(result);
  });
};


module.exports.updateRequest = (req, res, next) => {
  let title = req.body.title;
  let money = parseInt(req.body.money);
  let start_date = req.body.start_date;
  let end_date = req.body.end_date;
  let people_max = parseInt(req.body.people_max);
  let people_min = parseInt(req.body.people_min);
  let career = parseInt(req.body.career);
  let request_id = parseInt(req.body.request_id);
  let file_location = req.file.path;
  let language = req.body.languages.split(',');
  let score = req.body.scores.split(',');

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
      }
      sql = 'Update Request SET ' + mysql.escape(args) + ' where id = ' + mysql.escape(request_id);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'ERROR: request updating error!'
            });
          } else nextStep(null);
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let dsql = 'Delete from Request_lang where request_id = ' + mysql.escape(request_id);
      db.connection.query(dsql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'ERROR: request language spec delete error!'
            });
          } else nextStep(null);
        })
        .catch(nextStep);

    },
    (nextStep) => {
      let dsql2 = 'Delete from Request_doc where request_id = ' + mysql.escape(request_id);
      db.connection.query(dsql2, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'ERROR: request doc delete error!'
            });
          } else nextStep(null);
        })
        .catch(nextStep);

    },
    (nextStep) => {
      let l = language.length;
      let sqlarray = [];
      let tmparray = [];
      for (var i = 0; i < l; i++) {
        tmparray = [language[i], score[i], request_id];
        sqlarray.push(tmparray);
      }
      let multiple_sql = 'Insert INTO Request_lang (`type`, `level`, `request_id`) Values ' + mysql.escape(sqlarray);
      db.connection.query(multiple_sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'ERROR: request language spec insert error!'
            });
          } else nextStep(null);
        })
        .catch(nextStep);

    },
    (nextStep) => {
      let jsonData = {
        file_location: file_location,
        request_id: request_id,
      }
      let blob_sql = 'Insert INTO Request_doc SET ' + mysql.escape(jsonData);
      db.connection.query(blob_sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'ERROR: request doc insert error!'
            });
          } else nextStep(null, result);
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.json(result);
  });
};

module.exports.setRequestTeam = (req, res, next) => {
  let rid = req.body.rid;
  let tid = req.body.tid;
  let title = '';
  let cid = -1;
  let team_name = '';
  async.waterfall([
    (nextStep) => {
      let sql = 'Update Request set status = 1, pending = 0, team_id = ' + mysql.escape(tid) + ' where id = ' + mysql.escape(rid);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'request team setting error!'
            });
          } else {
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let sql = 'delete from Apply where request_id = ' + mysql.escape(rid) + ' and team_id = ' + mysql.escape(tid);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'applied team delete error!'
            });
          } else {
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let sql = 'select title,client_id from Request where id = ' + mysql.escape(rid);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'request data find error!'
            });
          } else {
            title = result[0].title;
            cid = result[0].client_id;
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let sql = 'select name from Team where id = ' + mysql.escape(tid);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'team name find error!'
            });
          } else {
            team_name = result[0].name;
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let jsonData = {
        team_id: tid,
        client_id: cid,
        request_id: rid,
        sent_from: 0,
        is_read: 0,
        message: team_name + " Team has been selected for Request " + title,
        report: 'none',
      }
      let sql = 'Insert INTO Message SET ' + mysql.escape(jsonData);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'selected team message error!'
            });
          } else {
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

module.exports.idVerify = (req, res, next) => {
  let user_id = req.body.user_id;
  async.waterfall([
    (nextStep) => {
      let sql = 'select * from Freelancer where user_id = ' + mysql.escape(user_id);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'no user'
            });
          } else {
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


module.exports.deleteRequest = (req, res, next) => {
  let id = req.body.id;
  async.waterfall([
    (nextStep) => {
      let sql = 'delete from Apply where request_id = ' + mysql.escape(id);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'request apply delete error!'
            });
          } else {
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let sql = 'delete from Request where id = ' + mysql.escape(id);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'request delete error!'
            });
          } else {
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


module.exports.requestComplete = (req, res, next) => {
  let team_id = req.body.team_id;
  let request_id = req.body.request_id;
  let client_id = req.body.client_id;
  let title = req.body.title;
  let report = req.file.path;
  async.waterfall([
    (nextStep) => {
      let sql = 'Update Request set pending = 2 where id = ' + mysql.escape(request_id);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'request pending update error!'
            });
          } else {
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let jsonData = {
        team_id: team_id,
        client_id: client_id,
        request_id: request_id,
        sent_from: 1,
        is_read: 0,
        message: title + " request development complete message",
        report: report,
      }
      let sql2 = 'Insert INTO Message SET ' + mysql.escape(jsonData);
      db.connection.query(sql2, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'request complete message insert error!'
            });
          } else {
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


module.exports.sendRejectMessage = (req, res, next) => {
  let message = req.body.message;
  let request_id = parseInt(req.body.rid);

  let team_id = req.body.tid;
  let client_id = req.body.uid;
  async.waterfall([
    (nextStep) => {
      let jsonData = {
        team_id: team_id,
        client_id: client_id,
        request_id: request_id,
        sent_from: 0,
        is_read: 0,
        message: "Report has been rejected : " + message,
        report: "none",
      }
      let sql = 'Insert INTO Message SET ' + mysql.escape(jsonData);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'reject message input error!'
            });
          } else {
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let sql2 = 'Update Request set status = 1, pending = 0, is_declined = 1 where id = ' + mysql.escape(request_id);
      db.connection.query(sql2, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'reject request input error!'
            });
          } else {
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


module.exports.getTeamName = (req, res, next) => {
  let tid = req.body.tid;
  async.waterfall([
    (nextStep) => {
      let sql = 'select name from Team where id = ' + mysql.escape(tid);
      db.connection.query(sql, function(err, result) {
          if (err) {
            //console.log(err);
            next({
              statusCode: 401,
              message: 'team name get error!'
            });
          } else {
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

module.exports.getAllRequestTeam = (req, res, next) => {
  let rid = parseInt(req.body.rid.substring(1));
  let team_ids = [];
  let memberSql = '';
  let resultArr = [];
  async.waterfall([
    (nextStep) => {
      let sql = 'select team_id from Apply where request_id = ' + mysql.escape(rid);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'no requests'
            });
          } else {
            team_ids = result;
            nextStep(null, result);
          }
        })
        .catch(nextStep);
    },
    (result, nextStep) => {
      for (let i = 0; i < result.length; i++) {
        if (i == result.length - 1) memberSql += 't.id = ' + mysql.escape(result[i].team_id);
        else memberSql += 't.id = ' + mysql.escape(result[i].team_id) + ' or ';
      }
      let sql2 = 'select t.id, t.name,t.min_career,t.mgr_id,tl.type,tl.max_level from Team as t join Team_lang as tl on tl.team_id = t.id where ' + memberSql;
      db.connection.query(sql2, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no team info error!'
          });
          else {
            resultArr.push(result);
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      memberSql = '';
      for (let i = 0; i < team_ids.length; i++) {
        if (i == team_ids.length - 1) memberSql += 't.id = ' + mysql.escape(team_ids[i].team_id);
        else memberSql += 't.id = ' + mysql.escape(team_ids[i].team_id) + ' or ';
      }
      let sql3 = 'select t.id as team_id,f.*,fl.type,fl.level,ep.title,ep.file_location\
                  from Team as t \
                  join Team_member as tm on tm.team_id = t.id \
                  join Freelancer as f on tm.member_id = f.id \
                  join Free_lang as fl on fl.free_id = f.id\
                  join Ext_portfolio as ep on ep.free_id = f.id where ' + memberSql;
      db.connection.query(sql3, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'no member info error!'
          });
          else {
            resultArr.push(result);
            nextStep(null, resultArr);
          }
        })
        .catch(nextStep);
    },
  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};


module.exports.getAllRequest = (req, res, next) => {
  let resultArr = [];
  let uid = '';
  if (req.body.uid == "all") uid = "all";
  else uid = parseInt(req.body.uid);
  let sql = '';
  let sql2 = '';
  let lang = [];
  async.waterfall([
    (nextStep) => {
      if (uid == "all") sql = 'Select * from Request';
      else sql = 'Select * from Request where client_id = ' + mysql.escape(uid);

      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'no requests'
            });
          } else {
            resultArr.push(result);
            nextStep(null, result);
          }
        })
        .catch(nextStep);
    },
    (result, nextStep) => {
      if (result.length == 0) next({
        statusCode: 401,
        message: 'no requests'
      });
      else {
        for (let i = 0; i < result.length; i++) {
          lang.push(result[i].id);
        }
        if (uid == "all") sql2 = 'Select * from Request_lang';
        else sql2 = 'Select * from Request_lang where request_id in ' + mysql.escape([lang]);
        db.connection.query(sql2, function(err, result) {
            if (err) next({
              statusCode: 401,
              message: 'no users'
            });
            else {
              resultArr.push(result);
              nextStep(null, lang);
            }
          })
          .catch(nextStep);
      }
    },
    (lang, nextStep) => {
      if (lang.length == 0) next({
        statusCode: 401,
        message: 'no requests'
      });
      else {
        sql2 = 'Select * from Request_doc where request_id in ' + mysql.escape([lang]);
        db.connection.query(sql2, function(err, result) {
            if (err) next({
              statusCode: 401,
              message: 'request doc error!'
            });
            else {
              resultArr.push(result);
              nextStep(null, resultArr);
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

module.exports.addStar = (req, res, next) => {

  let score = req.body.score;
  let rid = req.body.request_id;
  let tid = req.body.team_id;


  let memberSql = '';

  async.waterfall([
    (nextStep) => {
      let sql = 'select tm.member_id from Request as r join Team as t on t.id = r.team_id join Team_member as tm on tm.team_id = t.id where r.id = ' + mysql.escape(rid);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'no members on this request'
            });
          } else {
            nextStep(null, result);
          }
        })
        .catch(nextStep);
    },
    (result, nextStep) => {
      if (result.length == 0) {
        let empty = [
          []
        ];
        res.send(empty);
      } else {
        for (let i = 0; i < result.length; i++) {
          if (i == result.length - 1) memberSql += 'id = ' + mysql.escape(result[i].member_id);
          else memberSql += 'id = ' + mysql.escape(result[i].member_id) + ' or ';
        }
        sql2 = 'Update Freelancer set grade_sum = grade_sum + ' + mysql.escape(score) + ', request_count = request_count + 1 where ' + memberSql;
        db.connection.query(sql2, function(err, result) {
            if (err) next({
              statusCode: 401,
              message: 'team member score update error!'
            });
            else {
              nextStep(null);
            }
          })
          .catch(nextStep);
      }
    },
    (nextStep) => {
      sql3 = 'Update Request set status = 2, pending = 0 where id = ' + mysql.escape(rid);
      db.connection.query(sql3, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'request status updating error!'
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









/* 석준 파트 추가 */
module.exports.getRequestClient = (req, res, next) => {
  let resultArr = [];
  let sql = '';
  let sql2 = '';
  let lang = [];
  const uid = parseInt(req.body.uid);
  let index = parseInt(req.body.index);

  async.waterfall([
    (nextStep) => {
      if (index == 0) sql = 'Select * from Request where status = 0';
      else if (index == 1) {
        sql = 'Select * from Request where team_id in \
                                (Select team_id from Team_member where member_id = ' + uid + ') \
                                AND status = 1';
      } else {
        sql = 'Select * from Request where id in \
                      (Select request_id from Apply where team_id in \
                          (Select team_id from Team_member where member_id = ' + uid + '))';
      }
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'no requests'
            });
          } else {
            resultArr.push(result);
            nextStep(null, result);
          }
        })
        .catch(nextStep);
    },
    (result, nextStep) => {
      if (result.length == 0) {
        let empty = [
          []
        ];
        res.send(empty);
      }
      if (result.length == 0) next({
        statusCode: 401,
        message: 'no requests'
      });
      else {
        for (let i = 0; i < result.length; i++) {
          lang.push(result[i].id);
        }
        sql2 = 'Select * from Request_lang where request_id in ' + mysql.escape([lang]);
        db.connection.query(sql2, function(err, result) {
            if (err) next({
              statusCode: 401,
              message: 'request lang error!'
            });
            else {
              resultArr.push(result);
              nextStep(null, lang);
            }
          })
          .catch(nextStep);
      }
    },
    (lang, nextStep) => {
      if (lang.length == 0) next({
        statusCode: 401,
        message: 'no requests'
      });
      else {
        sql2 = 'Select * from Request_doc where request_id in ' + mysql.escape([lang]);
        db.connection.query(sql2, function(err, result) {
            if (err) next({
              statusCode: 401,
              message: 'request doc error!'
            });
            else {
              resultArr.push(result);
              nextStep(null, resultArr);
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

module.exports.addIntPortfolio = (req, res, next) => {
  let rid = req.body.rid;
  let tid = req.body.tid;
  async.waterfall([
    (nextStep) => {
      let sql = 'Select id from Freelancer where id in ( \
        Select member_id from Team_member where team_id = ' + tid + ')';
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'no members on this request'
            });
          } else {
            nextStep(null, result);
          }
        })
        .catch(nextStep);
    },
    (result, nextStep) => {
      let sql2 = 'INSERT INTO Int_portfolio (request_id, free_id) VALUES '
      for (let i = 0; i < result.length; i++) {
        sql2 = sql2 + '(' + mysql.escape(rid) + ', ' + result[i].id + ')'
        if (i < result.length - 1)
          sql2 = sql2 + ', '
      }

      db.connection.query(sql2, function(err, result) {
          if (err) next({
            statusCode: 401,
            message: 'request status updating error!'
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


module.exports.getMyAvailableTeams = (req, res, next) => {
  let resultArr = [];
  let sql = '';
  let sql2 = '';
  const uid = parseInt(req.body.uid);
  const rid = parseInt(req.body.rid);
  const requirement = req.body.requirement;
  const pmax = parseInt(req.body.pmax);
  const pmin = parseInt(req.body.pmin);
  const career = parseInt(req.body.career);

  async.waterfall([
    (nextStep) => {
      sql = 'SELECT * FROM Team WHERE (Team.id, ' + requirement.length + ') IN ( \
      SELECT id, COUNT(*) \
      FROM Team JOIN Team_lang ON Team_lang.team_id=Team.id \
      WHERE Team.mgr_id=' + uid + ' AND (';
      for (let i = 0; i < requirement.length; i++) {
        sql = sql + ' (type=\"' + requirement[i][0] + '\" AND max_level>=' + requirement[i][1] + ")";
        if (i < requirement.length - 1)
          sql = sql + ' OR ';
        else
          sql = sql + ') GROUP BY Team.id);'
      }

      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'no requests'
            });
          } else {
            resultArr.push(result);
            nextStep(null, resultArr);
          }
        })
        .catch(nextStep);
    },
    (result, nextStep) => {
      if (result.length == 0) next({
        statusCode: 401,
        message: 'no requests'
      });
      else {
        sql2 = 'SELECT id, COUNT(*) as count FROM Team JOIN Team_member ON Team_member.team_id=Team.id GROUP BY Team.id';
        db.connection.query(sql2, function(err, result) {
            if (err) next({
              statusCode: 401,
              message: 'no users'
            });
            else {
              resultArr.push(result);
              nextStep(null, resultArr);
            }
          })
          .catch(nextStep);
      }
    },
    (result, nextStep) => {
      if (result.length == 0) next({
        statusCode: 401,
        message: 'no requests'
      });
      else {
        let teamMemCount = resultArr.pop();
        let teamAvailable = resultArr.pop();
        let teamAvailableLength = teamAvailable.length;
        let teamMemCountLength = teamMemCount.length;
        for (let i = 0; i < teamAvailableLength; i++) {
          if (teamAvailable[i].min_career < career) {
            teamAvailable.splice(i--, 1);
          }
          if (i < 0)
            break;

          let removeFlag = false;
          for (let j = 0; j < teamMemCountLength; j++) {

            if (teamMemCount[j].id == teamAvailable[i].id) {
              if (teamMemCount[j].count < pmin || teamMemCount[j].count > pmax) {
                removeFlag = true;
              }
            }
          }

          if (!removeFlag) {
            resultArr.push(teamAvailable[i]);
          }
        }
      }
      nextStep(null, resultArr);
    },

  ], (err, result) => {
    if (err) next(err);
    else res.send(result);
  });
};

module.exports.applyTeamRequest = (req, res, next) => {
  const tid = parseInt(req.body.tid);
  const rid = parseInt(req.body.rid);
  let result = true;
  let sql = '';
  async.waterfall([
    (nextStep) => {
      sql = 'INSERT INTO Apply (request_id, team_id) VALUE (' + rid + ', ' + tid + ')';
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'no requests'
            });
          } else {
            nextStep(null, result);
          }
        })
        .catch(nextStep);
    },
    (result, nextStep) => {
      sql = 'UPDATE Request SET pending=1 WHERE id=' + rid;
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'no requests'
            });
          } else {
            nextStep(null, result);
          }
        })
        .catch(nextStep);
    },
    (result, nextStep) => {
      sql = 'select client_id,title from Request where id = ' + mysql.escape(rid);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'no requests client id error!'
            });
          } else {
            nextStep(null, result);
          }
        })
        .catch(nextStep);
    },
    (result, nextStep) => {
      let cid = result[0].client_id;
      let jsonData = {
        team_id: tid,
        client_id: cid,
        request_id: rid,
        sent_from: 1,
        is_read: 0,
        message: "Team applied " + result[0].title + " Request",
        report: 'none',
      }
      sql = 'Insert INTO Message SET ' + mysql.escape(jsonData);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'apply message insert error!'
            });
          } else {
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

module.exports.getIntPortfolio = (req, res, next) => {
  let uid = req.body.uid;
  let totalData = [];
  let teamId = [];
  let RequestList = [];
  let DocList = [];
  let LangList = [];
  let teamName = [];

  async.waterfall([
    (nextStep) => {
      let sql = 'Select team_id from Team_member where member_id = ' + uid;
      db.connection.query(sql, function(err, teamId) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'this freelancer doesn\'t belong to any Teams'
            });
          } else {
            totalData.push(teamId);
            nextStep(null, teamId);
          }
        })
        .catch(nextStep);
    },
    (teamId, nextStep) => {
      let sql2 = '';
      if (teamId.length != 0)
        sql2 = 'Select * from Request where team_id =' + teamId[0].team_id;
      for (let i = 1; i < teamId.length; i++) {
        sql2 = sql2 + ' OR team_id = ' + teamId[i].team_id;
      }
      db.connection.query(sql2, function(err, RequestList) {
          if (err) next({
            statusCode: 401,
            message: 'Request receiving error with team ids'
          });
          else {
            totalData.push(RequestList);
            nextStep(null, RequestList);
          }
        })
        .catch(nextStep);
    },
    (RequestList, nextStep) => {
      let sql3 = '';
      if (RequestList.length != 0)
        sql3 = 'Select * from Request_doc where request_id =' + RequestList[0].id;
      for (let i = 1; i < RequestList.length; i++) {
        sql3 = sql3 + ' OR request_id = ' + RequestList[i].id;
      }
      db.connection.query(sql3, function(err, DocList) {
          if (err) next({
            statusCode: 401,
            message: 'Request receiving error with team ids'
          });
          else {
            totalData.push(DocList);
            nextStep(null, DocList);
          }
        })
        .catch(nextStep);
    },
    (DocList, nextStep) => {
      let teamId = totalData[0];
      let sql4 = '';
      if (teamId.length != 0)
        sql4 = 'Select * from Team_lang where team_id =' + teamId[0].team_id;
      for (let i = 1; i < teamId.length; i++) {
        sql4 = sql4 + ' OR team_id = ' + teamId[i].team_id;
      }
      db.connection.query(sql4, function(err, LangList) {
          if (err) next({
            statusCode: 401,
            message: 'Request receiving error with team ids'
          });
          else {
            totalData.push(LangList);
            nextStep(null, LangList);
          }
        })
        .catch(nextStep);
    },
    (LangList, nextStep) => {
      let teamId = totalData[0];
      let sql5 = '';
      if (teamId.length != 0)
        sql5 = 'Select * from Team where id =' + teamId[0].team_id;
      for (let i = 1; i < teamId.length; i++) {
        sql5 = sql5 + ' OR id = ' + teamId[i].team_id;
      }
      db.connection.query(sql5, function(err, teamList) {
          if (err) next({
            statusCode: 401,
            message: 'Team receiving error with team ids'
          });
          else {
            totalData.push(teamList);
            nextStep(null, totalData);
          }
        })
        .catch(nextStep);
    },
  ], (err, totalData) => {
    if (err) next(err);
    else res.send(totalData);
  });
};

module.exports.sendApprovedMessage = (req, res, next) => {
  let request_id = parseInt(req.body.rid);
  let team_id = req.body.tid;
  let client_id = req.body.uid;
  let requestTitle = '';
  async.waterfall([
    (nextStep) => {
      let sql = 'Select title from Request where id = ' + request_id;
      db.connection.query(sql, function(err, requestTitle) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'reject message input error!'
          });
        }
          else {
            nextStep(null, requestTitle);
          }
        })
        .catch(nextStep);
    },
    (requestTitle, nextStep) => {
      let jsonData = {
        team_id: team_id,
        client_id: client_id,
        request_id: request_id,
        sent_from: 0,
        is_read: 0,
        message: "You have finished the Request [ " + requestTitle[0].title + " ] !",
        report: "done",
      }
      let sql = 'Insert INTO Message SET ' + mysql.escape(jsonData);
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'reject message input error!'
          });
        }
          else {
            nextStep(null);
          }
        })
        .catch(nextStep);
    },
    (nextStep) => {
      let sql2 = 'Update Request set status = 2, pending = 0 where id = ' + mysql.escape(request_id);
      db.connection.query(sql2, function(err, result) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'reject request input error!'
          });
        }
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

module.exports.addStarClient = (req, res, next) => {

  let score = req.body.score;
  let cid = req.body.client_id;
  let rid = req.body.request_id;
  let tid = req.body.team_id;

  async.waterfall([
    (nextStep) => {
      let sql = 'Update Client Set request_count = request_count + 1, grade_sum = grade_sum + ' + score + ' Where id = ' + cid;
      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
            statusCode: 401,
            message: 'star send error'
          });
        }
          else {
            nextStep(null,result);
          }
        })
        .catch(nextStep);
    },
    (result,nextStep) => {
      let sql2 = 'Update Message set is_read = 1 where sent_from = 0 and team_id = ' + tid
        + ' and request_id = ' + rid + ' and client_id = ' + cid;
      db.connection.query(sql2, function(err, result) {
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

module.exports.getDecRequest = (req, res, next) => {
  let resultArr = [];
  let sql = '';
  let sql2 = '';
  let lang = [];
  async.waterfall([
    (nextStep) => {
      sql = 'Select * from Request Where is_declined = 1'

      db.connection.query(sql, function(err, result) {
          if (err) {
            console.log(err);
            next({
              statusCode: 401,
              message: 'no requests'
            });
          } else {
            resultArr.push(result);
            nextStep(null, result);
          }
        })
        .catch(nextStep);
    },
    (result, nextStep) => {
      if (result.length == 0) next({
        statusCode: 401,
        message: 'no requests'
      });
      else {
        for (let i = 0; i < result.length; i++) {
          lang.push(result[i].id);
        }
        sql2 = 'Select * from Request_lang where request_id in ' + mysql.escape([lang]);
        db.connection.query(sql2, function(err, result) {
            if (err) next({
              statusCode: 401,
              message: 'no users'
            });
            else {
              resultArr.push(result);
              nextStep(null, lang);
            }
          })
          .catch(nextStep);
      }
    },
    (lang, nextStep) => {
      if (lang.length == 0) next({
        statusCode: 401,
        message: 'no requests'
      });
      else {
        sql2 = 'Select * from Request_doc where request_id in ' + mysql.escape([lang]);
        db.connection.query(sql2, function(err, result) {
            if (err) next({
              statusCode: 401,
              message: 'request doc error!'
            });
            else {
              resultArr.push(result);
              nextStep(null, resultArr);
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

module.exports.getTeamData = (req, res, next) => {
  let tid = req.body.tid;
  async.waterfall([
    (nextStep) => {
      let sql = 'select * from Team where id = ' + mysql.escape(tid);
      db.connection.query(sql, function(err, result) {
          if (err) {
            //console.log(err);
            next({
              statusCode: 401,
              message: 'team name get error!'
            });
          } else {
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

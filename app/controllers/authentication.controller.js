//token authentication
const async = require('async');
const _ = require('lodash');

const jwt = require('../../config/jwt');
const db = require('../../config/db');
const User = db.User;

module.exports.requireLogin = (req, res, next) => {
	//let token = req.headers.bearer;
	if(req.headers.authorization == "token") {
		next({statusCode: 403, message: 'require login'});
	}
	//let token_temp = req.headers.cookie.split("token")[1];
	//let token = token_temp.substring(9).split("%22%7D")[0];
	//console.log(req.headers);
	let token = req.headers.authorization;
	console.log("user token : " + token);
	let user = null;
	if (!token || !(user = jwt.verify(token))) {
		next({statusCode: 403, message: 'require login'});
	} else {
		console.log(user);
		//req.user = user;
		//res.send(user);
		next();
	}
};

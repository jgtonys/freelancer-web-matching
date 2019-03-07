let authController = require('../controllers/authentication.controller.js');
let controller = require('../controllers/users.controller.js');
let logincontroller = require('../controllers/login.controller.js');
let reqcontroller = require('../controllers/request.controller.js');
let maincontroller = require('../controllers/main.controller.js');
let fileController = require('../controllers/file.controller.js');

module.exports = (app) => {
    app.route('/')
        .get(maincontroller.mainpage);
    app.route('/signup')
        .post(fileController.up,controller.signup);
    app.route('/getall')
        .get(controller.getall);
    app.route('/adminLogin')
        .post(logincontroller.adminLogin);
    app.route('/freelancerLogin')
        .post(logincontroller.freelancerLogin);
    app.route('/clientLogin')
        .post(logincontroller.clientLogin);
    app.route('/getfreelancerinfo')
        .post(controller.getFreelancerInfo);
    app.route('/deleteuser')
        .post(controller.deleteUser);
    app.route('/addrequest')
        .post(reqcontroller.addRequest);
    app.route('/getallrequest')
        .post(reqcontroller.getAllRequest);
    app.route('/addteam')
        .post(controller.addTeam);
    app.route('/getmyteam')
        .post(controller.getMyTeam);
};

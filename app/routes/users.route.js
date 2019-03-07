let authController = require('../controllers/authentication.controller.js');
let controller = require('../controllers/users.controller.js');
let logincontroller = require('../controllers/login.controller.js');
let reqcontroller = require('../controllers/request.controller.js');
let maincontroller = require('../controllers/main.controller.js');
let fileController = require('../controllers/file.controller.js');

module.exports = (app) => {
    app.route('/')
        .get(maincontroller.mainpage);
    app.route('/uploads/portfolio/:id')
        .get(fileController.downloadPortfolio);
    app.route('/uploads/report/:id')
        .get(fileController.downloadReport);
    app.route('/uploads/teamspec/:id')
        .get(fileController.downloadSpec);
    app.route('/signup')
        .post(fileController.upload.single('userPortfolio'),controller.signup);
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
    app.route('/getclientinfo')
        .post(controller.getClientInfo);
    app.route('/deleteuser')
        .post(controller.deleteUser);
    app.route('/deleterequest')
        .post(reqcontroller.deleteRequest);
    app.route('/addrequest')
        .post(fileController.uploadTeamSpec.single('spec'),reqcontroller.addRequest);
    app.route('/updaterequest')
        .post(fileController.uploadTeamSpec.single('spec'),reqcontroller.updateRequest);
    app.route('/getallrequest')
        .post(reqcontroller.getAllRequest);
    app.route('/addteam')
        .post(controller.addTeam);
    app.route('/getmyteam')
        .post(controller.getMyTeam);
    app.route('/addStar')
        .post(reqcontroller.addStar);
    app.route('/getallrequestteam')
        .post(reqcontroller.getAllRequestTeam);
    app.route('/setrequestteam')
        .post(reqcontroller.setRequestTeam);
    app.route('/getteamname')
        .post(reqcontroller.getTeamName);
    app.route('/idverify')
        .post(reqcontroller.idVerify);
    app.route('/sendrejectmessage')
        .post(reqcontroller.sendRejectMessage);
    app.route('/updatefreelancer')
        .post(fileController.upload.single('userPortfolio'),controller.updateFreelancer);
    app.route('/getallteam')
        .get(controller.getAllTeam);
    app.route('/getteammessage')
        .post(controller.getTeamMessage);
    app.route('/requestcomplete')
        .post(fileController.uploadReport.single('completeReport'),reqcontroller.requestComplete);
    app.route('/getteammgr')
        .post(controller.getTeamMgr);
    app.route('/getclientbadgemsg')
        .post(controller.getClientBadgeMsg);
    app.route('/getfreebadgemsg')
        .post(controller.getFreeBadgeMsg);
    app.route('/readclientmsg')
        .post(controller.readClientMsg);
    app.route('/readfreelancermsg')
        .post(controller.readFreelancerMsg);
    app.route('/addIntPortfolio')
        .post(reqcontroller.addIntPortfolio);
    app.route('/getallmessages')
        .post(controller.getAllMessages);
    app.route('/getmyextportfolio')
        .post(controller.getMyExtPortfolio);
    app.route('/updateportfolio')
        .post(fileController.upload.single('userPortfolio'),controller.updatePorfolio);
    app.route('/updateclient')
        .post(controller.updateClient);
    app.route('/updateteam')
        .post(controller.updateTeam);
    app.route('/deleteteam')
        .post(controller.deleteTeam);






    /* 석준 부분 추가 */
    app.route('/getRequestClient')
        .post(reqcontroller.getRequestClient);
    app.route('/getMyAvailableTeams')
        .post(reqcontroller.getMyAvailableTeams);
    app.route('/applyTeamRequest')
        .post(reqcontroller.applyTeamRequest);
    app.route('/addIntPortfolio')
        .post(reqcontroller.addIntPortfolio);
    app.route('/getIntPortfolio')
        .post(reqcontroller.getIntPortfolio);
    app.route('/sendApprovedMessage')
        .post(reqcontroller.sendApprovedMessage);
    app.route('/addStarClient')
        .post(reqcontroller.addStarClient);
    app.route('/getDecRequest')
        .get(reqcontroller.getDecRequest);
    app.route('/getTeamData')
        .post(reqcontroller.getTeamData);
};

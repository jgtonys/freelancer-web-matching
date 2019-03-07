const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/portfolio/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var resultReport = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/report/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var uploadSpec = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/teamspec/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})


module.exports.upload = multer({ storage: storage })

module.exports.uploadReport = multer({ storage: resultReport })

module.exports.uploadTeamSpec = multer({ storage: uploadSpec })

module.exports.downloadPortfolio = (req, res, next) => {
  Filepath = "./uploads/portfolio/" + req.params.id;
  res.download(Filepath);
}

module.exports.downloadReport = (req, res, next) => {
  Filepath = "./uploads/report/" + req.params.id;
  res.download(Filepath);
}

module.exports.downloadSpec = (req, res, next) => {
  Filepath = "./uploads/teamspec/" + req.params.id;
  res.download(Filepath);
}

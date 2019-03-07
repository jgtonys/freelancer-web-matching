const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../public/upload/')
  },
  filename: (req, file, cb) => {
    cb(null, 'file.pdf')
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024*1024*10
  }
});

module.exports.up = (req, res, next) =>{
  console.log(req.body.userPortfolio);
  upload.fields([req.body.userPortfolio]);
  next();
}

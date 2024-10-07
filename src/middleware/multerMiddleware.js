//////////////////////// 1 ảnh
//const multer = require('multer');

// // Cấu hình multer
// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// const upload = multer({ storage: storage }).single('image');

// const uploadMiddleware = (req, res, next) => {
//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error uploading image' });
//     }
//     next();
//   });
// };

// module.exports = uploadMiddleware;
/////////////////////////////////// 1 ảnh ///////////////////

const multer = require('multer');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage }).array('images', 12);

const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading images' });
    }
    next();
  });
};

module.exports = uploadMiddleware;

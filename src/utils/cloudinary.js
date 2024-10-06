// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
//   api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
// });

// // Hàm upload image lên Cloudinary
// const uploadImage = async (req) => {
//   return new Promise((resolve, reject) => {
//     if (!req.file) {
//       return reject(new Error('No image uploaded'));
//     }
//     cloudinary.uploader.upload(req.file.path, (error, result) => {
//       if (error) {
//         return reject(error);
//       }
//       resolve(result.secure_url);
//     });
//   });
// };

// module.exports = { uploadImage };
///////////////////////////////////

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const uploadImage = async (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result.secure_url);
    });
  });
};

module.exports = { uploadImage };

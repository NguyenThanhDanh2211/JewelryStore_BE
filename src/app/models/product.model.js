const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slugify = require('slugify');

const productSchema = new Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String },
  slug: { type: String, unique: true },
  price: { type: Number },
  discount: { type: Number },
  image: [{ type: String }],
  category: { type: String },
  brand: { type: String },
  gender: { type: String },
  weight: { type: String },
  stoneMain: { type: String },
  stoneSecond: { type: String },
});

// // Middleware tạo slug trước khi lưu sản phẩm
// productSchema.pre('save', function (next) {
//   if (this.name) {
//     this.slug = slugify(this.name, { lower: true, strict: true });
//   }
//   next();
// });

// Middleware để tạo slug trước khi lưu sản phẩm
productSchema.pre('save', async function (next) {
  if (this.name) {
    let baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    // Kiểm tra xem slug đã tồn tại trong cơ sở dữ liệu chưa
    const productModel = mongoose.model('Products', productSchema);
    let existingProduct = await productModel.findOne({ slug });

    // Nếu tồn tại, thêm số vào sau slug cho đến khi không trùng lặp
    while (existingProduct) {
      slug = `${baseSlug}-${count}`;
      existingProduct = await productModel.findOne({ slug });
      count++;
    }

    this.slug = slug; // Lưu slug duy nhất vào schema
  }
  next();
});

module.exports = mongoose.model('Products', productSchema);

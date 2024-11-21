const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slugify = require('slugify');

const productSchema = new Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String },
  slug: { type: String, unique: true },
  price: { type: Number },
  discount: { type: Number },
  finalPrice: { type: Number },
  image: [{ type: String }],
  category: { type: String },
  men: { type: Boolean, default: false },
  collect: { type: String },
  tag: { type: String },
  description: { type: String },
  detail: { type: String },
});

productSchema.pre('save', async function (next) {
  if (this.name) {
    let baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    const productModel = mongoose.model('Products', productSchema);
    let existingProduct = await productModel.findOne({ slug });

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

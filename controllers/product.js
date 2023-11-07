const multer = require('multer');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

const storage = multer.memoryStorage(); // Armazena a imagem na memória

const upload = multer({ storage: storage }).single('photo');

exports.productById = (req, res, next, id) => {
  Product.findById(id)
  .then((product) => {
    if (!product) {
      return res.status(400).json({
        error: 'Product not found'
      });
    }
    req.product = product;
    next();
  })
  .catch((err) => {
    return res.status(400).json({
      error: 'Error while fetching the product'
    });
  });
};

exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.create = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }

    const fields = req.body;
    const { name, description, price, category, quantity } = fields;
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({
        error: 'All fields are required',
      });
    }

    const product = new Product(req.body);
    if (req.file) {
      if (req.file.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size',
        });
      }
      product.photo.data = req.file.buffer;
      product.photo.contentType = req.file.mimetype;
    }

    product.save()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(400).json({
          error: errorHandler(err)
        });
      });
  });
};

exports.remove = (req, res) => {
  let product = req.product;
  product.deleteOne()
    .then((deletedProduct) => {
      res.json({
        'message': 'Product deleted successfully'
      });
    })
    .catch((err) => {
      return res.status(400).json({
        error: errorHandler(err)
      });
    });
};

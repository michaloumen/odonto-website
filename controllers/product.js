const multer = require('multer');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

const storage = multer.memoryStorage(); // Armazena a imagem na memória

const upload = multer({ storage: storage }).single('photo');

exports.create = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
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

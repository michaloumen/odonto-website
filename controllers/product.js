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

exports.update = (req, res) => {
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

    const product = req.product;
    Object.assign(product, fields);

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

// chamadas para diferentes tipo de ordenação para PRODUCT LIST ALL
// http://localhost:8000/api/products?sortBy=sold&order=desc&limit=4
// http://localhost:8000/api/products?sortBy=createdAt&order=desc&limit=4
// http://localhost:8000/api/products?sortBy=createdAt&order=asc&limit=4
exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec()
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      return res.status(400).json({
        error: 'Products not found'
      });
    });
};

exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find({ _id: { $ne: req.product._id }, category: req.product.category })
    .limit(limit)
    .populate('category', '_id name')
    .exec()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      return res.status(400).json({
        error: 'Products not found'
      });
    });
};

// essa chamada não tá funcionando. Não retorna nada, nem erro
// Acho que é porque não tem nenhuma coisa pra consultar desse tipo no banco
// http://localhost:8000/api/products/categories
exports.listCategories = (req, res) => {
  console.log("listCategories controller called");

  Product.distinct('category', {}, (err, categories) => {
    if (err) {
      console.log("Error retrieving categories:", err);
      return res.status(400).json({
        error: 'Categories not found'
      });
    }
    console.log("Categories retrieved:", categories);
    res.json(categories);
  });
};

exports.listBySearch = async (req, res) => {
  try {
    const order = req.body.order ? req.body.order : "desc";
    const sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    const limit = req.body.limit ? parseInt(req.body.limit) : 100;
    const skip = parseInt(req.body.skip);
    const findArgs = {};

    for (const key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
        if (key === "price") {
          findArgs[key] = {
            $gte: req.body.filters[key][0],
            $lte: req.body.filters[key][1]
          };
        } else {
          findArgs[key] = req.body.filters[key];
        }
      }
    }

    const data = await Product.find(findArgs)
      .select("-photo")
      .populate("category")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec();

    res.json({
      size: data.length,
      data
    });
  } catch (err) {
    res.status(400).json({
      error: 'Products not found'
    });
  }
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  };
  next();
};
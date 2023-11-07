const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.categoryById = (req, res, next, categoryId) => {
  Category.findById(categoryId)
    .then((category) => {
      // if (!category) {
      //   return res.status(400).json({
      //     error: 'Category does not exist'
      //   });
      // }
      req.category = category;
      next();
    })
    .catch((err) => {
      return res.status(400).json({
        error: 'Category does not exist'
      });
    });
};

exports.create = (req, res) => {
  const category = new Category(req.body);
  category.save()
    .then(data => {
      res.json({ data });
    })
    .catch(err => {
      res.status(400).json({
        error: errorHandler(err)
      });
    });
};

exports.read = (req, res) => {
  return res.json(req.category);
};

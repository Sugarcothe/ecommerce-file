const Product = require('../models/product')
const {errorHandler} = require('../helpers/dbErrorHandler')
const formidable = require("formidable")//formidable or malta are used when photo is required.
const fs = require('fs')

const _ = require('lodash')


exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if(err || !product) {
      return res.status(400).json({
        error: 'Product not found'
      })
    }
    req.product = product
    next()
  })
}

exports.read = (req, res) => {
  req.product.photo =  undefined
  return res.json(req.product)
}

exports.create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if(err) {
      
    }

    // check for all fields
    const {

      name, 
      description, 
      price, 
      category, 
      quantity, 
      shipping

    } = fields

    if (
      !name || 
      !description || 
      !price || 
      !category ||
      !quantity || 
      !shipping
      ) {
      return res.status(400).json({
        error: "All fields are required"
      })
    }


    let product = new Product(fields)

    if(files.photo) {
      if(files.photo.size > 3000000) {
        return res.status(400).json({
          error: "Image should be less than 3mb"
        })
      }
      product.photo.data = fs.readFileSync(files.photo.path)
      product.photo.contentType = files.photo.type
    }

    
      product.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          })
        }
        res.json(result)
      })
  })
}

exports.remove = (req, res) => {
  let product = req.product
  product.remove((err, deletedProduct) => {
    if(err) {
      return res.status(400).json({
        error: errorHandler
      });
    }
    res.json({
      message: "Product Deleted"
    })
  })
}

exports.update = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if(err) {
      
    }

    // check for all fields
    const {

      name, 
      description, 
      price, 
      category, 
      quantity, 
      shipping

    } = fields

    if (
      !name || 
      !description || 
      !price || 
      !category ||
      !quantity || 
      !shipping
      ) {
      return res.status(400).json({
        error: "All fields are required"
      })
    }


    let product = req.product;
    product = _.extend(product, fields)

    if(files.photo) {
      if(files.photo.size > 3000000) {
        return res.status(400).json({
          error: "Image should be less than 3mb"
        })
      }
      product.photo.data = fs.readFileSync(files.photo.path)
      product.photo.contentType = files.photo.type
    }

    
      product.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          })
        }
        res.json(result)
      })
  })
}

// sell and arrival
// By sell = /product?sortBy=sold&order=desc&limit=4
// By arrival = /product?sortBy=sold&order=desc&limit=4
// if no params are sent, then all products are returned


exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc'
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
  let limit = req.query.limit ? parseInt( req.query.limit) : '6'

  Product.find()
  .select('_photo')
  .populate('category')
  .sort([[sortBy, order]])
  .limit(limit)
  .exec((err, products) => {
    if(err) {
      return res.status(400).json({
        error: 'Products not found'
      })
    } 
    res.send(products)
  })
}

// find the products based on request category
// other products that have same category will be returned
exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt( req.query.limit) : '6';

  product.find({_id: {$ne: req.product}, category: req.product.category})
  .limit(limit)
  .populate('category', '_id name')
  .exec((err, product) => {
    if(err) {
      return res.status(400).json({
        error: 'Products not found'
      })
    }
    res.json(products)
  })
}

// Get all the categories distinct to a product
exports.listCategories =(req, res) => {
  Product.distinct('category', {}, (err, categories) => {
    if(err) {
      return res.status(400).json({
        error: 'Products not found'
      })
    }
    res.json(categories)
  })
}

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
   
// route - make sure its post
// router.post("/products/by/search", listBySearch);
 
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req, res, next) => {
  if(req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType)
    return res.send(req.product.photo.data);
  }
  next()
}
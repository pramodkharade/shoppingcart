const mongodb = require('mongodb');
const {validationResult } = require('express-validator');
const Product = require('../models/product');
const fileHelper = require('../utils/file');
const ObjectID = mongodb.ObjectId();
exports.getAddProducts = (req, res, next) => {
  
  res.render(
    'admin/edit-product',
    {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: false,
      errorMessage:null,
      validationErrors: []
    });
};

exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if(image===undefined){
    return res.status(422).render(
      'admin/edit-product',
      {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        product: {
          title:title,
          price:price,
          description:description
        },
        errorMessage: 'Attached file is not a image',
        hasError: true,
        validationErrors: []
      });
  }
  const imageUrl = image.path;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   return res.status(422).render(
      'admin/edit-product',
      {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        product: {
          title:title,
          price:price,
          image:image,
          description:description
        },
        errorMessage: errors.array()[0].msg,
        hasError: true,
        validationErrors: errors.array()
      });
  }
  const product = new Product({
            title:title,
            price:price,
            description:description,
            imageUrl:imageUrl,
            userId:req.user
          });
  product.save()
  .then((result)=>{
    console.log("Created the product");
    res.redirect('/admin/products');
  })
  .catch((error)=>{
    console.log("Error Insert:",error);
  });
  
};
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product)=>{ 
      if (!product) {
            return res.redirect('/');
          }
          res.render(
            'admin/edit-product',
            {
              pageTitle: 'Edit Product',
              path: '/admin/edit-product',
              editing: editMode,
              product: product,
              hasError: false,
              errorMessage: null,
              validationErrors: []
            });
    })
    .catch((error)=>{
        console.log(error);
    });
  
};
exports.posteditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const image = req.file;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
Product.findById(prodId).then(product=>{
  if(product.userId.toString()!==req.user._id.toString()){
     return res.redirect('/');
  }
  product.title = updatedTitle;
  product.price = updatedPrice;
  if(image){
    fileHelper.deleteFile(product.imageUrl);
    product.imageUrl = image.path;
  }
  product.description = updatedDescription;
  return product.save().then(()=>{
    console.log('updated product');
    res.redirect('/admin/products');
 });

}) 
.catch((error)=>{
            console.log(error);
         });
};
exports.getProducts = (req, res, next) => {

  Product.find({userId:req.user._id})
  // .select('title imageUrl') // to get specific values from main model
  //.populate('userId','name') // to get reference  model specific values
  .then((products) => {
    res.render('admin/products',
    {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch((error)=>{
    console.log(error);
  });
};
exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found.'));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.status(200).json({ message: 'Success!' });
    })
    .catch(err => {
      res.status(500).json({ message: 'Deleting product failed.' });
    });
};

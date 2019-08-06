const mongodb = require('mongodb');
const {validationResult } = require('express-validator/check');
const Product = require('../models/product');
const ObjectID = mongodb.ObjectId();
exports.getAddProducts = (req, res, next) => {
  
  res.render(
    'admin/edit-product',
    {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage:null,
      isAuthenticated: req.session.isLoggedIn
    });
};

exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
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
          imageUrl:imageUrl,
          description:description
        },
        errorMessage: errors.array()[0].msg,
        isAuthenticated: req.session.isLoggedIn
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
              isAuthenticated: req.session.isLoggedIn
            });
    })
    .catch((error)=>{
        console.log(error);
    });
  
};
exports.posteditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
Product.findById(prodId).then(product=>{
  if(product.userId.toString()!==req.user._id.toString()){
     return res.redirect('/');
  }
  product.title = updatedTitle;
  product.price = updatedPrice;
  product.imageUrl = updatedImageUrl;
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

exports.postDeleteProduct = (req,res,next)=>{
  const prodId = req.body.productId;
  Product.deleteOne({_id:prodId,userId:req.user._id}).then(()=>{
    console.log('Product deleted');
    res.redirect('/admin/products');
  })
  .catch((error)=>{
      console.log(error);
  });
}

